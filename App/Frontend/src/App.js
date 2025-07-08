import React from 'react';
import './bootstrap/dist/css/bootstrap.min.css';
import Main from './components/Main/Main';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

const App = () => {
	return (
		<>    
			<Navbar />
			<Main />
			{/* <FeaturedHealers /> */}
			<Footer />
		</>
	)
	//footer after main
}

export default App;