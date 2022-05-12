import { toTitleCase } from "../modules/formatter";

function rechercheNom(props) {

    function handleClick() {
        props.onRetourBtn();
    }

    return (
        <>
            <div className="rechercheNom">
                <h4>Résultat(s) de la recherche pour : {toTitleCase(props.nom)}</h4>
                <button className="button" onClick={handleClick}>Retour</button>
            </div>
        </>
    )
}

export default rechercheNom;