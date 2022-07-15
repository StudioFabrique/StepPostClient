import { toTitleCase } from "../../modules/formatter";

function NoResults({ onCloseButton }) {
  return (
    <div className="rechercheNom">
      <h4>Aucun résultat(s) </h4>
      <button className="button" onClick={() => onCloseButton()}>
        Retour
      </button>
    </div>
  );
}

export default NoResults;
