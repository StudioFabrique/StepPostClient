import { useState, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Connexion from "../Connexion/Connexion";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  const onLogin = (newToken) => {
    setToken(newToken);
  };

  const onLogout = () => {
    setToken(null);
    localStorage.setItem("token", "");
    navigate("/");
  };
  return { token, onLogin, onLogout };
}

export const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.token) {
    return <Connexion to="/" replace state={{ from: location }} />;
  }
  return children;
};
