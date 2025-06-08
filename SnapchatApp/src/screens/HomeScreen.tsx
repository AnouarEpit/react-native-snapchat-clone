import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../store/authStore';
import { useSnapStore } from '../store/snapStore';
import { useStoriesStore } from '../store/storiesStore';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { receivedSnaps, loadMockSnaps } = useSnapStore();
  const { allStories, loadMockStories, getActiveStories } = useStoriesStore();
  const navigation = useNavigation<any>();

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Cargar datos mock al entrar
    loadMockSnaps();
    loadMockStories();
    
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleViewStory = (userStories: any, storyIndex: number = 0) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('StoriesViewer', { userStories, initialStoryIndex: storyIndex });
  };

  const handleViewSnap = (snap: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('ViewSnap', { snap });
  };

  const handleTakeSnap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('Camera');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Animado */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>👻</Text>
          </View>
          <Text style={styles.title}>MY_SNAPCHAT</Text>
        </Animated.View>

        {/* User Card Animado */}
        <Animated.View 
          style={[
            styles.userCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <Text style={styles.userId}>ID: {user?.id}</Text>
          </View>
        </Animated.View>

        {/* Stories Section */}
        <Animated.View 
          style={[
            styles.storiesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Stories</Text>
          
          <FlatList
            data={getActiveStories()}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.userId}
            renderItem={({ item: userStories }) => (
              <TouchableOpacity 
                style={styles.storyCard}
                onPress={() => handleViewStory(userStories)}
              >
                <View style={[
                  styles.storyAvatar,
                  userStories.hasUnviewed && styles.storyAvatarUnviewed
                ]}>
                  <Text style={styles.storyAvatarText}>
                    {userStories.avatar}
                  </Text>
                </View>
                <Text style={styles.storyUsername}>{userStories.username}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.storiesList}
            ListEmptyComponent={
              <View style={styles.noStoriesContainer}>
                <Text style={styles.noStoriesText}>No hay stories disponibles</Text>
              </View>
            }
          />
        </Animated.View>

        {/* Snaps Recibidos Animados */}
        <Animated.View 
          style={[
            styles.snapsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>
            Snaps Recibidos ({receivedSnaps.filter((s: any) => !s.viewed).length})
          </Text>
          
          {receivedSnaps.length > 0 ? (
            <FlatList
              data={receivedSnaps.filter((s: any) => !s.viewed)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item: snap }) => (
                <TouchableOpacity 
                  style={styles.snapCard}
                  onPress={() => handleViewSnap(snap)}
                >
                  <View style={styles.snapAvatar}>
                    <Text style={styles.snapAvatarText}>
                      {snap.from.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.snapFrom}>{snap.from}</Text>
                  <Text style={styles.snapDuration}>{snap.duration}s</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.snapsList}
            />
          ) : (
            <View style={styles.noSnapsContainer}>
              <Text style={styles.noSnapsText}>No hay snaps nuevos</Text>
              <Text style={styles.noSnapsSubtext}>Los snaps aparecerán aquí</Text>
            </View>
          )}
        </Animated.View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{receivedSnaps.length}</Text>
            <Text style={styles.statLabel}>Snaps Recibidos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Snaps Enviados</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleTakeSnap}
          >
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionText}>Tomar Snap</Text>
            <Text style={styles.actionSubtext}>¡Disponible!</Text>
          </TouchableOpacity>
          
          <View style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Ver Amigos</Text>
            <Text style={styles.comingSoon}>Próximamente</Text>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="secondary"
            size="large"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>ETAPA 9: Stories Beast Mode ✨</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  
  scrollView: {
    flex: 1,
  },
  
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  
  logoContainer: {
    backgroundColor: colors.snapchat,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  
  logo: {
    fontSize: 30,
  },
  
  title: {
    ...typography.title2,
    color: colors.white,
    fontWeight: '700',
  },
  
  userCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.glassDark,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.snapchat,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  
  avatarText: {
    ...typography.title2,
    color: colors.black,
    fontWeight: '700',
  },
  
  userInfo: {
    flex: 1,
  },
  
  username: {
    ...typography.title3,
    color: colors.white,
    marginBottom: 2,
  },
  
  email: {
    ...typography.callout,
    color: colors.grayText,
    marginBottom: 2,
  },
  
  userId: {
    ...typography.caption,
    color: colors.grayText,
  },
  
  storiesContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  
  storiesList: {
    paddingRight: spacing.lg,
  },
  
  storyCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 80,
  },
  
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.mediumGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 2,
    borderColor: colors.mediumGray,
  },
  
  storyAvatarUnviewed: {
    borderColor: colors.snapchat,
    borderWidth: 3,
  },
  
  storyAvatarText: {
    ...typography.callout,
    color: colors.white,
    fontWeight: '700',
  },
  
  storyUsername: {
    ...typography.caption,
    color: colors.white,
    textAlign: 'center',
  },
  
  noStoriesContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  
  noStoriesText: {
    ...typography.caption,
    color: colors.grayText,
  },
  
  snapsContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  
  snapsList: {
    paddingRight: spacing.lg,
  },
  
  snapCard: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 80,
  },
  
  snapAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.snapchat,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 3,
    borderColor: colors.snapchat,
  },
  
  snapAvatarText: {
    ...typography.callout,
    color: colors.black,
    fontWeight: '700',
  },
  
  snapFrom: {
    ...typography.caption,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 2,
  },
  
  snapDuration: {
    ...typography.caption,
    color: colors.grayText,
    fontSize: 10,
  },
  
  noSnapsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  
  noSnapsText: {
    ...typography.callout,
    color: colors.grayText,
    marginBottom: spacing.xs,
  },
  
  noSnapsSubtext: {
    ...typography.caption,
    color: colors.grayText,
  },
  
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  
  statCard: {
    flex: 1,
    backgroundColor: colors.mediumGray,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.small,
  },
  
  statNumber: {
    ...typography.title1,
    color: colors.snapchat,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  
  statLabel: {
    ...typography.caption,
    color: colors.grayText,
    textAlign: 'center',
  },
  
  actionsContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  
  sectionTitle: {
    ...typography.title3,
    color: colors.white,
    marginBottom: spacing.md,
  },
  
  actionCard: {
    backgroundColor: colors.mediumGray,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  
  actionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  
  actionText: {
    ...typography.callout,
    color: colors.white,
    flex: 1,
  },
  
  actionSubtext: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  
  comingSoon: {
    ...typography.caption,
    color: colors.grayText,
    fontStyle: 'italic',
  },
  
  logoutContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
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

export default HomeScreen;