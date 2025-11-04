// ✅ Import React and useState hook for managing component state
import React, { useState } from 'react';

// ✅ Import necessary components and APIs from React Native core library
import {
  View,                // Container for UI blocks
  Text,                // Displays text
  TextInput,           // For user input fields
  TouchableOpacity,    // Button-like touchable element
  Image,               // Display images
  StyleSheet,          // For component styling
  ScrollView,          // Enables scrolling if form is long
  Alert,               // Popup alert box for messages
  ActivityIndicator,   // Loading spinner
  Platform,            // Detects OS (Android/iOS)
  PermissionsAndroid,  // (Optional import) For runtime permissions on Android
} from 'react-native';

// ✅ Import image picker functions to allow camera/gallery access
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// ✅ Functional component for the student signup screen
const StudentSignup = ({ navigation }) => {

  // ---------- STATE VARIABLES ----------
  // useState hooks store form data and component state
  const [name, setName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [idImage, setIdImage] = useState(null);   // Stores selected image info
  const [loading, setLoading] = useState(false);  // Shows spinner while submitting

  // ✅ Backend API endpoint (Render hosted)
  const BACKEND_URL = 'https://rydy-backend.onrender.com/api/students/signup';

  // ---------- IMAGE SELECTION ----------
  // 🔹 Ask user how they want to upload ID (Camera or Gallery)
  const onChooseImage = () => {
    Alert.alert('Upload ID Card', 'Choose image from', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // 🔹 Open camera and capture photo
  const openCamera = async () => {
    // Launch device camera
    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    const asset = result.assets && result.assets[0]; // First image captured
    if (asset?.uri) setIdImage(asset); // Save image in state if available
  };

  // 🔹 Open gallery to select existing image
  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    const asset = result.assets && result.assets[0];
    if (asset?.uri) setIdImage(asset);
  };

  // ---------- FORM VALIDATION & SUBMIT ----------
  const validateAndSubmit = async () => {
    // Check for empty fields
    if (!name.trim() || !universityId.trim() || !universityName.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please fill out all fields.');
      return;
    }

    // Check password length
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters long.');
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match.');
      return;
    }

    // Check image selected
    if (!idImage) {
      Alert.alert('Validation', 'Please upload your ID card.');
      return;
    }

    // Show loading spinner
    setLoading(true);

    try {
      // ---------- CREATE FORMDATA OBJECT ----------
      // Used to send text fields + file in one request
      const formData = new FormData();
      formData.append('name', name);
      formData.append('universityId', universityId);
      formData.append('universityName', universityName);
      formData.append('password', password);
      formData.append('idCard', {
        // Different URI format for Android vs iOS
        uri: Platform.OS === 'android' ? idImage.uri : idImage.uri.replace('file://', ''),
        name: idImage.fileName || `id_${Date.now()}.jpg`, // Default name if missing
        type: idImage.type || 'image/jpeg',               // MIME type
      });

      // ---------- SEND SIGNUP REQUEST ----------
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData, // Send multipart data to backend
      });

      const json = await response.json(); // Parse JSON response
      setLoading(false); // Hide spinner

      // ✅ If backend responds successfully (status 200–299)
      if (response.ok) {
        Alert.alert(
          'Signup Submitted',
          'Your account is pending admin approval.',
          [{ text: 'OK', onPress: () => navigation.navigate('StudentLogin') }]
        );
      } else {
        // 🔹 Handle duplicate University ID error (custom backend message)
        if (json.message && json.message.includes('University ID already exists')) {
          Alert.alert(
            'Duplicate ID',
            'This University ID is already registered. Please log in or wait for admin approval.'
          );
        } else {
          // Generic error handling
          Alert.alert('Signup Failed', json.message || 'Something went wrong.');
        }
      }
    } catch (err) {
      // 🔹 Handle network or unexpected errors
      setLoading(false);
      console.error('❌ Network Error:', err);
      Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
    }
  };

  // ---------- UI (COMPONENT RETURN) ----------
  return (
    // ScrollView: allows vertical scroll, closes keyboard on tap
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* App logo */}
      <Image
        source={require('../../assets/rydy_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title & subtitle */}
      <Text style={styles.title}>Student Sign Up</Text>
      <Text style={styles.subtitle}>
        Register — your account will be approved by admin
      </Text>

      {/* Main form */}
      <View style={styles.form}>

        {/* Name field */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          placeholderTextColor="#a68bc6"
        />

        {/* University ID field */}
        <Text style={[styles.label, { marginTop: 12 }]}>University ID</Text>
        <TextInput
          style={styles.input}
          value={universityId}
          onChangeText={setUniversityId}
          placeholder="e.g. 2021-ABC-123"
          placeholderTextColor="#a68bc6"
        />

        {/* University Name field */}
        <Text style={[styles.label, { marginTop: 12 }]}>University Name</Text>
        <TextInput
          style={styles.input}
          value={universityName}
          onChangeText={setUniversityName}
          placeholder="Your University Name"
          placeholderTextColor="#a68bc6"
        />

        {/* Password field */}
        <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry // hides text
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor="#a68bc6"
        />

        {/* Confirm Password */}
        <Text style={[styles.label, { marginTop: 12 }]}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          placeholderTextColor="#a68bc6"
        />

        {/* Upload ID Card */}
        <Text style={[styles.label, { marginTop: 12 }]}>ID Card Picture</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={onChooseImage}>
          {idImage ? (
            // Show selected image preview
            <Image source={{ uri: idImage.uri }} style={styles.idPreview} resizeMode="cover" />
          ) : (
            // Placeholder text if no image selected
            <Text style={styles.uploadText}>Tap to upload ID card (front)</Text>
          )}
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={validateAndSubmit}
          disabled={loading} // disabled while loading
        >
          {loading ? (
            <ActivityIndicator color="#fff" /> // Spinner while uploading
          ) : (
            <Text style={styles.submitText}>Submit Signup</Text>
          )}
        </TouchableOpacity>

        {/* Note at bottom */}
        <View style={styles.noteRow}>
          <Text style={styles.noteText}>
            After submission, your account will be pending admin approval.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// ✅ Export the component as default
export default StudentSignup;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#f7f0ff',
  },
  logo: { width: 140, height: 140, marginTop: 8, marginBottom: 6 },
  title: { color: '#6A1B9A', fontSize: 24, fontWeight: '800', marginTop: 6 },
  subtitle: {
    color: '#6A1B9A',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 12,
    textAlign: 'center',
  },
  form: { width: '100%', marginTop: 6 },
  label: { color: '#6A1B9A', fontSize: 13, marginLeft: 4, fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ead9ff',
    marginTop: 6,
  },
  uploadBox: {
    height: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#d7bff5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  uploadText: { color: '#6A1B9A', textAlign: 'center', paddingHorizontal: 8 },
  idPreview: { width: '100%', height: '100%' },
  submitButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  noteRow: { marginTop: 12, alignItems: 'center' },
  noteText: { color: '#6A1B9A', fontSize: 12, textAlign: 'center' },
});
