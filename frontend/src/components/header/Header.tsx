import React from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../hooks/useWallet";
import { useAuth } from "../../hooks/userAuth";
import { Button } from "../common/button/Button";

export const Header: React.FC = () => {
  const { address, disconnect } = useWallet();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    disconnect();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">TaskChain</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 px-3 py-1 rounded-lg">
              <p className="text-sm text-gray-600">Wallet</p>
              <p className="font-mono text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>

            {user && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome,</p>
                <p className="font-medium">
                  {user.first_name} {user.last_name}
                </p>
              </div>
            )}

            <Button variant="secondary" onClick={handleLogout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
