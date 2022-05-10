import { useState } from "react";
import { testField } from "../modules/checkForm";
import { regexName, regexNumbers } from "../modules/data";
import '../styles/Recherche.css';

function Recherche({ onRecherche }) {
    const [value, setValue] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        let name = event.target.value;
            onRecherche(name);
    }

    return (
        <>
            <form className="form-recherche">
                <input type="text" id="searchInput" onChange={handleSubmit} />
                <img src="img/icone-loupe.png" alt="icone loupe" />
            </form>
        </>
    )
}

export default Recherche;