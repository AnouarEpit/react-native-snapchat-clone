import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

const CameraScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const requestPermissions = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return cameraPermission.granted && galleryPermission.granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const handleTakePhoto = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permisos requeridos',
          'Necesitamos acceso a la cámara para tomar fotos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        navigation.navigate('SendSnap', { imageUri });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permisos requeridos',
          'Necesitamos acceso a la galería para seleccionar fotos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        navigation.navigate('SendSnap', { imageUri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleShowOptions = () => {
    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        {
          text: 'Cámara',
          onPress: handleTakePhoto,
        },
        {
          text: 'Galería',
          onPress: handlePickFromGallery,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nuevo Snap</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Camera Preview */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>¡Cámara Lista!</Text>
          <Text style={styles.cameraSubtext}>
            Toca los botones para capturar o seleccionar
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.buttonRow}>
          <Button
            title="📱 Galería"
            onPress={handlePickFromGallery}
            variant="secondary"
            size="medium"
            style={styles.actionButton}
          />
          
          <TouchableOpacity style={styles.captureButton} onPress={handleShowOptions}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <Button
            title="📸 Cámara"
            onPress={handleTakePhoto}
            variant="secondary"
            size="medium"
            style={styles.actionButton}
          />
        </View>
        
        <Text style={styles.hint}>
          Toca el botón central para ver opciones rápidas
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.version}>ETAPA 7: Cámara Real ✨</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mediumGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  backIcon: {
    ...typography.title2,
    color: colors.white,
  },
  
  title: {
    ...typography.title3,
    color: colors.white,
    fontWeight: '600',
  },
  
  placeholder: {
    width: 40,
  },
  
  cameraContainer: {
    flex: 1,
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: colors.mediumGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
  },
  
  cameraIcon: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  
  cameraText: {
    ...typography.title3,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  
  cameraSubtext: {
    ...typography.callout,
    color: colors.grayText,
    textAlign: 'center',
  },
  
  controls: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  
  actionButton: {
    width: 80,
  },
  
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.snapchat,
  },
  
  hint: {
    ...typography.caption,
    color: colors.grayText,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  
  version: {
    ...typography.caption,
    color: colors.success,
  },
});

export default CameraScreen;