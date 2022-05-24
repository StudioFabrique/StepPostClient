import { useState } from "react";
import { toTitleCase } from "../modules/formatter";
import "../styles/Destinataire.css";
import PopupDelete from "./PopupDelete";
import { postData } from "../modules/postData";

function Destinataire(props) {
  const adresse = props.adresse;
  const [popupIsActive, updatePopupIsActive] = useState(false);

  const handleCancel = () => {
    updatePopupIsActive(false);
  };

  const handleConfirm = async (id) => {
    const response = await postData(`/deleteAdresse`, [id]);
    if (response.result) {
      updatePopupIsActive(false);
      props.onDelete();
    }
  };

  const handleNewBordereau = () => {
    props.onNewBordereau(adresse.id);
  };

  const handleClickIcone = (newId, section) => {
    props.onClickIcone(newId, section);
  };

  return (
    <>
      <article className="adresse" id="{adresse.id}">
        <div>
          <span>
            {adresse.civilite ? (
              <p>{toTitleCase(adresse.civilite)}&nbsp;</p>
            ) : null}
            <p>{adresse.nom.toUpperCase()}&nbsp;</p>
            <p>{toTitleCase(adresse.prenom)}&nbsp;</p>
          </span>
          <p>{toTitleCase(adresse.adresse)}</p>
          <p>
            {adresse.codePostal} {toTitleCase(adresse.ville)}
          </p>
        </div>
        <ul>
          <li key={Date.now()} id="adresse.id">
            <img
              src="img/icone-poste.png"
              alt="envoyer"
              onClick={() => handleClickIcone(adresse, 1)}
            />
          </li>
          <li key={Date.now() + 1} id="adresse.id">
            <img
              src="img/icone-edit.png"
              alt="editer"
              onClick={() => handleClickIcone(adresse, 2)}
            />
          </li>
          <li key={Date.now() + 2} id="adresse.id">
            <img
              src="img/icone-delete.png"
              alt="supprimer"
              onClick={() => updatePopupIsActive(true)}
            />
          </li>
        </ul>
      </article>
      {popupIsActive ? (
        <PopupDelete
          adresse={adresse}
          onCancelClick={handleCancel}
          onConfirmClick={handleConfirm}
        />
      ) : null}
    </>
  );
}

export default Destinataire;
