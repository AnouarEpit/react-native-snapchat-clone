import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { CameraView, CameraType, FlashMode } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface CameraPageProps {
  onPhotoTaken: (photoUri: string) => void;
}

const CameraPage: React.FC<CameraPageProps> = ({ onPhotoTaken }) => {
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        Vibration.vibrate(50);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        console.log('Photo prise:', photo.uri);
        onPhotoTaken(photo.uri);
      } catch (error) {
        console.error('Erreur photo:', error);
      }
    }
  };

  const flipCamera = () => {
    Vibration.vibrate(30);
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    Vibration.vibrate(30);
    setFlashMode(current => (current === 'off' ? 'on' : 'off'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        flash={flashMode}
      />
      
      <SafeAreaView style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.topButton} onPress={toggleFlash}>
            <Ionicons 
              name={flashMode === 'on' ? "flash" : "flash-off"} 
              size={24} 
              color={flashMode === 'on' ? "#FFD700" : "#FFFFFF"} 
            />
          </Pressable>
          
          <Text style={styles.title}>MY_SNAPCHAT</Text>
          
          <Pressable style={styles.topButton} onPress={flipCamera}>
            <Ionicons name="camera-reverse" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Side Controls */}
        <View style={styles.sideControls}>
          <Pressable style={styles.sideButton}>
            <Ionicons name="happy" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.sideButton}>
            <Ionicons name="musical-notes" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.sideButton}>
            <Ionicons name="text" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Capture Button */}
        <View style={styles.captureContainer}>
          <Pressable style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureInner} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  
  // Side Controls
  sideControls: {
    position: 'absolute',
    right: 20,
    bottom: 150,
    gap: 20,
  },
  sideButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Capture
  captureContainer: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
});

export default CameraPage;