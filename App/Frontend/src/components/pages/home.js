import React from 'react';
import Hero from '../Hero/Hero';
import AboutPage from './about';
import FeaturedHealers from '../FeaturedHealers/FeaturedHealers';
import Footer from '../footer/Footer';
function home() {
    return <>
        <Hero />
        <AboutPage />
        <FeaturedHealers />
        <Footer />
    </>;
}

export default home;