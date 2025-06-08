import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useStoriesStore, UserStories, Story } from '../store/storiesStore';
import { colors, typography, spacing } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const StoriesViewerScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { userStories, initialStoryIndex = 0 }: { userStories: UserStories; initialStoryIndex: number } = route.params;
  
  const { markStoryAsViewed } = useStoriesStore();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const currentStory = userStories.stories[currentStoryIndex];
  const totalStories = userStories.stories.length;

  useEffect(() => {
    // Fade in al cargar
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!isPaused && currentStory) {
      // Marcar como vista
      markStoryAsViewed(currentStory.id, userStories.userId);
      
      // Progreso de 5 segundos por story
      const animation = Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      });

      animation.start(({ finished }) => {
        if (finished) {
          handleNextStory();
        }
      });

      return () => animation.stop();
    }
  }, [currentStoryIndex, isPaused]);

  const handleNextStory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      progressAnim.setValue(0);
    } else {
      // Fin de stories, volver
      navigation.goBack();
    }
  };

  const handlePrevStory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      progressAnim.setValue(0);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const storyTime = new Date(dateString);
    const diffHours = Math.floor((now.getTime() - storyTime.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace unos minutos';
    if (diffHours === 1) return 'Hace 1 hora';
    return `Hace ${diffHours}h`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      
      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        {userStories.stories.map((_, index) => (
          <View key={index} style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: index === currentStoryIndex 
                    ? progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      })
                    : index < currentStoryIndex ? '100%' : '0%',
                },
              ]}
            />
          </View>
        ))}
      </View>

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userStories.avatar}</Text>
          </View>
          <View>
            <Text style={styles.username}>{userStories.username}</Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(currentStory.createdAt)}</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Story Content */}
      <Animated.View style={[styles.storyContainer, { opacity: fadeAnim }]}>
        <Image source={{ uri: currentStory.image }} style={styles.storyImage} />
        
        {/* Touch Areas */}
        <View style={styles.touchAreas}>
          <TouchableOpacity 
            style={styles.leftTouch}
            onPress={handlePrevStory}
            onPressIn={handlePause}
            onPressOut={handleResume}
          />
          <TouchableOpacity 
            style={styles.rightTouch}
            onPress={handleNextStory}
            onPressIn={handlePause}
            onPressOut={handleResume}
          />
        </View>
      </Animated.View>

      {/* Story Counter */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.storyCounter}>
          {currentStoryIndex + 1} de {totalStories}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
    gap: 2,
    zIndex: 10,
  },
  
  progressBarBg: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 1,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    zIndex: 10,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.snapchat,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  
  avatarText: {
    ...typography.callout,
    color: colors.black,
    fontWeight: '700',
  },
  
  username: {
    ...typography.callout,
    color: colors.white,
    fontWeight: '600',
  },
  
  timeAgo: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  closeIcon: {
    ...typography.title1,
    color: colors.white,
    fontWeight: '300',
  },
  
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  
  storyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  touchAreas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  
  leftTouch: {
    flex: 1,
  },
  
  rightTouch: {
    flex: 1,
  },
  
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    zIndex: 10,
  },
  
  storyCounter: {
    ...typography.caption,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default StoriesViewerScreen;