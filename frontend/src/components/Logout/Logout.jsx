import { useEffect } from "react";
import { useAuth } from "../AuthProvider/AuthProvider";

function Logout() {
  const auth = useAuth();
  useEffect(() => auth.onLogout(), []);
}

export default Logout;
