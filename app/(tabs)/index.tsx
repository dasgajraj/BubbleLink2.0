import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Button } from "react-native";
import { loginUser, registerUser, logoutUser } from "../../services/authService";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      Alert.alert("Success", `Welcome ${user.email}`);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password);
      Alert.alert("Success", `Welcome ${user.email}`);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert("Success", "Logged out successfully");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.maincontainer}>
      <Text style={styles.Heading}>Chat App</Text>
      <View style={styles.Container}>
        <Text style={styles.Head}>Email Id</Text>
        <TextInput 
          style={styles.Input} 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.Head}>Password</Text>
        <TextInput 
          style={styles.Input} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
        />
        <Button onPress={handleLogin} title="Login" />
        <Button onPress={handleRegister} title="Register" color="green" />
        <Button onPress={handleLogout} title="Logout" color="red" />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  Heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  Container: {
    width: "80%",
    padding: 10,
    alignItems: "center",
  },
  Head: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  Input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
  },
});
