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
import OptimizedInput from "../components/OptimizedInput";

type NavigationProp = StackNavigationProp<RootStackParamList, "CameraPage">;

const EditProfileScreen: React.FC = () => {
  const [username, setUsername] = useState("Anouar");
  const [email, setEmail] = useState("arnaud@gmail.com");
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

    Alert.alert("Succès", "Profil modifié !");
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
        <OptimizedInput
          onChangeText={setUsername}
          placeholder="Nom d'utilisateur"
          value={username}
          autoCapitalize="none"
          icon="person-outline"
          testID="username-input"
        />

        {/* Email */}
        <Text style={styles.label}>Adresse email</Text>
        <OptimizedInput
          onChangeText={setEmail}
          placeholder="Adresse email"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="mail-outline"
          testID="email-input"
        />
        <Text style={styles.label}>Nouveau mot de passe</Text>
        <OptimizedInput
          onChangeText={setPassword}
          placeholder="Nouveau mot de passe"
          value={password}
          secureTextEntry={true}
          icon="lock-closed-outline"
          showEye={true}
          autoComplete="password"
          testID="password-input"
        />

        {/* Confirmation */}
        <Text style={styles.label}>Confirmer le mot de passe</Text>
        <OptimizedInput
          onChangeText={setConfirmPassword}
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          secureTextEntry={true}
          icon="lock-closed-outline"
          showEye={true}
          autoComplete="password"
          testID="confirm-password-input"
        />

        {/* Bouton enregistrer */}
        <Pressable style={styles.editButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Enregistrer</Text>
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
  editButton: {
    flexDirection: "row",
    backgroundColor: "#667eea",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
