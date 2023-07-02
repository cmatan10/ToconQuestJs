import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import '../assets/css/About.css';
import AdminFooter from '../components/Footers/AdminFooter.js'

const Preparation = () => {
  const alchemyFaucet = 'https://goerlifaucet.com/'
  const QuickNode = 'https://faucet.quicknode.com/ethereum'
  return (
    <div>
      <br />
      <Container fluid className="container-colors about-container container-padding-fix">
        <Row className="about-heading-row">
          <Col className="text-center">
            <h1 className="about-heading" style={{ color: '#5e72e4' }}>Your Quest Preparation</h1>
          </Col>
        </Row>
        <Row className="about-content-row">
          <Col lg="2"></Col>
          <Col lg="8">
            <Card className="about-card">
              <CardBody>
                <h2 className="about-subheading" style={{ color: '#5e72e4' }}>Equip Your MetaMask</h2>
                <p className="about-text">
                  To enter the realm of ToconQuest, you must use MetaMask. Install this essential browser extension to access our game universe.
                </p>

                <h2 className="about-subheading" style={{ color: '#5e72e4' }}>Fuel your wallet</h2>
                <p className="about-text">
                  We highly recommend fueling your wallet with tokens from the following test network faucets:
                  <a href={alchemyFaucet} target="_blank" rel="noopener noreferrer"><strong> alchemy Faucet </strong></a>
                 and
                  <a href={QuickNode} target="_blank" rel="noopener noreferrer"><strong> QuickNode Faucet. </strong></a>
                  Remember, you are not required to create an instance on the Ethereum mainnet - we have deployed the contract on various testnets (Mumbai, Goerli, Sepolia) so you can play for free!
                </p>


                <h2 className="about-subheading" style={{ color: '#5e72e4' }}>Ignite Your Instance</h2>
                <p className="about-text">
                  Ready to play? The moment you press the 'play' button, a new instance of the contract will be created - your gateway to the challenges ahead.
                </p>

                <h2 className="about-subheading" style={{ color: '#5e72e4' }}>Forge Your Code in Remix</h2>
                <p className="about-text">
                  As you journey through the game, you may need to interact with the code in Remix. Simply copy and paste your code into Remix and add the contract address created for your instance (Choose MetaMask as the provider, click 'At Address' and you're all set).
                </p>

                <h2 className="about-subheading" style={{ color: '#5e72e4' }}>Collect Your Victories</h2>
                <p className="about-text">
                  With every win, you get the opportunity to mint a badge. Gather all required badges and you can mint an impressive certificate! Celebrate your progress, one accomplishment at a time.
                </p>

                <h2 className="about-subheading" style={{ color: '#5e72e4' }}>Expand Your Knowledge</h2>
                <p className="about-text">
                  Stuck on a level or looking to deepen your understanding? Check out our Knowledge Base - it's packed with relevant articles and resources to help you conquer every challenge and master Solidity.
                </p>

              </CardBody>
            </Card>
          </Col>
          <Col lg="2"></Col>
        </Row>
      </Container><AdminFooter />
    </div>
  );
};

export default Preparation;
