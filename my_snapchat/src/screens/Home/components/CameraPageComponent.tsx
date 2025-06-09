import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

interface CameraPageComponentProps {
  onPhotoResult: (photoUri: string) => void;
  colors: any;
}

const CameraPageComponent: React.FC<CameraPageComponentProps> = ({ onPhotoResult, colors }) => {
  
  const handleTakePhoto = async () => {
    console.log('📸 Prendre une photo - demande de permissions');
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de votre permission pour accéder à la caméra');
      return;
    }

    // Options de l'image picker
    Alert.alert(
      "Prendre une photo",
      "Choisissez une option",
      [
        {
          text: "Caméra",
          onPress: () => openCamera()
        },
        {
          text: "Galerie", 
          onPress: () => openGallery()
        },
        {
          text: "Annuler",
          style: "cancel"
        }
      ]
    );
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) 
        {
        const photoUri = result.assets[0].uri;
        console.log('confirmacion:', photoUri);
        onPhotoResult(photoUri);
          
      }
    } 
    catch (error) {
      console.error('❌ Erreur caméra:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder à la caméra');
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        console.log('📸 Photo sélectionnée depuis galerie:', photoUri);
        onPhotoResult(photoUri);
      }
    } catch (error) {
      console.error('❌ Erreur galerie:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder à la galerie');
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.pageContent}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Caméra</Text>
        </View>

        <View style={styles.cameraContent}>
          {/* Grande icône caméra */}
          <View style={[styles.cameraIconContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="camera" size={120} color={colors.accent} />
          </View>

          <Text style={[styles.cameraTitle, { color: colors.text }]}>
            Prendre un Snap
          </Text>
          <Text style={[styles.cameraSubtitle, { color: colors.textSecondary }]}>
            Capture un moment et partage-le avec tes amis
          </Text>

          {/* Boutons d'action */}
          <View style={styles.cameraActions}>
            <Pressable 
              style={[styles.primaryButton, { backgroundColor: colors.accent }]} 
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={24} color={colors.text} />
              <Text style={[styles.primaryButtonText, { color: colors.text }]}>
                Prendre une photo
              </Text>
            </Pressable>

            <Pressable 
              style={[styles.secondaryButton, { backgroundColor: colors.surface }]} 
              onPress={openGallery}
            >
              <Ionicons name="images" size={20} color={colors.accent} />
              <Text style={[styles.secondaryButtonText, { color: colors.accent }]}>
                Choisir depuis la galerie
              </Text>
            </Pressable>
          </View>

          {/* Conseils */}
          <View style={[styles.tipsContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>💡 Conseils</Text>
            <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
              • Assure-toi d'avoir un bon éclairage
            </Text>
            <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
              • Centre ton sujet dans le cadre
            </Text>
            <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
              • Tiens ton téléphone stable
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: width,
    height: height,
  },
  pageContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cameraContent: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 25,
  },
  cameraIconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  cameraSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  cameraActions: {
    width: '100%',
    gap: 15,
    marginTop: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipsContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 18,
  },
});

export default CameraPageComponent;