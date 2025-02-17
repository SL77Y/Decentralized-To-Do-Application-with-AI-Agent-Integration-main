import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { WalletLogin } from "../components/login/WalletLogin";
import { AuthForm } from "../components/login/AuthLogin";
import { useWallet } from "../hooks/useWallet";
import { toast } from "react-toastify";

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { isConnected } = useWallet();
  const navigate = useNavigate();
  const loginState = searchParams.get("state") || "wallet";

  useEffect(() => {
    if (loginState === "user" && !isConnected) {
      toast.error("Please connect your wallet first");
      navigate("/login?state=wallet");
    }
  }, [isConnected, loginState, navigate]);

  return loginState === "wallet" ? <WalletLogin /> : <AuthForm />;
};
