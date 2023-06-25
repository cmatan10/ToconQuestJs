import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../index';
import { Button, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AdminFooter from '../components/Footers/AdminFooter.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';

function Game4() {
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false); // new loading state
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [isHintVisible, setIsHintVisible] = useState(false);

  const hintLink = "https://docs.soliditylang.org/en/v0.8.10/contracts.html?highlight=fallback#receive-ether-function";

  const toggleHint = () => {
    setIsHintVisible(!isHintVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress || !nftContract) {
        return;
      }
      const balance = await nftContract.methods.balanceOf(walletAddress, 4).call();
      setTokenBalance(balance);
      console.log(TokenBalance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true); // set loading before starting the operation
      const receipt = await factoryContract.methods.deploy(4).send({
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
  const checkPayableGame = async () => {
    const bal = await web3.eth.getBalance(InstanceAddress)
    if (bal == 1){
      toast("Well done! You have solved this level!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000, 
      }) }
    if (TokenBalance < 1) {
      try {
        await nftContract.methods.mint(4, InstanceAddress).send({
          from: walletAddress,
          gas: 500000,
        })
          .once("error", (err) => {
            console.log(err);
            toast.error("Minting failed."); // Error toast
          })
          .once("receipt", async () => {
            const balance = await nftContract.methods.balanceOf(walletAddress, 4).call();
            setTokenBalance(balance);
            console.log(balance);
            toast.success("Minting completed successfully!"); // Success toast
          });
      } catch (err) {
        console.error(err.message);
      }
  }
  };
  

  const code = `// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.10;
    
    contract PayableContract {
    
        receive() external payable {
            require(msg.value == 1 wei, "Incorrect amount received");
        }
    }`;

  return (
    <>
    <Container className="container">
      <Card className="card"  style={{ backgroundColor: '#001636', color: 'white' }}>

        <CardBody>
          <CardTitle className="card-title title-color" ><b>Payable Contract</b></CardTitle>
          <div style={{ position: 'relative' }}>
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

      <Card className="card"  style={{ backgroundColor: '#001636', color: 'white' }}>
        <CardBody>
          <CardTitle className="card-title title-color" ><b>Game Description</b></CardTitle>
          <p><b>Your task is to learn how the receive function works in a Solidity contract and how to interact with it.</b>
            <br /><br />
            <b><strong> You need:</strong>  To accomplish this task, you need to understand the receive function in Solidity, its purpose, when it's triggered, and how to interact with it by sending Ether to the contract. </b>
          </p>
          <div>
            <Button style={{backgroundColor: '#c97539' , color: 'white'}}  className="button" onClick={createGame}>
              Create Instance
            </Button>
          </div>

        </CardBody>
      </Card>

      {!isLoading && InstanceAddress !== "" && (
        <Card className="card"  style={{ backgroundColor: '#001636', color: 'white' }}>
          <CardBody>
          <h3 className="mt-1 title-color" >Your Test Address: <p className="Instance-color"> {InstanceAddress} </p></h3>
            <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="button" onClick={checkPayableGame}>
              Submit
            </Button>
            <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="button" onClick={toggleHint}>
              {isHintVisible ? 'Hide Hint' : 'Show Hint'}
            </Button>
          </CardBody>
        </Card>
      )}
      {isHintVisible && (
        <Card className="card"  style={{ backgroundColor: '#001636', color: 'white' }}>
          <CardBody>
            <CardTitle className="card-title title-color" ><b>Hint</b></CardTitle>
            <p>
              <strong>The receive function is executed on a call to the contract with empty calldata. This is the function that is executed on plain Ether transfers.
                You Can Read More  </strong> <a style={{ textDecoration: "underline" }} href={hintLink} target="_blank" rel="noopener noreferrer"><strong>Here</strong></a>.
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

export default Game4;
