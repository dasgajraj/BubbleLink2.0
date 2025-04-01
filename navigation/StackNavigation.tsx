// StackNavigation.js
import React, { useState, useEffect, useContext } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../ui/Login";
import Profile from "../ui/Profile";
import LoadingScreen from "../ui/LoadingScreen";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import MyTabs from "./BottomTabNavigation";
import Chat from "../ui/Chat";

const Stack = createStackNavigator();

const StackNavigation = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
      />
      <Stack.Navigator
        initialRouteName={user ? "MyTabs" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        {!user ? (
          <Stack.Screen name="Login" component={Login} />
        ) : (
          <>
           <Stack.Screen name="Chat" component={Chat}/>
            <Stack.Screen name="MyTabs" component={MyTabs} initialParams={{ userId: user?.uid }} />
            <Stack.Screen name="Profile" component={Profile} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;