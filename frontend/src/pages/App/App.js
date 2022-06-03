import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import {
  AuthProvider,
  ProtectedRoute,
} from "../../components/AuthProvider/AuthProvider";
import { Route, Routes } from "react-router-dom";
import Historique from "../Historique/Historique";
import AdressesFavorites from "../AdressesFavorites/AdressesFavorites";
import Logout from "../../components/Logout/Logout";
import { useState } from "react";
import Home from "../Home/Home";

function App() {
  document.title = "Step Post";
  const [pageActive, updatePageActive] = useState(null);

  const handlePageActive = (page) => {
    updatePageActive(page);
  };

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
