import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";

export const useProfileService = (userId, navigation) => {
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Firestore
  useEffect(() => {
    const userRef = doc(firestore, "users", userId);
    
    const fetchUserProfile = async () => {
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserProfile({
            ...userData,
            photoURL: userData.photoURL,
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsLoading(false);
        Alert.alert("Error", "Failed to load user profile");
      }
    };

    fetchUserProfile();

    // Real-time listener
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUserProfile({
            ...userData,
            photoURL: userData.photoURL,
          });
        }
      },
      (error) => {
        console.error("Real-time profile update error:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Navigate to Chat screen
  const handleSendMessage = () => {
    navigation.navigate("Chat", {
      recipientId: userId,
      recipientEmail: userProfile.email,
    });
  };

  return {
    userProfile,
    isLoading,
    handleSendMessage,
  };
};
