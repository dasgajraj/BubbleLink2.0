import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SettingItem = ({ title, description, icon, right, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  return (
    <List.Item
      title={title}
      description={description}
      titleStyle={{ color: activeColors.text }}
      descriptionStyle={{ color: activeColors.onSurface60 }}
      left={() => <List.Icon icon={icon} color={activeColors.primary} />}
      right={right}
      onPress={onPress}
      style={styles.listItem}
    />
  );
};

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
        name: currentUser.displayName || "User",
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
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Appbar.Header style={{ backgroundColor: activeColors.background, width: "100%" }}>
        <Appbar.Content title="Settings" titleStyle={{ color: activeColors.text }} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <Card style={[styles.profileCard, { backgroundColor: activeColors.primarySurface }]}>
          <TouchableOpacity >
            <View style={styles.profileContainer}>
              {profilePic ? (
                <Avatar.Image size={80} source={{ uri: profilePic }} />
              ) : (
                <Avatar.Icon
                  size={80}
                  icon="account"
                  color="#FFF"
                  style={{ backgroundColor: activeColors.primary }}
                />
              )}
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: activeColors.text }]}>
                  {user?.name}
                </Text>
                <Text style={[styles.profileEmail, { color: activeColors.onSurface60 }]}>
                  {user?.email}
                </Text>
                <Text style={[styles.editProfile, { color: activeColors.primary }]}>
                  Edit Profile
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color={activeColors.onSurface60} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Account Settings */}
        <Text style={[styles.sectionTitle, { color: activeColors.primary }]}>
          Account Settings
        </Text>
        <Card style={[styles.settingsCard, { backgroundColor: activeColors.primarySurface }]}>
          <SettingItem
            title="Dark Mode"
            description="Toggle dark theme"
            icon="theme-light-dark"
            right={() => (
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                color={activeColors.primary}
              />
            )}
          />
          <Divider style={styles.divider} />
          <SettingItem
            title="Notifications"
            description="Enable push notifications"
            icon="bell-outline"
            right={() => (
              <Switch
                color={activeColors.primary}
                value={mode}
                onValueChange={() => setMode(!mode)}
              />
            )}
          />
          <Divider style={styles.divider} />

          <SettingItem
            title="Cloud Sync"
            description="Sync your chats to cloud"
            icon="cloud-outline"
          />
        </Card>

        {/* Privacy & Security */}
        <Text style={[styles.sectionTitle, { color: activeColors.primary }]}>
          Privacy & Security
        </Text>
        <Card style={[styles.settingsCard, { backgroundColor: activeColors.primarySurface }]}>
          <SettingItem
            title="Privacy"
            description="Manage your privacy settings"
            icon="shield-lock-outline"
          />
          <Divider style={styles.divider} />
          <SettingItem
            title="Blocked Contacts"
            description="Manage blocked users"
            icon="account-cancel-outline"
          />
          <Divider style={styles.divider} />
          <SettingItem
            title="Chat Settings"
            description="Message, media and storage"
            icon="message-text-outline"
          />
        </Card>

        {/* Help & About */}
        <Text style={[styles.sectionTitle, { color: activeColors.primary }]}>
          Help & About
        </Text>
        <Card style={[styles.settingsCard, { backgroundColor: activeColors.primarySurface }]}>
          <SettingItem
            title="Help Center"
            description="Get help with our app"
            icon="help-circle-outline"
          />
          <Divider style={styles.divider} />
          <SettingItem
            title="About"
            description="App version and info"
            icon="information-outline"
          />
        </Card>

        {/* Sign Out Button */}
        <Button
          mode="contained"
          onPress={handleSignOut}
          style={[styles.logoutButton, { backgroundColor: activeColors.error }]}
          labelStyle={{ color: "#FFF" }}
          icon="logout"
        >
          Sign Out
        </Button>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  profileCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  editProfile: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  settingsCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    overflow: "hidden",
  },
  listItem: {
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  divider: {
    marginHorizontal: 16,
    height: 0.5,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 8,
  },
});

export default Setting;