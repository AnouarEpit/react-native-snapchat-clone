import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface SnapModalProps {
  visible: boolean;
  snap: {
    id: string;
    from: string;
    image: string;
    duration: number;
    createdAt: string;
  } | null;
  onClose: () => void;
}

const SnapModal: React.FC<SnapModalProps> = ({ visible, snap, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (visible && snap) {
      setTimeLeft(snap.duration);
    }
  }, [visible, snap]);

  useEffect(() => {
    if (!visible || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose(); // Auto-fermer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [visible, timeLeft, onClose]);

  if (!snap) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar hidden />
      <View style={styles.container}>
        {/* Header avec timer */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {snap.from.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.username}>{snap.from}</Text>
            <Text style={styles.timer}>{timeLeft}s</Text>
          </View>
          
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Barre de progression */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill,
                { width: `${((snap.duration - timeLeft) / snap.duration) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Image du snap */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: snap.image }}
            style={styles.snapImage}
            resizeMode="contain"
          />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Tap pour fermer
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timer: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBackground: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snapImage: {
    width: width,
    height: height * 0.7,
  },
  instructions: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

export default SnapModal;