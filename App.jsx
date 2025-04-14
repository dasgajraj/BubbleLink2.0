// App.jsx
import * as React from "react";
import { useState } from "react";
import { StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import StackNavigation from "./navigation/StackNavigation";
import { ThemeContext } from "./constants/ThemeContext";
import { CustomLightTheme, CustomDarkTheme } from "./config/theme";

const App = () => {
  const [theme, setTheme] = useState({ mode: "dark" });

  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === "dark" ? "light" : "dark";
      newTheme = { mode };
    }
    setTheme(newTheme);
  };

  const paperTheme = theme.mode === "dark" ? CustomDarkTheme : CustomLightTheme;

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <PaperProvider theme={paperTheme}>
        <StatusBar
          barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
          backgroundColor={theme.mode === "dark" ? "#000" : "#fff"}
        />
        <StackNavigation />
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export default App;
