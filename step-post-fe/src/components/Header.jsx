import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Logout from "./Logout";
import Connexion from "./Connexion";
import '../styles/Header.css';
import NouvelEnvoi from "./NouvelEnvoi";
import { useEffect, useState } from "react";
import Historique from "./Historique";

function Header() {

    const [isActive, updateActive] = useState(0);

    return (
        <>
            <BrowserRouter>
                <nav>
                    <div>
                        <img src="img/logo.png" alt="logo step" />
                    </div>
                    <div>
                        <ul>
                            <li>
                                <Link to="/home"
                                    style={{ borderBottom: isActive === 0 ? "1px solid #140A82" : "0px solid #140A82" }}
                                    onClick={() => updateActive(0)}>
                                    <img className="icone" src="img/icone-home.png" alt="icone-accueil" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/historique"
                                    style={{ borderBottom: isActive === 1 ? "1px solid #140A82" : "0px solid #140A82" }}
                                    onClick={() => updateActive(1)}>
                                    <img className="icone" src="img/icone-tableau.png" alt="icone-historique-envois" />
                                </Link>
                            </li>
                            <li id="logout">
                                <Link to="/logout">
                                    <img className="icone" src="img/icone-logout.png" alt="icone-deconnexion" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Connexion />} />
                    <Route path="/historique" element={<Historique />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/nouvel-envoi" element={<NouvelEnvoi />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Header;