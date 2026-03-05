import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCYP1_ygjWQkIvRm0Bdgd6Z1CdMlWIveGg",
    authDomain: "gmumdzhiev-portfolio.firebaseapp.com",
    projectId: "gmumdzhiev-portfolio",
    storageBucket: "gmumdzhiev-portfolio.firebasestorage.app",
    messagingSenderId: "389226798289",
    appId: "1:389226798289:web:c0bac936248ce7351f39f0"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)