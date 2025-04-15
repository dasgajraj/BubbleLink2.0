import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import { ThemeContext } from "../constants/ThemeContext";
import { colors } from "../config/theme";
import {
  List,
  Button,
  Switch,
  Text,
  Avatar,
  Divider,
  Card,
  Appbar,
  Dialog,
  Portal,
  Paragraph,
} from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';

const Setting = ({ navigation }) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const [isDark, setDark] = useState(theme.mode === "dark");
  const [mode, setMode] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [signOutDialogVisible, setSignOutDialogVisible] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.email.split("@")[0] || "User",
      });

      // Fetch user profile pic from Firestore
      const fetchProfile = async () => {
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfilePic(userData.photoURL);
        }
      };

      fetchProfile();
    }
  }, []);

  const handleSignOut = () => {
    setSignOutDialogVisible(true);
  };

  const performSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => console.log("User signed out"))
      .catch((error) => console.error("Sign out error:", error));
    setSignOutDialogVisible(false);
  };

  const toggleTheme = () => {
    updateTheme();
    setDark(!isDark);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.primary }]}>
      <View style={[styles.contentContainer, { backgroundColor: activeColors.background }]}>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, { color: activeColors.text }]}>Settings</Text>
          <View style={styles.actionButtons}>
            <Appbar.Action 
              icon="magnify" 
              onPress={() => {}}
              color={activeColors.text} 
            />
            <Appbar.Action 
              icon="dots-vertical" 
              onPress={() => {}} 
              color={activeColors.text} 
            />
          </View>
        </View>

        <View style={styles.profileContainer}>
          {profilePic ? (
            <Image
              source={{ uri: profilePic }}
              style={styles.profileImage}
            />
          ) : (
            <Avatar.Icon
              size={50}
              icon="account"
              color="#FFF"
              style={[styles.profileImage, { backgroundColor: activeColors.primary }]}
            />
          )}
          <View style={styles.userInfo}>
            <Text style={[styles.username, { color: activeColors.text }]}>
              {user?.name}
            </Text>
            <Text style={[styles.phoneNumber, { color: isDark ? '#aaaaaa' : '#666666' }]}>
              {user?.email}
            </Text>
          </View>
          <Button 
            mode="outlined" 
            style={styles.editButton}
            labelStyle={[styles.editButtonText, { color: activeColors.text }]}
            onPress={() => {}}
          >
            Edit
          </Button>
        </View>

        <Text style={[styles.categoryHeader, { color: isDark ? '#aaaaaa' : '#666666' }]}>
          General
        </Text>

        <ScrollView style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuItem}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={activeColors.text}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, { color: activeColors.text }]}>
              Notifications
            </Text>
            <Switch
              value={mode}
              onValueChange={() => setMode(!mode)}
              color={activeColors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={toggleTheme}
          >
            <Ionicons
              name="moon-outline"
              size={22}
              color={activeColors.text}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, { color: activeColors.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              color={activeColors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
          >
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={activeColors.text}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, { color: activeColors.text }]}>
              Privacy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
          >
            <Ionicons
              name="cloud-outline"
              size={22}
              color={activeColors.text}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, { color: activeColors.text }]}>
              Storage & Data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
          >
            <Ionicons
              name="help-circle-outline"
              size={22}
              color={activeColors.text}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, { color: activeColors.text }]}>
              About
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.signOutItem]}
            onPress={handleSignOut}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color={activeColors.error}
              style={styles.menuIcon}
            />
            <Text style={[styles.menuItemText, { color: activeColors.error }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Sign Out Dialog */}
        <Portal>
          <Dialog
            visible={signOutDialogVisible}
            onDismiss={() => setSignOutDialogVisible(false)}
            style={{ backgroundColor: activeColors.primarySurface }}
          >
            <Dialog.Icon icon="logout" color={activeColors.primary} />

            <Dialog.Title style={{ color: activeColors.text }}>Sign Out</Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: activeColors.text }}>
                Are you sure you want to sign out? You will need to log in again to access your account.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setSignOutDialogVisible(false)} textColor={activeColors.primary}>Cancel</Button>
              <Button onPress={performSignOut} textColor={activeColors.error}>Sign Out</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: "row",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
  },
  phoneNumber: {
    fontSize: 14,
    marginTop: 2,
  },
  editButton: {
    borderRadius: 20,
    borderColor: '#3E4958',
    height: 36,
  },
  editButtonText: {
    fontSize: 14,
    marginVertical: 7,
    marginHorizontal: 10,
  },
  categoryHeader: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  menuIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
  },
  signOutItem: {
    marginTop: 20,
  }
});

export default Setting;