import { auth, firestore } from "../config/firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  doc, 
  setDoc 
} from "firebase/firestore";

// Login function
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw new Error(error.message);
  }
};

// Register function
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate a random number between 1 and 99
    const randomNum = Math.floor(Math.random() * 99) + 1;
    const gender = Math.random() > 0.5 ? "men" : "women";
    const photoURL = `https://randomuser.me/api/portraits/${gender}/${randomNum}.jpg`;

    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      uid: user.uid,
      photoURL: photoURL,
      createdAt: new Date().toISOString(),
    });

    console.log("User registered:", user);
    return user;
  } catch (error) {
    console.error("Registration Error:", error.message);
    throw new Error(error.message);
  }
};

// Logout function
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout Error:", error.message);
    throw new Error(error.message);
  }
};
