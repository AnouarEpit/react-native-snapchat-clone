// Types principaux pour l'application MY_SNAPCHAT

export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  createdAt: string;
  friends?: User[];
}

export interface Snap {
  id: string;
  from: string;
  to: string;
  image: string;
  duration: number;
  createdAt: string;
  seen: boolean;
  viewedAt?: string;
}

export interface Friend {
  id: string;
  username: string;
  profilePicture?: string;
  isOnline?: boolean;
}

// Types pour l'authentification
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  username: string;
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

// Types pour la caméra et les médias
export interface CameraOptions {
  quality: number;
  base64: boolean;
  allowsEditing: boolean;
  aspect: [number, number];
}

export interface ImageAsset {
  uri: string;
  width: number;
  height: number;
  base64?: string;
  type?: string;
  fileName?: string;
}

export interface SnapData {
  image: ImageAsset;
  recipients: string[];
  duration: number;
  text?: string;
  drawing?: string;
}

// Types pour les animations
export interface AnimationConfig {
  duration: number;
  easing?: string;
  useNativeDriver?: boolean;
}

export interface ScreenTransition {
  from: ScreenName;
  to: ScreenName;
  animation?: AnimationConfig;
}

// Types pour la navigation
export type ScreenName = 
  | 'Welcome'
  | 'Login'
  | 'SignUp'
  | 'Home'
  | 'Camera'
  | 'Friends'
  | 'Profile'
  | 'SnapView'
  | 'Settings'
  | 'Welcome'
  | 'FriendsSelection'
  | 'Splash';

export interface NavigationProps {
  navigation: any;
  route: any;
}

// Types pour les erreurs
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'snap_received' | 'friend_request' | 'snap_opened';
  title: string;
  body: string;
  data?: any;
  timestamp: string;
  read: boolean;
}

// Types pour les paramètres
export interface AppSettings {
  notifications: {
    enabled: boolean;
    snapReceived: boolean;
    friendRequests: boolean;
  };
  privacy: {
    allowFriendRequests: boolean;
    showOnlineStatus: boolean;
  };
  account: {
    rememberMe: boolean;
    autoSave: boolean;
  };
}

// Types pour le stockage local
export interface StorageKeys {
  USER_TOKEN: 'userToken';
  USER_DATA: 'userData';
  APP_SETTINGS: 'appSettings';
  CACHED_SNAPS: 'cachedSnaps';
  OFFLINE_SNAPS: 'offlineSnaps';
}

// Types pour les contextes React
export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export interface SnapContextType {
  snaps: Snap[];
  isLoading: boolean;
  error: string | null;
  sendSnap: (snapData: SnapData) => Promise<void>;
  getSnaps: () => Promise<void>;
  markAsRead: (snapId: string) => Promise<void>;
  deleteSnap: (snapId: string) => Promise<void>;
}

// Types pour les hooks personnalisés
export interface UseCameraResult {
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  takePhoto: () => Promise<ImageAsset | null>;
  pickImage: () => Promise<ImageAsset | null>;
  requestPermission: () => Promise<boolean>;
}

export interface UseAuthResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// Types pour les formulaires
export interface FormField {
  name: string;
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isSubmitting: boolean;
}

// Types pour les états de chargement
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

// Types utilitaires
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Export de tous les types
export type {
  // Re-export pour faciliter l'importation
  User as AppUser,
  Snap as AppSnap,
  Friend as AppFriend,
};