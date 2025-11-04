// Import React and hooks
import React, { useEffect, useState } from "react";

// Import React Native building blocks
import {
  View,             // General container
  Text,             // For displaying text
  StyleSheet,       // For styling components
  TouchableOpacity, // Pressable button
  FlatList,         // Efficient list rendering
  Alert,            // Popup alerts for user feedback
  ActivityIndicator,// Loading spinner
} from "react-native";

// Icons from react-native-vector-icons
import FontAwesome from "react-native-vector-icons/FontAwesome6";

// Backend endpoint for rides (Render-hosted)
const BACKEND_URL = "https://rydy-backend.onrender.com/api/rides"; // ✅ Your backend

// Functional component: BookRide screen (students view available rides & book)
const BookRide = () => {
  // Local state: list of rides fetched from backend
  const [rides, setRides] = useState([]);
  // Local state: loading indicator while fetching rides
  const [loading, setLoading] = useState(false);

  // ---------- Fetch rides from backend ----------
  const fetchRides = async () => {
    setLoading(true); // show spinner while loading
    try {
      // GET request to fetch all rides
      const res = await fetch(BACKEND_URL);
      // Parse JSON response into JS object/array
      const data = await res.json();
      // Save rides into state (expected array)
      setRides(data);
    } catch (err) {
      // Log and alert on error (network/server)
      console.error("❌ Error fetching rides:", err);
      Alert.alert("Error", "Failed to fetch rides from the server.");
    } finally {
      // Always hide spinner when done or on error
      setLoading(false);
    }
  };

  // ---------- Book a ride (student action) ----------
  // rideId: id of ride to book
  const handleBookRide = async (rideId) => {
    try {
      // PATCH request to book a seat on the ride
      // NOTE: body currently sends a hardcoded studentName — replace with logged-in student's name later
      const res = await fetch(`${BACKEND_URL}/${rideId}/book`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: "Test Student" }),
      });

      // Parse response body
      const data = await res.json();

      // If booking succeeded (HTTP 2xx)
      if (res.ok) {
        Alert.alert("✅ Ride Booked", "You successfully booked this ride!");
        fetchRides(); // refresh the rides to update bookedSeats/bookedStudents
      } else {
        // Show backend error message if available
        Alert.alert("Error", data.message || "Could not book this ride.");
      }
    } catch (err) {
      // Handle network / unexpected errors
      console.error("❌ Booking error:", err);
      Alert.alert("Error", "Something went wrong while booking the ride.");
    }
  };

  // ---------- Lifecycle: fetch rides on component mount ----------
  useEffect(() => {
    fetchRides();
  }, []); // empty deps → runs once when component mounts

  // ---------- UI RENDER ----------
  return (
    <View style={styles.container}>
      {/* Header title */}
      <Text style={styles.headerTitle}>Available Rides</Text>

      {/* Conditional rendering:
          - show ActivityIndicator while loading
          - show message if no rides
          - otherwise render FlatList of rides */}
      {loading ? (
        <ActivityIndicator size="large" color="#6A1B9A" style={{ marginTop: 40 }} />
      ) : rides.length === 0 ? (
        <Text style={styles.noRidesText}>
          No rides available right now. Please check back later.
        </Text>
      ) : (
        <FlatList
          data={rides}                        // array of ride objects
          keyExtractor={(item) => item._id}   // unique key for each item
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.rideCard}>
              {/* Route display (From → To) */}
              <Text style={styles.rideRoute}>
                {item.routeFrom} ➜ {item.routeTo}
              </Text>

              {/* Time info (fallback if not provided) */}
              <Text style={styles.rideInfo}>🕒 {item.time}</Text>

              {/* Seats booked / total */}
              <Text style={styles.rideInfo}>
                🚗 {item.bookedSeats || 0}/{item.totalSeats} seats booked
              </Text>

              {/* Optional: list student names if any have booked */}
              {item.bookedStudents?.length > 0 && (
                <Text style={styles.studentsList}>
                  👥 {item.bookedStudents.join(", ")}
                </Text>
              )}

              {/* Book button:
                  - disabled & greyed out if ride is full
                  - otherwise active and calls handleBookRide */}
              <TouchableOpacity
                style={[
                  styles.bookButton,
                  item.bookedSeats >= item.totalSeats && { backgroundColor: "#bbb" },
                ]}
                disabled={item.bookedSeats >= item.totalSeats}
                onPress={() => handleBookRide(item._id)}
              >
                <Text style={styles.bookButtonText}>
                  {item.bookedSeats >= item.totalSeats ? "Full" : "Book Ride"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

// Export the component to be used in navigation
export default BookRide;

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f0ff", // app theme background
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#6A1B9A",
    textAlign: "center",
    marginBottom: 20,
  },
  noRidesText: {
    textAlign: "center",
    color: "#6A1B9A",
    marginTop: 40,
    fontSize: 16,
    fontWeight: "500",
  },
  rideCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  rideRoute: {
    color: "#333",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  rideInfo: {
    color: "#6A1B9A",
    fontSize: 14,
    marginBottom: 4,
  },
  studentsList: {
    color: "#555",
    fontSize: 13,
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
