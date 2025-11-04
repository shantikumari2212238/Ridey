// ✅ Import React core and useState hook for managing component state
import React, { useState } from 'react';

// ✅ Import necessary React Native components
import {
  View,                // Basic container
  Text,                // Text display
  TextInput,           // Input fields for NIC and password
  TouchableOpacity,    // Pressable button elements
  Image,               // To display the Rydy logo
  StyleSheet,          // Style definitions for UI
  KeyboardAvoidingView,// Adjust layout when keyboard appears (especially iOS)
  Platform,            // Detect platform (Android / iOS)
  ScrollView,          // Make screen scrollable if content is long
  Alert,               // Show popup alerts for messages or errors
  ActivityIndicator,   // Spinner for loading indication
} from 'react-native';

// ✅ Functional component: DriverLogin screen
const DriverLogin = ({ navigation }) => {
  // ---------- State Management ----------
  const [nic, setNic] = useState('');             // NIC input field
  const [password, setPassword] = useState('');   // Password input field
  const [loading, setLoading] = useState(false);  // Track loading state while submitting

  // ✅ Backend API endpoint hosted on Render
  const BACKEND_URL = 'https://rydy-backend.onrender.com/api/drivers/login';

  // ---------- Handle Login Logic ----------
  const handleLogin = async () => {
    // Basic front-end validation: make sure both fields are filled
    if (!nic.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please fill in all fields.');
      return;
    }

    // Show spinner (ActivityIndicator)
    setLoading(true);

    try {
      // Send POST request to backend for authentication
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // tell backend we’re sending JSON
        body: JSON.stringify({ nic, password }),         // convert input data to JSON string
      });

      // Parse the JSON response body
      const data = await response.json();

      // Stop loading spinner after getting response
      setLoading(false);

      // If response is not OK (e.g., 400, 401, 404), show error
      if (!response.ok) {
        Alert.alert('Login Failed', data.message || 'Invalid credentials.');
        return;
      }

      // If login is successful:
      Alert.alert('Welcome', `Hello ${data.driver.name}! 🚗`);

      // Navigate to the DriverHome screen (replace removes login from back stack)
      navigation.replace('DriverHome');
    } catch (error) {
      // In case of network/server errors
      setLoading(false);
      console.error('Login Error:', error);
      Alert.alert(
        'Network Error',
        'Unable to reach the server. Please try again later.'
      );
    }
  };

  // ---------- UI Rendering ----------
  return (
    // Prevent UI from being overlapped by keyboard when typing
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // add padding only on iOS
    >
      {/* ScrollView ensures form can scroll on smaller devices */}
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // keeps taps active even when keyboard is open
      >
        {/* App logo */}
        <Image
          source={require('../../assets/rydy_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Screen title and subtitle */}
        <Text style={styles.title}>Driver Login</Text>
        <Text style={styles.subtitle}>Sign in with your NIC number</Text>

        {/* Login Form Section */}
        <View style={styles.form}>
          {/* NIC input label */}
          <Text style={styles.label}>NIC Number</Text>
          <TextInput
            value={nic}                           // value bound to state
            onChangeText={setNic}                 // update state when text changes
            placeholder="e.g. 42101-1234567-8"
            placeholderTextColor="#a68bc6"        // light purple placeholder color
            style={styles.input}                  // apply styling
            autoCapitalize="none"                 // disable automatic capitalization
          />

          {/* Password label */}
          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#a68bc6"
            style={styles.input}
            secureTextEntry                        // hides password characters
            autoCapitalize="none"                  // prevent auto-capitalization
          />

          {/* Login button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}                  // triggers login on press
            disabled={loading}                     // disable while submitting
          >
            {/* Show spinner if loading, otherwise show "Login" text */}
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Signup prompt row */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account?</Text>

            {/* Navigate to signup screen when clicked */}
            <TouchableOpacity
              onPress={() => navigation.navigate('DriverSignup')}
            >
              <Text style={styles.signupLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ✅ Export the component
export default DriverLogin;

// ---------- Stylesheet ----------
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f7f0ff' }, // full screen light purple
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,  // horizontal padding
    paddingTop: 40,         // spacing from top
    paddingBottom: 40,      // spacing from bottom
  },
  logo: { width: 180, height: 180, marginTop: 8, marginBottom: 8 }, // logo size
  title: { color: '#6A1B9A', fontSize: 28, fontWeight: '800', marginTop: 6 }, // main title
  subtitle: {
    color: '#6A1B9A',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',   // center subtitle text
  },
  form: { width: '100%', marginTop: 8 },
  label: {
    color: '#6A1B9A',
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ead9ff',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    elevation: 1,          // subtle shadow on Android
  },
  loginButton: {
    backgroundColor: '#6A1B9A',  // purple button
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 28,
    alignItems: 'center',
  },
  loginButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  signupRow: {
    flexDirection: 'row',  // horizontal text + button
    justifyContent: 'center',
    marginTop: 14,
  },
  signupText: { color: '#6A1B9A', fontSize: 14 },
  signupLink: { color: '#6A1B9A', fontSize: 14, fontWeight: '700' },
});
