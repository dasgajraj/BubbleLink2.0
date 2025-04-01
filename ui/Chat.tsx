import React, { useState, useLayoutEffect, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useNavigation, useRoute } from "@react-navigation/native";
import { 
  Avatar, 
  TextInput, 
  IconButton, 
  ActivityIndicator, 
  Surface, 
  useTheme,
  Provider as PaperProvider,
  MD3Colors,
} from 'react-native-paper';
import { 
  subscribeToMessages, 
  sendMessage as sendMessageService,
  Message
} from "../services/chatService";

const { width } = Dimensions.get("window");

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { recipientId, recipientEmail } = route.params;
  const theme = useTheme();

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
    navigation.navigate("Login");
  };

  // Configure navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="logout"
          iconColor={theme.colors.primary}
          size={24}
          onPress={onSignOut}
          style={styles.logoutButton}
        />
      ),
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTintColor: theme.colors.primary,
      headerTitleStyle: {
        fontWeight: "600",
      },
      title: recipientEmail,
    });
  }, [navigation, recipientEmail, theme]);

  // Subscribe to messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages(recipientId, setMessages);
    return unsubscribe;
  }, [recipientId]);

  // Send a message
  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || sending) return;
    
    try {
      setSending(true);
      await sendMessageService(inputText, recipientId);
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Could show a Snackbar here with Paper
    } finally {
      setSending(false);
    }
  }, [inputText, recipientId, sending]);

  // Render a message item
  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.user._id === auth.currentUser?.uid;
    const timestamp = typeof item.createdAt === 'number' 
      ? new Date(item.createdAt) 
      : item.createdAt?.toDate() || new Date();
      
    const formattedTime = timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageRowContainer,
          isCurrentUser ? styles.currentUserRow : styles.otherUserRow,
        ]}
      >
        {!isCurrentUser && (
          <Avatar.Text 
            size={32} 
            label={item.user.email.substring(0, 2).toUpperCase()} 
            style={styles.avatar}
          />
        )}
        <View>
          <Text style={isCurrentUser ? styles.userIdTextOther : styles.userIdTextCurrent}>
            {isCurrentUser ? "You" : item.user.email}
          </Text>
          <Surface
            style={[
              styles.messageContainer,
              isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
            ]}
            elevation={1}
          >
            <Text
              style={[
                styles.messageText,
                isCurrentUser ? styles.currentUserText : styles.otherUserText,
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.timeText,
                isCurrentUser ? styles.currentUserTime : styles.otherUserTime,
              ]}
            >
              {formattedTime}
            </Text>
          </Surface>
        </View>
      </View>
    );
  };

  // Auto-scroll to bottom when messages update
  const onContentSizeChange = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  return (
    <PaperProvider>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={onContentSizeChange}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.outline }]}>
                No messages yet. Say hello!
              </Text>
            </View>
          )}
        />

        <Surface style={styles.inputContainer} elevation={4}>
          <IconButton
            icon="paperclip"
            size={24}
            iconColor={theme.colors.primary}
            onPress={() => {}}
          />
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline
            mode="outlined"
            outlineColor={theme.colors.surfaceVariant}
            activeOutlineColor={theme.colors.primary}
            maxHeight={100}
          />
          {sending ? (
            <ActivityIndicator size="small" color={theme.colors.primary} style={styles.sendButton} />
          ) : (
            <IconButton
              icon="send"
              size={24}
              iconColor={inputText.trim() && !sending ? theme.colors.primary : theme.colors.outline}
              onPress={sendMessage}
              disabled={!inputText.trim() || sending}
              style={styles.sendButton}
            />
          )}
        </Surface>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 15,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
  messageRowContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  currentUserRow: {
    justifyContent: "flex-end",
  },
  otherUserRow: {
    justifyContent: "flex-start",
  },
  messageContainer: {
    maxWidth: width * 0.7,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  currentUserMessage: {
    backgroundColor: "#6366F1",
    borderTopRightRadius: 4,
  },
  otherUserMessage: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: "#FFFFFF",
  },
  otherUserText: {
    color: "#1E293B",
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
  },
  currentUserTime: {
    color: "#E2E8F0",
  },
  otherUserTime: {
    color: "#94A3B8",
  },
  avatar: {
    backgroundColor: "#6366F1",
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: "transparent",
  },
  sendButton: {
    margin: 4,
  },
  logoutButton: {
    marginRight: 8,
  },
  userIdTextCurrent: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
    marginLeft: 40,
    textAlign: "left",
  },
  userIdTextOther: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 4,
    marginRight: 40,
    textAlign: "right",
  },
});