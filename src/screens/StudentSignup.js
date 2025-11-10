// src/screens/StudentSignup.js
import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, Platform, StyleSheet
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const BACKEND_BASE = "https://rydy-backend.onrender.com/api/students";

const StudentSignup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [idImage, setIdImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChooseImage = () => {
    Alert.alert("Upload ID Card", "Choose image from", [
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  const openCamera = async () => {
    const result = await launchCamera({ mediaType: "photo", quality: 0.8 });
    const asset = result.assets && result.assets[0];
    if (asset?.uri) setIdImage(asset);
  };
  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: "photo", quality: 0.8 });
    const asset = result.assets && result.assets[0];
    if (asset?.uri) setIdImage(asset);
  };

  const validateAndInit = async () => {
    if (!name.trim() || !universityId.trim() || !universityName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Validation", "Please fill all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Validation", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation", "Passwords do not match.");
      return;
    }
    if (!idImage) {
      Alert.alert("Validation", "Please upload your ID card.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("universityId", universityId);
      formData.append("universityName", universityName);
      formData.append("password", password);
      formData.append("email", email);
      formData.append("idCard", {
        uri: Platform.OS === "android" ? idImage.uri : idImage.uri.replace("file://", ""),
        name: idImage.fileName || `id_${Date.now()}.jpg`,
        type: idImage.type || "image/jpeg",
      });

      const res = await fetch(`${BACKEND_BASE}/signup-init`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      setLoading(false);

      if (!res.ok) {
        Alert.alert("Signup Init Failed", json.message || "Something went wrong");
        return;
      }

      Alert.alert("OTP Sent", `Verification code was sent to ${email}`);
      navigation.navigate("StudentOtp", { tempId: json.tempId, email });
    } catch (err) {
      setLoading(false);
      console.error("Network error:", err);
      Alert.alert("Network Error", "Could not reach server. Try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Image source={require("../../assets/rydy_logo.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Student Sign Up</Text>
      <Text style={styles.subtitle}>We will send an OTP to verify your email</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="John Doe" placeholderTextColor="#a68bc6" />

        <Text style={[styles.label, { marginTop: 12 }]}>University ID</Text>
        <TextInput style={styles.input} value={universityId} onChangeText={setUniversityId} placeholder="2021-ABC-123" placeholderTextColor="#a68bc6" />

        <Text style={[styles.label, { marginTop: 12 }]}>University Name</Text>
        <TextInput style={styles.input} value={universityName} onChangeText={setUniversityName} placeholder="University" placeholderTextColor="#a68bc6" />

        <Text style={[styles.label, { marginTop: 12 }]}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#a68bc6" />

        <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
        <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} placeholder="Enter password" placeholderTextColor="#a68bc6" />

        <Text style={[styles.label, { marginTop: 12 }]}>Confirm Password</Text>
        <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" placeholderTextColor="#a68bc6" />

        <Text style={[styles.label, { marginTop: 12 }]}>ID Card Picture</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={onChooseImage}>
          {idImage ? <Image source={{ uri: idImage.uri }} style={styles.idPreview} resizeMode="cover" /> : <Text style={styles.uploadText}>Tap to upload ID card (front)</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={validateAndInit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Send OTP & Continue</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default StudentSignup;

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40, backgroundColor: "#f7f0ff" },
  logo: { width: 120, height: 120, marginTop: 8, marginBottom: 6 },
  title: { color: "#6A1B9A", fontSize: 22, fontWeight: "800", marginTop: 6 },
  subtitle: { color: "#6A1B9A", fontSize: 13, marginTop: 6, marginBottom: 12, textAlign: "center" },
  form: { width: "100%", marginTop: 6 },
  label: { color: "#6A1B9A", fontSize: 13, marginLeft: 4, fontWeight: "600" },
  input: { backgroundColor: "#fff", borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, fontSize: 16, color: "#333", borderWidth: 1, borderColor: "#ead9ff", marginTop: 6 },
  uploadBox: { height: 140, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: "#d7bff5", alignItems: "center", justifyContent: "center", marginTop: 8, overflow: "hidden", backgroundColor: "#fff" },
  uploadText: { color: "#6A1B9A", textAlign: "center", paddingHorizontal: 8 },
  idPreview: { width: "100%", height: "100%" },
  submitButton: { backgroundColor: "#6A1B9A", paddingVertical: 14, borderRadius: 30, marginTop: 20, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
