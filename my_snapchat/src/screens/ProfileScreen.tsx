import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";

type NavigationProp = StackNavigationProp<RootStackParamList, "ProfileScreen">;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const user = {
    username: "arnaud_dev",
    email: "arnaud@example.com",
    date: "01/01/1990",
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Profil</Text>
      </View>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <Text style={styles.value}>{user.username}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Date de naissance</Text>
        <Text style={styles.value}>{user.date}</Text>
      </View>
      <Pressable
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfileScreen")}
      >
        <Ionicons name="create-outline" size={20} color="#fff" />
        <Text style={styles.editButtonText}>Modifier le profil</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    marginTop: 50,
    marginLeft: 20,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  infoContainer: {
    marginBottom: 40,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
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
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
