import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";
import OptimizedInput from "../components/OptimizedInput";
import { useAuth } from "../contexts/AuthContext";
import { ApiService } from "../services/ApiService";

type NavigationProp = StackNavigationProp<RootStackParamList, "EditProfileScreen">;

const EditProfileScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();

  // Cargar datos actuales del usuario
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const validateForm = () => {
    if (!username.trim()) {
      Alert.alert("Erreur", "Le nom d'utilisateur est requis");
      return false;
    }
    if (username.length < 3) {
      Alert.alert("Erreur", "Le nom d'utilisateur doit faire au moins 3 caractères");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Alert.alert("Erreur", "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et _");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Erreur", "L'email est requis");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Erreur", "Email invalide");
      return false;
    }
    if (password && password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit faire au moins 6 caractères");
      return false;
    }
    if (password && password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log("💾 Mise à jour du profil...");
      
      const updateData: any = {
        username: username.trim(),
        email: email.trim(),
      };
      
      if (password.trim()) {
        updateData.password = password;
      }
      
      const response = await ApiService.updateUser(updateData);
      
      if (response.success) {
        Alert.alert(
          "Succès", 
          "Profil mis à jour avec succès ! Les changements seront visibles au prochain démarrage de l'application.", 
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
        console.log("✅ Profil mis à jour avec succès");
      } else {
        Alert.alert("Erreur", response.message || "Erreur lors de la mise à jour");
        console.error("❌ Erreur mise à jour:", response.message);
      }
    } catch (error: any) {
      console.error("❌ Erreur dans handleSave:", error);
      Alert.alert("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "⚠️ ATTENTION ⚠️\n\nCette action est irréversible. Votre compte et tous vos snaps seront définitivement supprimés.\n\nÊtes-vous absolument sûr de vouloir continuer ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "SUPPRIMER",
          style: "destructive",
          onPress: () => confirmDeleteAccount()
        }
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Dernière confirmation",
      "Tapez 'SUPPRIMER' pour confirmer la suppression définitive de votre compte.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Continuer",
          style: "destructive",
          onPress: () => executeDeleteAccount()
        }
      ]
    );
  };

  const executeDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      console.log("🗑️ Suppression du compte...");
      
      const response = await ApiService.deleteUser();
      
      if (response.success) {
        Alert.alert(
          "Compte supprimé", 
          "Votre compte a été supprimé avec succès. Vous allez être déconnecté.",
          [
            {
              text: "OK",
              onPress: async () => {
                await logout();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                });
              }
            }
          ]
        );
      } else {
        Alert.alert("Erreur", response.message || "Erreur lors de la suppression");
      }
    } catch (error: any) {
      console.error("❌ Erreur suppression compte:", error);
      Alert.alert("Erreur", "Erreur lors de la suppression du compte");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </Pressable>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Modifier mon profil</Text>

        {/* Section Informations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <Text style={styles.label}>Nom d'utilisateur</Text>
          <OptimizedInput
            onChangeText={setUsername}
            placeholder="Nom d'utilisateur"
            value={username}
            autoCapitalize="none"
            icon="person-outline"
            testID="username-input"
          />

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
        </View>

        {/* Section Mot de passe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changer le mot de passe</Text>
          
          <Text style={styles.label}>Nouveau mot de passe (optionnel)</Text>
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

          {password.length > 0 && (
            <>
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
            </>
          )}
        </View>

        {/* Bouton enregistrer */}
        <Pressable 
          style={[styles.saveButton, isLoading && styles.buttonDisabled]} 
          onPress={handleSave}
          disabled={isLoading || isDeleting}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="save-outline" size={20} color="#fff" />
          )}
          <Text style={styles.saveButtonText}>
            {isLoading ? "Sauvegarde..." : "Enregistrer les modifications"}
          </Text>
        </Pressable>

        {/* Zone dangereuse */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>⚠️ Zone dangereuse</Text>
          <Text style={styles.dangerDescription}>
            Les actions ci-dessous sont irréversibles
          </Text>
          
          <Pressable 
            style={[styles.deleteButton, isDeleting && styles.buttonDisabled]}
            onPress={handleDeleteAccount}
            disabled={isLoading || isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="trash-outline" size={20} color="#fff" />
            )}
            <Text style={styles.deleteButtonText}>
              {isDeleting ? "Suppression..." : "Supprimer mon compte"}
            </Text>
          </Pressable>
        </View>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dangerZone: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  dangerTitle: {
    color: "#FF3B30",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dangerDescription: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  deleteButtonText: {
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