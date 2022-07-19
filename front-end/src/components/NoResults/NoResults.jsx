import { toTitleCase } from "../../modules/formatter";

function NoResults({ onRetourBtn }) {
  return (
    <div className="rechercheNom">
      <h4>Aucun résultat(s) trouvés. </h4>
      <button className="button" onClick={() => onRetourBtn()}>
        Retour
      </button>
    </div>
  );
}

export default NoResults;
