import "./Header.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider";

function Header({ pageActive }) {
  const [isActive, updateActive] = useState(null);
  const auth = useAuth();
  const token = auth.token;

  useEffect(() => updateActive(pageActive), [pageActive]);

  return (
    <nav>
      <div>
        <img src="img/logo.png" alt="logo step" />
      </div>
      {token && (
        <div>
          <ul>
            <li>
              <Link
                to="/"
                style={{
                  borderBottom:
                    isActive === 0 ? "1px solid #140A82" : "0px solid #140A82",
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
                    isActive === 1 ? "1px solid #140A82" : "0px solid #140A82",
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
                    isActive === 2 ? "1px solid #140A82" : "0px solid #140A82",
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
  );
}

export default Header;
