import { formatDate, toTitleCase } from "../../modules/formatter";
import "./DetailsCourrier.css";

function DetailsCourrier(props) {
  const statuts = props.statutsCourrier;
  const dest = statuts[0].courrier;
  let tab = [];

  for (let i = 0; i < statuts.length; i++) {
    tab.push(
      <>
        <div className="cercleContainer" key={i}>
          <div className="cercle"></div>
          <div className="statuts">{statuts[i].etat}</div>
          <div className="statuts-date">{formatDate(statuts[i].date)} </div>
        </div>
        <div className="trait"></div>
      </>
    );
  }

  return (
    <>
      <article className="timeline">
        <div>{tab}</div>
      </article>
      <article className="details">
        <div key={`${dest.id}-${dest.name}`}>
          <p>{toTitleCase(`${dest.civilite} ${dest.prenom} ${dest.name}`)}</p>
          <p>{toTitleCase(`${dest.adresse}`)}</p>
          <p>{toTitleCase(`${dest.codePostal} ${dest.ville}`)}</p>
        </div>
      </article>
    </>
  );
}

export default DetailsCourrier;
