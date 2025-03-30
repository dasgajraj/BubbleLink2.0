import React, { useCallback, useContext, useState, useEffect } from "react";
import { View, FlatList, StyleSheet, SafeAreaView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { List, Button } from "react-native-paper";
import { useHomeService } from "../services/homeService";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { auth, firestore } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Home = () => {
  const navigation = useNavigation();
  const { users, chatData } = useHomeService(navigation);
  const { theme, updateTheme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const currentUserUid = auth.currentUser?.uid;
  const [isDark, setDark] = useState(theme.mode === "dark");
  const [userImages, setUserImages] = useState({});

  useEffect(() => {
    const fetchUserImages = async () => {
      let images = {};
      for (const user of users) {
        const userRef = doc(firestore, "users", user.id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          images[user.id] = userSnap.data().photoURL || getDefaultAvatar(user.id);
        } else {
          images[user.id] = getDefaultAvatar(user.id);
        }
      }
      setUserImages(images);
    };

    if (users.length > 0) fetchUserImages();
  }, [users]);

  const getDefaultAvatar = (id) => `https://randomuser.me/api/portraits/men/${id % 100}.jpg`;

  const renderUser = useCallback(({ item }) => {
    const userData = chatData[item.id] || { unreadCount: 0, lastMessage: null };
    const { unreadCount, lastMessage } = userData;
    
    return (
      <List.Item
        title={item.email}
        description={lastMessage
          ? lastMessage.user._id === currentUserUid
            ? `You: ${lastMessage.text}`
            : lastMessage.text
          : "No messages yet"
        }
        left={() => (
          <Image 
            source={{ uri: userImages[item.id] || getDefaultAvatar(item.id) }} 
            style={styles.profileImage}
          />
        )}
        right={() =>
          unreadCount > 0 ? (
            <View style={[styles.notificationBubble, { backgroundColor: activeColors.primary }]}>
              <List.Icon icon="message" color="#FFF" />
            </View>
          ) : null
        }
        onPress={() => navigation.navigate("Chat", { recipientId: item.id, recipientEmail: item.email })}
        style={[styles.userItem, { backgroundColor: activeColors.primarySurface }]}
        titleStyle={{ color: activeColors.text }}
        descriptionStyle={{ color: activeColors.onSurface60 }}
      />
    );
  }, [chatData, navigation, currentUserUid, activeColors, userImages]);

  const changeTheme = () => {
    navigation.navigate('Setting');
    updateTheme();
    setDark(!isDark);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: activeColors.background }]}>
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={changeTheme}
          style={styles.themeButton}
          labelStyle={{ color: activeColors.onPrimaryContainer }}
        >
          Toggle Theme
        </Button>

        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
        />
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
  themeButton: {
    marginBottom: 16,
    borderRadius: 8,
  },
  userItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  notificationBubble: {
    borderRadius: 24,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default Home;
