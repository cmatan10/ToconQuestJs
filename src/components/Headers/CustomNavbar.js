import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarToggler, Collapse } from 'reactstrap';
import '../../assets/css/navbar.css'

const CustomNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
  const toggle = () => setIsOpen(!isOpen);

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
<Navbar dark expand="md" style={{ backgroundColor: '#001636', position: 'fixed', width: '100%', top: 0, zIndex: 1029 }}>
      <NavbarToggler onClick={toggle} className="mr-2" style={{ zIndex: 2, position: 'relative' }}/>
      <Collapse isOpen={isOpen} navbar style={{ backgroundColor: '#001636', zIndex: 1, position: 'relative' }}>
        <Nav className="navbar-nav" style={{ display: 'flex', justifyContent: 'center', width: '100%' }} navbar>
          {routes.map((route, index) => {
            if (route.path.startsWith("/game")) {
                return null;
            }
            return (
              <NavItem className="nav-item" key={index}>
                {route.name === "Home" ? (
                  <NavLink tag={Link} to={route.path} className="custom-link">
                    <img src="/favicon.ico" alt="Home" style={{ width: '25px' }} />
                  </NavLink>
                ) : (
                  <NavLink tag={Link} to={route.path} className="custom-link">
                    {route.name}
                  </NavLink>
                )}
              </NavItem>
            );
          })}
          <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown} >
            <DropdownToggle nav caret>
              Games
            </DropdownToggle>
            <DropdownMenu style={{ color: 'white', backgroundColor: '#001636' }}>
              {gameRoutes.map((gameRoute, index) => (
                <DropdownItem key={index} tag={Link} to={gameRoute.path} className="custom-link" style={{ color: 'white', backgroundColor: '#001636' }}>
                  {gameRoute.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Collapse>
    </Navbar>
);

};

export default CustomNavbar;