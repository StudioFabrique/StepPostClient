import { useState } from "react";
import {
  formatDate,
  setEtatMessage,
  toTitleCase,
} from "../../modules/formatter";
import { postData } from "../../modules/fetchData";
import DetailsCourrier from "../DetailsCourrier/DetailsCourrier";

function Courrier({ statut, onCourrierClick }) {
  const [statutsCourrier, setStatutsCourrier] = useState([]);

  async function handleClick() {
    const response = await postData(`/details-courrier`, [statut.courrier.id]);
    setStatutsCourrier(response.statuts);
    onCourrierClick(statut.id);
  }

  return (
    <article
      className="courrier"
      key={`${statut.id}-${statut.courrier.bordereau}`}
      onClick={handleClick}
      style={{ backgroundColor: statut.isActive ? "#E0E0E0" : "white" }}
    >
      <div>
        <h4 className="date">{formatDate(statut.date)}</h4>
        <p>Bordereau n° : {statut.courrier.bordereau}</p>
      </div>
      <div>
        <span>
          <p>
            {setEtatMessage(
              statut.statut.etat,
              toTitleCase(statut.courrier.name)
            )}
          </p>
        </span>
        <span>{statut.courrier.type === 0 ? <p>Colis</p> : <p>Lettre</p>}</span>
      </div>
      <div className="detailsLivraison">
        {statut.isActive && (
          <DetailsCourrier statutsCourrier={statutsCourrier} />
        )}
      </div>
    </article>
  );
}
export default Courrier;
