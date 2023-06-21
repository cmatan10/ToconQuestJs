import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../index';
import InstanceABI from '../interfaces/EncodeData.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AdminFooter from '../components/Footers/AdminFooter.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';
function Game11() {
  const [encodedData, setencodedData] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false); // new loading state
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const hintLink = 'https://web3js.readthedocs.io/en/v1.7.1/web3-eth-abi.html#encodeparameters'
  const [_encodeStringAndUint, setEncodeStringAndUint] = useState(null); // new state variable for _encodeStringAndUint

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
      const balance = await nftContract.methods.balanceOf(walletAddress, 11).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true); // set loading before starting the operation
      const receipt = await factoryContract.methods.deploy(11).send({
        from: walletAddress,
        gas: 800000,
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

  const encode = async (encodedData) => {
    if (instanceContract) {
      try {
      await instanceContract.methods.encode(encodedData).send({
        from: walletAddress,
        gas: 500000,
      }).then(async () => {
        console.log('Transaction sent successfully!');
        toast.success("Transaction sent successfully!"); // Success toast
        if (TokenBalance < 1) {
          try {
          await nftContract.methods.mint(11, InstanceAddress).send({
            from: walletAddress,
            gas: 500000,
          })
            .once("error", (err) => {
              console.log(err);
              toast.error("Minting failed."); // Error toast
            })
            .once("receipt", async () => {
              const balance = await nftContract.methods.balanceOf(walletAddress, 11).call();
              setTokenBalance(balance);
              console.log(balance);
              toast.success("Minting completed successfully!"); // Success toast
            });
          } catch (err) {
            console.error(err.message);
            toast.error("Minting failed."); // Error toast
          }
        }
      })
  
    } catch (err) {
      console.error(err.message);
      toast.error("Encoding failed."); // Error toast
    }
    }
  };

  const encodeStringAndUint = async () => {
    let _encode = await instanceContract.methods._encodeStringAndUint().call();
    if(_encode === null){
      _encode = 'bytes: 0x'
    }
    console.log(_encode);
    setEncodeStringAndUint(_encode); 
  };

  const code = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.10;
  
  contract EncodeData {
      bytes public _encodeStringAndUint = hex"";
  
      function encode(bytes memory encodedData) external {
          require(
              keccak256(encodedData) == keccak256(abi.encode("WEB", 3)),
              "The Answer is incorrect"
          );
          _encodeStringAndUint = encodedData;
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
          <CardTitle className="game-title title-color" ><b>Encode Data</b></CardTitle>
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
          <p><b>Your task is to correctly encrypt the values "WEB" and 3 using Solidity's abi.encode. Pass the encoded information to the decode function to verify your solution.</b>
            <br /><br />
            <b><strong> You need:</strong> To complete this mission, you need to be familiar with the abi.encode function for encoding data in Solidity, understand how the keccak256 hash function works, and use these tools to encrypt data. </b>
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
        <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white', minHeight: '150px' }}>
            <CardBody>
              <Button color="primary" className="mt-1" onClick={encodeStringAndUint}>
                _encodeStringAndUint
              </Button>
              {_encodeStringAndUint !== null && <p style={{ wordBreak: "break-all" }}>{_encodeStringAndUint}</p>}
              <br />
              <Button color="info" className="mt-1" onClick={toggleHint}>
                { isHintVisible ? 'Hide Hint' : 'Show Hint'}
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
                  onChange={(e) => setencodedData(e.target.value)}
                />
              </FormGroup>
              <Button color="primary" className="mt-1" onClick={() => encode(encodedData)}>
                encode
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
                            <strong>Use the encodeparameters function from the web3js library. You can read more </strong> <a style={{textDecoration: "underline"}} href={hintLink} target="_blank" rel="noopener noreferrer"><strong>Here</strong></a>.
                           <br/>
                           <strong><strong>or</strong></strong>
                            <br/>
                            <strong>Write a function according to the following interface:<br/> <strong> function encode(string memory _str, uint256 _num) external pure returns (bytes memory);</strong></strong>
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

export default Game11;
