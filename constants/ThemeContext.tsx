// ThemeContext.tsx
import React, { createContext, useState, ReactNode, useContext } from "react";
import { CustomLightTheme, CustomDarkTheme } from "../config/theme"; // Your themes
import { useColorScheme } from "react-native";

interface ThemeContextProps {
  theme: typeof CustomLightTheme | typeof CustomDarkTheme;
  updateTheme: (newTheme: typeof CustomLightTheme | typeof CustomDarkTheme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: CustomLightTheme, // Default to light theme
  updateTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(CustomLightTheme); // Default to light theme
  const systemTheme = useColorScheme(); // Get system-wide color scheme (light/dark)

  const updateTheme = (newTheme: typeof CustomLightTheme | typeof CustomDarkTheme) => {
    setTheme(newTheme);
  };

  // Apply system theme if no theme is set
  React.useEffect(() => {
    if (systemTheme === "dark") {
      setTheme(CustomDarkTheme);
    } else {
      setTheme(CustomLightTheme);
    }
  }, [systemTheme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
