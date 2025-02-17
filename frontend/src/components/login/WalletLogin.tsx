import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../hooks/useWallet";
import { Button } from "../common/button/Button";
import { Link } from "react-router-dom";

export const WalletLogin: React.FC = () => {
  const { connect } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async () => {
    await connect();
    navigate("/login?state=user");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md transform transition-all">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Login to manage your tasks</p>
          </div>

          <div className="space-y-6">
            <Button onClick={handleConnect} className="w-full group" size="lg">
              <span className="flex items-center justify-center space-x-3">
                <svg
                  className="w-6 h-6 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12l-4.5-4.5v3h-5v3h5v3L22 12zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10a9.96 9.96 0 0 0 5.708-1.794l-1.414-1.414A7.96 7.96 0 0 1 12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8c2.209 0 4.209.896 5.656 2.344l1.414-1.414A9.959 9.959 0 0 0 12 2z" />
                </svg>
                <span>Connect Wallet</span>
              </span>
            </Button>

            <p className="text-sm text-center text-gray-500">
              First time here?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
