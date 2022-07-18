import { useState } from "react";
import { testField } from "../../modules/checkForm";
import { regexName, regexNumbers } from "../../modules/data";
import { testRechercheForm } from "../../modules/recherche";
import "./Recherche.css";

function Recherche({ onRechercheBordereau, onRechercheNom }) {
  const [value, setValue] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (testRechercheForm(value) === "bordereau") {
      onRechercheBordereau(value);
    } else {
      onRechercheNom(value);
    }
  }

  return (
    <form className="form-recherche" onSubmit={handleSubmit}>
      <div>
        <label>Numéro de bordereau / Nom du destinataire</label>
      </div>
      <div>
        <input
          type="text"
          id="searchInput"
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="button" type="">
          <img src="img/icone-chercher.png" alt="icone loupe" />
        </button>
      </div>
    </form>
  );
}

export default Recherche;
