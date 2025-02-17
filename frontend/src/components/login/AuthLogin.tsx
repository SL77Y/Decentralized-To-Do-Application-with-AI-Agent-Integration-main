import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../../hooks/useWallet";
import { Button } from "../common/button/Button";
import { authService } from "../../services/auth.service";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/userAuth";

export const AuthForm: React.FC = () => {
  const { address } = useWallet();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  // Add a helper function to check if passwords match
  const passwordsMatch = isRegistering
    ? formData.password === formData.confirmPassword
    : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        const response = await authService.register({
          ...formData,
          first_name: formData.firstName,
          last_name: formData.lastName,
          confirm_password: formData.confirmPassword,
          wallet_address: address || "",
        });
        localStorage.setItem("user", JSON.stringify(response.user));
        login(response.user, response.access_token);
      } else {
        const response = await authService.login({
          email: formData.email,
          password: formData.password,
          wallet_address: address || "",
        });
        localStorage.setItem("user", JSON.stringify(response.user));
        login(response.user, response.access_token);
      }

      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      if (error.response?.status === 401) {
        toast.error("Invalid credentials. Please try again.");
      } else if (error.response?.status === 409 && isRegistering) {
        toast.error("Account already exists. Please login instead.");
      } else if (error.response?.status === 400) {
        toast.error(errorMessage || "Please check your input.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md transform transition-all">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 text-center">
              Connected Wallet
            </p>
            <p className="font-mono text-center text-gray-800">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            {isRegistering && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </>
            )}

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            {isRegistering && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!passwordsMatch} // Disable button if passwords don't match
            >
              {isRegistering ? "Register" : "Login"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? "Login" : "Register"}
              </button>
            </p>

            {!passwordsMatch && isRegistering && (
              <p className="text-sm text-red-500 text-center">
                Passwords do not match.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
