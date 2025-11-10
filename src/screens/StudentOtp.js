// src/screens/StudentOtp.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";

const BACKEND_BASE = "https://rydy-backend.onrender.com/api/students";

const StudentOtp = ({ navigation, route }) => {
  const { tempId, email } = route.params || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const verifyOtp = async () => {
    if (!otp.trim()) return Alert.alert("Validation", "Please enter OTP");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_BASE}/signup/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempId, otp }),
      });
      const json = await res.json();
      setLoading(false);
      if (!res.ok) {
        return Alert.alert("Verification Failed", json.message || "Invalid OTP");
      }
      Alert.alert("Success", "Email verified. Signup complete — please wait for admin approval.", [
        { text: "OK", onPress: () => navigation.replace("StudentLogin") },
      ]);
    } catch (err) {
      setLoading(false);
      console.error("Verify error:", err);
      Alert.alert("Network Error", "Unable to verify OTP. Try again.");
    }
  };

  const resendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await fetch(`${BACKEND_BASE}/signup/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempId }),
      });
      const json = await res.json();
      setResendLoading(false);
      if (!res.ok) {
        return Alert.alert("Resend Failed", json.message || "Could not resend OTP");
      }
      Alert.alert("OTP Resent", `New OTP sent to ${email}`);
    } catch (err) {
      setResendLoading(false);
      console.error("Resend error:", err);
      Alert.alert("Network Error", "Unable to resend OTP. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>

      <TextInput value={otp} onChangeText={setOtp} placeholder="123456" keyboardType="numeric" style={styles.input} />

      <TouchableOpacity style={styles.verifyBtn} onPress={verifyOtp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.verifyText}>Verify & Finish</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendBtn} onPress={resendOtp} disabled={resendLoading}>
        {resendLoading ? <ActivityIndicator color="#6A1B9A" /> : <Text style={styles.resendText}>Resend OTP</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default StudentOtp;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7f0ff", justifyContent: "center" },
  title: { fontSize: 20, color: "#6A1B9A", fontWeight: "800", marginBottom: 8 },
  subtitle: { color: "#6A1B9A", marginBottom: 20 },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#ead9ff", marginBottom: 16 },
  verifyBtn: { backgroundColor: "#6A1B9A", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  verifyText: { color: "#fff", fontWeight: "700" },
  resendBtn: { marginTop: 12, alignItems: "center" },
  resendText: { color: "#6A1B9A", fontWeight: "700" },
});
