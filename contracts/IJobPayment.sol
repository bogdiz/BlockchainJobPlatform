// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IJobPayment {
    function processPayment(address payable _employee, uint256 _amount) external payable;
}
