import { createContext, useState, useEffect } from 'react';
import Web3 from "web3";
import gameABI from "./interfaces/GameFactory.json";
import nftABI from "./interfaces/NFTbadge";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [Chain, setChain] = useState("");
  const [factoryContract, setFactoryContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const web3 = new Web3(window.ethereum);

  const contractAddresses = {
    80001: { // Mumbai network
      gameAddress: "0x1a67ebb9C9B793ebC5Da05a6F36F7395263F6c21",
      nftAddress: "0xe4F1dAA63489114Ad240A3481232fB10740fD358"
    },
    11155111: { // Sepolia network
      gameAddress: "0x92F9eB5824211aA291EadDb3755220AC68Ef2BF1",
      nftAddress: "0x25aeF2397aCd724D0B448d9c87B7083b33282d59"
    },
    5: { // Goerli network
      gameAddress: "0xa7169fDC282c990b510E2d6428bBC0ED1F7f1EfE",
      nftAddress: "0x049a10aBa794e009D3F5F221150c33d21f345090"
    },
    97: { // BSC network
      gameAddress: "0x110A5E7F651730Ca3631a0980cE57533d866a6ba",
      nftAddress: "0x3150D2C079C49077942536C40fba8a378897aD07"
    },
    59140: { // Linea network
      gameAddress: "0xeC7cF964fFFA203337Dd33Da532515fD9c8d6EF5",
      nftAddress: "0x1D5885c87cf64cBcf99eDdb3A3A3Ef823C266aE0"
    },
    1440002: { // Xrp network
      gameAddress: "0xa837aa583B8c4Ad0396058F82984A13F98a22677",
      nftAddress: "0x2a830154207486eBe93d62A096f2834e1d72Ddeb"
    }
  };

  useEffect(() => {
    if (Chain) {
      const addresses = contractAddresses[Chain];
      if (addresses) {
        const gameContract = new web3.eth.Contract(gameABI, addresses.gameAddress);
        const nftContractInstance = new web3.eth.Contract(nftABI, addresses.nftAddress);
        console.log('gameContract:', gameContract);
        console.log('nftContractInstance:', nftContractInstance);
        setFactoryContract(gameContract);
        setNftContract(nftContractInstance);
      } else {
        console.log(`No contract addresses available for chain ID: ${Chain}`);
      }
    }
  }, [Chain]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const chainId = parseInt(window.ethereum.chainId, 16);
        setChain(chainId);
        setWalletAddress(accounts[0] || "");
      }
    };
    init();
  }, []);


  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      console.log(accounts);
      console.log(accounts[0]);
      setWalletAddress(accounts[0]);
    };

    const handleChainChanged = (chainId) => {
      const decimalChainId = parseInt(chainId, 16);
      setChain(decimalChainId);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem('walletAddress', walletAddress);
    }
  }, [walletAddress]);

  const requestAccount = async () => {
    console.log('Requesting account...');
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainId = parseInt(window.ethereum.chainId, 16);
        setChain(chainId);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      // Check if the user is on a mobile device
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        // Create a MetaMask deep link
        const metaMaskDeepLink = 'https://metamask.app.link/dapp/quest.tocon.io/';
  
        // Open the MetaMask app in a new tab
        window.open(metaMaskDeepLink, '_blank');
      } else {
        alert('MetaMask not detected');
      }
    }
  };
  

  return (
    <Web3Context.Provider value={{ Chain, walletAddress, factoryContract, nftContract, web3, requestAccount  }}>
      {children}
    </Web3Context.Provider>
  );
};
