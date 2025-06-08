import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

interface Friend {
  id: string;
  username: string;
  email: string;
}

const mockFriends: Friend[] = [
  { id: '1', username: 'alice', email: 'alice@example.com' },
  { id: '2', username: 'bob', email: 'bob@example.com' },
  { id: '3', username: 'charlie', email: 'charlie@example.com' },
  { id: '4', username: 'diana', email: 'diana@example.com' },
];

const SendSnapScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { imageUri } = route.params;
  
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [duration, setDuration] = useState<number>(3);

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
  };

  const handleSendSnap = () => {
    if (!selectedFriend) {
      Alert.alert('Erreur', 'Veuillez sélectionner un destinataire');
      return;
    }

    Alert.alert(
      'Snap envoyé!',
      `Snap envoyé à ${selectedFriend.username} pour ${duration} secondes`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home')
        }
      ]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Envoyer Snap</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <View style={styles.imageOverlay}>
            <Text style={styles.durationText}>{duration}s</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Durée d'affichage</Text>
          <View style={styles.durationContainer}>
            {[1, 2, 3, 5, 10].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.durationButton,
                  duration === time && styles.durationButtonActive
                ]}
                onPress={() => setDuration(time)}
              >
                <Text style={[
                  styles.durationButtonText,
                  duration === time && styles.durationButtonTextActive
                ]}>
                  {time}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Envoyer à</Text>
          <View style={styles.friendsList}>
            {mockFriends.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={[
                  styles.friendCard,
                  selectedFriend?.id === friend.id && styles.friendCardSelected
                ]}
                onPress={() => handleSelectFriend(friend)}
              >
                <View style={styles.friendAvatar}>
                  <Text style={styles.friendAvatarText}>
                    {friend.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{friend.username}</Text>
                  <Text style={styles.friendEmail}>{friend.email}</Text>
                </View>
                {selectedFriend?.id === friend.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Send Button */}
      <View style={styles.footer}>
        <Button
          title={`Envoyer à ${selectedFriend?.username || '...'}`}
          onPress={handleSendSnap}
          disabled={!selectedFriend}
          size="large"
          style={styles.sendButton}
        />
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
  
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  
  imageContainer: {
    height: 300,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  imageOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.glassDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  
  durationText: {
    ...typography.callout,
    color: colors.snapchat,
    fontWeight: '600',
  },
  
  section: {
    marginBottom: spacing.xl,
  },
  
  sectionTitle: {
    ...typography.title3,
    color: colors.white,
    marginBottom: spacing.md,
  },
  
  durationContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  
  durationButton: {
    flex: 1,
    backgroundColor: colors.mediumGray,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  
  durationButtonActive: {
    backgroundColor: colors.snapchat,
  },
  
  durationButtonText: {
    ...typography.callout,
    color: colors.white,
    fontWeight: '600',
  },
  
  durationButtonTextActive: {
    color: colors.black,
  },
  
  friendsList: {
    gap: spacing.sm,
  },
  
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mediumGray,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  
  friendCardSelected: {
    backgroundColor: colors.lightGray,
    borderWidth: 2,
    borderColor: colors.snapchat,
  },
  
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.snapchat,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  
  friendAvatarText: {
    ...typography.title3,
    color: colors.black,
    fontWeight: '700',
  },
  
  friendInfo: {
    flex: 1,
  },
  
  friendName: {
    ...typography.callout,
    color: colors.white,
    fontWeight: '600',
    marginBottom: 2,
  },
  
  friendEmail: {
    ...typography.caption,
    color: colors.grayText,
  },
  
  checkmark: {
    ...typography.title2,
    color: colors.snapchat,
    fontWeight: '700',
  },
  
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  
  sendButton: {
    width: '100%',
  },
});

export default SendSnapScreen;