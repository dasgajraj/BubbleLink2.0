import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Appbar, Avatar, TextInput, IconButton, ActivityIndicator, Surface } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth } from "../config/firebaseConfig";
import { sendMessage as sendMessageService, listenMessages } from "../services/chatService";
import { ThemeContext } from "../constants/ThemeContext";
import { colors } from "../config/theme";

const { width } = Dimensions.get("window");

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { recipientId, recipientEmail } = route.params;

  const themeContext = useContext(ThemeContext);
  const themeMode = themeContext?.theme?.mode || "light";
  const activeColors = colors[themeMode];

  // Extract username from email (string before @)
  const recipientUsername = recipientEmail.split('@')[0];
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const unsubscribe = listenMessages((allMessages) => {
      const relevantMessages = allMessages.filter(
        (msg) =>
          (msg.sender === currentUserId && msg.receiver === recipientId) ||
          (msg.sender === recipientId && msg.receiver === currentUserId)
      );
      const sortedMessages = relevantMessages.sort((a, b) => {
        const timestampA = typeof a.createdAt === "number" ? a.createdAt : a.createdAt?.toDate?.()?.getTime() || 0;
        const timestampB = typeof b.createdAt === "number" ? b.createdAt : b.createdAt?.toDate?.()?.getTime() || 0;
        return timestampA - timestampB;
      });
      
      setMessages(sortedMessages);
    });

    return unsubscribe;
  }, [recipientId, currentUserId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => flatListRef.current.scrollToEnd({ animated: false }), 100);
    }
  }, [messages]);

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

  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.sender === currentUserId;
    const showAvatar = !isCurrentUser && 
      (index === 0 || messages[index - 1].sender !== item.sender);
    
    return (
      <View style={styles.messageWrapper}>
        {!isCurrentUser && showAvatar && (
          <Avatar.Text
            size={32}
            label={recipientUsername.substring(0, 2).toUpperCase()}
            style={[styles.avatar, { backgroundColor: activeColors.primary }]}
          />
        )}
        {!isCurrentUser && !showAvatar && <View style={styles.avatarPlaceholder} />}
        
        <View
          style={[
            styles.messageContainer,
            isCurrentUser ? 
              [styles.currentUserMessage, { backgroundColor: activeColors.primary }] : 
              [styles.otherUserMessage, { backgroundColor: activeColors.secondarySurface }],
            // Ensure consistent right margins for current user messages
            isCurrentUser && styles.currentUserMessageContainer
          ]}
        >
          <Text
            style={{
              color: isCurrentUser ? activeColors.onPrimaryContainer : activeColors.text,
            }}
          >
            {item.text}
          </Text>
        </View>
        
        {isCurrentUser && <View style={styles.avatarPlaceholder} />}
      </View>
    );
  };

  const handleTitlePress = () => {
    navigation.navigate("Profile", { userId: recipientId });
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <Appbar.Header style={{ backgroundColor: activeColors.primarySurface }}>
        <Appbar.BackAction 
          onPress={() => navigation.goBack()} 
          color={activeColors.text}
        />
        <TouchableOpacity 
          onPress={handleTitlePress} 
          style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
        >
          <Avatar.Text
            size={36}
            label={recipientUsername.substring(0, 2).toUpperCase()}
            style={{ marginRight: 10, backgroundColor: activeColors.primary }}
          />
          <Text style={{ color: activeColors.text, fontSize: 16, fontWeight: "600" }}>
            {recipientUsername}
          </Text>
        </TouchableOpacity>
        {/* Added call and search buttons */}
        <Appbar.Action icon="phone" onPress={() => {}} color={activeColors.text} />
        <Appbar.Action icon="magnify" onPress={() => {}} color={activeColors.text} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} color={activeColors.text} />
      </Appbar.Header>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => {
          if (messages.length > 0 && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: false });
          }
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: activeColors.onSurface40 }]}>
              No messages yet. Say hello!
            </Text>
          </View>
        )}
      />

      <Surface style={[styles.inputContainer, { backgroundColor: activeColors.secondarySurface }]} elevation={2}>
        {/* Added attachment button */}
        <IconButton
          icon="attachment"
          size={24}
          iconColor={activeColors.onSurface60}
          onPress={() => {}}
        />
        {/* Added emoji button */}
        <IconButton
          icon="emoticon-outline"
          size={24}
          iconColor={activeColors.onSurface60}
          onPress={() => {}}
        />
        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: themeMode === 'light' ? 
                activeColors.background : 
                activeColors.secondarySurface 
            }
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message"
          placeholderTextColor={activeColors.placeholder}
          multiline
          mode="flat"
          textColor={activeColors.text}
        />
        {sending ? (
          <ActivityIndicator size="small" color={activeColors.primary} />
        ) : (
          <IconButton
            icon="send"
            size={24}
            iconColor={
              inputText.trim() && !sending
                ? activeColors.primary
                : activeColors.onSurface60
            }
            onPress={sendMessage}
            disabled={!inputText.trim() || sending}
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
    padding: 10,
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
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  messageContainer: {
    maxWidth: width * 0.75,
    padding: 12,
    borderRadius: 18,
    marginVertical: 2,
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    marginLeft: "auto",
    borderBottomRightRadius: 6,
  },
  // Fixed spacing for current user messages
  currentUserMessageContainer: {
    marginRight: 0,
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    marginRight: "auto",
    borderBottomLeftRadius: 6,
  },
  avatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  avatarPlaceholder: {
    width: 32,
    marginHorizontal: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    borderRadius: 20,
    maxHeight: 100,
    paddingHorizontal: 16,
  },
});