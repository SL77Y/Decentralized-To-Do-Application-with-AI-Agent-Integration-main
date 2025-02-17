import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import { useAuth } from "./hooks/userAuth";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isWalletConnected } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isWalletConnected) {
      navigate("/login?state=wallet");
      toast.error("Please connect your wallet first");
    } else if (!isAuthenticated) {
      navigate("/login?state=user");
    }
  }, [isWalletConnected, isAuthenticated, navigate]);

  if (!isWalletConnected || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // Makes toasts more visible
        />
      </WalletProvider>
    </BrowserRouter>
  );
}

export default App;
