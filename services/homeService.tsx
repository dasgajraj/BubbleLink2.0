import { useEffect, useState } from "react";
import { collection, query, onSnapshot, getDocs } from "firebase/firestore";
import { auth, firestore } from "../config/firebaseConfig"; // Ensure Firestore is imported
import { signOut } from "firebase/auth";

export const useHomeService = (navigation) => {
  const [users, setUsers] = useState([]);
  const [chatData, setChatData] = useState({});
  const currentUserUid = auth.currentUser?.uid;

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
    navigation.navigate("Login");
  };

  // Fetch users from Firestore
  useEffect(() => {
    const usersRef = collection(firestore, "users");

    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(usersRef);
        const usersData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            email: doc.data().email,
          }))
          .filter((user) => user.email !== auth.currentUser.email);

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Listen for chat messages in Firestore
  useEffect(() => {
    if (!currentUserUid) return;

    const messagesRef = collection(firestore, "messages");
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const newChatData = {};

      snapshot.docs.forEach((chatDoc) => {
        const chatId = chatDoc.id;
        if (!chatId.includes(currentUserUid)) return;

        const messages = chatDoc.data().messages || [];
        let unreadCount = 0;
        let lastMessage = null;

        messages.forEach((message) => {
          if (
            message.user._id !== currentUserUid &&
            (message.status === "sent" || message.status === "delivered")
          ) {
            unreadCount++;
          }

          if (!lastMessage || message.createdAt > lastMessage.createdAt) {
            lastMessage = message;
          }
        });

        const otherUserId = chatId.split("_").find((id) => id !== currentUserUid);

        if (otherUserId) {
          newChatData[otherUserId] = {
            unreadCount,
            lastMessage,
            messages: messages.sort((a, b) => b.createdAt - a.createdAt),
          };
        }
      });

      setChatData(newChatData);
    });

    return () => unsubscribe();
  }, [currentUserUid]);

  return { users, chatData, onSignOut };
};
