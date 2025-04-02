import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
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
} from 'react-native-paper';
import { 
  subscribeToMessages, 
  sendMessage as sendMessageService,
  Message
} from "../services/chatService";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { CustomAppBar } from '../component/AppBar';

const { width } = Dimensions.get("window");

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { recipientId, recipientEmail } = route.params;
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const [isDark] = useState(theme.mode === "dark");
  const paperTheme = useTheme();

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log("Error logging out: ", error));
    navigation.navigate("Login");
  };

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
          <Text style={[
            isCurrentUser ? styles.userIdTextOther : styles.userIdTextCurrent,
            { color: activeColors.textSecondary }
          ]}>
            {isCurrentUser ? "You" : item.user.email}
          </Text>
          <Surface
            style={[
              styles.messageContainer,
              isCurrentUser 
                ? [styles.currentUserMessage, { backgroundColor: activeColors.primary }]
                : [styles.otherUserMessage, { backgroundColor: activeColors.card }],
            ]}
            elevation={1}
          >
            <Text
              style={[
                styles.messageText,
                isCurrentUser 
                  ? [styles.currentUserText, { color: activeColors.textOnPrimary }]
                  : [styles.otherUserText, { color: activeColors.text }],
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.timeText,
                isCurrentUser 
                  ? [styles.currentUserTime, { color: activeColors.textOnPrimaryMuted }]
                  : [styles.otherUserTime, { color: activeColors.textMuted }],
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

  // Define the app bar actions
  const appBarActions = [
    {
      icon: 'phone',
      onPress: () => {},
    },
    {
      icon: 'dots-vertical',
      onPress: () => {},
    },
  ];

  // Navigate to user profile when title is pressed
  const handleTitlePress = () => {
    navigation.navigate("Profile", { userId: recipientId });
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      
      <CustomAppBar
        title={recipientEmail}
        subtitle={`ID: ${recipientId}`}
        showBack={true}
        actions={appBarActions}
        onTitlePress={handleTitlePress}
      />
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={onContentSizeChange}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: activeColors.textSecondary }]}>
              No messages yet. Say hello!
            </Text>
          </View>
        )}
      />

      <Surface style={[styles.inputContainer, { backgroundColor: activeColors.card }]} elevation={4}>
        <IconButton
          icon="paperclip"
          size={24}
          iconColor={activeColors.primary}
          onPress={() => {}}
        />
        <TextInput
          style={[styles.input, { backgroundColor: 'transparent', color: activeColors.text }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={activeColors.textSecondary}
          multiline
          mode="outlined"
          outlineColor={activeColors.border}
          activeOutlineColor={activeColors.primary}
          textColor={activeColors.text}
          maxHeight={100}
        />
        {sending ? (
          <ActivityIndicator size="small" color={activeColors.primary} style={styles.sendButton} />
        ) : (
          <IconButton
            icon="send"
            size={24}
            iconColor={inputText.trim() && !sending ? activeColors.primary : activeColors.textSecondary}
            onPress={sendMessage}
            disabled={!inputText.trim() || sending}
            style={styles.sendButton}
          />
        )}
      </Surface>
    </View>
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
    borderTopRightRadius: 4,
  },
  otherUserMessage: {
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {},
  otherUserText: {},
  timeText: {
    fontSize: 12,
    marginTop: 4,
  },
  currentUserTime: {},
  otherUserTime: {},
  avatar: {
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
  },
  sendButton: {
    margin: 4,
  },
  userIdTextCurrent: {
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 40,
    textAlign: "left",
  },
  userIdTextOther: {
    fontSize: 12,
    marginBottom: 4,
    marginRight: 40,
    textAlign: "right",
  },
});