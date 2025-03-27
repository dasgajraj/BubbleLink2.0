import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from "react-native";
import { loginUser, registerUser, logoutUser } from "../services/authService";

const App = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      // Handle successful login
    } catch (err: any) {
      // Handle login error
    }
  };

  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password);
      navigation.navigate("Home", { user });
    } catch (err: any) {
        console.warn(err);
        console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#6A5ACD" barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'login' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('login')}
          >
            <Text style={[
              styles.tabButtonText, 
              activeTab === 'login' && styles.activeTabButtonText
            ]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tabButton, 
              activeTab === 'register' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('register')}
          >
            <Text style={[
              styles.tabButtonText, 
              activeTab === 'register' && styles.activeTabButtonText
            ]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={activeTab === 'login' ? handleLogin : handleRegister}
          >
            <Text style={styles.actionButtonText}>
              {activeTab === 'login' ? 'Login' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6A5ACD',
  },
  container: {
    flex: 1,
    backgroundColor: '#6A5ACD',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: 'white',
  },
  tabButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: '#6A5ACD',
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    padding: 30,
  },
  inputLabel: {
    color: '#6A5ACD',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: '#6A5ACD',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default App;