import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from 'react-native-paper';
import { ThemeContext } from '../constants/ThemeContext';
import { colors } from '../config/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AddContact = ({ goBack }) => {
  const navigation = useNavigation();
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme || { mode: 'light' };
  const isDark = theme.mode === 'dark';
  const activeColors = colors[theme.mode];

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const handleSaveContact = () => {
    // Save contact logic here
    if (goBack) {
      goBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={goBack || (() => navigation.goBack())} 
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            New Contact
          </Text>
        </View>

        <ScrollView style={styles.contentContainer}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity style={[styles.profileImagePlaceholder, { backgroundColor: isDark ? '#333333' : '#F0F0F0' }]}>
              <Ionicons name="camera-outline" size={32} color="#8BB9FE" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            {/* First Name Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={isDark ? '#AAAAAA' : '#777777'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.textInput, 
                    { color: isDark ? '#FFFFFF' : '#000000' }
                  ]}
                  placeholder="First name"
                  placeholderTextColor={isDark ? '#AAAAAA' : '#888888'}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={[styles.inputDivider, { backgroundColor: isDark ? '#333333' : '#EFEFEF' }]} />
            </View>

            {/* Last Name Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <View style={styles.inputIconPlaceholder} />
                <TextInput
                  style={[
                    styles.textInput, 
                    { color: isDark ? '#FFFFFF' : '#000000' }
                  ]}
                  placeholder="Last name"
                  placeholderTextColor={isDark ? '#AAAAAA' : '#888888'}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
              <View style={[styles.inputDivider, { backgroundColor: isDark ? '#333333' : '#EFEFEF' }]} />
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <Ionicons 
                  name="call-outline" 
                  size={20} 
                  color={isDark ? '#AAAAAA' : '#777777'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.textInput, 
                    { color: isDark ? '#FFFFFF' : '#000000' }
                  ]}
                  placeholder="Phone"
                  placeholderTextColor={isDark ? '#AAAAAA' : '#888888'}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
              <View style={[styles.inputDivider, { backgroundColor: isDark ? '#333333' : '#EFEFEF' }]} />
            </View>

            {/* Address Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <Ionicons 
                  name="location-outline" 
                  size={20} 
                  color={isDark ? '#AAAAAA' : '#777777'} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.textInput, 
                    { color: isDark ? '#FFFFFF' : '#000000' }
                  ]}
                  placeholder="Address"
                  placeholderTextColor={isDark ? '#AAAAAA' : '#888888'}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
              <View style={[styles.inputDivider, { backgroundColor: isDark ? '#333333' : '#EFEFEF' }]} />
            </View>

            {/* City Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <View style={styles.inputIconPlaceholder} />
                <TextInput
                  style={[
                    styles.textInput, 
                    { color: isDark ? '#FFFFFF' : '#000000' }
                  ]}
                  placeholder="City"
                  placeholderTextColor={isDark ? '#AAAAAA' : '#888888'}
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={[styles.inputDivider, { backgroundColor: isDark ? '#333333' : '#EFEFEF' }]} />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#8BB9FE' }]}
          onPress={handleSaveContact}
        >
          <Ionicons name="checkmark" size={24} color="#FFFFFF" style={styles.saveButtonIcon} />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  inputIconPlaceholder: {
    width: 36,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  inputDivider: {
    height: 1,
    marginTop: 8,
    marginLeft: 36,
  },
  saveButton: {
    margin: 16,
    height: 50,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddContact;