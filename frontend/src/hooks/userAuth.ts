import { useState, useEffect } from "react";
import { AuthState, User } from "../types/auth";
import { useWallet } from "./useWallet";

const STORAGE_KEY = "auth_state";

export const useAuth = () => {
  const { isConnected, address } = useWallet();
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          user: null,
          token: null,
          isAuthenticated: false,
        };
  });

  useEffect(() => {
    if (!isConnected && authState.isAuthenticated) {
      logout();
    }
  }, [isConnected]);

  const login = (user: User, token: string) => {
    const newState = {
      user,
      token,
      isAuthenticated: true,
    };
    localStorage.setItem("auth_state", JSON.stringify(newState));
    setAuthState(newState);
  };

  const logout = () => {
    localStorage.removeItem("auth_state");
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return {
    ...authState,
    login,
    logout,
    isWalletConnected: isConnected,
    walletAddress: address,
  };
};
