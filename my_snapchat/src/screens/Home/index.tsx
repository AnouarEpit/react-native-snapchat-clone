import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [currentView, setCurrentView] = useState<'menu' | 'camera' | 'chat'>('menu');

  console.log('HomeScreen renderizado - user:', user?.username);

  const handlePhotoTaken = () => {
    const mockPhotoUri = './assets/snapchat.png';
    console.log('Navigating to FriendsSelection with mock photo');
    navigation.navigate('FriendsSelection', { photoUri: mockPhotoUri });
  };

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <Text style={styles.title}>MY_SNAPCHAT</Text>
      <Text style={styles.subtitle}>Bienvenue {user?.username}!</Text>
      
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => setCurrentView('chat')}>
          <Text style={styles.buttonText}>💬 Chat</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={() => setCurrentView('camera')}>
          <Text style={styles.buttonText}>📷 Caméra</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={handlePhotoTaken}>
          <Text style={styles.buttonText}>🧪 Test Friends Selection</Text>
        </Pressable>
        
        <Pressable style={[styles.button, styles.logoutButton]} onPress={logout}>
          <Text style={[styles.buttonText, styles.logoutText]}>🚪 Déconnexion</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderChat = () => (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>💬 Chat</Text>
      <Text style={styles.pageContent}>Interface Chat - En développement</Text>
      <Pressable style={styles.backButton} onPress={() => setCurrentView('menu')}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </Pressable>
    </View>
  );

  const renderCamera = () => (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>📷 Caméra</Text>
      <Text style={styles.pageContent}>Interface Caméra - En développement</Text>
      <Pressable style={styles.backButton} onPress={() => setCurrentView('menu')}>
        <Text style={styles.backButtonText}>← Retour</Text>
      </Pressable>
    </View>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return renderChat();
      case 'camera':
        return renderCamera();
      default:
        return renderMenu();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        {renderCurrentView()}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  safeArea: {
    flex: 1,
  },
  
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,100,100,0.2)',
    borderColor: 'rgba(255,100,100,0.4)',
    marginTop: 20,
  },
  logoutText: {
    color: '#FF6B6B',
  },
  
  // Pages
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  pageContent: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;