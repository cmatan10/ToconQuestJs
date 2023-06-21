import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../index';
import InstanceABI from '../interfaces/HashCollision.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AdminFooter from '../components/Footers/AdminFooter.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';
function Game12() {
  const [guess, setguess] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false); // new loading state
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [secretHashState, setSecretHashState] = useState("");
  const [collisionFoundState, setCollisionFoundState] = useState(null);
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
      const balance = await nftContract.methods.balanceOf(walletAddress, 12).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true); // set loading before starting the operation
      const receipt = await factoryContract.methods.deploy(12).send({
        from: walletAddress,
        gas: 500000,
      });
      const blockNumber = await web3.eth.getBlockNumber();
      await factoryContract.getPastEvents('DeployInstance', {
        filter: { sender: walletAddress },
        fromBlock: blockNumber - 900, toBlock: 'latest'
      }, async (error, events) => {
        for (let index = 0; index < events.length; index++) {
          if (receipt.transactionHash === events[index].transactionHash) {
            setInstanceAddress(events[index].returnValues.Instance);
          }
        }
      });
      setIsLoading(false);
      toast.success("Game created successfully!"); 
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error("Game creation failed.");
    }
  };


  const findCollision = async (guess) => {
    if (instanceContract) {
      if (isNaN(Number(guess))) {
        alert('Invalid input! Please enter a hexadecimal.');
        return;
      }
      try{
      await instanceContract.methods.findCollision(guess).send({
        from: walletAddress,
        gas: 500000,
      }).then(async () => {
        console.log('Transaction sent successfully!');
        toast.success("Transaction sent successfully!"); // Success toast
        if (TokenBalance < 1) {
          try{
          await nftContract.methods.mint(12, InstanceAddress).send({
            from: walletAddress,
            gas: 500000,
          })
            .once("error", (err) => {
              console.log(err);
              toast.error("Minting failed."); // Error toast
            })
            .once("receipt", async () => {
              const balance = await nftContract.methods.balanceOf(walletAddress, 12).call();
              setTokenBalance(balance);
              console.log(balance); 
              toast.success("Minting completed successfully!"); // Success toast
            });
          }catch (err) {
            console.error(err.message); 
            toast.error("Minting failed."); // Error toast
          }
        }
      })
    }catch (err) {
      console.error(err.message); 
      toast.error("Find collision operation failed."); // Error toast
    }
    }
  };

  const secretHash = async () => {
    const secret = await instanceContract.methods.secretHash().call();
    console.log(secret);
    setSecretHashState(secret); // update state variable
  } 

  const collisionFound = async () => {
    const collision = await instanceContract.methods.collisionFound().call();
    console.log(collision);
    setCollisionFoundState(collision); // update state variable
  }

  const code = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.10;
  
  contract HashCollision {
      bytes32 public secretHash = keccak256(abi.encodePacked(sha256("secret")));
  
      bool public collisionFound = false;
  
      function findCollision(bytes memory guess) public {
          require(keccak256(abi.encodePacked(guess)) == secretHash, "Not a collision!");
          collisionFound = true;
      }
      
  }`;

  return (
    <>
    <Container className="game-container">
      <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white' }}>
        <Link to="/" className="btn btn-primary" style={{ position: 'absolute', left: '0', top: '0' }}>
          <i className="fas fa-home"></i>
        </Link>
        <CardBody>
          <CardTitle className="game-title title-color" ><b>Hash Collision</b></CardTitle>
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

      <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white' }}>
      <CardBody>
          <CardTitle className="card-title title-color" ><b>Game Description</b></CardTitle>
          <p><b>Your task is to find a "collision" - a guess that results in the same hashed output as our secret phrase.</b>
            <br /><br />
            <b><strong> You need:</strong> To solve this puzzle, you need to understand hash functions in Solidity, specifically keccak256 and sha256, as well as how to use the abi.encodePacked function. You'll also need to understand the concept of hash collisions, where different inputs produce the same hashed output. </b>
          </p>
          <div>
            <Button color="primary" className="button-margin" onClick={createGame}>
              Create Instance
            </Button>
          </div>
        </CardBody>
      </Card>

      {!isLoading && InstanceAddress !== "" && (
        <>
        <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white' }}>
            <CardBody>
             <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="success" className="mt-1" onClick={secretHash}>
                secretHash
              </Button>
              {secretHashState !== "" && <p style={{ marginLeft: '10px', marginTop: '12px' }}> {secretHashState}</p>}
              </div>
              <br/>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button color="success" className="mt-1" onClick={collisionFound}>
                collisionFound
              </Button>
              {collisionFoundState !== null &&
            <p style={{ marginLeft: '10px', marginTop: '12px' }}>
              {collisionFoundState ? "True" : "False"}
            </p>
          }
          </div>
              <br/>
              <Button color="info" className="button" onClick={toggleHint}>
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
                  placeholder="Enter ID"
                  type="text"
                  onChange={(e) => setguess(e.target.value)}
                />
              </FormGroup>
              <Button color="primary" className="mt-1" onClick={() => findCollision(guess)}>
                findCollision
              </Button>
            </CardBody>
          </Card>

        </>
      )}
      {isHintVisible && (
                <Card className="card" style={{ backgroundColor: '#001636', color: 'white' }}>
                    <CardBody>
                        <CardTitle className="card-title title-color" ><b>Hint</b></CardTitle>
                        <p>
                            <strong>Write a function according to the following interface:<strong> function guess() external pure returns (bytes memory secret);</strong></strong>
                        </p>
                    </CardBody>
                </Card>
            )}
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
    <AdminFooter/>
    <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    </>
  );


}

export default Game12;
