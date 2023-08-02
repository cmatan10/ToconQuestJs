import React, {  useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {Button, Navbar, Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarToggler, Collapse } from 'reactstrap';
import '../../assets/css/navbar.css'
import { Web3Context } from '../../index';

const CustomNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const web3Context = useContext(Web3Context);
  const [walletAddress, setWalletAddress] = useState(web3Context.walletAddress);
  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
  const toggle = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 620);

  const shortAddress = `${walletAddress.substring(0, 4)}......${walletAddress.substring(walletAddress.length - 4)}`;
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 620);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    requestAccount();
    setWalletAddress(web3Context.walletAddress);
    const ethereum = window.ethereum;
    if (ethereum && ethereum.on) {
      const handleAccountsChanged = function (accounts) {
        setWalletAddress(accounts[0]);
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        if (ethereum && ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      }
    }
  }, [web3Context.walletAddress, web3Context.Chain]);
  const requestAccount = async () => {
    console.log('Requesting account...');
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Meta Mask not detected');
    }
  };

  var routes = [
    {
      path: "/",
      name: "Home",
      icon: "ni ni-tv-2 text-primary",
      layout: "/",
    },
    {
      path: "/about",
      name: "About",
      icon: "ni ni-tv-2 text-primary",
      layout: "/",
      showInSidebar: false,

    },
    {
      path: "/preparation",
      name: "Preparation",
      icon: "ni ni-tv-2 text-primary",
      layout: "/",
      showInSidebar: false,

    },
    {
      path: "/game1",
      name: "Bytes2",
      layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game2",
      name: "Fallback",
      layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game3",
      name: "Balance Checker", layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game4",
      name: "Payable Contract", layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game5",
      name: "Timestamp", layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game6",
      name: "Gas Checker", layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game7",
      name: "Change Password", layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game8",
      name: "Overflow", layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game9",
      name: "Blockhash", layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game10",
      name: "Interfaceid",
      layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game11",
      name: "Encode Data",
      layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game12",
      name: "Hash Collision",
      layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game13",
      name: "Decode Data",
      layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game14",
      name: "Factory",
      layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game15",
      name: "SupportInterface",
      layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game16",
      name: "LimitedTickets",
      layout: "/",
      showInSidebar: false,
    },
    {
      path: "/game17",
      name: "EducatedGuess",
      layout: "/",
      showInSidebar: false,
    }
  ];

  const gameRoutes = routes.filter(route => route.path.startsWith("/game"));

  return (
    <Navbar dark expand="md" style={{ backgroundColor: '#001636', position: 'fixed', width: '100%', top: 0, zIndex: 1029 }}>
      <NavbarToggler onClick={toggle} className="mr-2" style={{ zIndex: 2, position: 'relative' }} />
      <NavLink tag={Link} to={'/'} className="custom-link" onClick={closeNavbar}>
        <img src="/favicon.ico" alt="Home" style={{ width: '30px' }} />
      </NavLink>
      <Collapse isOpen={isOpen} navbar style={{ backgroundColor: '#001636', zIndex: 1, position: 'relative' }}>
        <Nav className="navbar-nav" style={{ width: '100%' }} navbar>
          {routes.map((route, index) => {
            if ( route.name === "Home" || route.path.startsWith("/game")) {
              return null;
            }
            return (
              <NavItem className="nav-item" key={index}>
                <NavLink tag={Link} to={route.path} className="custom-link" onClick={closeNavbar}>
                  {route.name}
                </NavLink>
              </NavItem>
            );
          })}
          <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle nav caret>
              Games
            </DropdownToggle>
            <DropdownMenu className="custom-dropdown-menu" style={{ color: 'white', backgroundColor: '#001636' }}>
              {gameRoutes.map((gameRoute, index) => (
                <DropdownItem key={index} tag={Link} to={gameRoute.path} className="custom-link" style={{ color: 'white', backgroundColor: '#001636' }} onClick={closeNavbar}>
                  {gameRoute.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Collapse>
      {!isOpen && <p className="m-2" style={{color:'white'}}>{isSmallScreen ? shortAddress : walletAddress}</p>}
    {!isOpen && <div className="ext-white shadow" style={{  marginLeft: '10px' }}>
      <Button onClick={requestAccount} style={{ backgroundColor:'rgba(235, 167, 104, 0.8)' }} className="fas fa-wallet mb-1" />
    </div>}
    </Navbar>
);
};

export default CustomNavbar;