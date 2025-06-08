import { Animated, Easing } from 'react-native';

export class AnimationSystem {
  // Animación de fade in suave
  static fadeIn(animatedValue: Animated.Value, duration: number = 300) {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
  }

  // Animación de fade out
  static fadeOut(animatedValue: Animated.Value, duration: number = 200) {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    });
  }

  // Animación de scale (botones)
  static scaleIn(animatedValue: Animated.Value) {
    return Animated.spring(animatedValue, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    });
  }

  static pulse(animatedValue: Animated.Value) {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
  }

  static slideInUp(animatedValue: Animated.Value, distance: number = 100) {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
  }

  static shake(animatedValue: Animated.Value) {
    return Animated.sequence([
      Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(animatedValue, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]);
  }

  // Stagger animations para listas
  static staggerFadeIn(animatedValues: Animated.Value[], staggerDelay: number = 100) {
    return Animated.stagger(
      staggerDelay,
      animatedValues.map(value => 
        Animated.timing(value, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      )
    );
  }
}

// Hook para animaciones simples
export const useSimpleAnimation = (initialValue: number = 0) => {
  const animatedValue = new Animated.Value(initialValue);
  
  const fadeIn = () => AnimationSystem.fadeIn(animatedValue).start();
  const fadeOut = () => AnimationSystem.fadeOut(animatedValue).start();
  const scaleIn = () => AnimationSystem.scaleIn(animatedValue).start();
  const pulse = () => AnimationSystem.pulse(animatedValue).start();
  
  return {
    animatedValue,
    fadeIn,
    fadeOut,
    scaleIn,
    pulse,
  };
};