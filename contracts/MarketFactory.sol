// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BinaryMarket.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MarketFactory {
    using SafeERC20 for IERC20;

    event MarketCreated(address indexed marketAddress, address indexed targetAgent, uint8 metricType, uint256 expiryBlock);

    address[] public deployedMarkets;
    address public protocolTreasury;
    address public aavePool;
    address public yieldRouter;

    constructor(address _protocolTreasury, address _aavePool) {
        protocolTreasury = _protocolTreasury;
        aavePool = _aavePool;
    }

    function setYieldRouter(address _yieldRouter) external {
        yieldRouter = _yieldRouter;
    }

    function createMarket(
        address _targetAgent, 
        uint8 _metricType, 
        uint256 _expiryBlock, 
        address _collateralToken, 
        address _resolver
    ) external returns (address) {
        require(yieldRouter != address(0), "YieldRouter not set");
        
        BinaryMarket newMarket = new BinaryMarket(
            _targetAgent,
            _metricType,
            _expiryBlock,
            _collateralToken,
            _resolver,
            aavePool,
            yieldRouter
        );
        
        deployedMarkets.push(address(newMarket));
        emit MarketCreated(address(newMarket), _targetAgent, _metricType, _expiryBlock);
        
        return address(newMarket);
    }
    
    // Sweep collected fees to the treasury
    function sweepFees(address token) external {
        uint256 bal = IERC20(token).balanceOf(address(this));
        if (bal > 0) {
            IERC20(token).safeTransfer(protocolTreasury, bal);
        }
    }
}
