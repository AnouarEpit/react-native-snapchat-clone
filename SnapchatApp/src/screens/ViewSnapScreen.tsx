import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSnapStore } from '../store/snapStore';
import { colors, typography, spacing } from '../utils/theme';
import { Snap } from '../types';

const { width, height } = Dimensions.get('window');

const ViewSnapScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { snap }: { snap: Snap } = route.params;
  
  const { markSnapAsViewed, removeSnap } = useSnapStore();
  const [timeLeft, setTimeLeft] = useState<number>(snap.duration);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    // Marcar como visto al abrir
    markSnapAsViewed(snap.id);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            // Tiempo agotado - eliminar snap y volver
            removeSnap(snap.id);
            navigation.goBack();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleImagePress = () => {
    if (!isActive) {
      setIsActive(true);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const progressPercentage = ((snap.duration - timeLeft) / snap.duration) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      
      {/* Header con timer */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.timerContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.timerText}>
            {isActive ? `${timeLeft}s` : 'Tap to view'}
          </Text>
        </View>
        
        <Text style={styles.fromText}>de {snap.from}</Text>
      </View>

      {/* Imagen del snap */}
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={handleImagePress}
        disabled={isActive}
      >
        {isActive ? (
          <Image source={{ uri: snap.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>👻</Text>
            <Text style={styles.placeholderText}>Tap to view snap</Text>
            <Text style={styles.placeholderSubtext}>
              from {snap.from} • {snap.duration}s
            </Text>
          </View>
        )}
        
        {isActive && (
          <View style={styles.overlay}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerCircleText}>{timeLeft}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.instructions}>
          {isActive 
            ? 'Snap se eliminará automáticamente...' 
            : 'Toca la imagen para ver el snap'
          }
        </Text>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  backIcon: {
    ...typography.title2,
    color: colors.white,
  },
  
  timerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.mediumGray,
    borderRadius: 2,
    marginBottom: spacing.xs,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: colors.snapchat,
    borderRadius: 2,
  },
  
  timerText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  
  fromText: {
    ...typography.caption,
    color: colors.grayText,
  },
  
  imageContainer: {
    flex: 1,
    margin: spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  imagePlaceholder: {
    flex: 1,
    backgroundColor: colors.mediumGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  placeholderIcon: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  
  placeholderText: {
    ...typography.title3,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  
  placeholderSubtext: {
    ...typography.callout,
    color: colors.grayText,
    textAlign: 'center',
  },
  
  overlay: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
  
  timerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.glassDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.snapchat,
  },
  
  timerCircleText: {
    ...typography.title3,
    color: colors.snapchat,
    fontWeight: '700',
  },
  
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  
  instructions: {
    ...typography.caption,
    color: colors.grayText,
    textAlign: 'center',
  },
});

export default ViewSnapScreen;