import { db } from "../config/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

// Send a message
export const sendMessage = async (message, sender, receiver) => {
  try {
    await addDoc(collection(db, "messages"), {
      text: message,
      sender,
      receiver,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Message Error:", error.message);
  }
};

// Listen to message updates
export const listenMessages = (callback) => {
  const q = query(collection(db, "messages"), orderBy("createdAt"));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};
