




import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBtD813Xk16mbjF0Gd8IZIXgkN3IHZyPYA",
    authDomain: "careermap-b5e34.firebaseapp.com",
    projectId: "careermap-b5e34",
    storageBucket: "careermap-b5e34.firebasestorage.app",
    messagingSenderId: "1078782802610",
    appId: "1:1078782802610:web:e4b1d98e186a302578a7ab",
    measurementId: "G-B81NPSL6VB"
};









const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });


export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signUpWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

export const updateUserProfile = (user, data) => updateProfile(user, data);

export const requestPasswordReset = (email) => sendPasswordResetEmail(auth, email);

export const logOut = () => signOut(auth);

export { auth, onAuthStateChanged };
