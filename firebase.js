import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBYO7dbcjBMNWZCvdHPWZJ8_qU0S2_wnM",
  authDomain: "twitter-clone-77253.firebaseapp.com",
  projectId: "twitter-clone-77253",
  storageBucket: "twitter-clone-77253.appspot.com",
  messagingSenderId: "296392066573",
  appId: "1:296392066573:web:c703432c75b86ce28a7744",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };
