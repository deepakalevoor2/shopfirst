import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAXzZhNI8n4oWS6ojEcgW69d0lBe5pCLA4",
    authDomain: "crwn-db-20f96.firebaseapp.com",
    databaseURL: "https://crwn-db-20f96.firebaseio.com",
    projectId: "crwn-db-20f96",
    storageBucket: "crwn-db-20f96.appspot.com",
    messagingSenderId: "696076366024",
    appId: "1:696076366024:web:8704e526960cc3a077b5fd",
    measurementId: "G-NPT9MQ7KHD"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth,additionalData) => {
  if(!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;