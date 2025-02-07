import React, { createContext, useState, useEffect } from 'react';
import JobPlatformABI from './JobPlatformABI.json' 
import JobPaymentABI from './JobPaymentABI.json'
import { ethers } from 'ethers';

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [contract, setContract] = useState(null);
  const [jobPaymentContract, setJobPaymentContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const contractABI = JobPlatformABI;
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const contractJobPaymentABI = JobPaymentABI
  const contractJobPaymentAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  useEffect(() => {
    if (window.ethereum) {
      const initializeWeb3 = async () => {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await _provider.getSigner();
        const _account = await signer.getAddress();
        const _contract = new ethers.Contract(contractAddress, contractABI, signer);
        const _jobPaymentContract = new ethers.Contract(contractJobPaymentAddress, contractJobPaymentABI, signer);

        setProvider(_provider);
        setContract(_contract);
        setJobPaymentContract(_jobPaymentContract);
        setAccount(_account);

        const _balance = await _provider.getBalance(_account);
        setBalance(ethers.formatEther(_balance));
      };

      initializeWeb3();
    }
  }, []);

  return (
    <Web3Context.Provider value={{ account, balance, contract, jobPaymentContract, provider }}>
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Provider, Web3Context };