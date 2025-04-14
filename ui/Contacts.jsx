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
import { List, Divider, Text, Avatar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { getAllContacts, searchContactsByName } from "../data/contactData";
import { ThemeContext } from "../constants/ThemeContext";
import { colors } from "../config/theme";

const Contacts = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

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
        style={styles.contactTouchable}
        activeOpacity={0.7}
      >
        <List.Item
          title={item.name}
          description={item.phoneNumber}
          left={() => <Avatar.Image source={{ uri: item.avatar }} size={50} />}
          style={[
            styles.contactItem,
            { backgroundColor: activeColors.primarySurface },
          ]}
          titleStyle={{ color: activeColors.text, fontWeight: "600" }}
          descriptionStyle={{ color: activeColors.text + "BB" }}
        />
      </TouchableOpacity>
    ),
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
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="close" size={22} color={activeColors.text + "A0"} />
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          ItemSeparatorComponent={() => (
            <Divider style={{ backgroundColor: activeColors.border }} />
          )}
          contentContainerStyle={
            contacts.length === 0 ? { flex: 1 } : { paddingBottom: 16 }
          }
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
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
    paddingHorizontal: 12,
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
  contactTouchable: {
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  contactItem: {
    padding: 10,
    elevation: 1,
    borderRadius: 12,
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
