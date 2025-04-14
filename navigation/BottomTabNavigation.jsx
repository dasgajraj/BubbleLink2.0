import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../constants/ThemeContext';
import { colors } from '../config/theme';
import Home from '../ui/Home';
import Setting from '../ui/Setting';
import Contacts from '../ui/Contacts';

const MyTabs = () => {
  const { theme } = useContext(ThemeContext);
  const mode = theme?.mode || 'light';
  const themeColors = colors[mode];

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'contacts', title: 'Contacts', icon: 'people' },
    { key: 'settings', title: 'Settings', icon: 'settings' },
  ]);

  // Pass setIndex to Home
  const renderScene = BottomNavigation.SceneMap({
    home: () => <Home setTabIndex={setIndex} />,
    contacts: Contacts,
    settings: Setting,
  });

  const getIconName = (routeKey) => {
    switch (routeKey) {
      case 'home':
        return 'home';
      case 'contacts':
        return 'people';
      case 'settings':
        return 'settings';
      default:
        return 'home';
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor={themeColors.botIcon}
      inactiveColor={themeColors.botIcon}
      barStyle={{ backgroundColor: themeColors.botBackground }}
      style={{ height: 80, justifyContent: 'center' }}
      renderIcon={({ route, focused, color }) => {
        const iconName = getIconName(route.key);
        return (
          <View
            style={[
              styles.iconWrapper,
              focused && {
                backgroundColor: themeColors.botIconBG,
                borderRadius: 20,
                width: 70,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 40,
              },
            ]}
          >
            <Ionicons
              name={focused ? iconName : `${iconName}-outline`}
              size={24}
              color={color}
            />
          </View>
        );
      }}
      getLabelText={({ route }) => route.title}
      labelStyle={{ fontSize: 12, marginBottom: 4 }}
      shifting={false}
    />
  );
};

export default MyTabs;

const styles = StyleSheet.create({
  iconWrapper: {
    marginTop: -3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});