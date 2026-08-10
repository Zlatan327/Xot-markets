// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentRegistryMock {
    struct Agent {
        bool isRegistered;
        uint256 paidVolume;
        uint256 completedJobs;
        bool isActive;
    }

    mapping(address => Agent) public agents;

    function registerAgent(address _agent) external {
        agents[_agent] = Agent({
            isRegistered: true,
            paidVolume: 0,
            completedJobs: 0,
            isActive: true
        });
    }

    function addPaidVolume(address _agent, uint256 _amount) external {
        require(agents[_agent].isRegistered, "Agent not registered");
        agents[_agent].paidVolume += _amount;
    }

    function addCompletedJob(address _agent) external {
        require(agents[_agent].isRegistered, "Agent not registered");
        agents[_agent].completedJobs += 1;
    }

    function getAgentPaidVolume(address _agent) external view returns (uint256) {
        return agents[_agent].paidVolume;
    }

    function getAgentCompletedJobs(address _agent) external view returns (uint256) {
        return agents[_agent].completedJobs;
    }

    function isAgentActive(address _agent) external view returns (bool) {
        return agents[_agent].isActive;
    }
}
