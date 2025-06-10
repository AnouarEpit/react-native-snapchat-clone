import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../App";
import { ApiService } from "../services/ApiService";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

type FriendsSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "FriendsSelection"
>;
type FriendsSelectionScreenRouteProp = RouteProp<
  RootStackParamList,
  "FriendsSelection"
>;

interface Friend {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

const FriendsSelectionScreen: React.FC = () => {
  const navigation = useNavigation<FriendsSelectionScreenNavigationProp>();
  const route = useRoute<FriendsSelectionScreenRouteProp>();
  const { photoUri, cameraType } = route.params;
  const { user } = useAuth();

  const [allUsers, setAllUsers] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [duration, setDuration] = useState(3);
  const [isSending, setIsSending] = useState(false);

  const gradientColors: readonly [string, string] = ["#667eea", "#764ba2"];

  // Mock users pour compléter si nécessaire
  const mockUsers: Friend[] = [
    { id: "test_alice", username: "alice_test", email: "alice@test.com" },
    { id: "test_bob", username: "bob_test", email: "bob@test.com" },
    { id: "test_charlie", username: "charlie_test", email: "charlie@test.com" },
  ];

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    setIsLoading(true);
    try {
      console.log("👥 Chargement de tous les utilisateurs...");

      // Essayer de récupérer tous les utilisateurs
      const response = await ApiService.getAllUsers();
      
      if (response.success && response.data && Array.isArray(response.data)) {
        let realUsers = response.data;
        
        // Filtrer l'utilisateur actuel (pas d'auto-envoi)
        realUsers = realUsers.filter((u: Friend) => 
          u.id !== user?.id && 
          u.username !== user?.username && 
          u.email !== user?.email
        );

        console.log("✅ Utilisateurs réels trouvés:", realUsers.length);
        
        // Combiner avec mock si nécessaire
        const allAvailableUsers = realUsers.length > 0 
          ? [...realUsers, ...mockUsers]
          : mockUsers;
        
        setAllUsers(allAvailableUsers);
      } else {
        console.log("⚠️ Pas d'utilisateurs réels, utilisation mock uniquement");
        setAllUsers(mockUsers);
      }
    } catch (error) {
      console.error("❌ Erreur chargement utilisateurs:", error);
      // En cas d'erreur, utiliser mock users
      setAllUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSnap = async () => {
    if (!selectedFriend) {
      Alert.alert("Erreur", "Veuillez sélectionner un destinataire");
      return;
    }

    const selectedUser = allUsers.find(u => u.id === selectedFriend);
    if (!selectedUser) return;

    setIsSending(true);
    try {
      console.log("📸 Envoi du snap à:", selectedUser.username);

      // Usar el nuevo método que sigue la documentación
      const snapData = {
        to: selectedUser.id, // ✅ Usar ID, no username
        duration: duration,
        imageUri: photoUri
      };

      console.log('📤 Snap data (format API):', {
        to: selectedUser.id,
        username: selectedUser.username, // Solo para debug
        duration: duration
      });

      const response = await ApiService.sendSnap(snapData);

      if (response.success) {
        Alert.alert(
          "Succès", 
          `Snap envoyé à ${selectedUser.username} pour ${duration} secondes !`, 
          [{ text: "OK", onPress: () => navigation.navigate("Home") }]
        );
      } else {
        Alert.alert("Erreur", response.message || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("❌ Erreur envoi snap:", error);
      Alert.alert("Erreur", "Erreur lors de l'envoi du snap");
    } finally {
      setIsSending(false);
    }
  };

  // Filtrer utilisateurs selon recherche
  const filteredUsers = allUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUser = (userData: Friend) => {
    const isRealUser = !userData.id.startsWith('test_');
    
    return (
      <Pressable
        key={userData.id}
        style={[
          styles.userItem,
          selectedFriend === userData.id && styles.userItemSelected,
        ]}
        onPress={() => setSelectedFriend(userData.id)}
      >
        <View
          style={[
            styles.userAvatar,
            { backgroundColor: isRealUser ? "#4CAF50" : "#FF9800" },
            selectedFriend === userData.id && styles.userAvatarSelected,
          ]}
        >
          <Text style={styles.userAvatarText}>
            {userData.username?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text
            style={[
              styles.userName,
              selectedFriend === userData.id && styles.userNameSelected,
            ]}
          >
            {userData.username}
          </Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={[styles.userType, { color: isRealUser ? "#4CAF50" : "#FF9800" }]}>
            {isRealUser ? "👤 Utilisateur réel" : "🎭 Test"}
          </Text>
        </View>
        
        {selectedFriend === userData.id && (
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
        )}
      </Pressable>
    );
  };

  const renderDurationOption = (value: number, label: string) => (
    <Pressable
      key={value}
      style={[
        styles.durationOption,
        duration === value && styles.durationOptionSelected,
      ]}
      onPress={() => setDuration(value)}
    >
      <Text
        style={[
          styles.durationText,
          duration === value && styles.durationTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Envoyer à</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.photoContainer}>
            <Image
              source={{ uri: photoUri }}
              style={[
                styles.photoPreview,
                cameraType === "front" && { transform: [{ scaleX: -1 }] },
              ]}
            />
          </View>

          <View style={styles.searchContainer}>
            <BlurView intensity={20} style={styles.searchBlur}>
              <Ionicons name="search" size={16} color="rgba(255,255,255,0.7)" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un utilisateur"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </BlurView>
          </View>

          <View style={styles.usersSection}>
            <Text style={styles.sectionTitle}>
              Utilisateurs disponibles ({filteredUsers.length})
            </Text>

            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="#FFFFFF"
                style={styles.loader}
              />
            ) : filteredUsers.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="people-outline"
                  size={48}
                  color="rgba(255,255,255,0.5)"
                />
                <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
                <Text style={styles.emptySubtext}>
                  Essayez un autre terme de recherche
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.usersList}
                showsVerticalScrollIndicator={false}
              >
                {filteredUsers.map(renderUser)}
              </ScrollView>
            )}
          </View>

          {/* Duration Selection */}
          <View style={styles.durationSection}>
            <Text style={styles.sectionTitle}>Durée d'affichage</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.durationList}
              contentContainerStyle={styles.durationContent}
            >
              {renderDurationOption(1, "1s")}
              {renderDurationOption(3, "3s")}
              {renderDurationOption(5, "5s")}
              {renderDurationOption(10, "10s")}
            </ScrollView>
          </View>

          {/* Send Button */}
          <View style={styles.sendContainer}>
            <Pressable
              style={[
                styles.sendButton,
                (!selectedFriend || isSending) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendSnap}
              disabled={!selectedFriend || isSending}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#667eea" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#667eea" />
                  <Text style={styles.sendButtonText}>Envoyer Snap</Text>
                </>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  placeholder: { width: 40 },
  photoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  photoPreview: {
    width: 180,
    height: 240,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBlur: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  usersSection: {
    flex: 1,
    marginBottom: 20,
  },
  loader: { marginTop: 30 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  emptySubtext: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    textAlign: "center",
  },
  usersList: {
    paddingHorizontal: 20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    gap: 12,
  },
  userItemSelected: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarSelected: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  userNameSelected: {
    fontWeight: "700",
  },
  userEmail: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 2,
  },
  userType: {
    fontSize: 11,
    fontWeight: "500",
  },
  durationSection: {
    marginBottom: 25,
  },
  durationList: {
    paddingLeft: 20,
  },
  durationContent: {
    paddingRight: 20,
  },
  durationOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginRight: 12,
    minWidth: 50,
    alignItems: "center",
  },
  durationOptionSelected: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  durationTextSelected: {
    color: "#667eea",
  },
  sendContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  sendButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default FriendsSelectionScreen;