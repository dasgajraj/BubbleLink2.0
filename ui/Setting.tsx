import { Button, StyleSheet, Text, View, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { colors } from '../config/theme';
import { ThemeContext } from '../constants/ThemeContext';
import { getAuth, signOut } from 'firebase/auth';

const Setting = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const [isDark, setDark] = useState(theme.mode === 'dark');
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser({
        email: currentUser.email,
        name: currentUser.displayName || 'User',
      });
    }

    // Fetch random profile image
    fetch('https://randomuser.me/api/')
      .then((res) => res.json())
      .then((data) => {
        setProfilePic(data.results[0].picture.large);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => console.log('User signed out'))
      .catch((error) => console.error('Sign out error:', error));
  };

  const ChangeTheme = () => {
    updateTheme();
    setDark(!isDark);
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      {user && (
        <View style={styles.profileContainer}>
          <Image source={{ uri: profilePic }} style={styles.profileImage} />
          <Text style={[styles.text, { color: activeColors.text }]}>
            {user.name}
          </Text>
          <Text style={[styles.text, { color: activeColors.text }]}>
            {user.email}
          </Text>
        </View>
      )}
      <Button title="Change Theme" onPress={ChangeTheme} />
      <Button title="Sign Out" onPress={handleSignOut} color="red" />
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
});
