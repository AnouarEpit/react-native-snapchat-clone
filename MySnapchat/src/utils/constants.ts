export const COLORS = {
    primary: '#FFFC00',
    secondary: '#FF6B35',
    background: '#000000',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  } as const;
  
  export const FONTS = {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  } as const;
  
  export const SIZES = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  } as const;
  
  export const API_CONFIG = {
    BASE_URL: 'https://snapchat.epidoc.eu',
    API_KEY: 'Mon api key', //

    TIMEOUT: 10000,
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // -------------- 5MB
    SNAP_DIMENSIONS: { width: 360, height: 640 },
  } as const;
  