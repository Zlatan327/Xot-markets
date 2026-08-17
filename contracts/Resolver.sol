// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BinaryMarket.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IAgentRegistry {
    function getAgentPaidVolume(address _agent) external view returns (uint256);
}

interface IReputationEngine {
    function getReputationScore(address _agent) external view returns (uint256);
}

contract Resolver {
    using SafeERC20 for IERC20;

    address public registryAddress;
    address public reputationAddress;
    address public arbitrationCouncil;

    uint256 public constant CHALLENGE_WINDOW = 4 hours;
    uint256 public minChallengeBond;

    enum ResolutionState { PENDING, AUTO_RESOLVED, CHALLENGED, ARBITRATION, FINALIZED }

    struct MarketResolution {
        ResolutionState state;
        BinaryMarket.Outcome proposedOutcome;
        uint256 autoResolvedTimestamp;
        address challenger;
        uint256 bondPosted;
    }

    mapping(address => MarketResolution) public resolutions;
    mapping(address => uint256) public lockedBonds;

    event AutoResolved(address indexed market, BinaryMarket.Outcome outcome);
    event Challenged(address indexed market, address indexed challenger, uint256 bond);
    event Finalized(address indexed market, BinaryMarket.Outcome outcome);

    constructor(address _registryAddress, address _reputationAddress, address _arbitrationCouncil, uint256 _minChallengeBond) {
        registryAddress = _registryAddress;
        reputationAddress = _reputationAddress;
        arbitrationCouncil = _arbitrationCouncil;
        minChallengeBond = _minChallengeBond;
    }

    // Layer 1: Auto-Resolution
    function resolveMarket(address marketAddress) external {
        BinaryMarket market = BinaryMarket(marketAddress);
        require(block.number >= market.expiryBlock(), "Market not yet expired");
        require(resolutions[marketAddress].state == ResolutionState.PENDING, "Already resolved");

        uint8 metricType = market.metricType();
        address targetAgent = market.targetAgent();
        uint256 threshold = market.metricThreshold();
        
        BinaryMarket.Outcome outcome = BinaryMarket.Outcome.VOID;

        if (metricType == 0 || metricType == 1) { // Volume Metric (0 or 1)
            try IAgentRegistry(registryAddress).getAgentPaidVolume(targetAgent) returns (uint256 currentVolume) {
                if (currentVolume >= threshold) {
                    outcome = BinaryMarket.Outcome.YES;
                } else {
                    outcome = BinaryMarket.Outcome.NO;
                }
            } catch {
                // If registry query fails, refund participants — never assume an outcome
                outcome = BinaryMarket.Outcome.VOID;
            }
        } else if (metricType == 2) { // APY / Yield Metric (2)
            try IReputationEngine(reputationAddress).getReputationScore(targetAgent) returns (uint256 score) {
                if (score >= threshold) {
                    outcome = BinaryMarket.Outcome.YES;
                } else {
                    outcome = BinaryMarket.Outcome.NO;
                }
            } catch {
                outcome = BinaryMarket.Outcome.VOID;
            }
        } else if (metricType == 3) { // Executions / Orders Metric (3)
            try IAgentRegistry(registryAddress).getAgentPaidVolume(targetAgent) returns (uint256 count) {
                if (count >= threshold) {
                    outcome = BinaryMarket.Outcome.YES;
                } else {
                    outcome = BinaryMarket.Outcome.NO;
                }
            } catch {
                outcome = BinaryMarket.Outcome.VOID;
            }
        }

        resolutions[marketAddress] = MarketResolution({
            state: ResolutionState.AUTO_RESOLVED,
            proposedOutcome: outcome,
            autoResolvedTimestamp: block.timestamp,
            challenger: address(0),
            bondPosted: 0
        });

        emit AutoResolved(marketAddress, outcome);
    }

    // Layer 2: Optimistic Challenge
    function challengeResolution(address marketAddress) external {
        MarketResolution storage res = resolutions[marketAddress];
        require(res.state == ResolutionState.AUTO_RESOLVED, "Cannot challenge in this state");
        require(block.timestamp <= res.autoResolvedTimestamp + CHALLENGE_WINDOW, "Challenge window passed");

        BinaryMarket market = BinaryMarket(marketAddress);
        IERC20 collateral = market.collateralToken();
        
        uint256 totalPool = market.totalYesPool() + market.totalNoPool();
        uint256 calculatedBond = totalPool / 200; // 0.5%
        uint256 bondAmount = calculatedBond > minChallengeBond ? calculatedBond : minChallengeBond;

        collateral.safeTransferFrom(msg.sender, address(this), bondAmount);
        lockedBonds[address(collateral)] += bondAmount;

        res.state = ResolutionState.CHALLENGED;
        res.challenger = msg.sender;
        res.bondPosted = bondAmount;

        emit Challenged(marketAddress, msg.sender, bondAmount);
    }

    // Layer 3: Arbitration
    function arbitrate(address marketAddress, BinaryMarket.Outcome finalOutcome) external {
        require(msg.sender == arbitrationCouncil, "Only arbitration council");
        MarketResolution storage res = resolutions[marketAddress];
        require(res.state == ResolutionState.CHALLENGED, "Market not challenged");

        res.state = ResolutionState.FINALIZED;
        
        BinaryMarket market = BinaryMarket(marketAddress);
        market.resolveMarket(finalOutcome);

        IERC20 collateral = market.collateralToken();
        lockedBonds[address(collateral)] -= res.bondPosted;

        if (finalOutcome != res.proposedOutcome) {
            // Challenger won. Refund bond.
            collateral.safeTransfer(res.challenger, res.bondPosted);
        }

        emit Finalized(marketAddress, finalOutcome);
    }

    // Finalize un-challenged resolution
    function finalizeResolution(address marketAddress) external {
        MarketResolution storage res = resolutions[marketAddress];
        require(res.state == ResolutionState.AUTO_RESOLVED, "Not in auto-resolved state");
        require(block.timestamp > res.autoResolvedTimestamp + CHALLENGE_WINDOW, "Challenge window still open");

        res.state = ResolutionState.FINALIZED;
        BinaryMarket(marketAddress).resolveMarket(res.proposedOutcome);

        emit Finalized(marketAddress, res.proposedOutcome);
    }

    // Sweep forfeited challenge bonds to the arbitration council (treasury)
    function sweepForfeitedBonds(address token) external {
        uint256 bal = IERC20(token).balanceOf(address(this));
        uint256 locked = lockedBonds[token];
        if (bal > locked) {
            IERC20(token).safeTransfer(arbitrationCouncil, bal - locked);
        }
    }
}
