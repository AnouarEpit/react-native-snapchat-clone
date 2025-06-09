import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TextInputProps,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

interface OptimizedInputProps extends TextInputProps 
{
  placeholder: string;
  value: string;

  onChangeText: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  showEye?: boolean;
  error?: string;
}

const OptimizedInput: React.FC<OptimizedInputProps> = ({
  placeholder,
  value,
  onChangeText,
  icon,
  showEye = false,
  error,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isSecure = secureTextEntry && !isPasswordVisible;

  const getInputColors = () => {
    if (error) {
      return {
        background: 'rgba(255,107,107,0.1)',
        border: '#FF6B6B',
        iconColor: '#FF6B6B',
      };
    }
    
    if (isFocused) 
    {
      return {
        background: 'rgba(255,255,255,0.1)',
        border: 'rgba(255,255,255,0.4)',
        iconColor: '#FFFFFF',
      };
    }
    
    return {
      background: 'rgba(255,255,255,0.05)',
      border: 'rgba(255,255,255,0.1)',
      iconColor: 'rgba(255,255,255,0.7)',
    };
  };

  const colors = getInputColors();

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { borderColor: colors.border }]}>
        <BlurView intensity={20} style={[styles.inputBlur, { backgroundColor: colors.background }]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
            style={styles.inputGradient}
          >
            <View style={styles.inputContent}>
              {icon && (
                <View style={styles.iconContainer}>
                  <Ionicons name={icon} size={20} color={colors.iconColor} />
                </View>
              )}

              <TextInput
                style={[styles.textInput, !icon && styles.textInputNoIcon]}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                secureTextEntry={isSecure}
                selectionColor="rgba(255,255,255,0.7)"
                {...props}
              />

              {showEye && secureTextEntry && (
                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessible={true}
                  accessibilityLabel={isPasswordVisible ? 'Masquer mot de passe' : 'Afficher mot de passe'}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.iconColor}
                  />
                </Pressable>
              )}
            </View>
          </LinearGradient>
        </BlurView>
      </View>

      {error && (
        <Animatable.View animation="fadeInDown" duration={300} style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    minHeight: 56,
  },
  inputBlur: {
    flex: 1,
  },
  inputGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    minHeight: 56,
  },
  iconContainer: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  textInputNoIcon: {
    marginLeft: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    letterSpacing: 0.2,
  },
});

export default OptimizedInput;