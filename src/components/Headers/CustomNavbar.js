import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import '../../assets/css/navbar.css'

const CustomNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

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
    }
  ];

  const gameRoutes = routes.filter(route => route.path.startsWith("/game"));

  return (
    <Navbar dark expand="sm" style={{ backgroundColor: '#001636' }}> {/* Adjust expand size here */}
      <Nav className="mr-auto" navbar>
        {routes.map((route, index) => {
          if (route.path.startsWith("/game")) {
            return null;
          }
          return (
            <NavItem key={index}>
              <NavLink tag={Link} to={route.path} className="custom-link"> {/* Add custom-link class */}
                {route.name}
              </NavLink>
            </NavItem>
          );
        })}
        <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown} >
          <DropdownToggle nav caret >
            Games
          </DropdownToggle>
          <DropdownMenu  style={{color: 'white' ,backgroundColor: '#001636'}}>
            {gameRoutes.map((gameRoute, index) => (
              <DropdownItem key={index} tag={Link} to={gameRoute.path} className="custom-link" style={{color: 'white' ,backgroundColor: '#001636'}}> {/* Add custom-link class */}
                {gameRoute.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;