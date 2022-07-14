import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
    localStorage.removeItem("token");
    navigate("/");
  };
  return { token, onLogin, onLogout };
}

export const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (!auth.token) {
    return <Connexion />;
  }
  return children;
};
