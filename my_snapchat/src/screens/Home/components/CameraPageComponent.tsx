import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode,
} from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../../../App"; // Assure-toi que ce chemin est correct

const { width, height } = Dimensions.get("window");

// Typage correct avec TOUS les écrans du stack
type NavigationProp = StackNavigationProp<RootStackParamList>;
const CameraPageComponent: React.FC = () => {
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const lastTap = useRef<number>(0);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setCameraType((prev) => (prev === "back" ? "front" : "back"));
    }
    lastTap.current = now;
  };

  const takePicture = async () => {
    if (cameraRef.current && "takePictureAsync" in cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      navigation.navigate("FriendsSelection", {
        photoUri: photo.uri,
        cameraType,
      });
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate("FriendsSelection", {
        photoUri: result.assets[0].uri,
        cameraType,
      });
    }
  };

  const toggleFlash = () => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  };

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    Alert.alert("Permission refusée", "Veuillez autoriser la caméra.");
    return <View style={styles.container} />;
  }

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <View style={styles.wrapper} pointerEvents="box-none">
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={cameraType}
          flash={flash}
        />

        {/* Bouton paramètres */}
        <View style={styles.settingsButtonWrapper}>
          <Pressable
            onPress={() => navigation.navigate("EditProfileScreen")}
            style={styles.roundButton}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </Pressable>
        </View>

        <View style={styles.profileButton}>
          <Pressable
            onPress={() => navigation.navigate("ProfileScreen")}
            style={styles.roundButton}
          >
            <Ionicons name="person-outline" size={24} color="white" />
          </Pressable>
        </View>

        {/* Boutons à droite */}
        <View style={styles.rightControls} pointerEvents="box-none">
          <Pressable onPress={pickFromGallery} style={styles.roundButton}>
            <Ionicons name="image" size={24} color="white" />
          </Pressable>

          <Pressable onPress={toggleFlash} style={styles.roundButton}>
            <Ionicons
              name={flash === "off" ? "flash-off" : "flash"}
              size={24}
              color="white"
            />
          </Pressable>

          <Pressable
            onPress={() =>
              setCameraType((prev) => (prev === "back" ? "front" : "back"))
            }
            style={styles.roundButton}
          >
            <Ionicons name="camera-reverse" size={24} color="white" />
          </Pressable>
        </View>

        {/* Bouton capture */}
        <View style={styles.captureButtonWrapper}>
          <Pressable onPress={takePicture} style={styles.captureButton} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    width,
    height,
  },
  rightControls: {
    position: "absolute",
    right: 20,
    top: 350,
    gap: 20,
    alignItems: "center",
    zIndex: 10,
  },
  roundButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonWrapper: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    zIndex: 10,
  },
  profileButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
  settingsButtonWrapper: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
});

export default CameraPageComponent;
