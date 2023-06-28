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
    useDeeplink: false,
    communicationLayerPreference: "socket",
 });
 window.ethereum.request({ method: 'eth_requestAccounts'});

   const contractAddresses = {
    80001: { // Mumbai network
      gameAddress: "0x8f5952e0C7e13DEDaF39A16455eeA0408f0d7e2f",
      nftAddress: "0x4fE052E7De10A83919eED7ce87b5C050b0446C72"
    },
    11155111: { // Sepolia network
      gameAddress: "0x63c56AD7048f6C3880ba8d0e362982e9Ebab44C6",
      nftAddress: "0xB89CB3523eD1615ACB9629DaCdCDc441539B4622"
    },
    5: { // Goerli network
      gameAddress: "0xb9F5440A01eF97Ac8e2A5803Ae9dECD2D810e552",
      nftAddress: "0x79227AfbC5357f02193D52510bb66ecAC25b9C08"
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
