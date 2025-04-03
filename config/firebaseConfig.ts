import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCb0gBO_s_KwB4KJJ8wUnW7zwCACbUGq4g",
  authDomain: "chat-app-80bec.firebaseapp.com",
  databaseURL: "https://chat-app-80bec-default-rtdb.firebaseio.com",
  projectId: "chat-app-80bec",
  storageBucket: "chat-app-80bec.firebasestorage.app",
  messagingSenderId: "673726207837",
  appId: "1:673726207837:web:ae4cf5ca3733ac54017ab4",
};
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const firestore = getFirestore(app); 
const db = getFirestore(app);

export { auth, firestore,db };
