import StackNavigation from "./navigation/StackNavigation";
import { ThemeContext } from "./constants/ThemeContext";
import { useState } from "react";
import { StatusBar } from "react-native";
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
  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <StatusBar
        barStyle={theme.mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.mode === "dark" ? "#000" : "#fff"}
      />
      <StackNavigation />
    </ThemeContext.Provider>
  );
};

export default App;
