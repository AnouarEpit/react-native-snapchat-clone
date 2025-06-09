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
  const { photoUri } = route.params;

  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [duration, setDuration] = useState(3);
  const [isSending, setIsSending] = useState(false);

  const gradientColors: readonly [string, string] = ["#667eea", "#764ba2"];

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    setIsLoading(true);
    try {
      console.log(" Chargement des amis...");

      const response = await ApiService.getFriends();

      console.log(" Réponse API getFriends:", response);

      if (response.success && response.data) {
        let friendsArray: Friend[] = [];

        if (Array.isArray(response.data)) {
          friendsArray = response.data as Friend[];
        } else if (response.data && typeof response.data === "object") {
          const responseObj = response.data as any;

          if (Array.isArray(responseObj.friends)) {
            friendsArray = responseObj.friends as Friend[];
          } else if (Array.isArray(responseObj.data)) {
            friendsArray = responseObj.data as Friend[];
          } else {
            console.warn(
              "⚠️ Structure de response.data inattendue:",
              response.data
            );
            friendsArray = [];
          }
        }

        console.log("Amis chargés:", friendsArray.length, "amis trouvés");
        setFriends(friendsArray);
      } else {
        console.log("⚠️ Aucun ami trouvé ou erreur API");
        setFriends([]);
      }
    } catch (error) {
      console.error("❌ Erreur chargement amis:", error);
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSnap = async () => {
    if (!selectedFriend) {
      Alert.alert("Erreur", "Veuillez sélectionner un ami");
      return;
    }

    setIsSending(true);
    try {
      console.log(" Envoi du snap...", {
        selectedFriend,
        duration,
        photoUri: photoUri.substring(0, 50) + "...",
      });

      const formData = new FormData();
      formData.append("to", selectedFriend);
      formData.append("duration", duration.toString());
      formData.append("image", {
        uri: photoUri,
        type: "image/jpeg",
        name: "snap.jpg",
      } as any);

      const response = await ApiService.sendSnap(formData);

      if (response.success) {
        Alert.alert("Succès", "Snap envoyé avec succès !", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home"),
          },
        ]);
      } else {
        Alert.alert("Erreur", response.message || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error(" Erreur envoi snap:", error);
      Alert.alert("Erreur", "Erreur lors de l'envoi du snap");
    } finally {
      setIsSending(false);
    }
  };

  const filteredFriends: Friend[] = Array.isArray(friends)
    ? friends.filter(
        (friend: Friend) =>
          friend.username &&
          friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const renderFriend = (friend: Friend) => (
    <Pressable
      key={friend.id}
      style={[
        styles.friendItem,
        selectedFriend === friend.id && styles.friendItemSelected,
      ]}
      onPress={() => setSelectedFriend(friend.id)}
    >
      <View
        style={[
          styles.friendAvatar,
          selectedFriend === friend.id && styles.friendAvatarSelected,
        ]}
      >
        <Text style={styles.friendAvatarText}>
          {friend.username?.charAt(0).toUpperCase() || "?"}
        </Text>
      </View>
      <Text
        style={[
          styles.friendName,
          selectedFriend === friend.id && styles.friendNameSelected,
        ]}
      >
        {friend.username || "Nom inconnu"}
      </Text>
      {selectedFriend === friend.id && (
        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
      )}
    </Pressable>
  );

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
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          </View>

          <View style={styles.searchContainer}>
            <BlurView intensity={20} style={styles.searchBlur}>
              <Ionicons name="search" size={16} color="rgba(255,255,255,0.7)" />

              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un ami"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </BlurView>
          </View>

          <View style={styles.friendsSection}>
            <Text style={styles.sectionTitle}>
              {isLoading
                ? "Chargement..."
                : `Mes amis (${filteredFriends.length})`}
            </Text>

            {isLoading ? (
              <ActivityIndicator
                size="large"
                color="#FFFFFF"
                style={styles.loader}
              />
            ) : filteredFriends.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="people-outline"
                  size={48}
                  color="rgba(255,255,255,0.5)"
                />
                <Text style={styles.emptyText}>
                  {searchQuery ? "Aucun ami trouvé" : "Aucun ami ajouté"}
                </Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery
                    ? "Essayez un autre nom"
                    : "Ajoutez des amis pour envoyer des snaps"}
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.friendsList}
                showsVerticalScrollIndicator={false}
              >
                {filteredFriends.map(renderFriend)}
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
              {renderDurationOption(15, "15s")}
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
                  <Text style={styles.sendButtonText}>Envoyer</Text>
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
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

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
  placeholder: {
    width: 40,
  },

  photoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  photoPreview: {
    width: 120,
    height: 160,
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

  friendsSection: {
    flex: 1,
    marginBottom: 20,
  },
  loader: {
    marginTop: 30,
  },
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
  friendsList: {
    paddingHorizontal: 20,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    gap: 12,
  },
  friendItemSelected: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  friendAvatarSelected: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  friendAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  friendName: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  friendNameSelected: {
    fontWeight: "700",
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
