
//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyDgPGjGouo9_f7uepszHldondUmQ24_c98",
    authDomain: "comp-1800-project-6eb78.firebaseapp.com",
    projectId: "comp-1800-project-6eb78",
    storageBucket: "comp-1800-project-6eb78.firebasestorage.app",
    messagingSenderId: "498376410852",
    appId: "1:498376410852:web:96a950d91b4ac2ede44ef1"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();







