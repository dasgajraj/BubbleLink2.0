// Login.jsx
import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Dialog,
  Portal,
  SegmentedButtons,
} from "react-native-paper";
import { colors } from "../config/theme";
import { ThemeContext } from "../constants/ThemeContext";
import { loginUser, registerUser } from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { theme } = useContext(ThemeContext);
  const mode = (theme?.mode || "light");
  const activeColors = colors[mode];

  const handleAuth = async () => {
    if (!email.trim()) return setErrorMessage("Please enter an email address");
    if (!password.trim()) return setErrorMessage("Please enter a password");

    try {
      setLoading(true);
      const user =
        activeTab === "login"
          ? await loginUser(email, password)
          : await registerUser(email, password);

      // onLoginSuccess(user);
      setEmail("");
      setPassword("");
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: activeColors.background }]}>
        <View style={styles.container}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            buttons={[
              { value: "login", label: "Login" },
              { value: "register", label: "Register" },
            ]}
            style={{ marginBottom: 20 }}
          />

          <View style={styles.formContainer}>
            <Text variant="titleMedium" style={{ color: activeColors.onSurface60 }}>
              Email
            </Text>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={loading}
              style={styles.input}
              outlineColor={activeColors.outline}
              activeOutlineColor={activeColors.primary}
              theme={{
                colors: {
                  text: activeColors.onSurface20,
                  placeholder: activeColors.placeholder,
                },
              }}
            />

            <Text variant="titleMedium" style={{ color: activeColors.onSurface60 }}>
              Password
            </Text>
            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              disabled={loading}
              style={styles.input}
              outlineColor={activeColors.outline}
              activeOutlineColor={activeColors.primary}
              theme={{
                colors: {
                  text: activeColors.onSurface20,
                  placeholder: activeColors.placeholder,
                },
              }}
            />

            <Button
              mode="contained"
              onPress={handleAuth}
              loading={loading}
              disabled={loading}
              style={{
                marginTop: 20,
                borderRadius: 8,
                backgroundColor: activeColors.primary,
              }}
              labelStyle={{ color: activeColors.onPrimaryContainer }}
            >
              {loading
                ? "Please wait..."
                : activeTab === "login"
                ? "Login"
                : "Register"}
            </Button>
          </View>
        </View>

        <Portal>
          <Dialog
            visible={!!errorMessage}
            onDismiss={() => setErrorMessage("")}
          >
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text>{errorMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setErrorMessage("")}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    marginBottom: 20,
  },
});

export default Login;
