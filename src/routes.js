
import Index from "views/Index.js";
import Game1 from "views/Game1.js";
import Game2 from "views/Game2.js";
import Game3 from "views/Game3.js";
import Game4 from "views/Game4.js";
import Game5 from "views/Game5.js";
import Game6 from "views/Game6.js";
import Game7 from "views/Game7.js";
import Game8 from "views/Game8.js";
import Game9 from "views/Game9.js";
import Game10 from "views/Game10.js";
import Game11 from "views/Game11.js";
import Game12 from "views/Game12.js";
import Game13 from "views/Game13.js";
import About from "views/About";
import Preparation from "views/Preparation";



var routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/",
  },
  {
    path: "/about",
    name: "About",
    icon: "ni ni-tv-2 text-primary",
    component: <About />,
    layout: "/",
    showInSidebar: false,  

  },
  {
    path: "/preparation",
    name: "Preparation",
    icon: "ni ni-tv-2 text-primary",
    component: <Preparation />,
    layout: "/",
    showInSidebar: false,  

  },
  {
    path: "/game1",
    name: "Game1",
    component: <Game1 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game2",
    name: "Game2",
    component: <Game2 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game3",
    name: "Game3",
    component: <Game3 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game4",
    name: "Game4",
    component: <Game4 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game5",
    name: "Game5",
    component: <Game5 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game6",
    name: "Game6",
    component: <Game6 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game7",
    name: "Game7",
    component: <Game7 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game8",
    name: "Game8",
    component: <Game8 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game9",
    name: "Game9",
    component: <Game9 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game10",
    name: "Game10",
    component: <Game10 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game11",
    name: "Game11",
    component: <Game11 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game12",
    name: "Game12",
    component: <Game12 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game13",
    name: "Game13",
    component: <Game13 />,
    layout: "/",
    showInSidebar: false,  
  }
  
  
  
  
  
  
];
export default routes;

