export interface User {
  _id: string;
  email: string;
  username: string;
  profilePicture: string;
  token?: string;
}

export interface Snap {
  _id: string;
  date: string;
  from: string;
  to?: string;
  image?: string;
  duration?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  profilePicture?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SendSnapData {
  to: string;
  image: string;
  duration: number;
}


