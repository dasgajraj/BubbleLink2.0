import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { auth } from "../config/firebaseConfig";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Avatar,
  TextInput,
  IconButton,
  ActivityIndicator,
  Surface,
  useTheme,
} from "react-native-paper";
import {
  sendMessage as sendMessageService,
  listenMessages,
} from "../services/chatService";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { CustomAppBar } from "../component/AppBar";

const { width } = Dimensions.get("window");

// Define message type based on your chat service
interface Message {
  id: string;
  text: string;
  sender: string;
  receiver: string;
  createdAt: any;
}

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
  const currentUserId = auth.currentUser?.uid;

  // Subscribe to messages
  useEffect(() => {
    const unsubscribe = listenMessages((allMessages) => {
      // Filter messages that are between current user and recipient
      const relevantMessages = allMessages.filter(
        (msg) =>
          (msg.sender === currentUserId && msg.receiver === recipientId) ||
          (msg.sender === recipientId && msg.receiver === currentUserId)
      );
      setMessages(relevantMessages);
    });
    
    return unsubscribe;
  }, [recipientId, currentUserId]);

  // Send a message
  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || sending || !currentUserId) return;

    try {
      setSending(true);
      await sendMessageService(inputText, currentUserId, recipientId);
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  }, [inputText, recipientId, sending, currentUserId]);

  // Render a message item
  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.sender === currentUserId;
    const timestamp =
      typeof item.createdAt === "number"
        ? new Date(item.createdAt)
        : item.createdAt?.toDate() || new Date();

    const formattedTime = timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userEmail = isCurrentUser 
      ? auth.currentUser?.email || "You"
      : recipientEmail;

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
            label={recipientEmail.substring(0, 2).toUpperCase()}
            style={styles.avatar}
          />
        )}
        <View>
          <Text
            style={[
              isCurrentUser ? styles.userIdTextOther : styles.userIdTextCurrent,
              { color: activeColors.textSecondary },
            ]}
          >
            {isCurrentUser ? "You" : userEmail}
          </Text>
          <Surface
            style={[
              styles.messageContainer,
              isCurrentUser
                ? [
                    styles.currentUserMessage,
                    { backgroundColor: activeColors.primary },
                  ]
                : [
                    styles.otherUserMessage,
                    { backgroundColor: activeColors.card },
                  ],
            ]}
            elevation={1}
          >
            <Text
              style={[
                styles.messageText,
                isCurrentUser
                  ? [
                      styles.currentUserText,
                      { color: activeColors.textOnPrimary },
                    ]
                  : [styles.otherUserText, { color: activeColors.text }],
              ]}
            >
              {item.text}
            </Text>
            <Text
              style={[
                styles.timeText,
                isCurrentUser
                  ? [
                      styles.currentUserTime,
                      { color: activeColors.textOnPrimaryMuted },
                    ]
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

 // Define the app bar actions
  const appBarActions = [
    {
      icon: "phone",
      onPress: () => {},
    },
    {
      icon: "dots-vertical",
      onPress: () => {},
    },
  ];

  // Navigate to user profile when title is pressed
  const handleTitlePress = () => {
    navigation.navigate("Profile", { userId: recipientId });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text
              style={[styles.emptyText, { color: activeColors.textSecondary }]}
            >
              No messages yet. Say hello!
            </Text>
          </View>
        )}
      />

      <Surface
        style={[styles.inputContainer, { backgroundColor: activeColors.card }]}
        elevation={4}
      >
        <IconButton
          icon="paperclip"
          size={24}
          iconColor={activeColors.primary}
          onPress={() => {}}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: "transparent", color: activeColors.text },
          ]}
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
          <ActivityIndicator
            size="small"
            color={activeColors.primary}
            style={styles.sendButton}
          />
        ) : (
          <IconButton
            icon="send"
            size={24}
            iconColor={
              inputText.trim() && !sending
                ? activeColors.primary
                : activeColors.textSecondary
            }
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
    justifyContent: "center",
    alignItems: "center",
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