import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import { ThemeContext } from "../constants/ThemeContext";
import { colors } from "../config/theme";
import { List, Button, Switch, Text } from "react-native-paper";
import AlertModal from "../component/AlertModal"; // Import our custom AlertModal

const Setting = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const [isDark, setDark] = useState(theme.mode === "dark");
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [signOutModalVisible, setSignOutModalVisible] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName || "User",
      });

      // Fetch user profile from Firestore
      const fetchProfile = async () => {
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfilePic(
            userSnap.data().photoURL
          );
        } 
      };

      fetchProfile();
    }
  }, []);



  const handleSignOut = () => {
    setSignOutModalVisible(true);
  };

  const performSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => console.log("User signed out"))
      .catch((error) => console.error("Sign out error:", error));
    setSignOutModalVisible(false);
  };

  const toggleTheme = () => {
    updateTheme();
    setDark(!isDark);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
      {user && (
        <View style={styles.profileContainer}>
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
          <Text style={[styles.text, { color: activeColors.text }]}>
            {user.name}
          </Text>
          <Text style={[styles.email, { color: activeColors.onSurface60 }]}>
            {user.email}
          </Text>
        </View>
      )}

      {/* Chat App Settings */}
      <View style={styles.settingsList}>
        <List.Section>
          <List.Item
            title="Dark Mode"
            titleStyle={{ color: activeColors.text }}
            left={() => (
              <List.Icon icon="theme-light-dark" color={activeColors.text} />
            )}
            right={() => (
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                color={activeColors.primary}
              />
            )}
          />
          <List.Item
            title="Notifications"
            titleStyle={{ color: activeColors.text }}
            left={() => <List.Icon icon="bell" color={activeColors.text} />}
            onPress={() => {
              // Show notification settings alert
            }}
          />
          <List.Item
            title="Privacy"
            titleStyle={{ color: activeColors.text }}
            left={() => (
              <List.Icon icon="shield-lock" color={activeColors.text} />
            )}
            onPress={() => {
              // Show privacy settings alert
            }}
          />
          <List.Item
            title="Blocked Contacts"
            titleStyle={{ color: activeColors.text }}
            left={() => (
              <List.Icon icon="block-helper" color={activeColors.text} />
            )}
            onPress={() => {
              // Show blocked contacts alert
            }}
          />
        </List.Section>
      </View>

      {/* Logout Button */}
      <Button
        mode="contained"
        onPress={handleSignOut}
        style={[styles.logoutButton, { backgroundColor: activeColors.error }]}
        labelStyle={{ color: "#FFF" }}
      >
        Sign Out
      </Button>

      {/* Custom Alert Modal for Sign Out */}
      <AlertModal
        visible={signOutModalVisible}
        title="Sign Out"
        message="Are you sure you want to sign out? You will need to log in again to access your account."
        actions={[
          {
            label: "Cancel",
            onPress: () => setSignOutModalVisible(false),
            nature: "constructive",
          },
          { label: "Sign Out", onPress: performSignOut, nature: "destructive" },
        ]}
        onDismiss={() => setSignOutModalVisible(false)}
        isDarkMode={isDark}
        iconName="logout"
      />
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
  },
  settingsList: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 10,
    borderRadius: 8,
  },
});
