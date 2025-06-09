import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
} 

from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../App';

import ChatPageComponent from './components/ChatPageComponent';
import CameraPageComponent from './components/CameraPageComponent';
import StoriesPageComponent from './components/StoriesPageComponent';
import BottomNavComponent from './components/BottomNavComponent';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const colors = {
  background: '#000000',
  surface: '#1c1c1e',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  accent: '#007AFF',
  border: '#38383a',
  success: '#30D158',
  error: '#FF6B6B',
};

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [currentPage, setCurrentPage] = useState(1); 
  const scrollViewRef = useRef<ScrollView>(null);

  console.log('🏠 HomeScreen Modular - currentPage:', currentPage, 'user:', user?.username);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: width, animated: false });
      }, 100);
    }
  }, []);

  const navigateToPage = (pageIndex: number) => {
    console.log('📱 Navegando a página:', pageIndex);
    setCurrentPage(pageIndex);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ 
        x: pageIndex * width, 
        animated: true 
      });
    }
  };

  const onScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const page = Math.round(scrollX / width);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handlePhotoResult = (photoUri: string) => {
    console.log('📸 Photo sélectionnée dans HomeScreen:', photoUri);
    navigation.navigate('FriendsSelection', { photoUri });
  };

  const handleTakePhotoFromStories = () => {
    // Navegar a la página de cámara al tocar "Ajouter à ma story"
    navigateToPage(1);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollContainer}
      >
        <ChatPageComponent 
          user={user} 
          onLogout={logout}
          colors={colors}
        />
        
        <CameraPageComponent 
          onPhotoResult={handlePhotoResult}
          colors={colors}
        />
        
        <StoriesPageComponent 
          onTakePhoto={handleTakePhotoFromStories}
          colors={colors}
        />
      </ScrollView>

      <BottomNavComponent 
        currentPage={currentPage} 
        onNavigate={navigateToPage}
        colors={colors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
});

export default HomeScreen;