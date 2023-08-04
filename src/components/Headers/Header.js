import { useContext, useEffect, useState, useRef } from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col, Button } from "reactstrap";
import { Web3Context } from '../../Web3Context';
import { TypeAnimation } from 'react-type-animation';
import '../../assets/css/game.css'

const Header = () => {
  const web3Context = useContext(Web3Context);
  const [walletAddress, setWalletAddress] = useState(web3Context.walletAddress);
  const [Chain, setChain] = useState(web3Context.Chain);
  const { nftContract } = useContext(Web3Context);
  const [tokenIDs, setTokenIDs] = useState(JSON.parse(localStorage.getItem('achievements')) || []);
  const walletAddressRef = useRef(walletAddress);
  const chainRef = useRef(Chain);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Chain:', Chain);
    console.log('tokenIDs:', tokenIDs);
    console.log('walletAddress:', walletAddress);

    if (nftContract !== null) {
      console.log('nftContract:', nftContract);
      console.log('nftContract _address:', nftContract._address);
    } else {
      console.log("nftContract is null");
    }
  }, [tokenIDs, walletAddress, nftContract, Chain]);
  
  useEffect(() => {
    if (nftContract) {
      updateAchievements(walletAddress);
    }
  }, [nftContract, walletAddress]);

  const updateAchievements = async (address) => {
    if (!nftContract) {
      console.error("nftContract is null");
      return;
    }
  
    let tempTokenIDs = [];
    for (let index = 1; index <= 17; index++) {
      try {
        const balance = await nftContract.methods.balanceOf(address, index).call();
        if (balance > 0) {
          tempTokenIDs.push(index);
        }
      } catch (e) {
        console.error(`Failed to fetch balance for token ${index} on network ${chainRef.current}. Error: ${e.message}`);
      }
    }
    setTokenIDs(tempTokenIDs);
  };

  
  useEffect(() => {
    if (tokenIDs.length > 0) {
      localStorage.setItem('achievements', JSON.stringify(tokenIDs));
    }
  }, [tokenIDs]);

  useEffect(() => {
    walletAddressRef.current = walletAddress;
    chainRef.current = Chain;
    // Trigger the update of achievements when the wallet address changes
    updateAchievements(walletAddress);
  }, [walletAddress, Chain]);

  useEffect(() => {
    setWalletAddress(web3Context.walletAddress);
    setChain(web3Context.Chain);
    const ethereum = window.ethereum;
    if (ethereum && ethereum.on) {
      const handleAccountsChanged = function (accounts) {
        setWalletAddress(accounts[0]);
        
      };
      const handleChainChanged = (chainId) => {
        // this line will convert chainId to decimal from hexadecimal
        const decimalChainId = parseInt(chainId, 16);
        setChain(decimalChainId);
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (ethereum && ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      }
    }
  }, [web3Context.walletAddress, web3Context.Chain]);


useEffect(() => {
    walletAddressRef.current = walletAddress;
    chainRef.current = Chain;
}, [walletAddress, Chain]);

useEffect(() => {
    const fetchData = async () => {
        let tempTokenIDs = [];
        for (let index = 1; index <= 17; index++) {
            try {
                const balance = await nftContract.methods.balanceOf(walletAddressRef.current, index).call();
                if (balance > 0) {
                    tempTokenIDs.push(index);
                }
            } catch (e) {
                console.error(`Failed to fetch balance for token ${index} on network ${chainRef.current}. Error: ${e.message}`);
            }
        }
        setTokenIDs(tempTokenIDs);
    };
        fetchData();
}, [nftContract]);

  const ChainToNetwork = {
    5: 'Goerli',
    11155111: 'Sepolia',
    80001: 'Mumbai',
    97: 'Bsc Testnet'
  };

  const tokenIDtoGame = {
    1: 'Bytes2',
    2: 'Fallback',
    3: 'BalanceChecker',
    4: 'PayableContract',
    5: 'Timestamp',
    6: 'GasChecker',
    7: 'ChangePassword',
    8: 'Overflow',
    9: 'BlockHash',
    10: 'InterfaceId',
    11: 'EncodeData',
    12: 'HashCollision',
    13: 'DecodeData',
    14: 'Factory',
    15: 'SupportInterface',
    16: 'LimitedTickets',
    17: 'EducatedGuess'
  };
  return (
    <div className="header header-component mt--0  pt-md-9 header-background ">
    
      <Col className="text-center ">
        <h1 className="page-title" style={{ fontFamily: 'Montserrat',color:'#a3a4af'}}>
          Tocon Quest
        </h1>

        <div className='animation-media '>
          <TypeAnimation
            className='type-animation-container'
            sequence={[
              // Same substring at the start will only be typed once, initially
              'With Intriguing Games, We convert Complex Solidity Coding Learnings into a Thrilling Quest.',
              6000, 
              'You Can Play In The Following Test networks: Mumbai, Goerli, Sepolia, Liena Testnet And BSC Testnet.',
              6000,
              'Get ready to Learn, Play, and Thrive!',
              6000,
            ]}
            speed={50}
            repeat={Infinity}
          />
        </div>
        
      </Col>

      <br />
      <Container fluid>

        <div className="header-body">

          <Row>
            <Col xl="1" />

            <Col lg="6" xl="10">
              <Card className="card-stats mb-4 mb-xl-0 card-fixed card-frame" style={{ backgroundColor: '#001636', color: 'white', position: 'relative', top: '120px' }}>
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase mb--3 "
                        style={{ color: '#ffffff', fontFamily: 'Montserrat', fontSize: '18px' }}
                      >
                        Achievements
                      </CardTitle>
                      <br />
                      <Row>
                        {tokenIDs.length === 0 ? (
                          <Col className="d-flex align-items-center justify-content-center">
                            <span className="h2 font-weight-bold mb-0 mb--6" style={{ color: '#a3a4af', fontSize: '15px' }}>
                              There is no achievements
                            </span>
                          </Col>
                        ) : (
                          tokenIDs.map((id, index) => (
                            <Col md="2" key={index}>
                              <span className="h2 font-weight-bold mb-0 " style={{ color: '#a3a4af', fontSize: '13px' }}>
                                {tokenIDtoGame[id]}
                                <i className="fas fa-medal" style={{ marginLeft: '5px', color: '#f2a23dba' }} />
                              </span>
                            </Col>
                          ))
                        )}
                      </Row>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl="2" />
          </Row>
        </div>
      </Container>
      <br />



    </div>
  );
};

export default Header;
