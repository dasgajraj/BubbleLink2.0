import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    query, 
    where, 
    onSnapshot, 
    orderBy, 
    serverTimestamp, 
    Timestamp,
    getDocs
  } from 'firebase/firestore';
  import { auth, firestore } from "../config/firebaseConfig";
  
  // Types
  export interface User {
    _id: string;
    email: string;
    avatar?: string;
  }
  
  export interface Message {
    _id: string;
    createdAt: any; // Firestore Timestamp
    text: string;
    status: 'sent' | 'delivered' | 'read';
    user: User;
    chatId: string;
  }
  
  // Get chat ID from two user IDs (deterministic)
  export const getChatId = (userId1: string, userId2: string): string => {
    return userId1 < userId2
      ? `${userId1}_${userId2}`
      : `${userId2}_${userId1}`;
  };
  
  // Create a new chat or get existing one
  export const createOrGetChat = async (recipientId: string) => {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) throw new Error("User not authenticated");
    
    const chatId = getChatId(currentUserUid, recipientId);
    
    // Check if chat exists
    const chatsRef = collection(firestore, "chats");
    const chatDoc = doc(chatsRef, chatId);
    
    try {
      // Get or create chat document
      const chatSnapshot = await getDocs(query(
        collection(firestore, "chats"),
        where("chatId", "==", chatId)
      ));
      
      if (chatSnapshot.empty) {
        // Create new chat
        await addDoc(chatsRef, {
          chatId,
          participants: [currentUserUid, recipientId],
          createdAt: serverTimestamp(),
          lastMessageAt: serverTimestamp(),
        });
      }
      
      return chatId;
    } catch (error) {
      console.error("Error creating or getting chat:", error);
      throw error;
    }
  };
  
  // Subscribe to messages
  export const subscribeToMessages = (
    recipientId: string,
    onMessagesUpdate: (messages: Message[]) => void
  ) => {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) return () => {};
    
    const chatId = getChatId(currentUserUid, recipientId);
  
    // Query messages
    const messagesRef = collection(firestore, "messages");
    const messagesQuery = query(
      messagesRef,
      where("chatId", "==", chatId),
      orderBy("createdAt", "asc")
    );
    
    // Set up listener
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList: Message[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const message: Message = {
          _id: doc.id,
          chatId: data.chatId,
          createdAt: data.createdAt?.toMillis() || Date.now(),
          text: data.text,
          status: data.status,
          user: data.user
        };
        
        // Mark received messages as delivered
        if (message.status === "sent" && message.user._id !== currentUserUid) {
          updateDoc(doc.ref, { status: "delivered" });
          message.status = "delivered";
        }
        
        messageList.push(message);
      });
      
      onMessagesUpdate(messageList);
    });
    
    return unsubscribe;
  };
  
  // Mark messages as read
  export const markMessagesAsRead = async (messages: Message[], recipientId: string) => {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) return;
    
    const messagesToUpdate = messages.filter(
      (message) => message.status === "delivered" && message.user._id !== currentUserUid
    );
    
    for (const message of messagesToUpdate) {
      const messageRef = doc(firestore, "messages", message._id);
      await updateDoc(messageRef, { status: "read" });
    }
  };
  
  // Send a new message
  export const sendMessage = async (text: string, recipientId: string) => {
    if (!text.trim()) return;
    
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    try {
      const chatId = getChatId(currentUser.uid, recipientId);
      
      // Ensure chat exists
      await createOrGetChat(recipientId);
      
      // Add message
      const messagesRef = collection(firestore, "messages");
      await addDoc(messagesRef, {
        chatId,
        createdAt: serverTimestamp(),
        text: text.trim(),
        status: "sent",
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
      });
      
      // Update chat's lastMessageAt timestamp
      const chatsRef = collection(firestore, "chats");
      const chatQuery = query(chatsRef, where("chatId", "==", chatId));
      const chatSnapshot = await getDocs(chatQuery);
      
      if (!chatSnapshot.empty) {
        const chatDoc = chatSnapshot.docs[0];
        await updateDoc(chatDoc.ref, { lastMessageAt: serverTimestamp() });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  // Get user chats
  export const getUserChats = (onChatsUpdate: (chats: any[]) => void) => {
    const currentUserUid = auth.currentUser?.uid;
    if (!currentUserUid) return () => {};
    
    const chatsRef = collection(firestore, "chats");
    const chatsQuery = query(
      chatsRef,
      where("participants", "array-contains", currentUserUid),
      orderBy("lastMessageAt", "desc")
    );
    
    return onSnapshot(chatsQuery, async (snapshot) => {
      const chats = [];
      
      for (const doc of snapshot.docs) {
        const chatData = doc.data();
        const otherUserId = chatData.participants.find((id: string) => id !== currentUserUid);
        
        if (otherUserId) {
          // Get other user profile (would need a users collection)
          // This is a simplified version - implement full user profile fetching as needed
          chats.push({
            id: doc.id,
            chatId: chatData.chatId,
            otherUserId,
            lastMessageAt: chatData.lastMessageAt?.toDate() || new Date(),
            // You'd add other user details here from your users collection
          });
        }
      }
      
      onChatsUpdate(chats);
    });
  };