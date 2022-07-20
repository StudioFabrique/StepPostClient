import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import {
  ProtectedRoute,
  useAuth,
} from "../../components/AuthProvider/AuthProvider";
import { Route, Routes } from "react-router-dom";
import Historique from "../Historique/Historique";
import AdressesFavorites from "../AdressesFavorites/AdressesFavorites";
import Logout from "../../components/Logout/Logout";
import { useEffect, useState } from "react";
import Home from "../Home/Home";
import { handShake } from "../../modules/fetchData";
import AddAddress from "../../components/AddAddress/AddAddress";

function App() {
  const auth = useAuth();
  const [pageActive, updatePageActive] = useState(null);
  const savedToken = localStorage.getItem("token");
  useEffect(() => {
    if (savedToken) {
      if (handShake(savedToken)) {
        auth.onLogin(savedToken);
      } else {
        auth.Logout();
      }
    }
  }, [auth, savedToken]);

  document.title = "Step Post";

  const handlePageActive = (page) => {
    updatePageActive(page);
  };

  return (
    <>
      <Header pageActive={pageActive} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home onPageLanding={handlePageActive} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ajout-adresse"
          element={
            <ProtectedRoute>
              <AddAddress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historique"
          element={
            <ProtectedRoute>
              <Historique onPageLanding={handlePageActive} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carnet-d-adresses"
          element={
            <ProtectedRoute>
              <AdressesFavorites onPageLanding={handlePageActive} />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
