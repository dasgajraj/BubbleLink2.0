import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Home from '../ui/Home';
import Setting from '../ui/Setting';
import Contacts from '../ui/Contacts';
import { ThemeContext } from '../constants/ThemeContext';
import { colors } from '../config/theme';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  const { theme } = useContext(ThemeContext);
  const mode = theme?.mode || 'light';
  const themeColors = colors[mode];

  const getIconName = (routeName, focused) => {
    switch (routeName) {
      case 'Home':
        return focused ? 'home' : 'home-outline';
      case 'Contacts':
        return focused ? 'people' : 'people-outline';
      case 'Settings':
        return focused ? 'settings' : 'settings-outline';

    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        animationEnabled: true,
        backgroundColor: themeColors.botBackground,
        headerShown: false,
        tabBarPressColor: 'hidden',
        tabBarIcon: ({ focused, size }) => {
          const iconName = getIconName(route.name, focused);
          return (
            <View
              style={[
                styles.iconWrapper,
                focused && { backgroundColor: themeColors.botIconBG, borderRadius: 20 },
                { width: size + 30, height: size+2},
              ]}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={themeColors.botIcon}
              />
            </View>
          );
        },
        tabBarActiveTintColor: themeColors.botIcon,
        tabBarInactiveTintColor: themeColors.botIcon,
        tabBarStyle: {
          backgroundColor: themeColors.botBackground,
          // borderTopColor: 'transparent',
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="Settings" component={Setting} />
    </Tab.Navigator>
  );
};

export default MyTabs;

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
