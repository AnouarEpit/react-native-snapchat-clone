// Theme system - Estilo Apple + Snapchat

export const colors = {
  // Snapchat brand
  snapchat: '#FFFC00',
  snapchatDark: '#E6E000',
  
  // Backgrounds
  black: '#000000',
  darkGray: '#111111',
  mediumGray: '#1C1C1E',
  lightGray: '#2C2C2E',
  
  // Text
  white: '#FFFFFF',
  lightText: '#F2F2F7',
  grayText: '#8E8E93',
  
  // Status
  success: '#30D158',
  error: '#FF453A',
  warning: '#FF9F0A',
  
  // Glassmorphism
  glassDark: 'rgba(28, 28, 30, 0.8)',
  glassLight: 'rgba(255, 255, 255, 0.1)',
};

export const typography = {
  // iOS San Francisco inspired
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
  },
  title1: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 34,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 25,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
