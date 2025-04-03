import React, { useState, useContext, useCallback } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { List, Divider, Text, Avatar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  getAllContacts,
  searchContactsByName,
  Contact,
} from "../data/contactData";
import { ThemeContext } from "../constants/ThemeContext";
import { colors } from "../config/theme";

const Contacts = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  // Get contacts based on search
  const getFilteredContacts = () => {
    if (searchQuery.trim()) {
      return searchContactsByName(searchQuery);
    }
    return getAllContacts();
  };

  const contacts = getFilteredContacts();

  // Format date to display "Today", "Yesterday", or date
  const formatLastContactedDate = (dateString) => {
    if (!dateString) return "Never";

    const contactDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (contactDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (contactDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return contactDate.toLocaleDateString();
    }
  };

  const renderContactItem = useCallback(
    ({ item }: { item: Contact }) => {
      return (
        <List.Item
          title={item.name}
          description={item.phoneNumber}
          left={() => <Avatar.Image source={{ uri: item.avatar }} size={50} />}
          style={[
            styles.contactItem,
            { backgroundColor: activeColors.primarySurface },
          ]}
          titleStyle={{ color: activeColors.text, fontWeight: "500" }}
          descriptionStyle={{ color: activeColors.text + "CC" }}
        />
      );
    },
    [navigation, activeColors]
  );

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: activeColors.primarySurface,
            borderColor: activeColors.border,
          },
        ]}
      >
        <Icon
          name="search"
          size={24}
          color={activeColors.text}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: activeColors.text }]}
          placeholder="Search contacts..."
          placeholderTextColor={activeColors.text + "80"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="close" size={24} color={activeColors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="person-search" size={60} color={activeColors.primary} />
      <Text style={[styles.emptyText, { color: activeColors.text }]}>
        {searchQuery.length > 0
          ? "No contacts found matching your search"
          : "You don't have any contacts yet"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: activeColors.background }]}
    >
      <View style={styles.container}>
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          ItemSeparatorComponent={() => (
            <Divider style={{ backgroundColor: activeColors.border }} />
          )}
          contentContainerStyle={contacts.length === 0 ? { flex: 1 } : null}
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
  },
  headerContainer: {
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 0,
  },
  contactItem: {
    padding: 8,
  },
  rightContent: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
    marginRight: 8,
  },
  lastContacted: {
    fontSize: 12,
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
