
// reactstrap components
import {
  Badge,
  Card,
  Media,
  Table,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../index';
import AdminFooter from '../components/Footers/AdminFooter.js'
import CarouselComponent from '../components/Headers/CarouselComponent.js'

import '../assets/css/game.css'



const Index = () => {
  const web3Context = useContext(Web3Context);
  const [walletAddress, setWalletAddress] = useState(web3Context.walletAddress);
  const { nftContract } = useContext(Web3Context);

  const [stages, setStages] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  
  // Function to get stage statusz
  const getStageStatus = async (id) => {
    if (!walletAddress) {
      return "Unsolved";
    }
    const balance = await nftContract.methods.balanceOf(walletAddress, id).call();
    console.log(`Balance of token ${id} in wallet ${walletAddress}: ${balance}`);
    console.log(stages);
    return balance > 0 ? 1 : 0;
  };

  useEffect(() => {
    const updateStages = async () => {
      const updatedStages = await Promise.all(stages.map((_, index) => getStageStatus(index + 1)));
      setStages(updatedStages);
    };
    if (walletAddress) {
      updateStages();
    }
  }, [walletAddress, nftContract]);

  useEffect(() => {
    if (web3Context.walletAddress !== walletAddress) {
      setWalletAddress(web3Context.walletAddress);
    }
  }, [web3Context.walletAddress]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        setWalletAddress(accounts[0]);
      });
    }
  }, []);

  return (
    < >

      <Header />

      {/* Page content */}
      <Container className="mt--0 container-color" fluid >
        {/* Table */}

        <Row>
          <div className="col "  >
            <Card className="shadow card-frame" style={{ backgroundColor: '#001636' }}>
              <div className="card-header text-white text-center" style={{ backgroundColor: '#001636', color: 'white' }}>
                <h3 className="mb-0" style={{ color: '#5e72e4', fontSize: "23px", fontFamily: 'Montserrat'  }}>SOLIDITY GAMES</h3>
              </div>
              <Table className="table table-dark table-hover" style={{ backgroundColor: '#001636' }} responsive>
                <thead>
                  <tr>
                    <th scope="col" style={{ fontSize: "19px", width: '20%', fontFamily: 'Montserrat'  }}>Game</th>
                    <th scope="col" style={{ fontSize: "19px", width: '20%', fontFamily: 'Montserrat'  }}>Difficulty</th>
                    <th scope="col" style={{ fontSize: "19px", width: '20%', fontFamily: 'Montserrat'  }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Link to="/game1" style={{ display: 'contents' }}>  {/* Add this */}
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/bytes2.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Bytes2
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                          <i className="bg-success " />
                          Easy
                        </Badge>
                      </td>
                      <td>
                        {stages[0] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>  {/* And this */}
                  </tr>
                  <tr>
                    <Link to="/game2" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/fallback.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Fallback
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                          <i className="bg-success" />
                          Easy
                        </Badge>
                      </td>
                      <td>
                        {stages[1] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game3" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/checkBalance.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Balance Checker
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                          <i className="bg-success" />
                          Easy
                        </Badge>
                      </td>
                      <td>
                        {stages[2] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game4" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/payableContract.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Payable Contract
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                          <i className="bg-success" />
                          Easy
                        </Badge>
                      </td>
                      <td>
                        {stages[3] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game5" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/timeStamp.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Timestamp
                            </span>
                          </Media>
                        </Media>
                      </th>

                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-primary" />
                          Medium
                        </Badge>
                      </td>
                      <td>
                        {stages[4] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game6" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/GasChecker.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Gas Checker
                            </span>
                          </Media>


                        </Media>
                      </th>

                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-primary" />
                          Medium
                        </Badge>
                      </td>
                      <td>
                        {stages[5] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game7" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/chamgePassword.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Change Password
                            </span>
                          </Media>
                        </Media>
                      </th>

                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-primary" />
                          Medium
                        </Badge>
                      </td>
                      <td>
                        {stages[6] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game8" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/overflow.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Overflow
                            </span>
                          </Media>
                        </Media>
                      </th>

                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-primary" />
                          Medium
                        </Badge>
                      </td>
                      <td>
                        {stages[7] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game9" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/blockhash.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              BlockHash
                            </span>
                          </Media>
                        </Media>
                      </th>

                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-primary" />
                          Medium
                        </Badge>
                      </td>
                      <td>
                        {stages[8] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                      
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game10" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/interfaceId.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              InterfaceId
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-warning" />
                          Hard
                        </Badge>
                      </td>
                      <td>
                        {stages[9] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game11" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/encodeData.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Encode Data
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-warning" />
                          Hard
                        </Badge>
                      </td>
                      <td>
                        {stages[10] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game12" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/hashCollosion.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Hash Collision
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-warning" />
                          Hard
                        </Badge>
                      </td>
                      <td>
                        {stages[11] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game13" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/decodeData.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Decode Data
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-warning" />
                          Hard
                        </Badge>
                      </td>
                      <td>
                        {stages[12] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                  <tr>
                    <Link to="/game14" style={{ display: 'contents' }}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <p className=" mr-5">
                            <img src={process.env.PUBLIC_URL + "/factory.jpeg"} alt="Icon description" style={{ width: "260px", height: "100px" }} />
                          </p>
                          <Media>
                            <span className="mb-0 big-font Instance-color"  >
                              Factory
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge style={{ fontSize: "19px", paddingTop: "48px" }} color="" className="badge-dot mr-9 Instance-color">
                        <i className="bg-warning" />
                          Hard
                        </Badge>
                      </td>
                      <td>
                        {stages[13] === 1 ? (
                          <div style={{ color: 'green', fontSize: "19px", paddingTop: "48px" }}>
                            Successfully solved
                          </div>
                        ) : (
                          <div style={{ color: 'gray', fontSize: "19px", paddingTop: "48px" }}>
                            Unsolved
                          </div>
                        )}
                      </td>
                    </Link>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
      <CarouselComponent/>
      <AdminFooter/> {/* This should be inside BrowserRouter but outside Routes */}

    </>
  );
};

export default Index;
