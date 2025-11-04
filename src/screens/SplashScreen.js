// ✅ Import React and necessary hooks
import React, { useEffect, useRef } from 'react';

// ✅ Import React Native components
import { 
  View,       // Container view
  Text,       // (Not used here but imported in case of text)
  Image,      // To display logo
  StyleSheet, // For styles
  Animated    // For animation effects like fade-in
} from 'react-native';

// ✅ Functional component for Splash Screen
const SplashScreen = ({ navigation }) => {

  // useRef: creates a reference that holds an Animated.Value for opacity (starting from 0 = fully transparent)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // useEffect runs once when the component mounts
  useEffect(() => {
    // 🔹 Step 1: Start a fade-in animation on the logo
    Animated.timing(fadeAnim, {
      toValue: 1,           // animate opacity from 0 → 1
      duration: 1500,       // over 1.5 seconds
      useNativeDriver: true // use native animation driver for performance
    }).start();             // start the animation immediately

    // 🔹 Step 2: After 3 seconds, navigate to "Welcome" screen
    const timer = setTimeout(() => {
      navigation.replace('Welcome'); // replaces SplashScreen so user can’t go back to it
    }, 3000);

    // 🔹 Step 3: Cleanup function — clear the timeout if component unmounts before time
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]); // dependencies: rerun only if fadeAnim or navigation changes

  // ---------- UI Rendering ----------
  return (
    // Main container centered vertically & horizontally
    <View style={styles.container}>
      
      {/* Animated logo — uses fadeAnim opacity value */}
      <Animated.Image
        source={require('../../assets/rydy_logo.png')} // local image asset
        style={[styles.logo, { opacity: fadeAnim }]}   // apply fade animation
        resizeMode="contain"                           // keeps aspect ratio
      />
      
      {/* (Optional text placeholders commented out)
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Rydy</Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Your daily university commute, simplified
      </Animated.Text>
      */}
    </View>
  );
};

// Export component so it can be used in App.js navigation
export default SplashScreen;

// 🎨 Styles for layout and appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,                     // full screen
    backgroundColor: '#f7f0ff',  // light purple background color
    alignItems: 'center',        // center horizontally
    justifyContent: 'center',    // center vertically
  },
  logo: {
    width: 220,                  // logo width
    height: 160,                 // logo height
    marginBottom: 20,            // spacing below logo
  },
  title: {
    fontSize: 36,                // large text for app name (if used)
    fontWeight: '700',           // bold
    color: '#5e2a84',            // deep purple color
  },
  tagline: {
    fontSize: 14,                // smaller text for slogan
    color: '#5e2a84',
    marginTop: 4,
    letterSpacing: 0.5,          // slightly spaced letters
  },
});
