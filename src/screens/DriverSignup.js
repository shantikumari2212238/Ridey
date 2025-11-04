// Import React and the useState hook for local component state
import React, { useState } from 'react';

// Import React Native UI components and APIs used in this screen
import {
  View,                // Container element
  Text,                // Text display
  TextInput,           // Input fields
  TouchableOpacity,    // Pressable element (button)
  Image,               // To show selected photo or logo
  StyleSheet,          // Create stylesheet for the component
  ScrollView,          // Allow form to scroll if it overflows screen
  Alert,               // Show pop-up alerts to user
  ActivityIndicator,   // Loading spinner
  Platform,            // Detect platform (android / ios) — used for file uri
} from 'react-native';

// image-picker functions to open camera or photo library
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Functional component for Driver Sign Up screen; receives navigation prop
const DriverSignup = ({ navigation }) => {
  // ---------- Local state ----------
  const [name, setName] = useState('');                     // Driver full name
  const [age, setAge] = useState('');                       // Driver age (string input)
  const [nic, setNic] = useState('');                       // NIC number (unique id)
  const [password, setPassword] = useState('');             // Password
  const [confirmPassword, setConfirmPassword] = useState('');// Confirm password
  const [photo, setPhoto] = useState(null);                 // Selected photo object
  const [loading, setLoading] = useState(false);            // Loading indicator while submitting

  // Backend endpoint for driver signup (hosted on Render)
  const BACKEND_URL = 'https://rydy-backend.onrender.com/api/drivers/signup';

  // ---------- Image selection UI ----------
  // Prompt user to choose Camera or Gallery when uploading photo
  const onChoosePhoto = () => {
    Alert.alert('Upload Photo', 'Choose image from', [
      { text: 'Camera', onPress: openCamera },    // Open device camera
      { text: 'Gallery', onPress: openGallery },  // Open photo library
      { text: 'Cancel', style: 'cancel' },        // Cancel action
    ]);
  };

  // Open device camera and capture a photo
  const openCamera = async () => {
    // Launch camera with options: photo only and some quality
    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    // `result.assets` is an array; take first asset (photo)
    const asset = result.assets && result.assets[0];
    // If an image uri is present, save the asset object in state
    if (asset?.uri) setPhoto(asset);
  };

  // Open image library / gallery to pick an existing photo
  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    const asset = result.assets && result.assets[0];
    if (asset?.uri) setPhoto(asset);
  };

  // ---------- Validation and submit ----------
  const validateAndSubmit = async () => {
    // Basic field presence checks
    if (!name.trim() || !age.trim() || !nic.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please fill all fields.');
      return; // stop submission if missing required fields
    }

    // Age validation: ensure numeric and reasonable range
    if (isNaN(age) || age < 18 || age > 80) {
      Alert.alert('Validation', 'Please enter a valid age between 18 and 80.');
      return;
    }

    // Password length check (minimum 6 characters)
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters.');
      return;
    }

    // Confirm password equality check
    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match.');
      return;
    }

    // Ensure a photo has been selected
    if (!photo) {
      Alert.alert('Validation', 'Please upload your photo.');
      return;
    }

    // All validations passed → show loading spinner
    setLoading(true);

    try {
      // Prepare FormData to send both text fields and an image file
      const formData = new FormData();
      formData.append('name', name);
      formData.append('age', age);
      formData.append('nic', nic);
      formData.append('password', password);

      // Append the photo file; adjust URI for iOS (strip file://)
      formData.append('photo', {
        uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
        name: photo.fileName || `driver_${Date.now()}.jpg`, // fallback filename
        type: photo.type || 'image/jpeg',                   // MIME type
      });

      // Send POST request to backend with multipart/form-data body
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
      });

      // Parse JSON response body
      const json = await response.json();
      // Hide loading spinner
      setLoading(false);

      // If request succeeded (HTTP 2xx), inform user and navigate to login
      if (response.ok) {
        Alert.alert(
          'Signup Submitted',
          'Your driver account is pending admin approval.',
          [{ text: 'OK', onPress: () => navigation.navigate('DriverLogin') }]
        );
      } else {
        // Handle duplicate NIC or other server-provided message
        if (json.message && json.message.includes('already exists')) {
          Alert.alert(
            'Duplicate NIC',
            'This NIC number is already registered. Please log in or wait for admin approval.'
          );
        } else {
          // Generic failure handling
          Alert.alert('Signup Failed', json.message || 'Something went wrong.');
        }
      }
    } catch (err) {
      // Network or unexpected error; ensure spinner hidden and show alert
      setLoading(false);
      console.error('❌ Network Error:', err);
      Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
    }
  };

  // ---------- Render UI ----------
  return (
    // ScrollView lets the form scroll on small screens and ensures taps are handled
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* App logo */}
      <Image source={require('../../assets/rydy_logo.png')} style={styles.logo} resizeMode="contain" />

      {/* Title and subtitle */}
      <Text style={styles.title}>Driver Sign Up</Text>
      <Text style={styles.subtitle}>Register — admin approval required</Text>

      {/* Form container */}
      <View style={styles.form}>
        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}               // controlled input bound to state
          onChangeText={setName}     // update state as user types
          placeholder="John Doe"
          placeholderTextColor="#a68bc6"
        />

        {/* Age */}
        <Text style={[styles.label, { marginTop: 12 }]}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"     // numeric keyboard shown on mobile
          placeholder="e.g. 35"
          placeholderTextColor="#a68bc6"
        />

        {/* NIC Number */}
        <Text style={[styles.label, { marginTop: 12 }]}>NIC Number</Text>
        <TextInput
          style={styles.input}
          value={nic}
          onChangeText={setNic}
          placeholder="e.g. 42101-1234567-8"
          placeholderTextColor="#a68bc6"
        />

        {/* Password */}
        <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry                 // hides text for password input
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

        {/* Photo upload */}
        <Text style={[styles.label, { marginTop: 12 }]}>Driver Photo</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={onChoosePhoto}>
          {photo ? (
            // If photo selected, show preview using its URI
            <Image source={{ uri: photo.uri }} style={styles.photoPreview} resizeMode="cover" />
          ) : (
            // Otherwise show placeholder text
            <Text style={styles.uploadText}>Tap to upload your photo</Text>
          )}
        </TouchableOpacity>

        {/* Submit button */}
        <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit} disabled={loading}>
          {loading ? (
            // Show spinner while request is in progress
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Signup</Text>
          )}
        </TouchableOpacity>

        {/* Note below the button */}
        <View style={styles.noteRow}>
          <Text style={styles.noteText}>After submission your account will be pending admin approval.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Export component
export default DriverSignup;

// ---------- Styles for this screen ----------
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
  photoPreview: { width: '100%', height: '100%' },
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
