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

export interface Snap {
  id: string;
  from: string;
  to: string;
  image: string; 
  duration: number; 
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

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Camera: undefined;
  SendSnap: { imageUri: string };
  ViewSnap: { snap: Snap };
};