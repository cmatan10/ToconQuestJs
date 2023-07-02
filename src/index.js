import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { useState, createContext, useEffect } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';

import Web3 from "web3";
import gameABI from "./interfaces/GameFactory.json"
import nftABI from "./interfaces/NFTbadge"
import CustomNavbar from './components/Headers/CustomNavbar';

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
export const Web3Context = createContext();

const App = () => {
   const [walletAddress, setWalletAddress] = useState("");
   const [Chain, setChain] = useState("");
   const [factoryContract, setFactoryContract] = useState(null);
   const [nftContract, setNftContract] = useState(null);
   const web3 = new Web3(window.ethereum);

   new MetaMaskSDK({
    useDeeplink: true,
    communicationLayerPreference: "socket",
 })


   const contractAddresses = {
    80001: { // Mumbai network
      gameAddress: "0x1a67ebb9C9B793ebC5Da05a6F36F7395263F6c21",
      nftAddress: "0x1bB3baE59016a9FF3CFbb8EE7BC60ED688303A73"
    },
    11155111: { // Sepolia network
      gameAddress: "0x92F9eB5824211aA291EadDb3755220AC68Ef2BF1",
      nftAddress: "0xA8cD928a8346FB37D8d5D4f4EC867f6c4073dedB"
    },
    5: { // Goerli network
      gameAddress: "0xa7169fDC282c990b510E2d6428bBC0ED1F7f1EfE",
      nftAddress: "0x1319a2fff9189496b5420256a0b19bBD36aed6eB"
    },
    97: { // Goerli network
      gameAddress: "0x110A5E7F651730Ca3631a0980cE57533d866a6ba",
      nftAddress: "0x72Bb9DD759ffaC48ff2A2Aa55C3cF8404a761E5d"
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
     requestAccount();
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
       requestAccount();
     }

     return () => {
       if (window.ethereum) {
         window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
         window.ethereum.removeListener('chainChanged', handleChainChanged);
       }
     }
   }, []);

   const requestAccount = async () => {
    console.log('Requesting account...');
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainId = parseInt(window.ethereum.chainId, 16);
        console.log('chainId:', chainId);
        setChain(chainId);
        console.log(accounts);
        console.log(accounts[0]);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting...');
      }
    } else {
      alert('Meta Mask not detected');
    }
  };
  

   return (
     <>
       <Web3Context.Provider value={{Chain , walletAddress, factoryContract, nftContract, web3 }}>
         <BrowserRouter>
           <CustomNavbar />
           <Routes>
             <Route path="/*" element={<AdminLayout />} />
             <Route path="*" element={<Navigate to="/" replace />} />
           </Routes>
         </BrowserRouter>
       </Web3Context.Provider>
     </>
   );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
