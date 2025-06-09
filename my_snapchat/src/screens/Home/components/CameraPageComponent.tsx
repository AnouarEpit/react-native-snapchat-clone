import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  Pressable,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../../../App"; // ajuste selon ton chemin réel

const { width, height } = Dimensions.get("window");

type NavigationProp = StackNavigationProp<RootStackParamList, "CameraPage">;

const CameraPageComponent: React.FC = () => {
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const cameraRef = useRef<CameraView>(null);
  const lastTap = useRef<number>(0);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current && "takePictureAsync" in cameraRef.current) {
      // @ts-ignore until expo-camera provides proper CameraView ref typing
      const photo = await cameraRef.current.takePictureAsync();
      navigation.navigate("FriendsSelection", { photoUri: photo.uri });
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setCameraType((prev) => (prev === "back" ? "front" : "back"));
    }
    lastTap.current = now;
  };

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    Alert.alert("Accès refusé", "Autorisez l'accès à la caméra.");
    return <View style={styles.container} />;
  }

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <View style={styles.wrapper}>
        <CameraView ref={cameraRef} style={styles.camera} facing={cameraType} />

        {/* Switch caméra (en bas à droite) */}
        <View style={styles.switchWrapper}>
          <Pressable onPress={handleDoubleTap} style={styles.switchButton}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </Pressable>
        </View>

        {/* Bouton capture (au centre en bas) */}
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
    flex: 1,
    width,
    height,
  },
  switchWrapper: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 20,
  },
  switchButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonWrapper: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
});

export default CameraPageComponent;
