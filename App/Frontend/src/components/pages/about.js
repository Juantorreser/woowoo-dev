import React from 'react';
import './about.css';
import { Container, Row, Col, Image } from 'react-bootstrap';
import images from './images/image.png';

const AboutPage = () => {
  return (
    <section id="about" className="about-page">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col md={5} className="mb-4 mb-md-0">
            {/* Use imported image here */}
            <Image src={images} alt="Woo Woo Network" fluid />
          </Col>

          <Col md={7}>
            <div className="about-content">
              <div className="text-left">
                <p>
                  Woo Woo Network was imagined by Kimberlee Klein to empower healers globally. Kimberlee works with those who have experienced pregnancy loss, guiding them towards spiritual healing and personal growth.
                </p>
                <p>
                  Recognizing the need for a platform that promotes healers effectively, Kimberlee founded Woo Woo Network to support healers in building sustainable businesses. We believe in the transformative power of holistic healing tools that enable clients to overcome life challenges peacefully.
                </p>
                <p>
                  At Woo Woo Network, we provide a safe space for clients to explore different healing modalities and capture the impact of healing sessions. Join us in discovering new tools and methodologies to enhance your spiritual journey!
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutPage;
