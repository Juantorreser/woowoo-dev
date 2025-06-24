// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Search from '../pages/search/search';
// import About from '../pages/about';
// import Privacy from '../pages/privacy';
// import Services from '../pages/services';
// import Home from '../pages/home';
// import SignIn from '../account/signin';
// import Signup from '../account/signup';
// import Account from '../account/account';   //There is no Account function yet. when the user is already signed in, this will lead them to the Account function from the module.
// import SignOut from '../account/signout';
// import Schedule from '../pages/schedule';
// import MessageBox from '../pages/message';

// //Main acts as a container for the routing
// const Main = () => {
//     return (
//         <main>
//         <div className='Main'>
//             <Routes>
//                 <Route exact path='/' element={<Home />} />
//                 <Route exact path='/home' element={<Home />} />
//                 <Route exact path='/search' element={<Search />} component={Search} />
//                 <Route exact path='/services' element={<Services />} />
//                 <Route exact path='/about' element={<About />} />
//                 <Route exact path='/schedule' element={<Schedule />} />
// 				<Route exact path='/privacy' element={<Privacy />} />
//                 <Route exact path='/signin' element={<SignIn />} />
//                 <Route exact path='/signup' element={<Signup />} />
//                 <Route exact path='/account' element={<Account />} />
//                 <Route exact path='/signout' element={<SignOut />} />
//                 {/* self-added. Not sure yet.*/}
//                 <Route exact path='/message' element = {<MessageBox/>}/>
//             </Routes>
//         </div>
//         </main>
//     )
// };

// export default Main;

import React from "react";
import { Routes, Route } from "react-router-dom";
import Search from '../pages/search/search';
import About from '../pages/about';
import Privacy from '../pages/privacy';
import Services from '../pages/services';
import Home from '../pages/home';
import SignIn from '../account/signin';
import Signup from '../account/signup';
import Account from '../account/account';
import SignOut from '../account/signout';
import Schedule from '../pages/schedule';
import MessageBox from '../pages/message';

import AddService from "../pages/addService";
import { AdminDashboard, EditServices, AdminUsers } from '../pages/adminDashboard';
import AdminAccountSearch from "../pages/admin-account-search";
import ManageUser from "../pages/ManageUser";
import RegisterUser from "../pages/RegisterUser";
import ManageServices from '../pages/manageServices';
import Login from "../account/Login";
// Main acts as a container for the routing
const Main = () => {
    return (
        <main>
            <div className='Main'>
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/home' element={<Home />} />
                    <Route exact path='/search' element={<Search />} />
                    <Route exact path='/services' element={<Services />} />
                    {/* <Route exact path='/about' element={<About />} /> */}
                    <Route exact path='/schedule' element={<Schedule />} />
                    <Route exact path='/privacy' element={<Privacy />} />
                    <Route exact path='/login' element={<Login />} />
                    <Route exact path='/signin' element={<SignIn />} />
                    <Route exact path='/signup' element={<Signup />} />
                    <Route exact path='/account' element={<Account />} />
                    <Route exact path='/signout' element={<SignOut />} />
                    <Route exact path='/messages' element={<MessageBox />} />
                    <Route exact path='/addService' element={<AddService />} />
                    <Route exact path='/admin' element={<AdminDashboard />} />
                    <Route exact path='/editServices' element={<EditServices />} />
                    <Route exact path='/adminUsers' element={<AdminUsers />} />
                    <Route exact path='/admin-account-search' element={<AdminAccountSearch />} />
                    <Route exact path='/manage-user' element={<ManageUser />} />
                    <Route exact path='/register' element={<RegisterUser />} />
                    <Route path="/manage-user/:userId" element={<ManageUser />} />
                </Routes>
            </div>

        </main>
    );
};

export default Main;
