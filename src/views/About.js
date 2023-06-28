import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import '../assets/css/About.css';
import AdminFooter from '../components/Footers/AdminFooter.js'

const About = () => {
  return (
    <div >
<br/>

      <Container fluid className="container-colors about-container">
        <Row className="about-heading-row">
          <Col className="text-center">
            <h1 className="about-heading" style={{color: '#5e72e4'}}>About ToconQuest</h1>
            <br/>
            <h2  style={{color: 'white'}}>Begin Your Blockchain Coding Journey with ToconQuest</h2>
          </Col>
        </Row>
        <Row className="about-content-row">
          <Col lg="2"></Col>
          <Col lg="8">
            <Card className="about-card">
              <CardBody>
                <h2 className="about-subheading" style={{color: '#5e72e4'}}>Embark on a Quest of Code</h2>
                <p className="about-text">
                Welcome to ToconQuest, an immersive coding game designed for anyone passionate about blockchain development and eager to master Solidity, the leading programming language for Ethereum smart contracts. 
                </p>
                <p className="about-text">
                As the world of blockchain continues to grow, understanding Solidity opens up a wealth of opportunities. Through a series of intriguing challenges and puzzles, ToconQuest provides a unique platform to learn, experiment, and become proficient in Solidity.                
                </p>

                <h2 className="about-subheading" style={{color: '#5e72e4'}}>Learn by Doing</h2>
                <p className="about-text">
                Say goodbye to mundane tutorials! At ToconQuest, we believe in learning by doing. Our game presents a variety of challenges, from crafting basic contracts to manipulating complex data structures. Each task is designed to enhance your understanding and proficiency in Solidity. 
                </p>
                <p className="about-text">
                For instance, you might find yourself triggering an overflow, checking balances, or even deciphering function signatures. Every challenge is a step forward in your Solidity journey.                
                </p>

                <h2 className="about-subheading" style={{color: '#5e72e4'}}>For Whom?</h2>
                <p className="about-text">
                Whether you're a seasoned developer ready to delve into blockchain, or a coding novice taking your first steps into this exciting field, ToconQuest is designed with you in mind. 
                </p>
                <p className="about-text">
                Our game offers a rich learning experience for everyone, regardless of their level of expertise. So, if you're passionate about coding and eager to explore the world of blockchain, ToconQuest is your perfect companion.                
                </p>

                <h2 className="about-subheading" style={{color: '#5e72e4'}}>Get Started</h2>
                <p className="about-text">
                Ready to embark on your coding adventure? Grab your keyboard, unleash your inner code wizard, and dive into the exciting world of ToconQuest. 
                </p>

                <p className="about-text">
                Join our community of web3 enthusiastic today and start your journey towards mastering Solidity. We can't wait to see how far you'll go!                </p>
   
                <p className="about-text">
                Remember, every great quest begins with a single step. Your step is here at ToconQuest. Let the adventure begin!                </p>
              </CardBody>
            </Card>
          </Col>
          <Col lg="2"></Col>
        </Row>
      </Container>
        
      <AdminFooter/>
    </div>
  );
};

export default About;
