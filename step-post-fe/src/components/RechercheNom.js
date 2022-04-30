import { toTitleCase } from "../modules/formatter";
import '../styles/RechercheNom.css';

function rechercheNom({ nom, onRetourBtn }) {

    function handleClick() {
        onRetourBtn();
    }

    return (
        <>
            <div className="rechercheNom">
                <h4>Résultat(s) de la recherche pour : {toTitleCase(nom)}</h4>
                <button className="button" onClick={handleClick}>Retour</button>
            </div>
        </>
    )
}

export default rechercheNom;