import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../ui/Login";
import LoadingScreen from "../ui/LoadingScreen";
import Home from "../ui/Home";
import Setting from "../ui/Setting";
// import Chat from "../ui/Chat"; // Uncommented the Chat import
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { useContext } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Create Stack Navigator
const Stack = createStackNavigator();

const StackNavigation = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext); 
  const activeColors = colors[theme.mode];

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle successful login or registration
  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      <Stack.Navigator 
        initialRouteName={user ? "Home" : "Login"}
        screenOptions={{ 
          headerShown: true,
          headerStyle: { 
            backgroundColor: activeColors.primary,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#e5e5ea",
          },
          headerTitleStyle: {
            color: activeColors.textPrimary,
            fontSize: 18,
            fontWeight: "600",
          },
          headerTintColor: activeColors.textPrimary
        }}
      >
        {!user ? (
          // No user is signed in, show Login screen
          <Stack.Screen 
            name="Login" 
            options={{ headerShown: false }}
          >
            {(props) => <Login {...props} onLoginSuccess={handleAuthSuccess} />}
          </Stack.Screen>
        ) : (
          // User is signed in, show Home and other screens
          <>
            <Stack.Screen name="Home" options={{
              headerBackTitle: true,
              headerTitleAlign: "left",
            }}>
              {(props) => <Home {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen 
              name="Setting" 
              component={Setting} 
              options={{
                headerBackTitle: true,
                headerTitleAlign: "left",
              }}
            />
            {/* <Stack.Screen 
              name="Chat" 
              component={Chat} 
              options={({ route }) => ({ 
                title: route.params?.recipientEmail || "Chat",
                headerBackTitle: true,
                headerTitleAlign: "left",
              })}
            /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;