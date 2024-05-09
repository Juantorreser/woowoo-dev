import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBHgWrdxrNW0tcheACV45rzou5b4jIZmC4",
    authDomain: "woo-woo-network.firebaseapp.com",
    projectId: "woo-woo-network",
    storageBucket: "woo-woo-network.appspot.com",
    messagingSenderId: "257418938856",
    appId: "1:257418938856:web:6319ea7393e05ae3107c5d",
    measurementId: "G-XNZR33LCJZ"
};

export const app = initializeApp(firebaseConfig);