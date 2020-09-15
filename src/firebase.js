import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCBqIOxi8vSH8Jy5nBJZ-8QR08zYtQeY1s",
  authDomain: "social-media-project-fe6bf.firebaseapp.com",
  databaseURL: "https://social-media-project-fe6bf.firebaseio.com",
  projectId: "social-media-project-fe6bf",
  storageBucket: "social-media-project-fe6bf.appspot.com",
  messagingSenderId: "43753162393",
  appId: "1:43753162393:web:1c211ba7edf21806409a08",
  measurementId: "G-WTDHJY606Y",
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
  export { db, auth, storage };