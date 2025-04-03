import React, { useCallback, useContext, useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { List, Button, Switch, Text } from "react-native-paper";
import { useHomeService } from "../services/homeService";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const Home = () => {
  const navigation = useNavigation();
  const {
    users,
    userImages,
    searchUsers,
    onSignOut,
    isLoading,
    getDefaultAvatar,
  } = useHomeService(navigation);
  const { theme, updateTheme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const [isDark, setDark] = useState(theme.mode === "dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const result = searchUsers(searchQuery);
      setFilteredUsers(result);
    }
  }, [searchQuery, users, searchUsers]);

  const renderUser = useCallback(
    ({ item }) => {
      return (
        <List.Item
          title={item.email}
          left={() => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Profile", { userId: item.id })
              }
            >
              <Image
                source={{
                  uri: userImages[item.id] || getDefaultAvatar(item.id),
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          )}
          onPress={() =>
            navigation.navigate("Chat", {
              recipientId: item.id,
              recipientEmail: item.email,
            })
          }
          style={[
            styles.userItem,
            {
              backgroundColor: activeColors.primarySurface,
              borderColor: activeColors.border,
            },
          ]}
          titleStyle={{ color: activeColors.text }}
        />
      );
    },
    [navigation, activeColors, userImages, getDefaultAvatar]
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: activeColors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: activeColors.background }]}
    >
      <View style={styles.container}>
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
            placeholder="Search users..."
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

        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon
                name="person-search"
                size={50}
                color={activeColors.primary}
              />
              <Text style={[styles.emptyText, { color: activeColors.text }]}>
                {searchQuery.length > 0
                  ? "No users found"
                  : "No users available"}
              </Text>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
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
  userItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default Home;
