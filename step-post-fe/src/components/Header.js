import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Logout from "./Logout";
import Logs from "./Logs";
import '../styles/Header.css';

function Header() {
    return (
        <>
            <BrowserRouter>
                <nav>
                    <div>
                        <img src="img/logo.png" alt="logo step"/>
                    </div>
                    <div>
                        <ul>
                            <li>
                                <Link to="/"><img class="icone" src="img/icone-home.png" alt="icone-accueil"/></Link>
                            </li>
                            <li>
                                <Link to="/historique"><img class="icone" src="img/icone-tableau.png" alt="icone-historique-envois"/></Link>
                            </li>
                            <li id="logout">
                                <Link to="/logout"><img class="icone" src="img/icone-logout.png" alt="icone-deconnexion"/></Link>
                            </li>
                    </ul>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>
        </>
    )
}

export default Header;