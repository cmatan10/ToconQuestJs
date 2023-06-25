


import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import React, { useState, createContext, useEffect } from 'react';
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
   const [isLoading, setIsLoading] = useState(true);  // <-- New state for managing loading
   const web3 = new Web3(window.ethereum);

   const contractAddresses = {
    80001: { // Mumbai network
      gameAddress: "0x8f5952e0C7e13DEDaF39A16455eeA0408f0d7e2f",
      nftAddress: "0xBBc6D21A2041F6C154f816A3da950eBe478bb295"
    },
    11155111: { // Sepolia network
      gameAddress: "0x3c61DdDF6096713DC3CcD78258B5d0eC7EAd49Db",
      nftAddress: "0xA97eb59f9bF66201C44AEf2BFd0eea22A8339C9E"
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
        setIsLoading(false);  // <-- Set loading to false after contracts have been initialized
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
