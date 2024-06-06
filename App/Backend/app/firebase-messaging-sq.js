// const {initializeApp} = require('firebase/app');
// const {getMessaging, getToken} = require('firebase/messaging');
// const {API_KEY} = require('./config/google.config.js');
// //Get registration token. Initially this makes a network call, once retireved subsequent calls to getToken will return from cache
// const firebaseConfig = {
//     apiKey:API_KEY,
//     authDomain: "woo-woo-network.firebaseapp.com",
//     projectId: "woo-woo-network",
//     storageBucket: "woo-woo-network.appspot.com",
//     messagingSenderId: "257418938856",
//     appId: "1:257418938856:web:6319ea7393e05ae3107c5d",
//     measurementId: "G-XNZR33LCJZ"
//   };
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);
// exports.getTokenFromFirebase = ()=> {
//     getToken(messaging, {vapidKey: API_KEY})
// .then((currentToken)=> {
//     if(currentToken){
//         console.log("TOken is: "+ currentToken);
//         return currentToken;
//     }
//     else{
//         console.log('No registration token available');
//     }
// }).catch(err=> {
//     console.log('An error occured while retrieving token'+ err);
// })
// }
