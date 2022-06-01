import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./Home";
import Logout from "./Logout";
import Connexion from "./Connexion";
import "../styles/Header.css";
import { useEffect, useState } from "react";
import Historique from "./Historique";
import AdressesFavorites from "./AdressesFavorites";
import { getData, postData } from "../modules/postData";

function Header() {
  const [isActive, updateActive] = useState(null);
  const [isLogged, updateIsLogged] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      updateIsLogged(true);
    } else {
      updateIsLogged(false);
    }
  }, [sessionStorage.getItem("token")]);

  const handlePageActive = (page) => {
    updateActive(page);
  };

  return (
    <>
      <BrowserRouter>
        <nav>
          <div>
            <img src="img/logo.png" alt="logo step" />
          </div>
          {isLogged && (
            <div>
              <ul>
                <li>
                  <Link
                    to="/home"
                    style={{
                      borderBottom:
                        isActive === 0
                          ? "1px solid #140A82"
                          : "0px solid #140A82",
                    }}
                  >
                    <img
                      className="icone"
                      src="img/icone-home.png"
                      alt="icone-accueil"
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/carnet-d-adresses"
                    style={{
                      borderBottom:
                        isActive === 1
                          ? "1px solid #140A82"
                          : "0px solid #140A82",
                    }}
                  >
                    <img
                      className="icone"
                      src="img/icone-favoris.png"
                      alt="icone-adresses-envois"
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/historique"
                    style={{
                      borderBottom:
                        isActive === 2
                          ? "1px solid #140A82"
                          : "0px solid #140A82",
                    }}
                  >
                    <img
                      className="icone"
                      src="img/icone-tableau.png"
                      alt="icone-historique-envois"
                    />
                  </Link>
                </li>
                <li id="logout">
                  <Link to="/logout">
                    <img
                      className="icone"
                      src="img/icone-logout.png"
                      alt="icone-deconnexion"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              isLogged ? (
                <Home onPageLanding={handlePageActive} />
              ) : (
                <Connexion />
              )
            }
          />
          <Route
            path="/home"
            element={
              isLogged ? (
                <Home onPageLanding={handlePageActive} />
              ) : (
                <Connexion />
              )
            }
          />
          <Route
            path="/historique"
            element={<Historique onPageLanding={handlePageActive} />}
          />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/carnet-d-adresses"
            element={<AdressesFavorites onPageLanding={handlePageActive} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Header;
