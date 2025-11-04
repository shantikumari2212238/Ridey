// ✅ Import React and hooks for state management and side effects
import React, { useEffect, useState } from "react";

// ✅ Import React Native UI components
import {
  View,             // Container view
  Text,             // Text display
  StyleSheet,       // For styling
  TouchableOpacity, // For clickable buttons
  FlatList,         // For rendering scrollable lists of rides
  Alert,            // For showing popup alerts
  StatusBar,        // For customizing top status bar (color, icon style)
} from "react-native";

// ✅ Import FontAwesome icons for UI
import FontAwesome from "react-native-vector-icons/FontAwesome6";

// ✅ Backend URL for fetching rides (hosted on Render)
const BACKEND_URL = "https://rydy-backend.onrender.com/api/rides";

// ✅ Functional component: DriverHome screen
const DriverHome = ({ navigation }) => {
  // State to hold rides data fetched from backend
  const [rides, setRides] = useState([]);

  // ---------- FUNCTION: Fetch rides from backend ----------
  const fetchRides = async () => {
    try {
      // Send GET request to the backend
      const res = await fetch(BACKEND_URL);
      // Parse the JSON response
      const data = await res.json();
      // Save response data (list of rides) in state; fallback to empty list if null
      setRides(data || []);
    } catch (err) {
      // If network or server error occurs
      console.error("❌ Error fetching rides:", err);
      Alert.alert("Error", "Failed to fetch rides from server");
    }
  };

  // ---------- useEffect: Runs once when the screen mounts ----------
  useEffect(() => {
    fetchRides(); // Call the fetch function on component mount
  }, []);

  // ---------- UI RENDER ----------
  return (
    <View style={styles.container}>
      {/* Set StatusBar color and text theme */}
      <StatusBar backgroundColor="#6A1B9A" barStyle="light-content" />

      {/* 🔝 HEADER SECTION */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Home</Text>
      </View>

      {/* 🚗 CREATE RIDE CARD (Button for creating new ride) */}
      <TouchableOpacity
        style={styles.createRideCard}
        onPress={() => navigation.navigate("CreateRide")} // Navigate to CreateRide screen
      >
        <FontAwesome name="car" size={36} color="#d8b9ff" /> {/* Car icon */}
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.createRideTitle}>Create a Ride</Text>
          <Text style={styles.createRideSubtitle}>
            Schedule your ride details
          </Text>
        </View>
      </TouchableOpacity>

      {/* 📅 SECTION HEADER — “Today's Rides” */}
      <View style={styles.sectionHeader}>
        <FontAwesome name="calendar-days" size={20} color="#6A1B9A" />
        <Text style={styles.sectionTitle}>Today's Rides</Text>
      </View>

      {/* 🔸 CONDITIONAL RENDER: show message if no rides, else list */}
      {rides.length === 0 ? (
        // If no rides available
        <Text style={styles.noRidesText}>
          No rides created yet. Tap “Create a Ride” to get started.
        </Text>
      ) : (
        // If rides exist → show FlatList
        <FlatList
          data={rides}                          // data source (rides array)
          keyExtractor={(item) => item._id}     // unique key for each ride
          showsVerticalScrollIndicator={false}  // hide scroll bar
          renderItem={({ item }) => (
            // Each ride displayed as a card
            <View style={styles.rideCard}>
              {/* Ride route (From ➜ To) */}
              <Text style={styles.rideRoute}>
                {item.routeFrom} ➜ {item.routeTo}
              </Text>

              {/* Ride time */}
              <Text style={styles.rideTime}>
                🕒 {item.time || "Not specified"}
              </Text>

              {/* Seats info */}
              <Text style={styles.rideSeats}>
                🚗 {item.bookedSeats || 0}/{item.totalSeats} seats booked
              </Text>

              {/* Show list of booked students if available */}
              {item.bookedStudents?.length > 0 && (
                <Text style={styles.studentsList}>
                  👥 {item.bookedStudents.join(", ")}
                </Text>
              )}

              {/* Start Ride button — placeholder for future functionality */}
              <TouchableOpacity style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Ride</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* ⚙️ BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        {/* Home tab (active) */}
        <TouchableOpacity>
          <FontAwesome name="house" size={22} color="#6A1B9A" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        {/* My Rides tab — navigate to MyRides screen */}
        <TouchableOpacity onPress={() => navigation.navigate("MyRides")}>
          <FontAwesome name="clipboard-list" size={22} color="#999" />
          <Text style={[styles.navText, { color: "#999" }]}>My Rides</Text>
        </TouchableOpacity>

        {/* Profile tab — navigate to DriverProfile screen */}
        <TouchableOpacity onPress={() => navigation.navigate("DriverProfile")}>
          <FontAwesome name="user" size={22} color="#999" />
          <Text style={[styles.navText, { color: "#999" }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ✅ Export component
export default DriverHome;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f0ff",  // light purple background
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  // Header bar
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#6A1B9A",
  },

  // Create Ride button card
  createRideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6A1B9A", // dark purple
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  createRideTitle: { color: "#fff", fontWeight: "700", fontSize: 18 },
  createRideSubtitle: { color: "#d8b9ff", fontSize: 14, marginTop: 2 },

  // Section header (for "Today's Rides")
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  sectionTitle: { color: "#000", fontWeight: "700", fontSize: 17, marginLeft: 8 },

  // Message for when there are no rides
  noRidesText: {
    textAlign: "center",
    color: "#6A1B9A",
    marginTop: 40,
    fontSize: 14,
  },

  // Each ride card in the list
  rideCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  rideRoute: { color: "#333", fontWeight: "600", fontSize: 15, marginBottom: 6 },
  rideTime: { color: "#6A1B9A", fontSize: 13, marginBottom: 4 },
  rideSeats: { color: "#6A1B9A", fontSize: 13, marginBottom: 4 },
  studentsList: { color: "#555", fontSize: 13, marginBottom: 10 },

  // Start Ride button style
  startButton: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  startButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // Bottom navigation bar
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6A1B9A",
    marginTop: 2,
  },
});
