import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../config/firebaseConfig";

export const useHomeService = (navigation) => {
  const [users, setUsers] = useState([]);
  const [userImages, setUserImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(firestore, "users");
        const snapshot = await getDocs(usersRef);
        const usersData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            email: doc.data().email,
          }))
          .filter((user) => user.email !== auth.currentUser?.email);

        setUsers(usersData);
        
        // Fetch user images after getting users
        await fetchUserImages(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch user profile images
  const fetchUserImages = async (usersData) => {
    try {
      let images = {};
      for (const user of usersData) {
        const userRef = doc(firestore, "users", user.id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          images[user.id] = userSnap.data().photoURL;
        }
      }
      setUserImages(images);
    } catch (error) {
      console.error("Error fetching user images:", error);
    }
  };

  // Refetch user images
  const refreshUserImages = useCallback(async () => {
    return fetchUserImages(users);
  }, [users]);

  // Search functionality
  const searchUsers = useCallback((query) => {
    if (!query || query.trim() === "") return users;
    
    const searchTerm = query.toLowerCase().trim();
    return users.filter(user => 
      user.email.toLowerCase().includes(searchTerm)
    );
  }, [users]);

  return { 
    users, 
    userImages, 
    searchUsers, 
    isLoading,
    refreshUserImages,
  };
};