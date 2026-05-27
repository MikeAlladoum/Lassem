// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./CrowdfundingCampaign.sol";

contract CrowdfundingFactory {
    address[] public campaigns;
    mapping(address => address[]) public ownerCampaigns;
    
    event CampaignCreated(
        address indexed campaignAddress,
        address indexed owner,
        uint256 goalAmount,
        uint256 deadline
    );

    function createCampaign(uint256 _goalAmount, uint256 _deadlineTimestamp) 
        external returns (address) 
    {
        require(_goalAmount > 0, "Goal must be > 0");
        require(_deadlineTimestamp > block.timestamp, "Deadline must be in future");
        
        CrowdfundingCampaign campaign = new CrowdfundingCampaign(
            msg.sender,
            _goalAmount,
            _deadlineTimestamp
        );
        
        address campaignAddress = address(campaign);
        campaigns.push(campaignAddress);
        ownerCampaigns[msg.sender].push(campaignAddress);
        
        emit CampaignCreated(campaignAddress, msg.sender, _goalAmount, _deadlineTimestamp);
        return campaignAddress;
    }

    function getCampaignsCount() external view returns (uint256) {
        return campaigns.length;
    }

    function getOwnerCampaigns(address owner) external view returns (address[] memory) {
        return ownerCampaigns[owner];
    }
}
