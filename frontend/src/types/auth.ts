export interface User {
  id: string;
  email: string;
  walletAddress: string;
  first_name: string;
  last_name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
