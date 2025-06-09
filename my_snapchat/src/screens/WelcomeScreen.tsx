import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import VideoBackground from '../components/VideoBackground';


//ver despues para la pantalla 
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
      duration={600}
      style={styles.buttonContainer}
    >
      <Pressable
        style={[styles.button, isPrimary && styles.primaryButton]}
        onPress={onPress}
        android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <BlurView intensity={isPrimary ? 30 : 18} style={styles.buttonBlur}>
          <LinearGradient
            colors={
              isPrimary 
                ? [
                    'rgba(255,255,255,0.28)', 
                    'rgba(255,255,255,0.18)',
                    'rgba(255,255,255,0.12)'
                  ] as const
                : [
                    'rgba(255,255,255,0.16)', 
                    'rgba(255,255,255,0.08)',
                    'rgba(255,255,255,0.06)'
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
                  size={18} 
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
                  size={16} 
                  color="#FFFFFF" 
                  style={styles.buttonArrow}
                />
              )}
            </View>
          </LinearGradient>
        </BlurView>
      </Pressable>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <VideoBackground overlayOpacity={0.75}>
        
        {/* Éléments décoratifs subtils */}
        <Animatable.View
          animation="fadeIn"
          delay={1200}
          style={[styles.hexagon, { top: 120, right: 35 }]}
        />
        <Animatable.View
          animation="fadeIn"
          delay={1800}
          style={[styles.hexagon, { bottom: 200, left: 25, width: 35, height: 35 }]}
        />
        <Animatable.View
          animation="fadeIn"
          delay={2400}
          style={[styles.hexagon, { top: '55%', right: 15, width: 20, height: 20 }]}
        />

        <View style={styles.content}>
          
          {/* Section Logo et Titre */}
          <View style={styles.logoSection}>
            
            {/* Logo container */}
            <Animatable.View 
              animation="zoomIn" 
              duration={1000} 
              delay={300}
              style={styles.logoContainer}
            >
              <BlurView intensity={22} style={styles.logoBlur}>
                <Animatable.View
                  animation="pulse"
                  iterationCount="infinite"
                  duration={3500}
                  style={styles.logoImageContainer}
                >
                  <Image
                    source={require('../../assets/images/logoSnap.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                    onError={(error) => {
                      console.error('❌ Erreur chargement logo:', error);
                    }}
                    onLoad={() => {
                      console.log('✅ Logo logoSnap.png chargé avec succès');
                    }}
                  />
                </Animatable.View>
              </BlurView>
              
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={2200}
                style={styles.logoGlow}
              />
            </Animatable.View>

            {/* Textes de bienvenue */}
            <Animatable.Text
              animation="fadeInUp"
              delay={600}
              style={styles.welcomeMessage}
            >
              Bienvenue
            </Animatable.Text>

            <Animatable.View animation="fadeInUp" delay={900} style={styles.titleContainer}>
              <Text style={styles.appTitle}>MY SNAPCHAT</Text>
              <Animatable.Text
                animation="fadeInUp"
                delay={1100}
                style={styles.appSubtitle}
              >
                Partagez l'instant présent
              </Animatable.Text>
            </Animatable.View>
          </View>

          {/* Section des boutons - Plus compacte et professionnelle */}
          <View style={styles.buttonsSection}>
            <Button
              title="Se connecter"
              onPress={onLogin}
              isPrimary={true}
              delay={1400}
              icon="log-in-outline"
            />
            
            <Button
              title="Créer un compte"
              onPress={onSignUp}
              delay={1550}
              icon="person-add-outline"
            />
            
            <Animatable.View
              animation="fadeIn"
              delay={1700}
              style={styles.dividerContainer}
            >
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.divider} />
            </Animatable.View>
            
            <Animatable.View
              animation="fadeInUp"
              delay={1850}
              style={styles.discoverButtonContainer}
            >
              <Pressable
                style={styles.discoverButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="play-circle-outline" size={14} color="rgba(255,255,255,0.75)" />
                <Text style={styles.discoverText}>Découvrir MY_SNAPCHAT</Text>
              </Pressable>
            </Animatable.View>
            
            <Animatable.Text
              animation="fadeIn"
              delay={2000}
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
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.04)',
    transform: [{ rotate: '45deg' }],
    zIndex: 5,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 70,
    paddingHorizontal: 32,
    zIndex: 10,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 35,
    alignItems: 'center',
  },
  logoBlur: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  logoImageContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 55,
    height: 55,
    tintColor: '#FFFFFF',
  },
  logoGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
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
    marginBottom: 12,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
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
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  appSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonsSection: {
    gap: 12,
    zIndex: 15,
    paddingBottom: 15,
  },
  buttonContainer: {
    marginBottom: 4,
    position: 'relative',
  },
  button: {
    borderRadius: 18,
    overflow: 'hidden',
    minHeight: 52,
    position: 'relative',
  },
  primaryButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonBlur: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  primaryButtonText: {
    fontWeight: '700',
    fontSize: 17,
  },
  buttonArrow: {
    marginLeft: 10,
    opacity: 0.9,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    paddingHorizontal: 16,
  },
  divider: {
    flex: 1,
    height: 0.8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: 16,
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  discoverButtonContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  discoverText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    marginTop: 8,
    fontWeight: '400',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default WelcomeScreen;