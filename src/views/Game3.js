import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../index';
import InstanceABI from '../interfaces/BalanceChecker.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AdminFooter from '../components/Footers/AdminFooter.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../assets/css/game.css';
function Game3() {
  const [_account, set_account] = useState("");
  const [_amount, set_amount] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false); // new loading state
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const hintLink = "https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=balance#getbalance";
  const [correctBalanceChecked1, setCorrectBalanceChecked] = useState(null);

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
      const balance = await nftContract.methods.balanceOf(walletAddress, 3).call();
      setTokenBalance(balance);
      console.log(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true);
      const receipt = await factoryContract.methods.deploy(3).send({
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


  const checkBalance = async (_account, _amount) => {
    if (!web3.utils.isAddress(_account)) {
      alert('Invalid Ethereum address!');
      return;
    }

    if (instanceContract) {
      try {
        await instanceContract.methods.checkBalance(_account, _amount).send({
          from: walletAddress,
          gas: 500000,
        }).then(async () => {
          console.log('Transaction sent successfully!');
          toast.success("Transaction sent successfully!"); // Success toast
          if (TokenBalance < 1) {
            console.log(TokenBalance);
            try {
              await nftContract.methods.mint(3, InstanceAddress).send({
                from: walletAddress,
                gas: 500000,
              })
                .once("error", (err) => {
                  console.log(err);
                  toast.error("Minting failed."); // Error toast
                })
                .once("receipt", async () => {
                  const balance = await nftContract.methods.balanceOf(walletAddress, 3).call();
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
        toast.error("Checking balance failed."); // Error toast
      }
    }
  };

  const correctBalanceChecked = async () => {
    const balanceChecked = await instanceContract.methods.correctBalanceChecked().call();
    console.log(balanceChecked);
    setCorrectBalanceChecked(balanceChecked);
}

  const code = `// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.10;
    
    contract BalanceChecker {
        bool public correctBalanceChecked = false;
    
        function checkBalance(address _account, uint256 _amount) public {
            require(_account.balance == _amount, "Incorrect balance");
            correctBalanceChecked = true;
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
            <CardTitle className="game-title title-color" ><b>Balance Checker</b></CardTitle>
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
            <CardTitle className="game-title title-color" ><b>Game Description</b></CardTitle>
            <p><b>Your task is to master the skill of checking a digital wallet's balance and converting that balance from Ether to Wei.</b>
              <br /><br />
              <b><strong> You need:</strong> To solve this puzzle, you need to know how to check Ethereum account balances in Solidity and how to convert balances between Ether and Wei. </b></p>
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
                  <Button color="primary" className="mt-1" onClick={() => correctBalanceChecked()}>
                    correctBalanceChecked
                  </Button>
                  {correctBalanceChecked1 !== null &&
                    <p style={{ marginLeft: '10px', marginTop: '12px' }}>
                      {correctBalanceChecked1.toString()}
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
                    placeholder="_account"
                    type="text"
                    onChange={(e) => set_account(e.target.value)}
                  />
                  <br />
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="_amount"
                    type="text"
                    onChange={(e) => set_amount(e.target.value)}
                  />
                </FormGroup>
                <Button color="primary" className="mt-1" onClick={() => checkBalance(_account, _amount)}>
                  checkBalance
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
                <strong>Check how to Get the balance of an address at a given block. </strong>
                <a style={{ textDecoration: "underline" }} href={hintLink} target="_blank" rel="noopener noreferrer"><strong>Here</strong></a>.
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

export default Game3;
