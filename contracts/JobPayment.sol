// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IJobPayment.sol";

contract JobPayment is IJobPayment {
    address public owner;
    mapping(address => uint256) public payments;
    
    event PaymentProcessed(address indexed employee, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    receive() external payable {}
    
    // Implementarea interfeței pentru procesarea plăților
    function processPayment(address payable _employee, uint256 _amount) 
        external
        payable
        override
    {
        require(msg.value >= _amount, "Insufficient payment amount");
        
        payments[_employee] += _amount;
        _employee.transfer(_amount);
        
        emit PaymentProcessed(_employee, _amount);
    }
    
    // Funcție pentru retragerea ETH-ului rămas
    function withdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
    }
}