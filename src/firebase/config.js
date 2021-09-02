import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHKMkxlqubcr4vM6LK6m08nU1eJQxX2Lc",
  authDomain: "funchat-cc67b.firebaseapp.com",
  projectId: "funchat-cc67b",
  storageBucket: "funchat-cc67b.appspot.com",
  messagingSenderId: "1059097933743",
  appId: "1:1059097933743:web:ce3380d9ea1c163651a15a",
  measurementId: "G-L0CF7HVFFC"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

// if (window.location.hostname === 'localhost') {
//   auth.useEmulator('http://localhost:9099');
//   db.useEmulator('localhost', '8080');
// }

export { db, auth };
export default firebase;


