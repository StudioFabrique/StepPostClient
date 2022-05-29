import { toTitleCase } from "../modules/formatter";

function NoResults({ nom, onRetourBtn }) {

    function handleClick() {
        onRetourBtn();
    }

    return (
        <>
            <div className="rechercheNom">
                <h4>Aucun résultat(s) trouvés pour : {toTitleCase(nom)} </h4>
                <button className="button" onClick={handleClick}>Retour</button>
            </div>
        </>
    )
}

export default NoResults;