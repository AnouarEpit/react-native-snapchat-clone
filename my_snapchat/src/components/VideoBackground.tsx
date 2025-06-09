import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface VideoBackgroundProps {
  children?: React.ReactNode;
  overlayOpacity?: number;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  children, 
  overlayOpacity = 0.6 
}) => {
  console.log('VideoBackground avec vidéo réelle');

  const overlayColors: readonly [string, string, string, string] = [
    `rgba(10,14,39,${overlayOpacity * 0.8})`,
    `rgba(26,26,46,${overlayOpacity * 0.6})`,
    `rgba(22,33,62,${overlayOpacity * 0.4})`,
    `rgba(15,52,96,${overlayOpacity * 0.9})`,
  ];

  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/videos/VideoSnapHome.mp4')}
        style={styles.video}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
        onError={(error) => {
          console.error('Erreur vidéo:', error);
        }}
        onLoad={() => {
          console.log('Vidéo VideoSnapHome.mp4 chargée avec succès');
        }}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && !status.isPlaying && status.shouldPlay) {
            console.log('Vidéo en cours de chargement...');
          }
        }}
      />

      <View style={styles.decorativeElements}>
        <View style={[styles.floatingElement, styles.element1]} />
        <View style={[styles.floatingElement, styles.element2]} />
        <View style={[styles.floatingElement, styles.element3]} />
      </View>

      <LinearGradient
        colors={overlayColors}
        style={styles.overlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  floatingElement: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 50,
  },
  element1: {
    width: 120,
    height: 120,
    top: '20%',
    right: '10%',
    transform: [{ rotate: '45deg' }],
  },
  element2: {
    width: 80,
    height: 80,
    bottom: '30%',
    left: '15%',
    backgroundColor: 'rgba(102,126,234,0.05)',
    borderRadius: 40,
  },
  element3: {
    width: 60,
    height: 60,
    top: '60%',
    right: '20%',
    backgroundColor: 'rgba(118,75,162,0.06)',
    transform: [{ rotate: '30deg' }],
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 4,
  },
});

export default VideoBackground;