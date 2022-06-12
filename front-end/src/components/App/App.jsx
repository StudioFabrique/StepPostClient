import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { ProtectedRoute, useAuth } from "../AuthProvider/AuthProvider";
import { Route, Routes } from "react-router-dom";
import Historique from "../../pages/Historique/Historique";
import AdressesFavorites from "../../pages/AdressesFavorites/AdressesFavorites";
import Logout from "../Logout/Logout";
import { useEffect, useState } from "react";
import Home from "../../pages/Home/Home";

function App() {
  const auth = useAuth();
  const [pageActive, updatePageActive] = useState(null);
  const savedToken = localStorage.getItem("token");
  useEffect(() => {
    if (savedToken) {
      auth.onLogin(savedToken);
    }
  }, []);

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
