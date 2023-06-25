import { useContext, useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { Web3Context } from '../../index';
import { TypeAnimation } from 'react-type-animation';
import '../../assets/css/game.css'
import CarouselComponent from './CarouselComponent.js'

const Header = () => {
  const web3Context = useContext(Web3Context);
  const [walletAddress, setWalletAddress] = useState(web3Context.walletAddress);
  const [Chain, setChain] = useState(web3Context.Chain);
  const { nftContract } = useContext(Web3Context);
  const [tokenIDs, setTokenIDs] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    // Check if the chain is supported before making any contract calls
    if (!walletAddress || !nftContract || ![/* your supported chain IDs */].includes(Chain)) {
      return;
    }
    let tempTokenIDs = [];
    for (let index = 1; index <= 14; index++) {
      const balance = await nftContract.methods.balanceOf(walletAddress, index).call();
      if (balance > 0) {
        tempTokenIDs.push(index);
      }
    }
    setTokenIDs(tempTokenIDs);
  };
  fetchData();
}, [Chain ,walletAddress, nftContract])





  useEffect(() => {
    setWalletAddress(web3Context.walletAddress);
    setChain(web3Context.Chain);
    const ethereum = window.ethereum;
    if (ethereum && ethereum.on) {
      const handleAccountsChanged = function (accounts) {
        setWalletAddress(accounts[0]);
        // setChain(Chain); remove this line
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
    14: 'Factory'
  };
  return (
    <div className="header mt--5 pb-0 pt-md-0 container-color">
      <Col className="text-center">
        <h1 className="" style={{ color: '#5e72e4', fontSize: '3.4em', fontWeight: 'bold', fontFamily: 'Montserrat' }}>
          Tocon Quest
        </h1>

        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed once, initially
            ' With Intriguing Games, We convert Complex Solidity Coding Learnings into a Thrilling Quest. Get ready to Learn, Play, and Thrive!',
            5000,
            ''
          ]}
          speed={50}
          style={{ fontSize: '17px' }}
          repeat={Infinity}
        />
      </Col>

      <br />
      <CarouselComponent />
      <br />
      <Container fluid>

        <div className="header-body">

          <Row>
            <Col xl="1" />
            <Col lg="6" xl="4">
              <Card className="card-stats mb-4 mb-xl-0 card-fixed card-frame" style={{ backgroundColor: '#001636', color: 'white' }} responsive>
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase mb-0"
                        style={{ color: '#5e72e4', fontFamily: 'Montserrat' }}
                      >
                        Login
                      </CardTitle>
                      <br />
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="h2 font-weight-bold mb-0" style={{ fontSize: '14px', color: 'white' }}>
                          {walletAddress ? walletAddress : <p className="h2 font-weight-bold mb-0" style={{ fontSize: '14px', color: 'white' }}> You must connect a digital wallet to play the game </p>}
                        </span>
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow" style={{ marginLeft: '10px' }}>
                          <i className="fas fa-wallet" />
                        </div>
                      </div>
                      <span className="h2 font-weight-bold mb-0" style={{ fontSize: '14px', color: 'white' }}>
                          {Chain ? <p className="d-flex align-items-center justify-content-center">{Chain}</p> : <p className="h2 font-weight-bold mb-0" style={{ fontSize: '14px', color: 'white' }}> Meta Mask not detected </p>}
                        </span>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="6">
              <Card className="card-stats mb-4 mb-xl-0 card-fixed card-frame" style={{ backgroundColor: '#001636', color: 'white' }}>
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase mb-0 pb-2"
                        style={{ color: '#5e72e4', fontFamily: 'Montserrat' }}
                      >
                        Achievements
                      </CardTitle>
                      <br />
                      <Row>
                        {tokenIDs.length === 0 ? (
                          <Col className="d-flex align-items-center justify-content-center">
                            <span className="h2 font-weight-bold mb-0" style={{ color: 'white', fontSize: '16px' }}>
                              There is no achievements
                            </span>
                          </Col>
                        ) : (
                          tokenIDs.map((id, index) => (
                            <Col md="3" key={index}>
                              <span className="h2 font-weight-bold mb-0" style={{ color: 'white', fontSize: '12px' }}>
                                {tokenIDtoGame[id]}
                                <i className="fas fa-medal" style={{ marginLeft: '5px', color: 'gold' }} />
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
