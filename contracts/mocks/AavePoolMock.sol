// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IAavePool.sol";

// A mock token representing aTokens which we don't strictly need to implement as ERC20 for basic tests,
// but we just hold the underlying token and return it on withdraw.
contract AavePoolMock is IAavePool {
    using SafeERC20 for IERC20;

    mapping(address => mapping(address => uint256)) public deposits;

    function supply(address asset, uint256 amount, address onBehalfOf, uint16) external {
        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        deposits[asset][onBehalfOf] += amount;
    }

    function withdraw(address asset, uint256 amount, address to) external returns (uint256) {
        uint256 userBal = deposits[asset][msg.sender];
        uint256 withdrawAmount = amount;
        
        if (amount == type(uint256).max) {
            withdrawAmount = userBal;
        }

        require(userBal >= withdrawAmount, "Insufficient balance");
        
        deposits[asset][msg.sender] -= withdrawAmount;
        IERC20(asset).safeTransfer(to, withdrawAmount);
        
        return withdrawAmount;
    }

    // Custom function to simulate yield generation
    function simulateYield(address asset, address user, uint256 amount) external {
        // Assume the test script mints tokens to this mock contract and then we just increase the user's deposit record
        deposits[asset][user] += amount;
    }
}
