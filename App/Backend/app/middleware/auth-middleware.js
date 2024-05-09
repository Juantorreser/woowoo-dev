import jwtHelper from '../utils/jwt-helper';
import { adminAuth } from '../utils/firebase/admin';

// this is the auth middleware to check user credential and role

const getAuthToken = (req) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        return req.headers.authorization.split(' ')[1];
    } else {
        console.log('error in getting authentication token');
    }
};

/**
 * Check if user is authenticated
 */
const isAuthenticatedUser = async (req, res, next) => {
    try {
        const token = getAuthToken(req);
        await adminAuth().verifyIdToken(token);
        // check if email is verify
        const { email_verified } = jwtHelper.getJWTInfo(token);
        if (!email_verified) {
            console.log('Email is not verified'); // will uncomment later on
        }
        next();
    } catch (err) {
        console.log(err);
        res.status(401).send('Unauthorized');
    }
};

/**
 * Check if user is healer
 */
const isAuthenticatedHealer = async (req, res, next) => {
    try {
        const token = getAuthToken(req);
        await adminAuth().verifyIdToken(token);
        const { healer } = jwtHelper.getJWTInfo(req.headers.authorization);
        if (!healer) {
        console.log('Only healer can request this endpoint');
        }
        next();
    } catch (err) {
        res.status(401).send(err.message);
    }
};

export default {
    isAuthenticatedHealer,
    isAuthenticatedUser,
};