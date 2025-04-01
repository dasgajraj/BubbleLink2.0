// BottomTabNavigation.js
import React, { useState, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation } from "react-native-paper";
import Home from "../ui/Home";
import Setting from "../ui/Setting";
import Contacts from "../ui/Contacts";
import { ThemeContext } from "../constants/ThemeContext";
import { colors } from "../config/theme";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "home", icon: "home", component: Home },
    { key: "contacts", icon: "contacts", component: Contacts },
    { key: "setting", icon: "settings", component: Setting },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    setting: Setting,
    contacts: Contacts,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor={activeColors.primary}
      inactiveColor={activeColors.secondary}
      barStyle={{ backgroundColor: activeColors.background }}
      renderIcon={({ route, color }) => {
        return <MaterialIcons name={route.icon} size={24} color={color} />;
      }}
    />
  );
};

export default MyTabs;