import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Appbar,
  Avatar,
  Divider,
  List,
  Button,
  useTheme,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { useProfileService } from "../services/profileService";

const ActionButton = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Icon name={icon} size={24} color={color} />
    <Text style={{ color, marginTop: 6 }}>{label}</Text>
  </TouchableOpacity>
);

const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const paperTheme = useTheme();

  const { userProfile, isLoading, handleSendMessage } = useProfileService(
    userId,
    navigation
  );

  // Extract username from email (part before @)
  const getUserName = (email) => {
    if (!email) return "User";
    return email.split("@")[0];
  };

  const displayName = userProfile.displayName || getUserName(userProfile.email);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: activeColors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={{ color: activeColors.text }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: activeColors.background }]}
    >
      <ScrollView style={styles.container}>
        <Appbar.Header style={{ backgroundColor: activeColors.background }}>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            color={activeColors.text}
          />
          <Appbar.Content title="" />
          <Appbar.Action
            icon="dots-vertical"
            color={activeColors.text}
            onPress={() => {}}
          />
        </Appbar.Header>

        <View style={styles.center}>
          {userProfile.photoURL ? (
            <Avatar.Image
              size={100}
              source={{ uri: userProfile.photoURL }}
            />
          ) : (
            <Avatar.Text
              size={100}
              label={displayName.substring(0, 2).toUpperCase()}
              backgroundColor={activeColors.primary}
            />
          )}
          <Text style={[styles.name, { color: activeColors.text }]}>
            {displayName}
          </Text>
          <Text style={[styles.email, { color: activeColors.onSurface60 }]}>
            {userProfile.email}
          </Text>
          {userProfile.status && (
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor:
                      userProfile.status === "online" ? "#4CAF50" : "#9E9E9E",
                  },
                ]}
              />
              <Text style={{ color: activeColors.onSurface60 }}>
                {userProfile.status}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <ActionButton
            icon="message-text-outline"
            label="Message"
            color={activeColors.primary}
            onPress={handleSendMessage}
          />
          <ActionButton
            icon="phone-outline"
            label="Call"
            color={activeColors.primary}
            onPress={() => {}}
          />
          <ActionButton
            icon="video-outline"
            label="Video"
            color={activeColors.primary}
            onPress={() => {}}
          />
        </View>

        <Divider style={{ backgroundColor: activeColors.outline, marginVertical: 16 }} />

        {userProfile.bio && (
          <>
            <List.Section>
              <List.Subheader style={{ color: activeColors.primary }}>About</List.Subheader>
              <View style={styles.bioContainer}>
                <Text style={{ color: activeColors.onSurface80 }}>
                  {userProfile.bio}
                </Text>
              </View>
            </List.Section>
            <Divider style={{ backgroundColor: activeColors.outline }} />
          </>
        )}

        <List.Section>
          <List.Subheader style={{ color: activeColors.primary }}>Contact Info</List.Subheader>

          {userProfile.phone && (
            <List.Item
              title={userProfile.phone}
              titleStyle={{ color: activeColors.text }}
              left={() => (
                <List.Icon color={activeColors.primary} icon="phone" />
              )}
            />
          )}

          <List.Item
            title={userProfile.email}
            titleStyle={{ color: activeColors.text }}
            left={() => (
              <List.Icon color={activeColors.primary} icon="email" />
            )}
          />

          {userProfile.location && (
            <List.Item
              title={userProfile.location}
              titleStyle={{ color: activeColors.text }}
              left={() => (
                <List.Icon color={activeColors.primary} icon="map-marker" />
              )}
            />
          )}
        </List.Section>

        <Divider style={{ backgroundColor: activeColors.outline }} />

        <List.Section>
          <List.Subheader style={{ color: activeColors.primary }}>More Actions</List.Subheader>

          <List.Item
            title="View Media"
            titleStyle={{ color: activeColors.text }}
            left={() => (
              <List.Icon color={activeColors.primary} icon="image-outline" />
            )}
            onPress={() => {}}
          />

          <List.Item
            title="Search in Conversation"
            titleStyle={{ color: activeColors.text }}
            left={() => (
              <List.Icon color={activeColors.primary} icon="magnify" />
            )}
            onPress={() => {}}
          />

          <List.Item
            title="Notifications"
            titleStyle={{ color: activeColors.text }}
            left={() => (
              <List.Icon color={activeColors.primary} icon="bell-outline" />
            )}
            onPress={() => {}}
          />

          <List.Item
            title="User ID"
            description={userId}
            titleStyle={{ color: activeColors.text }}
            descriptionStyle={{ color: activeColors.onSurface60 }}
            left={() => (
              <List.Icon color={activeColors.primary} icon="account-circle" />
            )}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    alignItems: "center",
    marginVertical: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    marginBottom: 8,
  },
  actionButton: {
    alignItems: "center",
    width: 80,
  },
  bioContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});

export default Profile;