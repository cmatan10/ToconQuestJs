import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../index';
import InstanceABI from '../interfaces/SupportInterface.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle, Collapse } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AdminFooter from '../components/Footers/AdminFooter.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';

function Game15() {
  const [id, setId] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [ContractInterface, setContractInterface] = useState(null);
  const [Selector1, setSelector1] = useState(null);
  const [Selector2, setSelector2] = useState(null);




  const toggleHint = () => {
    setIsHintVisible(!isHintVisible);
  };

  useEffect(() => {
    if (web3.utils.isAddress(InstanceAddress)) {
      setInstanceContract(new web3.eth.Contract(InstanceABI, InstanceAddress));
    }
  }, [InstanceAddress]);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress || !nftContract) {
        return;
      }
      const balance = await nftContract.methods.balanceOf(walletAddress, 15).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true);
      const receipt = await factoryContract.methods.deploy(15).send({
        from: walletAddress,
        gas: 800000,
      });

      const deployInstanceEvent = receipt.events.DeployInstance;
      if (deployInstanceEvent) {
        setInstanceAddress(deployInstanceEvent.returnValues.Instance);
        toast.success("Game created successfully!"); // Success toast
      } else {
        toast.error("Game creation failed."); // Error toast
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error("Game creation failed. Please make sure your Metamask wallet is properly connected."); // Error toast
    }
  };


  const calculateXOR = async (id) => {

    if (instanceContract) {
      try {

        await instanceContract.methods.calculateXOR(id).send({
          from: walletAddress,
          gas: 500000,
        }).then(async () => {
          console.log('The Mission Is Complete');
          toast("Well done! You have solved this level!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 5000, 
            }); 
          if (TokenBalance < 1) {
            try {
              await nftContract.methods.mint(15, InstanceAddress).send({
                from: walletAddress,
                gas: 700000,
              })
                .once("error", (err) => {
                  console.log(err);
                  toast.error("Minting failed."); // Error toast
                })
                .once("receipt", async () => {
                  const balance = await nftContract.methods.balanceOf(walletAddress, 15).call();
                  setTokenBalance(balance);
                  console.log(balance);
                  toast.success("Minting completed successfully!"); // Success toast
                });

            } catch (err) {
              console.error(err.message);
              toast.error("Minting failed."); // Error toast
            }
          }
        });
      } catch (err) {
        console.error(err.message);
        toast.error("Transaction failed."); // Error toast
      }
    }
  };

  const contractInterface = async () => {
    const contractInterface = await instanceContract.methods.contractInterface().call()
    setContractInterface(contractInterface)
    console.log(contractInterface);
  }


  const selector1 = async () => {
    const selector1 = await instanceContract.methods.selector1().call()
    setSelector1(selector1)
    console.log(selector1);
  }

  const selector2 = async () => {
    const selector2 = await instanceContract.methods.selector2().call()
    setSelector2(selector2)
    console.log(selector2);
  }


  const code = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.10;
  
  contract SupportInterface {
  
      bool public contractInterface;
  
      bytes4 public selector1 = bytes4(keccak256("calcFunc1(uint)"));
      
      bytes4 public selector2 = bytes4(keccak256("calcFunc2(bool)"));
      
      function calcFunc1(uint number) private {
      }
  
      function calcFunc2(bool Boolean) private {
      }
  
      function calculateXOR(bytes4 id) external {
          bytes4 xorValue = selector1 ^ selector2 ^ bytes4(keccak256("calculateXOR(bytes4)"));
          require(id == xorValue, "This is not the interface of the contract");
              contractInterface = true;
      }
  }
  
  
  `;

  return (
    <>
      <Container className="game-container container-padding-fix" >
        <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white' }}>
          <CardBody>
            <CardTitle className="game-title title-color" ><b>SupportInterface</b></CardTitle>
            <div className="code-section">
              <CopyToClipboard text={code}>
                <Button className="button-copy">
                  Copy code
                </Button>
              </CopyToClipboard>
              <SyntaxHighlighter language="javascript" style={a11yDark} ref={codeRef}>
                {code}
              </SyntaxHighlighter>
            </div>
          </CardBody>
        </Card>

        <Card className="game-card card-color" style={{ backgroundColor: '#001636', color: 'white' }}>
          <CardBody>
            <CardTitle className="game-title title-color" ><b>Game Description</b></CardTitle>
            <p><b>Your task is to find out the address of the contract that will be deployed by calling the deploy function. </b>
              <br /><br />
              <b><strong> You need:</strong>understand how a smart contract address is calculated and calculate the address where the SomeContract contract will be deployed.</b></p>
            <div>
              <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="button-margin" onClick={createGame}>
                Create Instance
              </Button>
            </div>
          </CardBody>
        </Card>

        {!isLoading && InstanceAddress !== "" && (
          <>
            <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white' }}>
              <CardBody>
              <CardTitle className="card-title title-color" ><b>State Variables & Call Functions</b></CardTitle>

                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
                  <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={() => contractInterface()}>
                    ContractInterface
                  </Button>
                  {ContractInterface !== null &&
                    <p style={{ marginLeft: '10px', marginTop: '12px' }}>
                      {ContractInterface ? "True" : "False"}
                    </p>
                  }                </div>
                <br />
                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
                  <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={() => selector1()}>
                  selector1
                  </Button>
                  {Selector1 !== '' && <p style={{ marginLeft: '10px', marginTop: '12px' }}>{Selector1}</p>}
                </div>
                <br />
                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
                <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={() => selector2()}>
                  selector2
                  </Button>
                  {Selector2 !== '' && <p style={{ marginLeft: '10px', marginTop: '12px' }}>{Selector2}</p>}
                </div>

                <br />
                <br />

                <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={toggleHint}>
                  {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                </Button>
              </CardBody>
            </Card>


            <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white' }}>
              <CardBody>
                <h3 className="mt-1 title-color" >Your Test Address: <p className="Instance-color"> {InstanceAddress} </p></h3>
                <FormGroup>
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="calculateXOR"
                    type="text"
                    onChange={(e) => setId(e.target.value)}
                  />
                </FormGroup>
                <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="mt-1" onClick={() => calculateXOR(id)}>
                calculateXOR
                </Button>
              </CardBody>
            </Card>
          </>
        )}

        <Collapse isOpen={isHintVisible}>
          <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white' }}>
            <CardBody>
              <CardTitle className="game-title title-color" >Hint</CardTitle>
              <p>
                calc the deployed address: keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode)))
                .
              </p>
            </CardBody>
          </Card>
        </Collapse>
        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {TokenBalance < 1 ? null : (
            <div>
              <img
                src={process.env.PUBLIC_URL + "/gotBadge.png"}
                alt="got badge"
                style={{ width: "260px", height: "180px" }}
              />
              <strong>
                Congratulations! You Got A Badge{" "}
                <i className="fas fa-medal" style={{ color: "gold", fontSize: "20px", position: 'relative', top: '3px' }}></i>
              </strong>
            </div>
          )}
        </p>
      </Container>
      <AdminFooter />
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />

    </>
  );




}

export default Game15;
