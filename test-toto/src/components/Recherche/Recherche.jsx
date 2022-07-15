import { useState } from "react";
import { postData } from "../../modules/fetchData";
import { useAuth } from "../AuthProvider/AuthProvider";
import { baseUrl } from "../../modules/data";
import "./Recherche.css";
import { testRechercheForm } from "../../modules/recherche";
import DetailsRecherche from "../DetailsRecherche/DetailsRecherche";
import NoResults from "../NoResults/NoResults";
import RechercheNom from "../RechercheNom/RechercheNom";

function Recherche({ onRechercheNom }) {
  const [value, setValue] = useState("");
  const [rechercheBordereau, updateRechercheBordereau] = useState(false);
  const [detailsRecherche, updateDetailsRecherche] = useState({});
  const [rechercheNom, updateRechercheNom] = useState(false);
  const [noResults, updateNoResults] = useState(false);
  const auth = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value.length !== 0) {
      let path = testRechercheForm(value);
      if (path === "nom") {
        setNom(value);
      } else {
        setBordereau(value);
      }
    }
  };

  const setBordereau = async (value) => {
    const response = await postData(
      `${baseUrl}/bordereau`,
      [value],
      auth.token
    );
    if (response !== false) {
      updateDetailsRecherche(response);
      updateRechercheBordereau(true);
    } else {
      updateNoResults(true);
    }
  };

  const setNom = (value) => {
    onRechercheNom(value);
    updateRechercheNom(true);
  };

  const handleCloseButton = () => {
    updateRechercheBordereau(false);
    updateNoResults(false);
  };

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
      {rechercheBordereau && (
        <DetailsRecherche
          courrier={detailsRecherche}
          onCloseButton={handleCloseButton}
        />
      )}
      {rechercheNom && <RechercheNom />}
      {noResults && <NoResults onCloseButton={handleCloseButton} />}
    </>
  );
}

export default Recherche;
