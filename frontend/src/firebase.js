import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTc4aTyqx-GaamMNFTKEHFuQOe-Up1F10",
  authDomain: "kharcha-d28f8.firebaseapp.com",
  projectId: "kharcha-d28f8",
  storageBucket: "kharcha-d28f8.firebasestorage.app",
  messagingSenderId: "438180148861",
  appId: "1:438180148861:web:9686e2c6f6a66c12cd6314",
  measurementId: "G-W5VYDPDEZF",
};

let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (err) {
  console.warn("Firebase initialization warning:", err.message);
  // Create fallback objects to prevent app crash
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider };
export default app;