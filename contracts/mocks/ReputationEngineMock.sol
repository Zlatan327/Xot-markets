// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReputationEngineMock {
    mapping(address => uint256) public reputationScores;
    mapping(address => uint256) public lastUpdatedTimestamp;

    function setReputationScore(address _agent, uint256 _score) external {
        reputationScores[_agent] = _score;
        lastUpdatedTimestamp[_agent] = block.timestamp;
    }

    function getReputationScore(address _agent) external view returns (uint256) {
        return reputationScores[_agent];
    }
    
    function getLastUpdatedTimestamp(address _agent) external view returns (uint256) {
        return lastUpdatedTimestamp[_agent];
    }
}
