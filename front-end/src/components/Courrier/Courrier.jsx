import { useState } from "react";
import {
  formatDate,
  setEtatMessage,
  toTitleCase,
} from "../../modules/formatter";
import { postData } from "../../modules/fetchData";
import DetailsCourrier from "../DetailsCourrier/DetailsCourrier";

function Courrier({ courrier, onCourrierClick }) {
  const [statuts, setStatuts] = useState([]);

  async function handleClick() {
    const response = await postData(`/details-courrier`, [courrier.id]);
    setStatuts(response.result);
    onCourrierClick(courrier.id);
  }

  return (
    <article
      className="courrier"
      id={`${courrier.id}-${courrier.bordereau}`}
      onClick={handleClick}
      style={{ backgroundColor: courrier.isActive ? "#E0E0E0" : "white" }}
    >
      <div>
        <h4 className="date">{formatDate(courrier.date)}</h4>
        <p>Bordereau n° : {courrier.bordereau}</p>
      </div>
      <div>
        <span>
          <p>{setEtatMessage(courrier.etat, toTitleCase(courrier.nom))}</p>
        </span>
        <span>{courrier.type === 0 ? <p>Colis</p> : <p>Lettre</p>}</span>
      </div>
      <div className="detailsLivraison">
        {courrier.isActive && (
          <DetailsCourrier
            statuts={statuts}
            destinataire={{
              civilite: courrier.civilite,
              prenom: courrier.prenom,
              nom: courrier.nom,
              adresse: courrier.adresse,
              codePostal: courrier.codePostal,
              ville: courrier.ville,
            }}
          />
        )}
      </div>
    </article>
  );
}
export default Courrier;
