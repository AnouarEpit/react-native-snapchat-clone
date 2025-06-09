import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";
import { useAuth } from "../contexts/AuthContext";

type NavigationProp = StackNavigationProp<RootStackParamList, "ProfileScreen">;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const formatDate = (input: string): string => {
    if (!input) return "Non renseignée";

    try {
      let dateObj;

      if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
        dateObj = new Date(input);
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
        const [day, month, year] = input.split("/");
        dateObj = new Date(`${year}-${month}-${day}`);
      }

      if (!dateObj || isNaN(dateObj.getTime())) return input;

      return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(dateObj);
    } catch {
      return input;
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.value}>Utilisateur non connecté</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      <View style={styles.profileHeader}>
        <Image
          source={{
            uri:
              user.profilePicture ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user.username),
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Date de naissance</Text>
        <Text style={styles.value}>{formatDate(user.date ?? "")}</Text>
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
    backgroundColor: "black",
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    zIndex: 10,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#38bdf8",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#cbd5e1",
  },
  infoSection: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
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
