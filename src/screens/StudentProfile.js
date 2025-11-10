import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import { launchImageLibrary } from "react-native-image-picker";

const BACKEND_BASE = "https://rydy-backend.onrender.com/api/students";

const StudentProfile = ({ navigation, route }) => {
  const studentId = route?.params?.studentId;
  const [student, setStudent] = useState(null);
  const [name, setName] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!studentId) {
      Alert.alert("Error", "No studentId provided. Please login again.");
      navigation.goBack();
      return;
    }
    fetchProfile();
  }, [studentId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_BASE}/${studentId}`);
      const text = await res.text();
      // try parse JSON, otherwise show raw text
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.error("Profile fetch returned non-JSON:", text);
        Alert.alert("Server error", text || "Unexpected response from server");
        setLoading(false);
        return;
      }
      setStudent(json);
      setName(json.name || "");
      if (json.idCardImage) {
        // if backend serves /uploads static, prefix with base URL if needed
        const url =
          json.idCardImage.startsWith("http") ||
          json.idCardImage.startsWith("data:")
            ? json.idCardImage
            : `https://rydy-backend.onrender.com/${json.idCardImage.replace(
                /^\//,
                ""
              )}`;
        setPhotoUri(url);
      } else {
        setPhotoUri(null);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      Alert.alert("Network error", "Could not fetch profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const onChoosePhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
      });
      const asset = result?.assets && result.assets[0];
      if (asset?.uri) {
        // preview local uri
        setPhotoUri(asset.uri);
        // save asset to state so we can send it on Save
        setStudent((s) => ({ ...s, __newPhoto: asset }));
      }
    } catch (err) {
      console.error("image picker", err);
    }
  };

  const onDeletePhoto = () => {
    Alert.alert("Delete Photo", "Are you sure you want to delete your photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await saveProfile({ deletePhoto: true, removePreview: true });
        },
      },
    ]);
  };

  // Generic save handler. options: { deletePhoto: boolean, removePreview: boolean }
  const saveProfile = async (options = {}) => {
    setSaving(true);
    try {
      const form = new FormData();

      if (options.deletePhoto) {
        // send a flag to backend to remove stored photo
        form.append("deletePhoto", "true");
      } else {
        // if user selected a new photo we attached to student.__newPhoto
        if (student?.__newPhoto?.uri) {
          const p = student.__newPhoto;
          const localUri = Platform.OS === "android" ? p.uri : p.uri.replace("file://", "");
          form.append("photo", {
            uri: localUri,
            name: p.fileName || `photo_${Date.now()}.jpg`,
            type: p.type || "image/jpeg",
          });
        }
      }

      // Only send name if changed
      if (name !== (student?.name || "")) {
        form.append("name", name);
      }

      const res = await fetch(`${BACKEND_BASE}/${studentId}`, {
        method: "PATCH",
        body: form,
        // DO NOT set Content-Type — fetch will set the multipart boundary automatically
      });

      // read text first so we can handle non-json errors safely
      const raw = await res.text();

      // try parse JSON, otherwise show raw HTML/text in an alert
      let json;
      try {
        json = JSON.parse(raw);
      } catch (e) {
        console.error("PATCH returned non-JSON:", raw);
        Alert.alert("Server error", raw || "Unexpected response from server");
        setSaving(false);
        return;
      }

      if (!res.ok) {
        const msg = json.message || JSON.stringify(json);
        Alert.alert("Failed", msg);
        setSaving(false);
        return;
      }

      // Success
      setStudent(json.student || json);
      setName((json.student && json.student.name) || name);
      // If we removed preview after delete
      if (options.removePreview) setPhotoUri(null);
      // Clear temporary __newPhoto field
      setStudent((s) => {
        if (!s) return s;
        const copy = { ...s };
        delete copy.__newPhoto;
        return copy;
      });

      Alert.alert("Success", json.message || "Profile updated");
    } catch (err) {
      console.error("Save profile error:", err);
      Alert.alert("Network error", "Could not save profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6A1B9A" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#f7f0ff" barStyle="dark-content" />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={22} color="#6A1B9A" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.avatarWrap}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <FontAwesome name="user" size={48} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.photoButtons}>
        <TouchableOpacity style={styles.changeBtn} onPress={onChoosePhoto}>
          <Text style={styles.changeBtnText}>Change Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={onDeletePhoto}>
          <Text style={styles.deleteBtnText}>Delete Photo</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <TouchableOpacity
        style={[styles.saveBtn, saving ? styles.disabledBtn : null]}
        onPress={() => saveProfile({})}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default StudentProfile;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 24,
    backgroundColor: "#f7f0ff",
    minHeight: "100%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: { fontSize: 20, color: "#6A1B9A", fontWeight: "800" },
  avatarWrap: { alignItems: "center", marginVertical: 8 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    backgroundColor: "#6A1B9A",
    alignItems: "center",
    justifyContent: "center",
  },
  photoButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 12,
  },
  changeBtn: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  changeBtnText: { color: "#fff", fontWeight: "700" },
  deleteBtn: {
    backgroundColor: "#c62828",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteBtnText: { color: "#fff", fontWeight: "700" },

  label: { color: "#6A1B9A", marginTop: 10, marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ead9ff",
  },
  saveBtn: {
    marginTop: 18,
    backgroundColor: "#6A1B9A",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
  disabledBtn: { opacity: 0.7 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
