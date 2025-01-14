// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IJobPayment.sol";


contract JobPlatform {
    struct Job {
        string title;
        string description;
        address employee;
        address employer;
        uint256 salary;
    }
    
    uint256 public jobCount;
    IJobPayment public paymentContract;
    
    // mappings
    mapping(uint256 => Job) public jobs;
    mapping(address => uint256[]) public employeeJobs;

    // Events
    event JobCreated(uint256 indexed jobId, string title, address indexed employer);
    event JobDeleted(uint256 jobId, address indexed employer);
    event JobTaken(uint256 indexed jobId, address indexed employee);
    event JobCompleted(uint256 indexed jobId);
    
    // Modifiers
    modifier jobExists(uint256 _jobId) {
        require(_jobId < jobCount, "Job does not exist");
        _;
    }
    
    constructor(address _paymentContract) {
        paymentContract = IJobPayment(_paymentContract);
    }
    
    function takeJob(uint256 _jobId) external jobExists(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.employee == address(0), "Job already taken");
        
        job.employee = msg.sender;
        employeeJobs[msg.sender].push(_jobId);
        
        emit JobTaken(_jobId, msg.sender);
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
            employer: msg.sender,
            employee: address(0)
        });

        emit JobCreated(jobCount, _title, msg.sender);
        
        return jobCount++;
    }

    function deleteJob(uint256 _jobId)
        jobExists(_jobId)
        public
        returns (uint256)
    {
        require(msg.sender == jobs[_jobId].employer, "Only the employer can deactivate the job");

        delete jobs[jobCount];
        
        emit JobDeleted(_jobId, msg.sender);

        return jobCount--;
    }

    function getJob(uint256 _jobId) external view jobExists(_jobId) returns (Job memory) {
        return jobs[_jobId];
    }

    function getEmployeeJobs(address _employee) external view returns (uint256[] memory) {
        return employeeJobs[_employee];
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