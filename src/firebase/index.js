// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  collection,
  getDocs,
  getFirestore,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  where,
  getDoc,
} from "firebase/firestore";
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

// ======== fetch docs ========

// function that will ensure every document has timestamp field
export const document = (doc) => { return {...doc, createdAt: timestamp, deleted: false}};

// return the doc ref
export const getDocRef = (collection, id) => doc(DB, collection, id);

// fetch a document by it ref from the (getDocRef) function
export const fetchRefDoc = async (ref) => { return { ...await (await getDoc(ref)).data(), id: ref.id }};

// fetch docs with limits
export const fetchDocs = (collectionRef, ...queryConstraints) => query( collectionRef, ...queryConstraints);
// get docs ordered by timestamp
export const fetchDescDocs = (collectionRef, ...queryConstraints) => fetchDocs(collectionRef, ...queryConstraints, orderBy("createdAt", "desc"));

// get the docs in a sub collection
export const fetchSubColDocs = (col, doc, subCol, ...queryConstraints) => fetchDocs(collection(DB, col, doc, subCol), ...queryConstraints, orderBy("createdAt", "desc"));

// ======== add doc ========

// add/create doc
export const addDocument = async (collection, data) => await addDoc(collectionDB(collection), document(data));

// document refence/cascade document
export async function addRefDocument(collection, data, refCollection, refData, ref="ref") {
  // if not ref collection throw an error
  if(!refCollection) throw new Error("refCollection is required");
  const docRef = await addDocument(collection, data);
  return await addDocument(refCollection, refData ? {...refData, [ref]: docRef} : {[ref]: docRef} );
}

// adding a document in a sub collection
export async function addSubColDocument(coll, doc, subCollection, subDoc) {
  if(!subCollection) throw new Error("subCol is required");
  try {
    const docRef = await addDocument(coll, doc);
    const subColRef = collection(DB, coll, docRef.id, subCollection);
    return await addDoc(subColRef, document(subDoc));
  } catch (error) {
    console.error("Error adding sub-collection document: ", error);
  }
}

export async function addSubDocument(coll, id, subCollection, subDoc) {
  if(!subCollection) throw new Error("subCollection is required");
  try {
    const subColRef = collection(DB, coll, id, subCollection);
    return await addDoc(subColRef, document(subDoc));
  } catch (error) {
    console.error("Error adding sub document: ", error);
  }
}

// ======== update doc ======== 

//update doc
export const updateDocument = async (collection, id, data) => await updateDoc(doc(DB, collection, id), {...data, updatedAt: timestamp});

// update doc in a sub collection
export async function updateSubColDocument(col, docID, subCol, subDocID, subDoc) {
  if(!subCol) throw new Error("subCol is required");
  try {
    const subColRef = doc(DB, col, docID, subCol, subDocID);
    return await updateDoc(subColRef, {...subDoc, updatedAt: timestamp});
  } catch (error) {
    console.error("Error updating sub-collection document: ", error);
  }
}

// ======== delete doc ========

// delete doc
export const deleteDocument = async (collection, id) => await updateDocument(collection, id, {deleted: true});

// restore doc
export const restoreDocument = async (collection, id) => await updateDocument(collection, id, {deleted: false});

// delete doc permanently
export const deleteDocumentPermanently = async (collection, id) => await deleteDoc(doc(DB, collection, id));

// delete on cascade: delete the document and delete all the documents that have a reference to the document that is being deleted
export async function deleteOnCascade(collection, id, docRefCollection, ref="ref", restore=false) {
  const docRef = getDocRef(collection, id);
  const queryRef = query(collectionDB(docRefCollection || collection), where(ref, "==", docRef));
  const docs = await docSnap(queryRef);
  docs.forEach(async (doc) => restore ? await restoreDocument(docRefCollection || collection, doc.id) : await deleteDocument(docRefCollection || collection, doc.id));
  restore ? await restoreDocument(collection, id) : await deleteDocument(collection, id);
}