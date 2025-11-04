// Import React and useState hook for managing local component state
import React, { useState } from "react";

// Import React Native components used in this screen
import {
  View,           // Container element
  Text,           // Text display
  TextInput,      // Input fields
  TouchableOpacity,// Pressable button
  StyleSheet,     // Stylesheet creator
  Alert,          // Popup alert dialogs
  ScrollView,     // Scrollable container for the form
} from "react-native";

// FontAwesome icons for small UI decorations
import FontAwesome from "react-native-vector-icons/FontAwesome6";

// Backend endpoint for creating rides (hosted on Render)
const BACKEND_URL = "https://rydy-backend.onrender.com/api/rides";

// Functional component that allows drivers to create a new ride
const CreateRide = ({ navigation }) => {
  // formData state holds all inputs in one object for convenience
  const [formData, setFormData] = useState({
    routeFrom: "",   // origin of ride
    routeTo: "",     // destination of ride
    time: "",        // ride time (string)
    totalSeats: "",  // total seats (string input; convert before sending)
  });

  // Generic handler to update a single key in formData
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value }); // spread previous + update
  };

  // Called when user taps "Create Ride" button
  const handleCreateRide = async () => {
    // Destructure values for validation & submission
    const { routeFrom, routeTo, time, totalSeats } = formData;

    // Basic front-end validation: ensure all fields are filled
    if (!routeFrom || !routeTo || !time || !totalSeats) {
      Alert.alert("Missing Fields", "Please fill out all ride details.");
      return; // stop if any required field is empty
    }

    try {
      // Send POST request to backend with JSON body
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // tell server we're sending JSON
        body: JSON.stringify({
          routeFrom,
          routeTo,
          time,
          totalSeats: Number(totalSeats), // convert seats from string → number
        }),
      });

      // We first read raw text because some backends can return non-JSON
      const text = await response.text();
      let data;

      try {
        // Attempt to parse the backend response as JSON
        data = JSON.parse(text);
      } catch (err) {
        // If parsing fails, log the raw response and show user-friendly alert
        console.error("❌ Invalid JSON from backend:", text);
        Alert.alert("Server Error", "Unexpected server response. Please try again.");
        return;
      }

      // If response is OK (HTTP 2xx), show success and navigate back to DriverHome
      if (response.ok) {
        Alert.alert("✅ Ride Created", "Your ride has been added successfully!", [
          { text: "OK", onPress: () => navigation.navigate("DriverHome") },
        ]);
      } else {
        // If backend returned an error, show the message if available
        console.log("❌ Server error:", data);
        Alert.alert("Error", data.message || "Failed to create ride.");
      }
    } catch (err) {
      // Network error or fetch failure
      console.error("❌ Network error:", err);
      Alert.alert("Error", "Could not connect to server.");
    }
  };

  // ---------- UI RENDER ----------
  return (
    // ScrollView ensures the form scrolls on small devices and keyboard overlap is manageable
    <ScrollView contentContainerStyle={styles.container}>
      {/* Screen heading */}
      <Text style={styles.heading}>Create a Ride</Text>

      {/* Input: From */}
      <View style={styles.inputContainer}>
        <FontAwesome name="location-dot" size={18} color="#6A1B9A" />{/* icon */}
        <TextInput
          placeholder="From (e.g. Campus)"
          style={styles.input}
          value={formData.routeFrom}                          // controlled input
          onChangeText={(text) => handleChange("routeFrom", text)} // update state
          placeholderTextColor="#999"
        />
      </View>

      {/* Input: To */}
      <View style={styles.inputContainer}>
        <FontAwesome name="location-arrow" size={18} color="#6A1B9A" />
        <TextInput
          placeholder="To (e.g. Central Station)"
          style={styles.input}
          value={formData.routeTo}
          onChangeText={(text) => handleChange("routeTo", text)}
          placeholderTextColor="#999"
        />
      </View>

      {/* Input: Time */}
      <View style={styles.inputContainer}>
        <FontAwesome name="clock" size={18} color="#6A1B9A" />
        <TextInput
          placeholder="Time (e.g. 8:30 AM)"
          style={styles.input}
          value={formData.time}
          onChangeText={(text) => handleChange("time", text)}
          placeholderTextColor="#999"
        />
      </View>

      {/* Input: Total Seats (numeric keyboard) */}
      <View style={styles.inputContainer}>
        <FontAwesome name="users" size={18} color="#6A1B9A" />
        <TextInput
          placeholder="Total Seats"
          keyboardType="numeric" // numeric keyboard on mobile
          style={styles.input}
          value={formData.totalSeats}
          onChangeText={(text) => handleChange("totalSeats", text)}
          placeholderTextColor="#999"
        />
      </View>

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleCreateRide}>
        <Text style={styles.submitText}>Create Ride</Text>
      </TouchableOpacity>

      {/* Cancel button — simply goes back to previous screen */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Export component so it can be used in navigation
export default CreateRide;

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,               // allow ScrollView to expand vertically
    backgroundColor: "#f7f0ff",// background color matching app theme
    padding: 20,
    justifyContent: "center",  // center content vertically (if space permits)
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: "#6A1B9A",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",      // icon + input on a row
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,              // subtle shadow on Android
  },
  input: {
    flex: 1,                   // input takes up remaining row space
    marginLeft: 10,
    color: "#333",
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#6A1B9A",
    fontWeight: "600",
    fontSize: 15,
  },
});
