import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { ThemeContext } from "../constants/ThemeContext"; // Import your theme context

const LoadingScreen = () => {
  const { theme, isDarkMode } = useContext(ThemeContext); // Get theme and dark mode status from context

  return (
    <View style={[styles.view, { backgroundColor: theme.background }]}> 
      <StatusBar hidden />

      <Text style={[styles.MainText, { color: isDarkMode ? "#000000" : theme.primary }]}>Bubble Link</Text>
      <ActivityIndicator
        animating={true}
        color={theme.primary}
        size="small"
        style={styles.Loader}
      />

      <View style={styles.footerView}>
        <Text style={[styles.footerText, { color: theme.secondary }]}>V ~ 2.0.0</Text>
      </View>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  MainText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  Loader: {
    marginTop: 20,
  },
  footerView: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
  },
});
