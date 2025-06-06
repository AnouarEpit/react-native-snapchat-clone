import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>logo test</Text>
          </View>
          <Text style={styles.title}>SnapChay Test</Text>

        </View>

        <View style={styles.userCard}>
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
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Snaps Enviados</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Snaps Recibidos</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          
          <View style={styles.actionCard}>
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionText}>Tomar Snap</Text>
            <Text style={styles.comingSoon}>Próximamente</Text>
          </View>
          
          <View style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Ver Amigos</Text>
            <Text style={styles.comingSoon}>Próximamente</Text>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="secondary"
            size="large"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>ETAPA 4: Home Premium </Text>
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
