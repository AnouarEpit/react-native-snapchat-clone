import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Dimensions,
  Vibration,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface BottomNavBarProps {
  currentPage: number;
  onNavigate: (pageIndex: number) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, onNavigate }) => {
  const indicatorPosition = useSharedValue(currentPage);

  useEffect(() => {
    indicatorPosition.value = withSpring(currentPage, {
      damping: 20,
      stiffness: 150,
    });
  }, [currentPage]);

  const handleNavigate = (pageIndex: number) => {
    if (pageIndex !== currentPage) {
      Vibration.vibrate(30);
      onNavigate(pageIndex);
    }
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      indicatorPosition.value,
      [0, 1, 2],
      [0, width / 3, (width * 2) / 3]
    );

    return {
      transform: [{ translateX }],
    };
  });

  const getButtonStyle = (pageIndex: number) => {
    return useAnimatedStyle(() => {
      const isActive = currentPage === pageIndex;
      const scale = isActive ? 1.1 : 1;
      const opacity = isActive ? 1 : 0.7;

      return {
        transform: [{ scale: withSpring(scale) }],
        opacity: withSpring(opacity),
      };
    });
  };

  const navItems = [
    {
      index: 0,
      icon: 'chatbubbles' as keyof typeof Ionicons.glyphMap,
      label: 'Chat',
      activeColor: '#667eea',
    },
    {
      index: 1,
      icon: 'camera' as keyof typeof Ionicons.glyphMap,
      label: 'Caméra',
      activeColor: '#FFFFFF',
    },
    {
      index: 2,
      icon: 'library' as keyof typeof Ionicons.glyphMap,
      label: 'Stories',
      activeColor: '#764ba2',
    },
  ];

  return (
    <View style={styles.container}>
      <BlurView intensity={80} style={styles.navContainer}>
        {/* Indicator Background */}
        <Animated.View style={[styles.indicator, indicatorStyle]} />
        
        {/* Navigation Items */}
        {navItems.map((item) => (
          <Pressable
            key={item.index}
            style={styles.navItem}
            onPress={() => handleNavigate(item.index)}
          >
            <Animated.View style={[styles.navButton, getButtonStyle(item.index)]}>
              <Ionicons
                name={item.icon}
                size={currentPage === item.index ? 24 : 20}
                color={currentPage === item.index ? item.activeColor : 'rgba(255,255,255,0.6)'}
              />
              {currentPage === item.index && (
                <Animated.Text style={[styles.navLabel, { color: item.activeColor }]}>
                  {item.label}
                </Animated.Text>
              )}
            </Animated.View>
          </Pressable>
        ))}
      </BlurView>

      {/* Camera Quick Access (when not on camera page) */}
      {currentPage !== 1 && (
        <Pressable 
          style={styles.quickCameraButton}
          onPress={() => handleNavigate(1)}
        >
          <View style={styles.quickCameraInner}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 34, // Safe area for iPhone
  },
  navContainer: {
    flexDirection: 'row',
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: width / 3 - 16,
    height: 54,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  
  // Quick Camera Access
  quickCameraButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickCameraInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomNavBar;