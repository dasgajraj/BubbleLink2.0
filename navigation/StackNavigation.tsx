import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../ui/Login";
import LoadingScreen from "../ui/LoadingScreen";
import Home from "../ui/Home";
import Setting from "../ui/Setting";
import { auth } from "../config/firebaseConfig";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { useContext } from "react";
// Create Stack Navigator
const Stack = createStackNavigator();

const StackNavigation = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const {theme} = useContext(ThemeContext); 
  const activeColors = colors[theme.mode];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setTimeout(() => {
        setUser(currentUser);
        setLoading(false);
      }, 1000);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home" component={Home} user={user} />
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
