import React from 'react';
import { app } from '../firebase/firebase-config';
import { getAuth } from 'firebase/auth';

const auth = getAuth(app);

const SignOut = () => {
    //signout occurs for the firebase authentication instance
    auth.signOut() 
        .then(() => {
            window.location.assign('/home');
        });

    return (
        <div>
            Signing Out...
        </div>
    );
}

export default SignOut;