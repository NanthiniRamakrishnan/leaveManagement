// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAp9dI4N8onxCDYJQnkAwJgnw-tIxzEaYw",
    authDomain: "attendancemanagement-33a90.firebaseapp.com",
    projectId: "attendancemanagement-33a90",
    storageBucket: "attendancemanagement-33a90.firebasestorage.app",
    messagingSenderId: "230605292963",
    appId: "1:230605292963:web:abb559c503d2466059c616",
    measurementId: "G-8E759139T3"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
