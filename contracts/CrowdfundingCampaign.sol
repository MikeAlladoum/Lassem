// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CrowdfundingCampaign {
    // Variables d'état
    address public owner;           // Créateur de la campagne
    uint256 public goalAmount;      // Objectif en wei
    uint256 public currentAmount;   // Montant collecté en wei
    uint256 public deadline;        // Timestamp Unix de fin
    bool public withdrawn;          // Fonds déjà retirés ?
    bool public cancelled;          // Campagne annulée ?
    
    // Mapping des contributions par adresse
    mapping(address => uint256) public contributions;
    address[] public contributors;
    
    // Événements — OBLIGATOIRES pour la synchronisation avec PostgreSQL
    event ContributionReceived(address indexed contributor, uint256 amount, uint256 newTotal);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event RefundIssued(address indexed contributor, uint256 amount);
    event CampaignCancelled();

    // Modificateurs
    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }
    modifier campaignActive() { require(!cancelled && block.timestamp < deadline, "Campaign not active"); _; }
    modifier goalReached() { require(currentAmount >= goalAmount, "Goal not reached"); _; }
    modifier deadlinePassed() { require(block.timestamp >= deadline, "Deadline not passed"); _; }

    // Constructeur
    constructor(address _owner, uint256 _goalAmount, uint256 _deadline) {
        owner = _owner;
        goalAmount = _goalAmount;
        deadline = _deadline;
    }

    // Fonction de contribution — payable
    function contribute() external payable campaignActive {
        require(msg.sender != owner, "Owner cannot contribute");
        require(msg.value > 0, "Amount must be > 0");
        
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        contributions[msg.sender] += msg.value;
        currentAmount += msg.value;
        
        emit ContributionReceived(msg.sender, msg.value, currentAmount);
    }

    // Retrait des fonds par le créateur (objectif atteint + deadline dépassée)
    function withdrawFunds() external onlyOwner deadlinePassed goalReached {
        require(!withdrawn, "Already withdrawn");
        withdrawn = true;
        uint256 amount = address(this).balance;
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");
        emit FundsWithdrawn(owner, amount);
    }

    // Remboursement d'un contributeur individuel
    function refund() external deadlinePassed {
        require(currentAmount < goalAmount, "Goal was reached, no refund");
        require(contributions[msg.sender] > 0, "No contribution found");
        
        uint256 amount = contributions[msg.sender];
        contributions[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit RefundIssued(msg.sender, amount);
    }

    // Remboursement de tous les contributeurs (appelable par owner)
    function refundAll() external onlyOwner deadlinePassed {
        require(currentAmount < goalAmount, "Goal was reached");
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 amount = contributions[contributor];
            if (amount > 0) {
                contributions[contributor] = 0;
                (bool success, ) = payable(contributor).call{value: amount}("");
                require(success, "Transfer failed");
                emit RefundIssued(contributor, amount);
            }
        }
    }

    // Annulation par le owner avant la deadline
    function cancel() external onlyOwner campaignActive {
        cancelled = true;
        // Rembourser tous les contributeurs existants
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 amount = contributions[contributor];
            if (amount > 0) {
                contributions[contributor] = 0;
                (bool success, ) = payable(contributor).call{value: amount}("");
                require(success, "Transfer failed");
                emit RefundIssued(contributor, amount);
            }
        }
        emit CampaignCancelled();
    }

    // Getters
    function getContributorsCount() external view returns (uint256) {
        return contributors.length;
    }

    function getCampaignInfo() external view returns (
        address, uint256, uint256, uint256, bool, bool
    ) {
        return (owner, goalAmount, currentAmount, deadline, withdrawn, cancelled);
    }
    
    receive() external payable { revert("Use contribute()"); }
}
