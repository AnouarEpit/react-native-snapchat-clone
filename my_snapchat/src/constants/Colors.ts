export const Colors = {
  primary: '#FFFFFF', 
  primaryDark: '#F0F0F0',
  secondary: '#0f3460', 
  accent: '#1a1a2e', 

  gradients: {
    navy: ['#0a0e27', '#1a1a2e', '#16213e', '#0f3460'],

    glass: ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)'],

    logo: ['#ffffff', '#e8f4f8', '#ffffff'],

    deepNavy: ['#0a0e27', '#16213e'],

    error: ['#FF6B6B', '#FF5252'],

    success: ['#4CAF50', '#45a049'],
  },

  navy: {
    darkest: '#0a0e27',  
    dark: '#1a1a2e',      
    medium: '#16213e',   
    light: '#0f3460',     
    accent: '#2c5282',    
  },

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  gray: {
    100: 'rgba(255,255,255,0.95)',
    200: 'rgba(255,255,255,0.8)',
    300: 'rgba(255,255,255,0.7)',
    400: 'rgba(255,255,255,0.6)',
    500: 'rgba(255,255,255,0.5)',
    600: 'rgba(255,255,255,0.4)',
    700: 'rgba(255,255,255,0.3)',
    800: 'rgba(255,255,255,0.2)',
    900: 'rgba(255,255,255,0.1)',
  },


  success: '#4CAF50',
  warning: '#FFC107',
  error: '#FF6B6B',
  info: '#2196F3',


  background: {
    primary: '#0a0e27',
    secondary: '#1a1a2e',
    overlay: 'rgba(0,0,0,0.5)',
    glass: 'rgba(255,255,255,0.1)',
    blur: 'rgba(255,255,255,0.05)',
  },

  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.8)',
    muted: 'rgba(255,255,255,0.7)',
    placeholder: 'rgba(255,255,255,0.5)',
    disabled: 'rgba(255,255,255,0.3)',
  },


  border: {
    light: 'rgba(255,255,255,0.1)',
    medium: 'rgba(255,255,255,0.2)',
    strong: 'rgba(255,255,255,0.3)',
    focus: 'rgba(255,255,255,0.4)',
  },

  shadow: {
    light: 'rgba(0,0,0,0.1)',
    medium: 'rgba(0,0,0,0.2)',
    heavy: 'rgba(0,0,0,0.4)',
    glow: 'rgba(255,255,255,0.1)',
  },

  interactive: {

    buttonPrimary: 'rgba(255,255,255,0.15)',
    buttonSecondary: 'rgba(255,255,255,0.05)',

    inputBackground: 'rgba(255,255,255,0.05)',
    inputFocused: 'rgba(255,255,255,0.1)',
    inputError: 'rgba(255,107,107,0.1)',
    modalOverlay: 'rgba(10,14,39,0.8)',
    cardBackground: 'rgba(255,255,255,0.08)',
  },

  geometric: {
    subtle: 'rgba(255,255,255,0.03)',
    medium: 'rgba(255,255,255,0.05)',
    visible: 'rgba(255,255,255,0.1)',
  },
} as const;

export const withOpacity = (color: string, opacity: number): string => {

  if (color.startsWith('rgba')) 
  {
    const base = color.substring(5, color.lastIndexOf(','));
    return `rgba(${base}, ${opacity})`;
  }
  
  if (color.startsWith('#')) 
    {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return color;
};

export const getRandomNavyGradient = (): string[] => {
  const navyGradients = [
    Colors.gradients.navy,
    Colors.gradients.deepNavy,
    ['#0a0e27', '#16213e', '#1a1a2e'],
    ['#1a1a2e', '#0f3460', '#16213e'],
  ];
  return [...navyGradients[Math.floor(Math.random() * navyGradients.length)]];
};

export const getInputColors = (focused: boolean, error: boolean) => {
  if (error) 
  {
    return {
      background: Colors.interactive.inputError,
      border: Colors.error,
      icon: Colors.error,
    };
  }
  
  if (focused) {
    return {
      background: Colors.interactive.inputFocused,
      border: Colors.border.focus,
      icon: Colors.white,
    };
  }
  
  return {
    background: Colors.interactive.inputBackground,
    border: Colors.border.light,
    icon: Colors.text.muted,
  };
};

export default Colors;