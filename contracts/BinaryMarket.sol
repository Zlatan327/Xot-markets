// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IAavePool.sol";

contract BinaryMarket is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum Outcome { PENDING, YES, NO, VOID }
    
    address public factory;
    address public resolver;
    address public yieldRouter;
    IAavePool public aavePool;
    IERC20 public collateralToken;
    
    address public targetAgent;
    uint8 public metricType;
    uint256 public expiryBlock;
    
    Outcome public finalOutcome = Outcome.PENDING;
    
    uint256 public totalYesPool;
    uint256 public totalNoPool;
    
    mapping(address => uint256) public yesShares;
    mapping(address => uint256) public noShares;
    mapping(address => bool) public hasClaimed;
    
    uint256 public constant FEE_PERCENT = 150; // 1.5% fee
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    event SharesBought(address indexed buyer, bool isYes, uint256 amount);
    event MarketResolved(Outcome outcome);
    event WinningsClaimed(address indexed user, uint256 amount);
    event InvestedToAave(uint256 amount);
    event WithdrawnFromAave(uint256 amount);
    event YieldHarvested(uint256 amount);

    modifier onlyResolver() {
        require(msg.sender == resolver, "Only resolver can resolve");
        _;
    }

    modifier onlyYieldRouter() {
        require(msg.sender == yieldRouter, "Only yield router");
        _;
    }

    constructor(
        address _targetAgent,
        uint8 _metricType,
        uint256 _expiryBlock,
        address _collateralToken,
        address _resolver,
        address _aavePool,
        address _yieldRouter
    ) {
        factory = msg.sender;
        targetAgent = _targetAgent;
        metricType = _metricType;
        expiryBlock = _expiryBlock;
        collateralToken = IERC20(_collateralToken);
        resolver = _resolver;
        aavePool = IAavePool(_aavePool);
        yieldRouter = _yieldRouter;
    }

    function buyShares(bool isYes, uint256 amount) external nonReentrant {
        require(finalOutcome == Outcome.PENDING, "Market is already resolved");
        require(block.number < expiryBlock, "Market has expired");
        require(amount > 0, "Amount must be greater than 0");

        collateralToken.safeTransferFrom(msg.sender, address(this), amount);

        // Deduct 1.5% fee on entry
        uint256 fee = (amount * FEE_PERCENT) / FEE_DENOMINATOR;
        uint256 netAmount = amount - fee;
        
        // Route fee to factory/treasury
        collateralToken.safeTransfer(factory, fee);

        if (isYes) {
            yesShares[msg.sender] += netAmount;
            totalYesPool += netAmount;
        } else {
            noShares[msg.sender] += netAmount;
            totalNoPool += netAmount;
        }

        emit SharesBought(msg.sender, isYes, netAmount);
    }

    function resolveMarket(Outcome _outcome) external onlyResolver {
        require(finalOutcome == Outcome.PENDING, "Already resolved");
        require(_outcome != Outcome.PENDING, "Invalid outcome");
        finalOutcome = _outcome;
        emit MarketResolved(_outcome);
    }

    function claim() external nonReentrant {
        require(finalOutcome != Outcome.PENDING, "Not resolved yet");
        require(!hasClaimed[msg.sender], "Already claimed");
        
        uint256 payout = 0;
        
        if (finalOutcome == Outcome.VOID) {
            // Refund minus fees already taken
            payout = yesShares[msg.sender] + noShares[msg.sender];
        } else if (finalOutcome == Outcome.YES) {
            uint256 userShares = yesShares[msg.sender];
            if (userShares > 0 && totalYesPool > 0) {
                // Pari-mutuel payout calculation
                uint256 totalPool = totalYesPool + totalNoPool;
                payout = (userShares * totalPool) / totalYesPool;
            }
        } else if (finalOutcome == Outcome.NO) {
            uint256 userShares = noShares[msg.sender];
            if (userShares > 0 && totalNoPool > 0) {
                // Pari-mutuel payout calculation
                uint256 totalPool = totalYesPool + totalNoPool;
                payout = (userShares * totalPool) / totalNoPool;
            }
        }

        hasClaimed[msg.sender] = true;
        
        if (payout > 0) {
            collateralToken.safeTransfer(msg.sender, payout);
            emit WinningsClaimed(msg.sender, payout);
        }
    }

    // --- AAVE INTEGRATION (Secure Principal Routing) ---

    // Allows the YieldRouter to command this market to invest idle principal into Aave.
    function investToAave(uint256 amount) external onlyYieldRouter nonReentrant {
        require(finalOutcome == Outcome.PENDING, "Cannot invest resolved market");
        collateralToken.forceApprove(address(aavePool), amount);
        aavePool.supply(address(collateralToken), amount, address(this), 0);
        emit InvestedToAave(amount);
    }

    // Allows the YieldRouter to command this market to withdraw principal from Aave in preparation for resolution.
    function withdrawFromAave(uint256 amount) external onlyYieldRouter nonReentrant {
        aavePool.withdraw(address(collateralToken), amount, address(this));
        emit WithdrawnFromAave(amount);
    }

    // Harvests any excess balance (interest) generated by Aave and sends it to the YieldRouter.
    function harvestYield() external onlyYieldRouter nonReentrant {
        // Withdraw entire balance of aTokens back to underlying collateral
        aavePool.withdraw(address(collateralToken), type(uint256).max, address(this));
        
        uint256 principal = totalYesPool + totalNoPool;
        uint256 currentBal = collateralToken.balanceOf(address(this));
        
        // If we have more collateral than the combined pools, the excess is yield.
        if (currentBal > principal) {
            uint256 yieldAmount = currentBal - principal;
            collateralToken.safeTransfer(yieldRouter, yieldAmount);
            emit YieldHarvested(yieldAmount);
        }
    }
}
