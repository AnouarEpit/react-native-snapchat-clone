// Types esenciales para MY_SNAPCHAT

export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  date?: string;
}

export interface Snap {
  id: string;
  from: string;
  to: string;
  image: string;
  duration: number;
  createdAt: string;
  seen: boolean;
}

export interface AuthUser extends User {
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
}

// Navigation types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  FriendsSelection: { photoUri: string; cameraType: "back" | "front" };
  EditProfileScreen: undefined;
  ProfileScreen: undefined;
  AddFriendsScreen: undefined;
};