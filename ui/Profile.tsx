import React, { useContext, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Image, TouchableOpacity, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Button, Card, Title, Paragraph, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { useProfileService } from "../services/profileService";

const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  
  const { 
    userProfile, 
    isLoading, 
    handleCall, 
    handleVideoCall, 
    handleSendMessage 
  } = useProfileService(userId, navigation);

  // Extract username from email (part before @)
  const getUserName = (email) => {
    if (!email) return "User";
    return email.split('@')[0];
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: activeColors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: activeColors.text }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: activeColors.background }]}>
      <View style={styles.container}>
        <Button 
          icon="arrow-left" 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          labelStyle={{ color: activeColors.primary }}
        >
          Back
        </Button>
        
        <Card style={[styles.profileCard, { backgroundColor: activeColors.primarySurface }]}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: userProfile.photoURL }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Title style={{ color: activeColors.text }}>
                {userProfile.displayName || getUserName(userProfile.email)}
              </Title>
              <Paragraph style={{ color: activeColors.onSurface60 }}>{userProfile.email}</Paragraph>
              {userProfile.status && (
                <View style={styles.statusContainer}>
                  <View style={[styles.statusIndicator, { backgroundColor: userProfile.status === "online" ? "#4CAF50" : "#9E9E9E" }]} />
                  <Text style={{ color: activeColors.onSurface60 }}>{userProfile.status}</Text>
                </View>
              )}
            </View>
          </View>

          <Divider style={{ backgroundColor: activeColors.outline, marginVertical: 16 }} />

          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleCall}
            >
              <Icon name="phone" size={24} color={activeColors.primary} />
              <Text style={[styles.actionText, { color: activeColors.text }]}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleVideoCall}
            >
              <Icon name="video" size={24} color={activeColors.primary} />
              <Text style={[styles.actionText, { color: activeColors.text }]}>Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleSendMessage}
            >
              <Icon name="message-text" size={24} color={activeColors.primary} />
              <Text style={[styles.actionText, { color: activeColors.text }]}>Message</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {userProfile.bio && (
          <Card style={[styles.bioCard, { backgroundColor: activeColors.primarySurface }]}>
            <Card.Content>
              <Title style={{ color: activeColors.text }}>About</Title>
              <Paragraph style={{ color: activeColors.onSurface80 }}>{userProfile.bio}</Paragraph>
            </Card.Content>
          </Card>
        )}

        <Card style={[styles.infoCard, { backgroundColor: activeColors.primarySurface }]}>
          <Card.Content>
            <Title style={{ color: activeColors.text }}>Info</Title>
            
            {userProfile.phone && (
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color={activeColors.primary} />
                <Text style={[styles.infoText, { color: activeColors.onSurface80 }]}>{userProfile.phone}</Text>
              </View>
            )}
            
            {userProfile.location && (
              <View style={styles.infoRow}>
                <Icon name="map-marker" size={20} color={activeColors.primary} />
                <Text style={[styles.infoText, { color: activeColors.onSurface80 }]}>{userProfile.location}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Icon name="account-circle" size={20} color={activeColors.primary} />
              <Text style={[styles.infoText, { color: activeColors.onSurface80 }]}>User ID: {userId}</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  profileCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    alignItems: "center",
    padding: 8,
  },
  actionText: {
    marginTop: 4,
  },
  bioCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  infoCard: {
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  infoText: {
    marginLeft: 12,
  },
});

export default Profile;