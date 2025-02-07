// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IJobPayment.sol";


contract JobPayment is IJobPayment {
    address public owner;
    mapping(address => uint256) public payments;
    
    event PaymentProcessed(address indexed employee, uint256 amount);
    event EtherReceived(address indexed sender, uint256 amount); // For receive()
    event FallbackCalled(address indexed sender, uint256 amount, bytes data); // For fallback()

    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit FallbackCalled(msg.sender, msg.value, msg.data);
    }
    
    function processPayment(address payable _employee, uint256 _amount) 
        external
        payable
        override
    {
        _validatePayment(_employee, _amount);

        payments[_employee] += _amount;
        _employee.transfer(_amount);
        
        emit PaymentProcessed(_employee, _amount);
    }
       
    function withdrawBalance() external onlyOwner {
        uint256 balance = address(this).balance;
        _sendFunds(payable(owner), balance);
    }

    function _sendFunds(address payable _recipient, uint256 _amount) internal {
        require(address(this).balance >= _amount, "Insufficient contract balance");
        _recipient.transfer(_amount);
    }

     function _validatePayment(address _employee, uint256 _amount) private pure {
        require(_employee != address(0), "Invalid employee address");
        require(_amount > 0, "Payment amount must be greater than zero");
    }
}