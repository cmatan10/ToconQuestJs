import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../index';
import InstanceABI from '../interfaces/Timestamp.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AdminFooter from '../components/Footers/AdminFooter.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';
function Game5() {
  const [Timestamp, setTimestamp] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false); // new loading state
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [successState, setSuccessState] = useState(null);
  const hintLink = 'https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getTransaction#gettransaction'
  const hintLink2 = 'https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getBlock#getblock'
  const hintLink3 = 'https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getStorageAt#getstorageat'
  const hintLink4 = 'https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html?highlight=todecimal#hextonumber'


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
      const balance = await nftContract.methods.balanceOf(walletAddress, 5).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true); // set loading before starting the operation
      const receipt = await factoryContract.methods.deploy(5).send({
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
      toast.error("Game creation failed. Please make sure your Metamask wallet is properly connected.");
    }
  };

  const timeReset = async (_Timestamp) => {
    if (isNaN(_Timestamp)) {
      alert('Invalid timestamp!');
      return;
    }
  
    if (instanceContract) {
      try {
        await instanceContract.methods.timeReset(_Timestamp).send({
          from: walletAddress,
          gas: 500000,
        }).then(async () => {
          console.log('Transaction sent successfully!');
          toast.success("Transaction sent successfully!"); // Success toast
          if (TokenBalance < 1) {
            try {
              await nftContract.methods.mint(5, InstanceAddress).send({
                from: walletAddress,
                gas: 500000,
              })
                .once("error", (err) => {
                  console.log(err);
                  toast.error("Minting failed."); // Error toast
                })
                .once("receipt", async () => {
                  const balance = await nftContract.methods.balanceOf(walletAddress, 5).call();
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
        console.log(err);
        toast.error("Time reset failed."); // Error toast
      }
    }
  };
  const success = async () => {
    const success = await instanceContract.methods.success().call();
    console.log(success);
    setSuccessState(success); // set state here
  }
  const code = `// SPDX-License-Identifier: MIT
  pragma solidity 0.8.10;
  
  contract Timestamp {
      uint256 private currentBlockTimestamp;
      bool public success;
  
      constructor() {
          currentBlockTimestamp = block.timestamp;
      }
      function timeReset(uint256 _Timestamp) external {
          require(currentBlockTimestamp == _Timestamp,"This Is Not The Timestamp");
          currentBlockTimestamp = 0;
          success = true;
      }
  }`;

  return (
    <>
    <Container className="game-container">
      <Card className="game-card"  style={{ backgroundColor: '#001636', color: 'white' }}>
        <Link to="/" className="btn btn-primary" style={{ position: 'absolute', left: '0', top: '0' }}>
          <i className="fas fa-home"></i>
        </Link>
        <CardBody>
          <CardTitle className="game-title title-color" ><b>Timestamp</b></CardTitle>
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

      <Card className="game-card"  style={{ backgroundColor: '#001636', color: 'white' }}>
        <CardBody>
          <CardTitle className="card-title  title-color" ><b>Game Description</b></CardTitle>
          <p><b>Your task is to understand and interact with the block.timestamp in Solidity, which provides the timestamp of the current block.</b>
            <br /><br />
            <b><strong> You need:</strong>  To complete this puzzle, you need to understand how block.timestamp works in Solidity and how to access it. </b></p>
          <div>
            <Button color="primary" className="button-margin" onClick={createGame}>
              Create Instance
            </Button>
          </div>
        </CardBody>
      </Card>
      {!isLoading && InstanceAddress !== "" && (
          <>
            <Card className="game-card"  style={{ backgroundColor: '#001636', color: 'white', minHeight: '150px' }}>
              <CardBody>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button color="primary" className="mt-1" onClick={() => success()}>
                    success
                  </Button>
                  {successState !== null && 
                    <p style={{ marginLeft: '10px', marginTop: '12px' }}>
                      {successState.toString()}
                    </p>
                  }
                </div>
                <br />
                <Button color="info" className="mt-1" onClick={toggleHint}>
                  {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                </Button>
              </CardBody>
            </Card>
            
            <Card className="game-card"  style={{ backgroundColor: '#001636', color: 'white' }}>
              <CardBody>
                <h3 className="mt-1 title-color" >Your Test Address: <p className="Instance-color"> {InstanceAddress} </p></h3>
                <FormGroup>
                <Input
                className="form-control-alternative"
                id="input-city"
                placeholder="_Timestamp"
                type="text"
                onChange={(e) => setTimestamp(e.target.value)}
              />
                </FormGroup>
                <Button color="primary" className="mt-1" onClick={() => timeReset(Timestamp)}>
                  timeReset
                </Button>
              </CardBody>
            </Card>
          </>
        )}
     
      {isHintVisible && (
        <Card className="card"  style={{ backgroundColor: '#001636', color: 'white' }}>
          <CardBody>
            <CardTitle className="card-title title-color" ><b>Hint</b></CardTitle>
            <p>
              <strong>
                <a style={{ textDecoration: "underline" }} href={hintLink} target="_blank" rel="noopener noreferrer"> https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getTransaction#gettransaction</a>
                <br />
                +
                <br />
                <a style={{ textDecoration: "underline" }} href={hintLink2} target="_blank" rel="noopener noreferrer"> https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getBlock#getblock</a>
                <br />
                OR
                <br />
                <a style={{ textDecoration: "underline" }} href={hintLink3} target="_blank" rel="noopener noreferrer"> https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getStorageAt#getstorageat</a>
                <br />
                +
                <br />
                <a style={{ textDecoration: "underline" }} href={hintLink4} target="_blank" rel="noopener noreferrer"> https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html?highlight=todecimal#hextonumber</a>
              </strong>.
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

export default Game5;
