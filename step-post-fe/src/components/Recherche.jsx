import { useState } from "react";
import { testField } from "../modules/checkForm";
import { regexName, regexNumbers } from "../modules/data";
import "../styles/Recherche.css";

function Recherche({ onRecherche }) {
  const [value, setValue] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    let testName = testField(regexName, value);
    let testNumbers = testField(regexNumbers, value);
    if ((testName || testNumbers) && value.length !== 0) {
      onRecherche(value);
    }
  }

  return (
    <>
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
    </>
  );
}

export default Recherche;
