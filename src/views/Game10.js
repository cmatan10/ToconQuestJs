import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../index';
import InstanceABI from '../interfaces/InterfaceId.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AdminFooter from '../components/Footers/AdminFooter.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';
function Game10() {
  const [id, setid] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false); // new loading state
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const hintLink = 'https://emn178.github.io/online-tools/keccak_256.html'
  const [_answer, setAnswer] = useState(null); // added a new state variable to hold the answer

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
      const balance = await nftContract.methods.balanceOf(walletAddress, 10).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true); // set loading before starting the operation
      const receipt = await factoryContract.methods.deploy(10).send({
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


  const CalcMe = async (id) => {
    // Check if id is a valid integer or hexadecimal
    let inputid = id.startsWith('0x') ? id.slice(2) : id;

    // Check if inputBytes2 is a valid hex string
    if (!web3.utils.isHex(id) && isNaN(id) || !/^([0-9A-Fa-f]{8})$/.test(inputid)) {
      alert('Invalid input! Please provide a valid integer or hexadecimal');
      return;
    }

    // Convert to hex if the input is an integer
    let inputId = isNaN(id) ? id : web3.utils.toHex(id);

    if (instanceContract) {
      try {
        await instanceContract.methods.CalcMe(inputId).send({
          from: walletAddress,
          gas: 500000,
        }).then(async () => {
          const ans = await instanceContract.methods.answer().call()

          if (ans == true) { 
            console.log('Transaction sent successfully!');
            toast.success("Transaction sent successfully!"); // Success toast
            if (TokenBalance < 1) {
              try {
                await nftContract.methods.mint(10, InstanceAddress).send({
                  from: walletAddress,
                  gas: 500000,
                })
                  .once("error", (err) => {
                    console.log(err);
                    toast.error("Minting failed."); // Error toast
                  })
                  .once("receipt", async () => {
                    const balance = await nftContract.methods.balanceOf(walletAddress, 10).call();
                    setTokenBalance(balance);
                    console.log(balance);
                    toast.success("Minting completed successfully!"); // Success toast
                  });
              } catch (err) {
                console.error(err.message);
                toast.error("Minting failed."); // Error toast
              }
            }
          }

        });
      } catch (err) {
        console.error(err.message);
        toast.error("CalcMe operation failed."); // Error toast
      }
    }
  };

  const answer = async () => {
    const ans = await instanceContract.methods.answer().call()
    console.log(ans);
    setAnswer(ans); // update the answer state
  }

  const code = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.10;
  
  contract InterfaceId {
      bool public answer;
  
      function CalcMe(bytes4 id) external {
          require(id == bytes4(keccak256("CalcMe(bytes4)")), "Calc Me Again!");
          answer = true;
      }
  }
  `;

  return (
    <>
      <Container className="game-container">
        <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white' }}>

          <CardBody>
            <CardTitle className="game-title title-color" ><b>Interfaceid</b></CardTitle>
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
            <p><b>Your task is to decipher what a function signature looks like and how to find it.</b>
              <br /><br />
              <b><strong> You need:</strong> To solve this puzzle, you need to understand function signatures in Solidity, how to compute them using the keccak256 hash function, and how to convert them into the bytes4 type. </b>
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button color="primary" className="mt-1" onClick={() => answer()}>
                    answer
                  </Button>
                  {_answer !== null && 
                  <p style={{ marginLeft: '10px', marginTop: '12px' }}>
                    {_answer.toString()}
                  </p>}
                </div>
                <br />
                <Button color="info" className="mt-1" onClick={toggleHint}>
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
                    onChange={(e) => setid(e.target.value)}
                  />
                </FormGroup>
                <Button color="primary" className="mt-1" onClick={() => CalcMe(id)}>
                  CalcMe
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
                <strong>Calculate the function signature </strong> <a style={{ textDecoration: "underline" }} href={hintLink} target="_blank" rel="noopener noreferrer"><strong>Here</strong></a>.
                <br />
                <strong><strong>or</strong></strong>
                <br />
                <strong>Write a function according to the following interface:<strong> function Calc() external pure returns (bytes4);</strong></strong>
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
      <AdminFooter />
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    </>
  );


}

export default Game10;
