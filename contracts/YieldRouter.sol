// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IBinaryMarketAave {
    function investToAave(uint256 amount) external;
    function withdrawFromAave(uint256 amount) external;
    function harvestYield() external;
}

contract YieldRouter is Ownable {
    using SafeERC20 for IERC20;

    address public prizeVault;
    address public collateralToken;

    event YieldHarvested(address indexed market, uint256 amount);

    constructor(address _collateralToken, address _prizeVault) Ownable(msg.sender) {
        collateralToken = _collateralToken;
        prizeVault = _prizeVault;
    }

    // Command a specific market to deposit funds into Aave
    function commandInvest(address market, uint256 amount) external onlyOwner {
        IBinaryMarketAave(market).investToAave(amount);
    }

    // Command a specific market to withdraw funds from Aave back to liquid collateral
    function commandWithdraw(address market, uint256 amount) external onlyOwner {
        IBinaryMarketAave(market).withdrawFromAave(amount);
    }

    // Command a market to withdraw everything from Aave, calculate profit, and send profit here
    function commandHarvest(address market) external onlyOwner {
        IBinaryMarketAave(market).harvestYield();
        
        // Sweep the harvested yield to the PrizeVault
        uint256 bal = IERC20(collateralToken).balanceOf(address(this));
        if (bal > 0) {
            IERC20(collateralToken).safeTransfer(prizeVault, bal);
            emit YieldHarvested(market, bal);
        }
    }
}
