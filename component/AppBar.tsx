import React, { useContext } from "react";
import { Appbar } from "react-native-paper";
import { ThemeContext } from "../constants/ThemeContext";
import { colors } from "../config/theme";
import { useNavigation } from "@react-navigation/native";

export function CustomAppBar({
  title,
  subtitle,
  showBack = true,
  actions = [],
  onTitlePress,
  backgroundColor,
}) {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Appbar.Header
      style={{ backgroundColor: backgroundColor || activeColors.primary }}
    >
      {showBack && (
        <Appbar.BackAction
          onPress={handleBack}
          color={activeColors.textOnPrimary}
        />
      )}

      <Appbar.Content
        title={title}
        subtitle={subtitle}
        onPress={onTitlePress}
        titleStyle={{ color: activeColors.textOnPrimary }}
        subtitleStyle={{ color: activeColors.textOnPrimaryMuted }}
      />

      {actions.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
          color={activeColors.textOnPrimary}
        />
      ))}
    </Appbar.Header>
  );
}
