import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import VideoBackground from '../components/VideoBackground';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onSignUp }) => {

  const Button = ({ title, onPress, isPrimary = false, delay = 0, icon }: any) => (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={800}
      style={styles.buttonContainer}
    >
      <Pressable
        style={[styles.button, isPrimary && styles.primaryButton]}
        onPress={onPress}
        android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <BlurView intensity={isPrimary ? 40 : 25} style={styles.buttonBlur}>
          <LinearGradient
            colors={
              isPrimary 
                ? [
                    'rgba(255,255,255,0.25)', 
                    'rgba(255,255,255,0.15)',
                    'rgba(255,255,255,0.1)'
                  ] as const
                : [
                    'rgba(255,255,255,0.15)', 
                    'rgba(255,255,255,0.08)',
                    'rgba(255,255,255,0.05)'
                  ] as const
            }
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.buttonContent}>
              {icon && (
                <Ionicons 
                  name={icon} 
                  size={20} 
                  color="#FFFFFF" 
                  style={styles.buttonIcon}
                />
              )}
              <Text style={[styles.buttonText, isPrimary && styles.primaryButtonText]}>
                {title}
              </Text>
              {isPrimary && (
                <Ionicons 
                  name="arrow-forward" 
                  size={18} 
                  color="#FFFFFF" 
                  style={styles.buttonArrow}
                />
              )}
            </View>
          </LinearGradient>
        </BlurView>
        
        {isPrimary && (
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
            style={styles.buttonGlow}
          />
        )}
      </Pressable>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <VideoBackground overlayOpacity={0.6}>
        
        <Animatable.View
          animation="fadeIn"
          delay={1000}
          style={[styles.hexagon, { top: 120, right: 50 }]}
        />
        <Animatable.View
          animation="fadeIn"
          delay={1500}
          style={[styles.hexagon, { bottom: 200, left: 40, width: 35, height: 35 }]}
        />

        <View style={styles.content}>
          
          <View style={styles.logoSection}>
            
            <Animatable.View 
              animation="zoomIn" 
              duration={1200} 
              style={styles.logoContainer}
            >
              <BlurView intensity={20} style={styles.logoBlur}>
                <Animatable.View
                  animation="pulse"
                  iterationCount="infinite"
                  duration={3000}
                >
                  <Ionicons name="camera" size={50} color="#FFFFFF" />
                </Animatable.View>
              </BlurView>
              
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2000}
                style={styles.logoGlow}
              />
            </Animatable.View>

            <Animatable.Text
              animation="fadeInUp"
              delay={800}
              style={styles.welcomeMessage}
            >
              Bienvenue
            </Animatable.Text>

            <Animatable.View animation="fadeInUp" delay={1200} style={styles.titleContainer}>
              <Text style={styles.appTitle}>MY SNAPCHAT</Text>
              <Animatable.Text
                animation="fadeInUp"
                delay={1400}
                style={styles.appSubtitle}
              >
                Partagez l'instant présent
              </Animatable.Text>
            </Animatable.View>
          </View>

          <View style={styles.buttonsSection}>
            <Button
              title="Se connecter"
              onPress={onLogin}
              isPrimary={true}
              delay={1600}
              icon="log-in-outline"
            />
            <Button
              title="Créer un compte"
              onPress={onSignUp}
              delay={1800}
              icon="person-add-outline"
            />
            
            <Animatable.View
              animation="fadeIn"
              delay={1900}
              style={styles.dividerContainer}
            >
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.divider} />
            </Animatable.View>
            
            <Animatable.View
              animation="fadeInUp"
              delay={1200}
              style={styles.discoverButtonContainer}
            >
              <Pressable
                style={styles.discoverButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="play-circle-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.discoverText}>Découvrir MY_SNAPCHAT</Text>
              </Pressable>
            </Animatable.View>
            
            <Animatable.Text
              animation="fadeIn"
              delay={1200}
              style={styles.footerText}
            >
              Développé par Anouar et Arnaud
            </Animatable.Text>
          </View>
        </View>

      </VideoBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hexagon: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: [{ rotate: '45deg' }],
    zIndex: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: 30,
    zIndex: 10,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  logoBlur: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleContainer: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  appSubtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonsSection: {
    gap: 20,
    zIndex: 15,
  },
  buttonContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 60,
    position: 'relative',
  },
  primaryButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonBlur: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 28,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 12,
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  primaryButtonText: {
    fontWeight: '700',
    fontSize: 18,
  },
  buttonArrow: {
    marginLeft: 12,
    opacity: 0.9,
  },
  buttonGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: -1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '500',
    marginHorizontal: 20,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  discoverButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  discoverText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginTop: 20,
    fontWeight: '400',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default WelcomeScreen;