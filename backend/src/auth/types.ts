export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    wallet_address: string;
    first_name: string;
    last_name: string;
  };
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  walletAddress: string;
}

export interface RegisterDtoInterface {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  walletAddress: string;
}

export interface UserDetails {
  email: string;
  refresh_token: string | null;
  id: string;
  first_name: string;
  last_name: string;
  password: string;
  wallet_address: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
