import React from 'react';
import './about.css'; // Import your custom CSS file for additional styling
import { Container, Row, Col } from 'react-bootstrap';

const AboutPage = () => {
    return (
        <section id="about" className="about-page">
            {/* Animated Background */}
            <div className="animated-background"></div>

            <Container>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <div className="about-content">
                            <h1 className="display-4 text-green mb-4">About Woo Woo Network</h1>
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
}

export default AboutPage;
