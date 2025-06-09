import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";

type NavigationProp = StackNavigationProp<RootStackParamList, "CameraPage">;

const EditProfileScreen: React.FC = () => {
  const [username, setUsername] = useState("john_doe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const handleSave = () => {
    if (!username || !email) {
      Alert.alert("Champs requis", "Veuillez remplir tout les champs.");
      return;
    }

    if (password && password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    Alert.alert("Succès", "Profil modifié localement !");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Modifier mon profil</Text>

        {/* Nom d'utilisateur */}
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {/* Email */}
        <Text style={styles.label}>Adresse email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Mot de passe */}
        <Text style={styles.label}>Nouveau mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Confirmation */}
        <Text style={styles.label}>Confirmer le mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Bouton enregistrer */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#667eea",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 25,
    gap: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
});

export default EditProfileScreen;
