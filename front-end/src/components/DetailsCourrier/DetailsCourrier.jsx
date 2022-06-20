import { formatDate, toTitleCase } from "../../modules/formatter";
import "./DetailsCourrier.css";

function DetailsCourrier(props) {
  const statuts = props.detailsCourrier;
  const dest = props.destinataire;

  return (
    <>
      <article className="timeline">
        <div>
          {statuts.map((statut, index) => {
            return (
              <>
                <div className="cercleContainer">
                  <div className="cercle"></div>
                  <div className="statuts">{statut.etat}</div>
                  <div className="statuts-date">{formatDate(statut.date)} </div>
                </div>
                <div className="trait"></div>
              </>
            );
          })}
        </div>
      </article>
      <article className="details">
        <div>
          <p>{toTitleCase(`${dest.civilite} ${dest.prenom} ${dest.nom}`)}</p>
          <p>{toTitleCase(`${dest.adresse}`)}</p>
          <p>{toTitleCase(`${dest.codePostal} ${dest.ville}`)}</p>
        </div>
      </article>
    </>
  );
}

export default DetailsCourrier;
