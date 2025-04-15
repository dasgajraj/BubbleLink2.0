import React, { useState, useContext, useCallback, useMemo } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { List, Divider, Text, Avatar, Appbar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { getAllContacts, searchContactsByName } from "../data/contactData";
import { ThemeContext } from "../constants/ThemeContext";
import { colors } from "../config/theme";

const Contacts = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const isDark = theme.mode === "dark";

  const contacts = useMemo(() => {
    return searchQuery.trim()
      ? searchContactsByName(searchQuery)
      : getAllContacts();
  }, [searchQuery]);

  const renderContactItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Chat", {
            recipientId: item.id,
            recipientEmail: item.email,
          })
        }
        style={styles.contactItem}
        activeOpacity={0.7}
      >
        <Avatar.Image 
          source={{ uri: item.avatar }} 
          size={50} 
          style={styles.contactAvatar}
        />
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: activeColors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.contactPhone, { color: isDark ? '#aaaaaa' : '#666666' }]}>
            {item.phoneNumber}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? '#aaaaaa' : '#666666'}
        />
      </TouchableOpacity>
    ),
    [navigation, activeColors, isDark]
  );

  const HeaderComponent = () => (
    <View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, { color: activeColors.text }]}>Contacts</Text>
        <View style={styles.actionButtons}>
          <Appbar.Action 
            icon="dots-vertical" 
            onPress={() => {}} 
            color={activeColors.text} 
          />
        </View>
      </View>
      
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: activeColors.primarySurface,
              borderColor: activeColors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={22}
            color={activeColors.text + "B0"}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: activeColors.text }]}
            placeholder="Search contacts..."
            placeholderTextColor={activeColors.text + "80"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-outline" size={22} color={activeColors.text + "A0"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <Text style={[styles.categoryHeader, { color: isDark ? '#aaaaaa' : '#666666' }]}>
        All Contacts
      </Text>
    </View>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="person-outline" size={60} color={activeColors.primary} />
      <Text style={[styles.emptyText, { color: activeColors.text }]}>
        {searchQuery.length > 0
          ? "No contacts found matching your search"
          : "You don't have any contacts yet"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: activeColors.primary }]}
    >
      <View style={[styles.contentContainer, { backgroundColor: activeColors.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <FlatList
            data={contacts}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={HeaderComponent}
            ListEmptyComponent={EmptyComponent}
            contentContainerStyle={
              contacts.length === 0 ? { flex: 1 } : { paddingBottom: 16 }
            }
            keyboardShouldPersistTaps="handled"
          />
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 14,
  },
  keyboardView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: "row",
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoryHeader: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  contactAvatar: {
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
  },
  contactPhone: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
});

export default Contacts;