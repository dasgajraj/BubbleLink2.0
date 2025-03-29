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

    // Store user data in Firestore
    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    });

    console.log("User registered:", user);
    return user;
  } catch (error: any) {
    console.error("Registration Error:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Logout the currently authenticated user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error: any) {
    console.error("Logout Error:", error.message);
    throw new Error(error.message);
  }
};
