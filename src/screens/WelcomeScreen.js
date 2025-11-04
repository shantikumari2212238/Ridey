// src/screens/WelcomeScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// 🔹 Get screen width to create responsive background circle
const { width } = Dimensions.get('window');

/**
 * 🏠 WelcomeScreen Component
 * - The first screen after splash
 * - Offers two choices: Student or Driver login
 * - Uses navigation to move to the correct login screen
 */
const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 🔵 Decorative top circle background */}
      <View style={styles.topCircle} />

      {/* 📄 Main content container */}
      <View style={styles.content}>
        {/* 🟣 Title */}
        <Text style={styles.title}>Welcome to Rydy</Text>

        {/* 🟣 Short tagline */}
        <Text style={styles.subtitle}>Hop in and ride with ease!</Text>

        {/* 🟣 Small descriptive text */}
        <Text style={styles.tagline}>
          your daily and monthly campus transit partner
        </Text>

        {/* 🚗 Two Buttons for role selection */}
        <View style={styles.buttonContainer}>
          {/* Student button → navigates to Student Login */}
          <TouchableOpacity
            style={styles.studentButton}
            onPress={() => navigation.navigate('StudentLogin')}
          >
            <Text style={styles.buttonText}>Student</Text>
          </TouchableOpacity>

          {/* Driver button → navigates to Driver Login */}
          <TouchableOpacity
            style={styles.driverButton}
            onPress={() => navigation.navigate('DriverLogin')}
          >
            <Text style={styles.buttonText}>Driver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Export component as default so it can be imported in App.js (Navigator)
export default WelcomeScreen;

/* 🎨 Stylesheet
   - Uses purple theme (#6A1B9A) consistent with brand
   - Responsive layout with flexbox
*/
const styles = StyleSheet.create({
  // Main layout wrapper
  container: {
    flex: 1, // takes full height
    backgroundColor: '#ffffff', // white background
    alignItems: 'center', // center horizontally
  },

  // Large decorative circle at the top-right
  topCircle: {
    position: 'absolute',
    top: -width * 0.4, // push partially offscreen for curved look
    right: -width * 0.3,
    width: width * 1.2, // slightly larger than screen
    height: width * 1.2,
    borderRadius: width * 0.6, // make it circular
    backgroundColor: '#f3d9ff', // soft lavender tone
  },

  // Content container for texts and buttons
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  // App title
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#5e2a84', // dark purple
    marginBottom: 8,
  },

  // Subheading text
  subtitle: {
    fontSize: 16,
    color: '#5e2a84',
    marginBottom: 4,
  },

  // Small descriptive tagline
  tagline: {
    fontSize: 13,
    color: '#5e2a84',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 80, // spacing before buttons
  },

  // Container for the two role buttons
  buttonContainer: {
    flexDirection: 'row',
    gap: 20, // space between buttons (React Native 0.71+)
    marginTop: 40,
  },

  // Student button styling
  studentButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  // Driver button styling (same color scheme)
  driverButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  // Common text style for both buttons
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
