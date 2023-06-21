import React from 'react';
import { Container, Row, Col, Form, FormGroup, Input, Button } from "reactstrap";
import '../../assets/css/game.css';

const Footer = () => {
  return (
    <div className="footer py-3 container-color">
      <Container fluid>
        <Row className="justify-content-center mb-3">
          <Col xs="12" sm="10" md="8" className="text-center">
            <h4 className="text-light mb-1" style={{ fontSize: '18px' }}>Join the Disruptor's Guide Community</h4>
            <p className="text-light small" style={{ fontSize: '14px' }}>
              Unlock more value from academy.tocon! Our free newsletter is your guide in the Web3 and Creator Economy universe. Get insights, trends, and strategies, plus an exclusive E-book, all at no cost. Subscribe now!
            </p>
     
            <iframe 
  src="https://embeds.beehiiv.com/12e92968-4f43-4f52-82e9-920ee0132120?slim=true" 
  data-test-id="beehiiv-embed" 
  height="52" 
  frameborder="0"
  title="Disruptor's Guide Community Subscription" // Add a unique title here
></iframe>          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8">
            <Row>
              <Col md="4" className="text-center">
                <strong><strong> <h6 className="text-uppercase text-light mb-1">Resources</h6></strong> </strong>
                <ul className="list-unstyled" style={{ fontSize: '20px' }}>
                  <li><a href="/about" className="text-light small" rel="noopener noreferrer"> About</a></li>
                  <li><a href="/preparation" className="text-light small" rel="noopener noreferrer"> Preparation</a></li>
                  <li><a href="https://github.com/cmatan10/toconquest" className="text-light small" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a></li>
                </ul>
              </Col>
              <Col md="4" className="text-center">
                <strong><strong><h6 className="text-uppercase text-light mb-1 ">Follow Us</h6></strong> </strong>
                <ul className="list-inline py-3" style={{ fontSize: '20px' }}>
                  <li className="list-inline-item"><a href="https://www.linkedin.com/company/tocon-io/?viewAsMember=true" className="text-light" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a></li>
                  <li className="list-inline-item"><a href="https://www.facebook.com/Tocon.io.Company?mibextid=LQQJ4d" className="text-light" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a></li>
                  <li className="list-inline-item"><a href="https://twitter.com/tocon_io" className="text-light" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></li>
                  <li className="list-inline-item"><a href="https://www.pinterest.com/toconio/" className="text-light" target="_blank" rel="noopener noreferrer"><i className="fab fa-pinterest"></i></a></li>
                  <li className="list-inline-item"><a href="https://www.youtube.com/@Tocon_io" className="text-light" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a></li>
                  <li className="list-inline-item"><a href="https://www.instagram.com/tocon_io/?igshid=MmIzYWVlNDQ5Yg%3D%3D" className="text-light" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a></li>
                  <li className="list-inline-item"><a href="https://open.spotify.com/show/704HlTFE3fBwLT4PUX2LOA?si=dfbbca840517417a&nd=1" className="text-light" target="_blank" rel="noopener noreferrer"><i className="fab fa-spotify" ></i></a></li>

                  
                </ul>
              </Col>
              <Col md="4" className="text-center">
                <strong><strong><h6 className="text-uppercase text-light mb-1">Contact Us</h6></strong> </strong>
                <ul className="list-inline" style={{ fontSize: '18px' }}>
                  <li><a href="https://www.tocon.io/" className="text-light small" target="_blank" rel="noopener noreferrer">Tocon.io</a></li>
                  <li><a href="https://academy.tocon.io/" className="text-light small" target="_blank" rel="noopener noreferrer">Tocon Academy</a></li>
                  <li className="list-inline-item"><a href="mailto:info@tocon.io" className="mb-1 text-light small"><i className="fas fa-envelope"></i> info@tocon.io</a></li>
                </ul>
              </Col>
            </Row>
            <Row>
              <Col className="text-center py-1 mt-2 border-top border-light" style={{ justifyContent: 'space-between', display: 'flex' }}>
                <p className="mb-0 text-light small" style={{ marginLeft: '1rem', fontSize: '13px' }}>© 2022 Tocon.io, Inc. All rights reserved.</p>
                <a href="mailto:matan.cohen@tocon.io" className="text-light small" target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px' }}><i className="fas fa-envelope"></i> Contact Author</a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
