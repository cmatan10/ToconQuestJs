import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../index';
import InstanceABI from '../interfaces/GasChecker.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AdminFooter from '../components/Footers/AdminFooter.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';
function Game6() {
  const [iterations, setiterations] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false); // new loading state
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [gasUsedValue, setGasUsedValue] = useState(null);
  const [gasCheckedValue, setGasCheckedValue] = useState(null);
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
      const balance = await nftContract.methods.balanceOf(walletAddress, 6).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true); // set loading before starting the operation
      const receipt = await factoryContract.methods.deploy(6).send({
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

  const complexOperation = async (iterations) => {
    if (isNaN(iterations)) {
      alert('Invalid iteration count!');
      return;
    }

    if (instanceContract) {
      try {
        await instanceContract.methods.complexOperation(iterations).send({
          from: walletAddress,
          gas: 500000,
        }).then(async () => {
          const gas = await instanceContract.methods.gasUsed().call()
          if (gas > 3000 && gas < 5000) {
            console.log('Transaction sent successfully!');
            toast.success("Transaction sent successfully!"); // Success toast
            if (TokenBalance < 1) {
              try {
                await nftContract.methods.mint(6, InstanceAddress).send({
                  from: walletAddress,
                  gas: 500000,
                })
                  .once("error", (err) => {
                    console.log(err);
                    toast.error("Minting failed."); // Error toast
                  })
                  .once("receipt", async () => {
                    const balance = await nftContract.methods.balanceOf(walletAddress, 6).call();
                    setTokenBalance(balance);
                    console.log(balance);
                    toast.success("Minting completed successfully!"); // Success toast
                  });
                  // console.log('Transaction sent successfully!');
                  // toast.success("Transaction sent successfully!"); // Success toast
              } catch (err) {
                console.error(err.message);
                toast.error("Minting failed."); // Error toast
              }
            }
          }

        });
      } catch (err) {
        console.log(err);
        toast.error("Complex operation failed."); // Error toast
      }
    }
  };

  const gasUsed = async () => {
    const gasUsed = await instanceContract.methods.gasUsed().call();
    setGasUsedValue(gasUsed);
    console.log(gasUsed);
  }

  const GasChecked = async () => {
    const GasChecked = await instanceContract.methods.GasChecked().call();
    setGasCheckedValue(GasChecked);
    console.log(GasChecked);
  }
  const code = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.10;
  
  contract GasChecker {
      uint256 public gasUsed = 0; 
      bool public GasChecked = false;
  
      function complexOperation(uint256 iterations) external {
          uint256 gasStart = gasleft();
  
          uint256 sum = 0;
          for(uint256 i = 0; i < iterations; i++) {
              sum += i;
          }
  
          gasUsed = gasStart - gasleft();
          
          if(gasUsed > 3000 && gasUsed < 5000){
           GasChecked = true;
          }
      }
  }
  `;

  return (
    <>
      <Container className="game-container">
        <Card className="game-card" style={{ backgroundColor: '#001636', color: 'white' }}>
          <Link to="/" className="btn btn-primary" style={{ position: 'absolute', left: '0', top: '0' }}>
            <i className="fas fa-home"></i>
          </Link>
          <CardBody>
            <CardTitle className="game-title title-color" ><b>Gas Checker</b></CardTitle>
            <div className="code-section" >
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
            <p><b>Your task is to understand how gas is consumed in a contract operation and to manage the gas usage effectively within a given range.</b>
              <br /><br />
              <b><strong> You need:</strong> To solve this puzzle, you need to understand Ethereum's gas concept, how to use gasleft() to monitor gas consumption, and how to control and optimize gas usage in Solidity. </b>
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
          <Button color="primary" className="mt-1" onClick={() => gasUsed()}>
            gasUsed
          </Button>
          {gasUsedValue !== null &&
            <p style={{ marginLeft: '10px', marginTop: '12px' }}>
              {gasUsedValue}
            </p>
          }
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <Button color="primary" className="mt-1" onClick={() => GasChecked()}>
            GasChecked
          </Button>
          {gasCheckedValue !== null &&
            <p style={{ marginLeft: '10px', marginTop: '12px' }}>
              {gasCheckedValue ? "True" : "False"}
            </p>
          }
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
            onChange={(e) => setiterations(e.target.value)}
          />
        </FormGroup>
        <Button color="primary" className="mt-1" onClick={() => complexOperation(iterations)}>
          complexOperation
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
                <strong>Try to figure out how much gas is required for one iteration, so you can estimate how many iterations the loop will take to consume gas in the range of 3000 to 5000. </strong>
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

export default Game6;
