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
  const web3 = new Web3(window.ethereum);
  const gameAddress = "0x8f5952e0C7e13DEDaF39A16455eeA0408f0d7e2f"
  const factoryContract = new web3.eth.Contract(gameABI, gameAddress)
  const nftAddress = "0xBBc6D21A2041F6C154f816A3da950eBe478bb295"
  const nftContract = new web3.eth.Contract(nftABI, nftAddress)
  
  useEffect(() => {
    requestAccount(setWalletAddress)
  },[]);

  const requestAccount = async () => {
    console.log('Requesting account...');
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
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
      <Web3Context.Provider value={{ walletAddress, factoryContract, nftContract, web3 }}>
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