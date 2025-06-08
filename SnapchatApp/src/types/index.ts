// Types pour my_snapchat

export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

// Nouveaux types pour les snaps
export interface Snap {
  id: string;
  from: string;
  to: string;
  image: string; // URI local ou base64
  duration: number; // en secondes (1-10)
  createdAt: string;
  viewed?: boolean;
  viewedAt?: string;
}

export interface CreateSnapData {
  to: string;
  image: string;
  duration: number;
}

export interface Friend {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

// Store types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  toggleApiMode?: () => void;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Camera: undefined;
  SendSnap: { imageUri: string };
  ViewSnap: { snap: Snap };
  StoriesViewer: { userStories: any; initialStoryIndex: number };
};