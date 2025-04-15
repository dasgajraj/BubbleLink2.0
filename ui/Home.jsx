import React, { useCallback, useContext, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Text, TextInput, Avatar, ActivityIndicator, FAB, IconButton } from 'react-native-paper';
import { useHomeService } from '../services/homeService';
import { colors } from '../config/theme';
import { ThemeContext } from '../constants/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const {
    users,
    userImages,
    searchUsers,
    isLoading,
  } = useHomeService();

  const navigation = useNavigation();
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme || { mode: 'light' };
  const isDark = theme.mode === 'dark';
  const activeColors = colors[theme.mode];

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const result = searchUsers(searchQuery);
      setFilteredUsers(result);
    }
  }, [searchQuery, users, searchUsers]);

  const renderUser = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() =>
          navigation.navigate("Chat", {
            recipientId: item.id,
            recipientEmail: item.email,
          })}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", {
              userId: item.id,
            })}
          activeOpacity={0.8}
        >
          {userImages[item.id] ? (
            <Avatar.Image
              source={{ uri: userImages[item.id] }}
              size={48}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={48}
              label={(item.email.charAt(0) || "").toUpperCase()}
              style={{ backgroundColor: isDark ? '#333' : '#e1e1e1' }}
              labelStyle={{ color: '#888' }}
            />
          )}
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: activeColors.text }]}>
            {item.email.split("@")[0] || "User"}
          </Text>
          <Text style={[styles.email, { color: isDark ? '#aaaaaa' : '#666666' }]}>
            {item.email}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? '#777777' : '#bbbbbb'}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
    ),
    [activeColors, userImages, isDark, navigation]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, { color: activeColors.text }]}>Messages</Text>
          <View style={styles.actionButtons}>
            <IconButton
              icon="dots-horizontal"
              size={22}
              iconColor={activeColors.text}
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}>
          <Ionicons
            name="search-outline"
            size={18}
            color={isDark ? '#888' : '#999'}
            style={styles.searchIcon}
          />
          <TextInput
            mode="flat"
            style={[styles.searchInput, { color: activeColors.text, backgroundColor: 'transparent' }]}
            placeholder="Search"
            placeholderTextColor={isDark ? '#888' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            underlineColor="transparent"
            selectionColor={activeColors.primary}
          />
          {searchQuery.length > 0 && (
            <IconButton
              icon="close-circle"
              size={18}
              onPress={() => setSearchQuery('')}
              iconColor={isDark ? '#888' : '#999'}
              style={styles.clearButton}
            />
          )}
        </View>

        {users.length > 0 && (
          <Text style={[styles.categoryHeader, { color: isDark ? '#888' : '#777' }]}>
            RECENT
          </Text>
        )}

        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          style={styles.userList}
          contentContainerStyle={users.length === 0 ? { flex: 1 } : null}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? '#222' : '#f5f5f5' }]}>
                <Ionicons
                  name="chatbubble-outline"
                  size={40}
                  color={isDark ? '#666' : '#999'}
                />
              </View>
              <Text style={[styles.emptyText, { color: activeColors.text }]}>
                {searchQuery.length > 0
                  ? 'No users found'
                  : 'No conversations yet'}
              </Text>
              <Text style={[styles.emptySubText, { color: isDark ? '#888' : '#777' }]}>
                Start a new chat by tapping the button below
              </Text>
            </View>
          }
        />

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: activeColors.primary }]}
          onPress={() => navigation.navigate("AddContact")}
          color="#FFFFFF"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: "row",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 38,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 38,
    fontSize: 15,
    padding: 0,
  },
  clearButton: {
    margin: 0,
  },
  categoryHeader: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  userList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 4,
  },
  avatar: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "500",
  },
  email: {
    fontSize: 13,
    marginTop: 2,
  },
  chevronIcon: {
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
  },
});

export default Home;
