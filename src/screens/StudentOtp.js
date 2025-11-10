// src/screens/StudentOtp.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";

const BACKEND = "https://rydy-backend.onrender.com/api/students";

const StudentOtp = ({ navigation, route }) => {
  const { studentId, email } = route.params || {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  if (!studentId) {
    return <View style={styles.container}><Text>Missing studentId</Text></View>;
  }

  const verifyOtp = async () => {
    if (!otp.trim()) { Alert.alert("Validation", "Please enter the OTP"); return; }
    setLoading(true);
    try {
      const resp = await fetch(`${BACKEND}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, otp }),
      });
      const json = await resp.json();
      setLoading(false);
      if (!resp.ok) return Alert.alert("Verify failed", json.message || "Invalid OTP");
      Alert.alert("Verified", "Email verified successfully. Please login.", [{ text: "OK", onPress: () => navigation.replace("StudentLogin") }]);
    } catch (err) {
      setLoading(false);
      console.error("Verify error:", err);
      Alert.alert("Error", "Network error verifying OTP");
    }
  };

  const resendOtp = async () => {
    setResendLoading(true);
    try {
      const resp = await fetch(`${BACKEND}/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const json = await resp.json();
      setResendLoading(false);
      if (!resp.ok) return Alert.alert("Resend failed", json.message || "Could not resend OTP");
      Alert.alert("OTP Sent", `OTP resent to ${email || "your email"}`);
    } catch (err) {
      setResendLoading(false);
      console.error("Resend error:", err);
      Alert.alert("Error", "Network error resending OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>We sent a 6-digit code to {email}</Text>

      <TextInput value={otp} onChangeText={setOtp} placeholder="Enter OTP" keyboardType="numeric" style={styles.input} maxLength={6} />

      <TouchableOpacity style={styles.btn} onPress={verifyOtp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify OTP</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={resendOtp} disabled={resendLoading}>
        {resendLoading ? <ActivityIndicator /> : <Text style={styles.linkText}>Resend OTP</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.smallLink} onPress={() => navigation.replace("StudentLogin")}>
        <Text style={{ color: "#6A1B9A" }}>Back to login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudentOtp;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f0ff", padding: 24, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "800", color: "#6A1B9A", marginBottom: 8 },
  subtitle: { color: "#6A1B9A", marginBottom: 18, textAlign: "center" },
  input: { width: "80%", backgroundColor: "#fff", borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#ead9ff", marginBottom: 12, textAlign: "center" },
  btn: { width: "80%", backgroundColor: "#6A1B9A", padding: 12, borderRadius: 20, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  link: { marginTop: 12 },
  linkText: { color: "#6A1B9A", fontWeight: "700" },
  smallLink: { marginTop: 18 },
});
