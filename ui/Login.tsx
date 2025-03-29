import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { loginUser, registerUser } from "../services/authService";
import { useNavigation } from "@react-navigation/native";


const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const navigation = useNavigation();

  const handleAuth = async () => {
    try {
      if (!email.trim()) {
        Alert.alert("Validation Error", "Please enter an email address");
        return;
      }

      if (!password.trim()) {
        Alert.alert("Validation Error", "Please enter a password");
        return;
      }

      setLoading(true);
      
      let user;
      if (activeTab === "login") {
        user = await loginUser(email, password);
      } else {
        user = await registerUser(email, password);
      }
      
      // Call the onLoginSuccess function passed from the parent component
      onLoginSuccess(user);
      
      // Clear the form
      setEmail("");
      setPassword("");
      
      // No need to navigate here as the parent component will handle navigation
      // based on the updated user state
      
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred";

      if (err.code) {
        switch (err.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address";
            break;
          case "auth/user-not-found":
            errorMessage = "No user found with this email";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password";
            break;
          case "auth/email-already-in-use":
            errorMessage = "Email is already registered";
            break;
          case "auth/weak-password":
            errorMessage = "Password is too weak";
            break;
        }
      }

      Alert.alert("Authentication Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: activeColors.background }]}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "login" && {
                  backgroundColor: activeColors.primarySurface,
                },
              ]}
              onPress={() => setActiveTab("login")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  { color: activeColors.onSurface40 },
                  activeTab === "login" && {
                    color: activeColors.onPrimaryContainer,
                    fontWeight: "bold",
                  },
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "register" && {
                  backgroundColor: activeColors.primarySurface,
                },
              ]}
              onPress={() => setActiveTab("register")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  { color: activeColors.onSurface40 },
                  activeTab === "register" && {
                    color: activeColors.onPrimaryContainer,
                    fontWeight: "bold",
                  },
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            <Text
              style={[styles.inputLabel, { color: activeColors.onSurface60 }]}
            >
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: activeColors.secondarySurface,
                  color: activeColors.onSurface20,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={activeColors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
            <Text
              style={[styles.inputLabel, { color: activeColors.onSurface60 }]}
            >
              Password
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: activeColors.secondarySurface,
                  color: activeColors.onSurface20,
                },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={activeColors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: activeColors.primary },
                loading && { opacity: 0.7 }
              ]}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: activeColors.onPrimaryContainer },
                ]}
              >
                {loading 
                  ? "Please wait..." 
                  : activeTab === "login" 
                    ? "Login" 
                    : "Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
  },
  tabButton: {
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  formContainer: {
    padding: 30,
    width: "100%",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
});

export default Login;