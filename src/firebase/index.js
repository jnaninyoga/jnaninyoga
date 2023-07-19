// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs, getFirestore, serverTimestamp, query, limit } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMMFjoFS0WoAqn__UZunph0acR73QmdfI",
  authDomain: "yogajnanin.firebaseapp.com",
  // databaseURL: "https://yogajnanin-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yogajnanin",
  storageBucket: "yogajnanin.appspot.com",
  messagingSenderId: "70536311861",
  appId: "1:70536311861:web:07d1e3b2ffbb0e711eed7c",
  measurementId: "G-EW5W96W0XE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const DB = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;

export const collectionDB = (name) => collection(DB, name);
export const docSnap = async (collectionRef) => await getDocs(collectionRef);
// Firebase FireStore TimeStamp
export const timestamp = serverTimestamp();

// function that will ensure every document has timestamp field
export const document = (doc) => { return {...doc, timestamp}};

// fetch docs into array:
// export const fetchDocs = async (collectionRef) => await docSnap(collectionRef).docs.map(doc => doc.data());

// fetch docs with limits
export const fetchDocs = (collectionRef, limitNumber) => query(collectionRef, limit(limitNumber));


