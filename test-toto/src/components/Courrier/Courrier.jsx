import { useState } from "react";
import { postData } from "../../modules/fetchData";
import {
  formatDate,
  setEtatMessage,
  toTitleCase,
} from "../../modules/formatter";
import { useAuth } from "../AuthProvider/AuthProvider";
import DetailsCourrier from "../DetailsCourrier/DetailsCourrier";

function Courrier({ courrier, onClick }) {
  const [statuts, setStatuts] = useState([]);
  const auth = useAuth();

  const handleClick = async () => {
    const response = await postData(
      "http://127.0.0.1:8000/api/details-courrier",
      [courrier.id],
      auth.token
    );
    setStatuts(response.result);
    onClick(courrier.id);
  };

  return (
    <article className="courrier" onClick={handleClick}>
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
      {
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
      }
    </article>
  );
}
export default Courrier;
