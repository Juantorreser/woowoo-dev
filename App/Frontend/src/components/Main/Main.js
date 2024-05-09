import React from "react";
import { Routes, Route } from "react-router-dom";
import Search from '../pages/search/search';
import About from '../pages/about';
import Privacy from '../pages/privacy';
import Services from '../pages/services';
import Home from '../pages/home';
import SignIn from '../account/signin';
import Signup from '../account/signup';
import Account from '../account/account';   //There is no Account function yet. when the user is already signed in, this will lead them to the Account function from the module.
import SignOut from '../account/signout';
import Schedule from '../pages/schedule';

//Main acts as a container for the routing
const Main = () => {
    return (
        <main>
        <div className='Main'>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/home' element={<Home />} />
                <Route exact path='/search' element={<Search />} component={Search} />
                <Route exact path='/services' element={<Services />} />
                <Route exact path='/about' element={<About />} />
                <Route exact path='/schedule' element={<Schedule />} />
				<Route exact path='/privacy' element={<Privacy />} />
                <Route exact path='/signin' element={<SignIn />} />
                <Route exact path='/signup' element={<Signup />} />
                <Route exact path='/account' element={<Account />} />
                <Route exact path='/signout' element={<SignOut />} />
            </Routes>
        </div>
        </main>
    )
};

export default Main;