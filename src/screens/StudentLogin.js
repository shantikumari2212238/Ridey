// Import React and the useState hook to manage local component state
import React, { useState } from 'react';

// Import React Native components and APIs used in this screen
import {
  View,                // Basic container element
  Text,                // For displaying text
  TextInput,           // For input fields
  TouchableOpacity,    // Pressable button-like element
  Image,               // For showing the app logo
  StyleSheet,          // For defining component styles
  KeyboardAvoidingView,// Adjusts UI when keyboard opens (iOS padding)
  Platform,            // To detect platform (iOS/Android)
  ScrollView,          // Allows content to scroll when needed
  Alert,               // Shows popup messages to the user
  ActivityIndicator,   // Loading spinner while waiting for async ops
} from 'react-native';

// Functional component for the Student Login screen; receives navigation prop
const StudentLogin = ({ navigation }) => {
  // Local state: studentId input value
  const [studentId, setStudentId] = useState('');
  // Local state: password input value
  const [password, setPassword] = useState('');
  // Local state: loading indicator while sending login request
  const [loading, setLoading] = useState(false);

  // Backend endpoint for student login (hosted on Render)
  const BACKEND_URL = 'https://rydy-backend.onrender.com/api/students/login';

  // Handler called when user presses the Login button
  const handleLogin = async () => {
    // Basic front-end validation: ensure both fields are filled
    if (!studentId.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please fill in all fields.');
      return; // stop if validation fails
    }

    // Show loading spinner
    setLoading(true);

    try {
      // Send POST request with JSON body containing universityId and password
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId: studentId, // backend expects `universityId`
          password,                // password from state
        }),
      });

      // Parse response body as JSON
      const data = await response.json();
      // Hide loading spinner regardless of success/failure
      setLoading(false);

      // If response status is not OK (200–299), show error message
      if (!response.ok) {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
        return;
      }

      // Successful login: show welcome message with student name
      Alert.alert('Welcome', `Hello ${data.student.name}! 🎉`);
      // Navigate to StudentHome and replace current screen (prevents back to login)
      navigation.replace('StudentHome');
    } catch (error) {
      // Network or unexpected error handling
      setLoading(false); // make sure spinner is hidden
      console.error('Login error:', error); // print error to debug console
      Alert.alert(
        'Network Error',
        'Unable to reach the server. Please try again later.'
      );
    }
  };

  // Render UI
  return (
    // KeyboardAvoidingView moves content up on iOS when keyboard opens
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // only apply padding on iOS
    >
      {/* ScrollView allows tapping outside inputs to persist taps and scroll if needed */}
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled" // prevents keyboard from blocking tap events
      >
        {/* App logo image (local asset) */}
        <Image
          source={require('../../assets/rydy_logo.png')}
          style={styles.logo}
          resizeMode="contain" // preserve aspect ratio
        />

        {/* Screen title and subtitle */}
        <Text style={styles.title}>Student Login</Text>
        <Text style={styles.subtitle}>Sign in with your University ID</Text>

        {/* Form container */}
        <View style={styles.form}>
          {/* University ID label */}
          <Text style={styles.label}>University ID</Text>
          {/* University ID input field */}
          <TextInput
            value={studentId}             // value from state
            onChangeText={setStudentId}   // update state on change
            placeholder="e.g. 2021-ABC-123"
            placeholderTextColor="#a68bc6"
            style={styles.input}
            autoCapitalize="none"        // do not auto-capitalize ID
          />

          {/* Password label */}
          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          {/* Password input field */}
          <TextInput
            value={password}              // value from state
            onChangeText={setPassword}    // update state on change
            placeholder="Enter your password"
            placeholderTextColor="#a68bc6"
            style={styles.input}
            secureTextEntry                // hide typed characters
            autoCapitalize="none"          // no auto-capitalization for passwords
          />

          {/* Login button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}         // call login handler when pressed
            disabled={loading}            // disable button while loading
          >
            {/* Show spinner if loading, otherwise show "Login" text */}
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Row for signup prompt */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            {/* Navigate to StudentSignup when user taps Sign Up */}
            <TouchableOpacity onPress={() => navigation.navigate('StudentSignup')}>
              <Text style={styles.signupLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Export component as default so other files can import it
export default StudentLogin;

// ---------- Stylesheet: visual styling for the components ----------
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#f7f0ff' }, // full-screen background
  container: {
    alignItems: 'center',        // center items horizontally
    paddingHorizontal: 24,       // side padding
    paddingTop: 40,              // top padding
    paddingBottom: 40,           // bottom padding
  },
  logo: { width: 180, height: 180, marginTop: 8, marginBottom: 8 }, // logo size & spacing
  title: { color: '#6A1B9A', fontSize: 28, fontWeight: '800', marginTop: 6 }, // main title style
  subtitle: {
    color: '#6A1B9A',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',        // center the subtitle text
  },
  form: { width: '100%', marginTop: 8 }, // container width fills parent
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
    elevation: 1,                 // Android shadow elevation
  },
  loginButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 28,
    alignItems: 'center',
  },
  loginButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  signupText: { color: '#6A1B9A', fontSize: 14 },
  signupLink: { color: '#6A1B9A', fontSize: 14, fontWeight: '700' },
});
