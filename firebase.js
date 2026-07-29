import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getDatabase, 
    ref, 
    set, 
    get, 
    onValue, 
    child 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcwpTvUCzdpOzbZQtSq_5ij6KS2RiBIFg",
  authDomain: "cr-election-12f29.firebaseapp.com",
  databaseURL: "https://cr-election-12f29-default-rtdb.firebaseio.com",
  projectId: "cr-election-12f29",
  storageBucket: "cr-election-12f29.firebasestorage.app",
  messagingSenderId: "549834230427",
  appId: "1:549834230427:web:f6f002500d9bccd775143e",
  measurementId: "G-1BNJ7TP46Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);

export { signInWithPopup, signOut, onAuthStateChanged, ref, set, get, onValue, child };