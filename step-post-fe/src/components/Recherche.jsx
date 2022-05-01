import { useState } from "react";
import { postData } from "../modules/postData";
import '../styles/Recherche.css';

function Recherche({ onRecherche }) {
    const [value, setValue] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        if (value) {
            onRecherche(value);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" id="searchInput" onChange={(e) => setValue(e.target.value)} />
                <img src="img/icone-loupe.png" alt="icone loupe" />
            </form>
        </>
    )
}

export default Recherche;