import { useState, useEffect } from "react";
import { Alert, Linking } from "react-native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";

export const useProfileService = (userId, navigation) => {
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Default avatar fallback
  const getDefaultAvatar = (id) => `https://randomuser.me/api/portraits/men/${id % 100}.jpg`;

  // Fetch user profile from Firestore
  useEffect(() => {
    const userRef = doc(firestore, "users", userId);
    
    // Initial fetch
    const fetchUserProfile = async () => {
      try {
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserProfile({
            ...userData,
            photoURL: userData.photoURL || getDefaultAvatar(userId),
          });
        } else {
          // If user doesn't exist, create basic profile with default
          setUserProfile({
            email: "Unknown User",
            photoURL: getDefaultAvatar(userId),
            status: "offline"
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
    
    // Listen for real-time updates
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setUserProfile({
          ...userData,
          photoURL: userData.photoURL || getDefaultAvatar(userId),
        });
      }
    }, (error) => {
      console.error("Real-time profile update error:", error);
    });

    return () => unsubscribe();
  }, [userId]);

  // Handle phone call
  const handleCall = () => {
    if (userProfile.phone) {
      Linking.openURL(`tel:${userProfile.phone}`);
    } else {
      Alert.alert("No Phone Number", "This user hasn't added a phone number.");
    }
  };

  // Handle video call - This would typically use a third-party library
  const handleVideoCall = () => {
    Alert.alert(
      "Video Call",
      "This would initiate a video call with the user.",
      [{ text: "OK" }]
    );
  };

  // Navigate to chat screen
  const handleSendMessage = () => {
    navigation.navigate("Chat", {
      recipientId: userId,
      recipientEmail: userProfile.email
    });
  };

  return {
    userProfile,
    isLoading,
    handleCall,
    handleVideoCall,
    handleSendMessage
  };
};