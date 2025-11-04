// ✅ Import React — since this is a React Native functional component
import React from "react";

// ✅ Import core React Native components
import {
  View,              // Used as container blocks
  Text,              // For text display
  StyleSheet,        // To create and apply styles
  TextInput,         // Input box for searching
  TouchableOpacity,  // For clickable buttons
  StatusBar,         // Controls the device status bar (color, icons, etc.)
} from "react-native";

// ✅ Import FontAwesome icons for icons like bus, bell, etc.
import FontAwesome from "react-native-vector-icons/FontAwesome6";

// ✅ Functional Component — main screen shown after student logs in
const StudentHome = ({ navigation }) => {
  return (
    // Root container for the entire screen
    <View style={styles.container}>
      
      {/* Customizing status bar appearance */}
      <StatusBar backgroundColor="#f7f0ff" barStyle="dark-content" />

      {/* 🔝 HEADER SECTION */}
      <View style={styles.header}>
        {/* Left side: App logo with icon and title */}
        <View style={styles.logoContainer}>
          <FontAwesome name="bus" size={28} color="#6A1B9A" />   {/* Bus icon */}
          <Text style={styles.logoText}>Rydy</Text>             {/* App name */}
        </View>

        {/* Right side: Notification bell icon */}
        <FontAwesome name="bell" size={22} color="#6A1B9A" />
      </View>

      {/* 👋 WELCOME SECTION */}
      <Text style={styles.welcomeText}>Welcome Back to Rydy!</Text>

      {/* 🔍 SEARCH BAR SECTION */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for vans or driver"
        placeholderTextColor="#888"
      />

      {/* 🚌 MAIN BUTTONS SECTION */}
      {/* These could represent category tabs or filters */}
      <View style={styles.buttonRow}>
        {/* Active (highlighted) button */}
        <TouchableOpacity style={[styles.mainButton, styles.activeButton]}>
          <Text style={styles.mainButtonTextActive}>Daily Rides</Text>
        </TouchableOpacity>

        {/* Inactive (default) button */}
        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.mainButtonText}>Daily Rides</Text>
        </TouchableOpacity>
      </View>

      {/* OPTION BUTTONS SECTION (Two per row) */}
      {/* First row of feature buttons */}
      <View style={styles.buttonRow}>
        {/* Navigate to BookRide screen when pressed */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("BookRide")}
        >
          <FontAwesome name="location-dot" size={16} color="#6A1B9A" />
          <Text style={styles.optionText}>Book a Ride</Text>
        </TouchableOpacity>

        {/* Placeholder for a "Track my Van" feature */}
        <TouchableOpacity style={styles.optionButton}>
          <FontAwesome name="bus" size={16} color="#6A1B9A" />
          <Text style={styles.optionText}>Track my Van</Text>
        </TouchableOpacity>
      </View>

      {/* Second row of option buttons */}
      <View style={styles.buttonRow}>
        {/* Subscription feature */}
        <TouchableOpacity style={styles.optionButton}>
          <FontAwesome name="credit-card" size={16} color="#6A1B9A" />
          <Text style={styles.optionText}>My subscriptions</Text>
        </TouchableOpacity>

        {/* Chat with driver feature */}
        <TouchableOpacity style={styles.optionButton}>
          <FontAwesome name="comments" size={16} color="#6A1B9A" />
          <Text style={styles.optionText}>Chat with Driver</Text>
        </TouchableOpacity>
      </View>

      {/* ⚙️ BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        {/* Home button (active) */}
        <TouchableOpacity>
          <FontAwesome name="house" size={22} color="#6A1B9A" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>

        {/* Bookings tab (inactive) */}
        <TouchableOpacity>
          <FontAwesome name="clipboard-list" size={22} color="#6A1B9A" />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>

        {/* Profile tab (inactive) */}
        <TouchableOpacity>
          <FontAwesome name="user" size={22} color="#6A1B9A" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ✅ Export component so it can be used in navigation
export default StudentHome;

// 🎨 STYLING SECTION
const styles = StyleSheet.create({
  // Main screen container: sets layout and padding
  container: { 
    flex: 1, 
    backgroundColor: "#f7f0ff", 
    paddingHorizontal: 20, 
    paddingTop: 50 
  },

  // Header bar: logo + bell icon
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", // logo left, bell right
    alignItems: "center", 
    marginBottom: 25 
  },

  // Inner logo area: bus icon and text side by side
  logoContainer: { 
    flexDirection: "row", 
    alignItems: "center" 
  },

  // Logo text styling
  logoText: { 
    color: "#6A1B9A", 
    fontSize: 24, 
    fontWeight: "800", 
    marginLeft: 8 
  },

  // Welcome text just below header
  welcomeText: { 
    fontSize: 22, 
    fontWeight: "800", 
    color: "#6A1B9A", 
    marginBottom: 20 
  },

  // Search bar styling
  searchBar: { 
    backgroundColor: "#e0d6eb", 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    color: "#333", 
    marginBottom: 25 
  },

  // Generic button row (used for top tabs & feature buttons)
  buttonRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 15 
  },

  // Default style for large buttons
  mainButton: { 
    flex: 1, 
    backgroundColor: "#e5d4f8", 
    paddingVertical: 12, 
    borderRadius: 20, 
    alignItems: "center", 
    marginHorizontal: 4 
  },

  // Active state for highlighted button
  activeButton: { 
    backgroundColor: "#6A1B9A" 
  },

  // Default button text
  mainButtonText: { 
    color: "#6A1B9A", 
    fontWeight: "700" 
  },

  // Active button text color (white)
  mainButtonTextActive: { 
    color: "#fff", 
    fontWeight: "700" 
  },

  // Option buttons (like “Book Ride” or “Track Van”)
  optionButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#f1e4ff", 
    paddingVertical: 12, 
    justifyContent: "center", 
    borderRadius: 10, 
    flex: 1, 
    marginHorizontal: 4 
  },

  // Text inside small option buttons
  optionText: { 
    color: "#6A1B9A", 
    fontWeight: "600", 
    fontSize: 14, 
    marginLeft: 8 
  },

  // Bottom navigation bar at the bottom of screen
  bottomNav: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center", 
    backgroundColor: "#f1e4ff", 
    borderTopWidth: 1, 
    borderColor: "#e0d6eb", 
    paddingVertical: 10, 
    position: "absolute", 
    bottom: 0, 
    width: "100%" 
  },

  // Active navigation label style
  navTextActive: { 
    fontSize: 12, 
    color: "#6A1B9A", 
    fontWeight: "700", 
    marginTop: 2 
  },

  // Inactive navigation label style
  navText: { 
    fontSize: 12, 
    color: "#6A1B9A", 
    marginTop: 2 
  },
});
