import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, firestore } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";

export const useHomeService = (navigation) => {
  const [users, setUsers] = useState([]);

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

  return { users, onSignOut };
};