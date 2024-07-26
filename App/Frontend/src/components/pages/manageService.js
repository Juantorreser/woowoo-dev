import {Formik, Form, Field, ErrorMessage} from 'formik';
import axios from 'axios';
// using some aspects of account.css for consistency with account.js form styling
import '../account/account.css';
import './manageServices.css';

const ManageServices = () => {
    return (
        <>
            <h1>Manage Services</h1>
            <h2>Change Service Prices and Schedules</h2>
            <h3>Code started in change-service-prices</h3>
        </>
    )
}

export default ManageServices;