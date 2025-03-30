import { auth, firestore } from "../config/firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  UserCredential 
} from "firebase/auth";
import { 
  doc, 
  setDoc 
} from "firebase/firestore";

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error: any) {
    console.error("Login Error:", error.message);
    throw new Error(error.message);
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate a random number between 1 and 99 for EACH user registration
    const randomNum = Math.floor(Math.random() * 99) + 1;
    
    // Randomly assign male or female avatars
    const gender = Math.random() > 0.5 ? "men" : "women";
    
    // Construct the profile photo URL
    const photoURL = `https://randomuser.me/api/portraits/${gender}/${randomNum}.jpg`;

    // Store user data in Firestore
    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      uid: user.uid,
      photoURL: photoURL,
      createdAt: new Date().toISOString(),
    });

    console.log("User registered:", user);
    return user;
  } catch (error: any) {
    console.error("Registration Error:", error.message);
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error: any) {
    console.error("Logout Error:", error.message);
    throw new Error(error.message);
  }
};