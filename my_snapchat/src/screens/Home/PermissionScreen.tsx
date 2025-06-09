import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface PermissionScreenProps {
  loading?: boolean;
  onRequestPermission?: () => void;
}

const PermissionScreen: React.FC<PermissionScreenProps> = ({ 
  loading = false, 
  onRequestPermission 
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initialisation...</Text>
      </View>
    );
  }

  const gradientColors: readonly [string, string] = ['#667eea', '#764ba2'];

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.background}>
        <SafeAreaView style={styles.content}>
          <Ionicons name="camera-outline" size={80} color="#FFFFFF" />
          <Text style={styles.title}>MY_SNAPCHAT</Text>
          <Text style={styles.subtitle}>
            Autorise l'accès à la caméra pour capturer des snaps
          </Text>
          <Pressable style={styles.button} onPress={onRequestPermission}>
            <Text style={styles.buttonText}>Autoriser</Text>
          </Pressable>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default PermissionScreen;