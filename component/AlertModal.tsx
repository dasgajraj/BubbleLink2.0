import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from "../config/theme";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AlertModalProps {
  title: string;
  message: string;
  actions: {
    label: string;
    onPress: () => void;
    nature?: 'constructive' | 'destructive'; // Updated to use string literals for clarity
  }[];
  visible: boolean;
  onDismiss?: () => void;
  isDarkMode: boolean;
  iconName?: string;
 
}

const AlertModal = ({
  title,
  message,
  actions,
  visible,
  onDismiss,
  isDarkMode,
  iconName = "alert-circle",
  nature = 'constructive'
}: AlertModalProps) => {
  const activeColors = colors[isDarkMode ? 'dark' : 'light'];
  
  // Set icon and colors based on nature
  const getIconName = () => {
    if (iconName !== "alert-circle") return iconName;
    return nature === 'destructive' ? "delete-alert" : "check-circle";
  };
  
  const getIconColor = () => {
    return nature === 'destructive' ? activeColors.error : activeColors.primary;
  };

  const getActionColor = (index: number) => {
    // Primary action (last in array) gets themed color, others get neutral
    const isPrimaryAction = index === actions.length - 1;
    
    if (isPrimaryAction) {
      return nature === 'destructive' ? activeColors.error : activeColors.primary;
    }
    return activeColors.text;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalContainer, { backgroundColor: activeColors.background }]}>
          {/* Icon and Title */}
          <View style={styles.iconContainer}>
            <Icon name={getIconName()} size={48} color={getIconColor()} />
            <Text style={[styles.title, { color: activeColors.text }]}>
              {title}
            </Text>
          </View>
          
          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: activeColors.textLight }]}>
              {message}
            </Text>
          </View>
          
          {/* Actions */}
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.actionButton}
                onPress={action.onPress}
              >
                <Text 
                  style={[
                    styles.actionText, 
                    { color: getActionColor(index) }
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '85%',
    maxWidth: 340,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  iconContainer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  messageContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AlertModal;