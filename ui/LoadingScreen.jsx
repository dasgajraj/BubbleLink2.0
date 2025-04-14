// LoadingScreen.jsx
import React, { useContext } from "react";
import { StatusBar } from "react-native";
import { Text, ActivityIndicator, Surface } from "react-native-paper";
import { ThemeContext } from "../constants/ThemeContext";
import { colors } from "../config/theme";

const LoadingScreen = () => {
  const themeContext = useContext(ThemeContext);
  const themeMode = themeContext?.theme?.mode || "light";
  const activeColors = colors[themeMode];

  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: activeColors.background,
      }}
    >
      <StatusBar hidden />

      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 10,
          color: activeColors.primary,
        }}
      >
        Bubble Link
      </Text>

      <ActivityIndicator
        animating={true}
        color={activeColors.primary}
        size="small"
        style={{ marginTop: 20 }}
      />

      <Surface
        style={{
          position: "absolute",
          bottom: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: activeColors.secondary,
          }}
        >
          V ~ 2.0.0
        </Text>
      </Surface>
    </Surface>
  );
};

export default LoadingScreen;
