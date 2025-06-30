import React from 'react';
import Hero from '../Hero/Hero';
import AboutPage from './about';
import FeaturedHealers from '../FeaturedHealers/FeaturedHealers';

function home() {
    return <>
        <Hero />
        <AboutPage />
        <FeaturedHealers />
    </>;
}

export default home;