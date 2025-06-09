
export const Config = {

  API: {
    BASE_URL: 'https://snapchat.epihub.eu',
    TIMEOUT: 10000,
  },

  ENDPOINTS: {

    USER_SIGNUP: '/user',
    USER_LOGIN: '/user',
    USER_PROFILE: '/user',
    USER_BY_ID: '/user/{id}',
    
    FRIENDS: '/user/friends',
    
    SNAPS: '/snap',
    SNAP_BY_ID: '/snap/{id}',
    SNAP_SEEN: '/snap/seen/{id}',
  },

  STORAGE_KEYS: {
    USER_TOKEN: 'userToken',
    USER_DATA: 'userData',
    API_KEY: 'apiKey',
  },

  APP: {
    NAME: 'MY SNAPCHAT',
    VERSION: '1.0.0',
    DEFAULT_SNAP_DURATION: 3,
    MAX_SNAP_DURATION: 10,
    SUPPORTED_DURATIONS: [1, 3, 5, 7, 10],
  },

  COLORS: {
    PRIMARY: '#667eea',
    SECONDARY: '#764ba2',
    BACKGROUND_GRADIENT: ['#0a0e27', '#1a1a2e', '#16213e', '#0f3460'],
    CHAT_GRADIENT: ['#667eea', '#764ba2'],
    STORIES_GRADIENT: ['#764ba2', '#667eea'],
    SUCCESS: '#4CAF50',
    ERROR: '#FF6B6B',
    WARNING: '#FFD700',
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    TRANSPARENT: 'transparent',
  },

  UI: {
    BORDER_RADIUS: {
      SMALL: 8,
      MEDIUM: 16,
      LARGE: 25,
      CIRCLE: 50,
    },
    SPACING: {
      XS: 4,
      SM: 8,
      MD: 16,
      LG: 24,
      XL: 32,
    },
    BLUR_INTENSITY: {
      LOW: 20,
      MEDIUM: 30,
      HIGH: 40,
      EXTRA_HIGH: 90,
    },
  },
};

export const getApiUrl = (endpoint: string, params: Record<string, string> = {}): string => {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, value);
  });
  return url;
};

export type ConfigType = typeof Config;
export type EndpointKey = keyof typeof Config.ENDPOINTS;
export type StorageKey = keyof typeof Config.STORAGE_KEYS;
export type ColorKey = keyof typeof Config.COLORS;