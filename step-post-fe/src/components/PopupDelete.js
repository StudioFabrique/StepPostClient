import { toTitleCase } from "../modules/formatter";
import '../styles/Popup.css';

function PopupDelete({adresse, onCancelClick, onConfirmClick}) {
    return (
        <>
        <div className="screen"></div>
        <article className="popup">
            <h4>Confirmez vous la suppression de cette adresse ?</h4>
            <div>
                <p>{toTitleCase(`${adresse.civilite} ${adresse.prenom} ${adresse.nom}`)}</p>
                <p>{toTitleCase(adresse.adresse)}</p>
                <p>{toTitleCase(`${adresse.codePostal} ${adresse.ville}`)}</p>
            </div>
            <div className="popup-buttons">
                <button className="button" onClick={() => onCancelClick()}>Annuler</button>
                <button className="button-valider" onClick={() => onConfirmClick(adresse.id)}>Confirmer</button>
            </div>
        </article>
        </>
    )
} 

export default PopupDelete;