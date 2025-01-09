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
        bool isActive;
    }
    
    address public owner;
    uint256 public jobCount;
    IJobPayment public paymentContract;
    
    // mappings
    mapping(uint256 => Job) public jobs;
    mapping(address => bool) public employers;
    mapping(address => uint256[]) public employeeJobs;
    
    // Events
    event JobCreated(uint256 indexed jobId, string title, address indexed employer);
    event JobTaken(uint256 indexed jobId, address indexed employee);
    event JobCompleted(uint256 indexed jobId);
    event EmployerRegistered(address indexed employer);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    modifier onlyEmployer() {
        require(employers[msg.sender], "Only registered employers can call this function");
        _;
    }
    modifier jobExists(uint256 _jobId) {
        require(_jobId < jobCount, "Job does not exist");
        _;
    }
    
    constructor(address _paymentContract) {
        owner = msg.sender;
        paymentContract = IJobPayment(_paymentContract);
    }
    
    function registerEmployer() external {
        require(!employers[msg.sender], "Employer already registered");
        employers[msg.sender] = true;
        emit EmployerRegistered(msg.sender);
    }

    function takeJob(uint256 _jobId) external jobExists(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.isActive, "Job is not active");
        require(job.employee == address(0), "Job already taken");
        
        job.employee = msg.sender;
        employeeJobs[msg.sender].push(_jobId);
        
        emit JobTaken(_jobId, msg.sender);
    }
    
    function createJob(string calldata _title, string calldata _description, uint256 _salary) 
        public 
        onlyEmployer 
        returns (uint256)
    {
        jobs[jobCount] = Job({
            title: _title,
            description: _description,
            salary: _salary,
            employer: msg.sender,
            isActive: true,
            employee: address(0)
        });
        
        emit JobCreated(jobCount, _title, msg.sender);
        
        return jobCount++;
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