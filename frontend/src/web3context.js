import React, { createContext, useState, useEffect } from 'react';
import JobPlatformABI from './JobPlatformABI.json' 
import { ethers } from 'ethers';

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const contractABI = JobPlatformABI;
  const contractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";

  useEffect(() => {
    if (window.ethereum) {
      const initializeWeb3 = async () => {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await _provider.getSigner();
        const _account = await signer.getAddress();
        const _contract = new ethers.Contract(contractAddress, contractABI, signer);

        setProvider(_provider);
        setContract(_contract);
        setAccount(_account);

        const _balance = await _provider.getBalance(_account);
        setBalance(ethers.formatEther(_balance));
      };

      initializeWeb3();
    }
  }, []);

  return (
    <Web3Context.Provider value={{ account, balance, contract, provider }}>
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Provider, Web3Context };