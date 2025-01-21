// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IJobPayment.sol";


contract JobPlatform {
    struct Job {
        string title;
        string description;
        address employer;
        uint256 salary;
    }
    
    uint256 public jobCount;
    IJobPayment public paymentContract;
    
    // mappings
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => address[]) public jobEmployees;

    // events
    event JobCreated(uint256 indexed jobId, string title, address indexed employer);
    event JobDeleted(uint256 jobId, address indexed employer);
    event JobTaken(uint256 indexed jobId, address indexed employee);
    event JobCompleted(uint256 indexed jobId);
    
    // modifiers
    modifier jobExists(uint256 _jobId) {
        require(_jobId < jobCount, "Job does not exist");
        _;
    }

    constructor(address _paymentContract) {
        paymentContract = IJobPayment(_paymentContract);
    }
    
    function takeJob(uint256 _jobId) external jobExists(_jobId) {
        jobEmployees[_jobId].push(msg.sender);

        emit JobTaken(_jobId, msg.sender);
    }

    function getAllEmployees(uint256 _jobId) external view returns (address[] memory) {
        return jobEmployees[_jobId];
    }
    
    function createJob(string calldata _title, string calldata _description, uint256 _salary) 
        public 
        returns (uint256)
    {
        require(bytes(_title).length > 0, "Job must have a title");
        
        string memory description = _description;
        if (bytes(description).length == 0) {
            description = "-";
        }

        jobs[jobCount] = Job({
            title: _title,
            description: description,
            salary: _salary,
            employer: msg.sender
        });

        emit JobCreated(jobCount, _title, msg.sender);
        return jobCount++;
    }

    function deleteJob(uint256 _jobId)
        jobExists(_jobId)
        public
    {
        require(msg.sender == jobs[_jobId].employer, "Only the employer can deactivate the job");

        delete jobs[_jobId];
        delete jobEmployees[_jobId];
        
        emit JobDeleted(_jobId, msg.sender);
    }

    function getJob(uint256 _jobId) external view jobExists(_jobId) returns (Job memory) {
        return jobs[_jobId];
    }

    function processPayment(address payable _employee, uint256 _amount) 
        external
        payable
    {
        paymentContract.processPayment(_employee, _amount);
    }

    // Pure
    function calculateBonus(uint256 _salary, uint256 _performance) 
        public 
        pure 
        returns (uint256) 
    {
        return (_salary * _performance) / 100;
    }
}