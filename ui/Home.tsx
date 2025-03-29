import React, { useLayoutEffect, useCallback, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useHomeService } from "../services/homeService";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { auth } from "../config/firebaseConfig";

const Home = () => {
  const navigation = useNavigation();
  const { users, chatData, onSignOut } = useHomeService(navigation);
  const { theme } = useContext(ThemeContext);
  const activateColors = colors[theme.mode];
  const currentUserUid = auth.currentUser?.uid;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onSignOut} style={styles.logoutButton}>
          <AntDesign name="logout" size={24} color={activateColors.textPrimary} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: activateColors.primary,
        elevation: 0,
      },
      headerTintColor: activateColors.textPrimary,
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
    });
  }, [navigation, activateColors]);

  const renderUser = useCallback(({ item }) => {
    const userData = chatData[item.id] || { unreadCount: 0, lastMessage: null };
    const { unreadCount, lastMessage } = userData;

    const lastMessageTime = lastMessage
      ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <TouchableOpacity
        style={[styles.userItem, unreadCount > 0 && styles.userItemUnread, { backgroundColor: activateColors.card }]}
        onPress={() => {
          navigation.navigate("Chat", {
            recipientId: item.id,
            recipientEmail: item.email,
          });
        }}
      >
        <View style={styles.userItemContent}>
          <View style={styles.userInfo}>
            <Text style={[styles.userEmail, unreadCount > 0 && styles.unreadText, { color: activateColors.textPrimary }]}>
              {item.email}
            </Text>
            {lastMessage && (
              <Text style={[styles.lastMessage, { color: activateColors.textSecondary }]} numberOfLines={1}>
                {lastMessage.user._id === currentUserUid ? "You: " : ""}
                {lastMessage.text}
              </Text>
            )}
          </View>
          <View style={styles.messageInfo}>
            {lastMessageTime && <Text style={[styles.timeText, { color: activateColors.textSecondary }]}>{lastMessageTime}</Text>}
            {unreadCount > 0 && (
              <View style={[styles.notificationBubble, { backgroundColor: activateColors.primary }]}>
                <Text style={styles.bubbleText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [chatData, navigation, currentUserUid, activateColors]);

  const totalUnread = Object.values(chatData).reduce(
    (sum, chat) => sum + (chat.unreadCount || 0),
    0
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: activateColors.background }]}>
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            totalUnread > 0 ? (
              <Text style={[styles.totalUnread, { color: activateColors.primary }]}>
                {totalUnread} unread message{totalUnread !== 1 ? "s" : ""}
              </Text>
            ) : null
          }
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
  userItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  userItemUnread: {
    opacity: 0.9,
  },
  userItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flex: 1,
    marginRight: 16,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 2,
  },
  messageInfo: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 12,
    marginBottom: 4,
  },
  notificationBubble: {
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  bubbleText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  totalUnread: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  unreadText: {
    fontWeight: "600",
  },
  logoutButton: {
    marginRight: 15,
  },
});

export default Home;