// config/theme.jsx
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const CustomLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Light Theme Colors from image
    primary: "#0D6EFD",            // Primary blue
    primaryContainer: "#76A9FF",   // Primary Container blue
    onPrimaryContainer: "#002548", // On Primary Container dark blue
    primarySurface: "#D5E3FF",     // Primary Surface light blue
    secondarySurface: "#E7E8EA",   // Secondary Surface light gray
    background: "#FFFFFF",         // Background white
    onSurface20: "#444A51",        // On Surface 20 dark gray
    onSurface40: "#5A6169",        // On Surface 40 medium gray
    onSurface60: "#787D84",        // On Surface 60 light gray
    
    // Additional colors (keeping from original)
    text: "#0D1B2A",
    secondary: "#B3E5FC",
    error: "#D32F2F",
    disabled: "#BDBDBD",
    placeholder: "#9E9E9E",
    border: "#E0E0E0",

    // BOTTOM NAVIGATION
    botIcon:  "#001c38",
    botIconBG: "#d3e4ff",
    botBackground: "#f3f4f9",
    
  },
};

export const CustomDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Dark Theme Colors from image
    primary: "#76A9FF",            // Primary light blue
    primaryContainer: "#225091",   // Primary Container medium blue
    onPrimaryContainer: "#D5E3FF", // On Primary Container light blue
    primarySurface: "#0A1929",     // Primary Surface very dark blue
    secondarySurface: "#1A1A1A",   // Secondary Surface dark gray
    background: "#000000",         // Background black
    onSurface20: "#D1D5DB",        // On Surface 20 light gray
    onSurface40: "#9DA3AE",        // On Surface 40 medium gray
    onSurface60: "#737984",        // On Surface 60 darker gray
    
    // Additional colors (keeping from original)
    text: "#E3F2FD",
    secondary: "#64B5F6",
    error: "#EF5350",
    disabled: "#616161",
    placeholder: "#B0BEC5",
    border: "#424242",
    
    // BOTTOM NAVIGATION
    botIcon:  "#d7e2ff",
    botIconBG: "#2f4156",
    botBackground: "#13232c",


  },
};

export const colors = {
  light: CustomLightTheme.colors,
  dark: CustomDarkTheme.colors,
};