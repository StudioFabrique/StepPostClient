import React, { useEffect, useState } from "react";
import { postData } from "../../modules/postData";
import "./Bordereau.css";
import PopupConfirmation from "../PopupConfirmation/PopupConfirmation";
import { baseUrl } from "../../modules/data/baseUrl";
import Adresse from "../Adresse/Adresse";

function Bordereau(props) {
  let valider = false;
  const msg = "Confirmer l'impression du bordereau svp.";
  const [qrcode, updateQrcode] = useState("");
  const [bordereau, updateBordereau] = useState("-----");
  const [isSubmitted, updateIsSubmitted] = useState(false);
  const [exp, updateExp] = useState({});
  const [dest, updateDest] = useState([]);
  const [type, updateType] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    updateDest(props.adresse);
    fetch(`${baseUrl}/expediteur`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }).then((response) => response.json().then(({ exp }) => updateExp(exp)));
    updateType(props.type);
    if (!dest.telephone) {
      dest.telephone = "non disponible";
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      window.print();
      valider = true;
    }
  }, [isLoaded]);

  const handleRetour = () => {
    props.onRetour();
  };

  const handleQrCode = async () => {
    if (!valider) {
      updateIsSubmitted(true);
    } else {
      alert("Votre bordereau est déjà en cours d'impression.");
    }
  };

  const handleConfirm = async () => {
    const response = await postData("/qrcode", [dest.id, type]);
    updateQrcode(response.qrcode);
    updateBordereau(response.bordereau);
    updateIsSubmitted(false);
  };
  const handleCancel = () => {
    updateIsSubmitted(false);
    valider = false;
  };

  return (
    <main className="main-bordereau">
      <section className="section-bordereau-exp">
        <article className="article-exp-left">
          <div>
            <img src="img/logo.png" alt="logo step post" />
            <div>
              <input
                type="checkbox"
                name="type"
                checked={type === 1}
                readOnly
              />
              <label htmlFor="lettre">Lettre</label>
              <input
                type="checkbox"
                name="type"
                checked={type === 0}
                readOnly
              />
              <label htmlFor="colis">Colis</label>
            </div>
            <p>Date et cachet STEP POST</p>
          </div>
          <div>
            <p>STEP POST Opérateur Postal</p>
            <p>Autorisation n°12-0098</p>
            <p>Technopolis Hélioparc</p>
            <p>2 av. du Président Pierre Angot 64000 PAU</p>
            <p>RCS de Pau 434 805 644</p>
          </div>
        </article>
        <article className="article-exp-right">
          <div>
            <h2>SIGNEO</h2>
            <p>Le service recommandé de Step Post</p>
          </div>
          <div>
            <h3>Expéditeur</h3>
            <span>{exp && <Adresse adresse={exp} isDest={false} />}</span>
          </div>
        </article>
      </section>
      <section className="section-bordereau-dest">
        <article className="article-dest-left">
          <div>
            {qrcode ? (
              <img src={qrcode} alt="qrcode" onLoad={() => setIsLoaded(true)} />
            ) : (
              <h5>
                Le QR code et le numéro de bordereau seront générés lors de
                l'impression.
              </h5>
            )}
          </div>
          <div>
            <p>Bordereau n° {bordereau}</p>
          </div>
        </article>
        <article className="article-dest-right">
          <div>
            <h3>Destinataire</h3>
            <span>
              {dest && (
                <Adresse
                  adresse={dest}
                  instructions={props.instructions}
                  isDest={true}
                />
              )}
            </span>
          </div>
          <div>
            <p>Signature :</p>
            <span>
              <p>Date :</p>
              <p> .. / .. / .. </p>
            </span>
          </div>
        </article>
      </section>
      <section className="section-bordereau-buttons">
        <div>
          <button className="button" onClick={handleRetour}>
            Retour
          </button>
          <button className="button-valider" onClick={handleQrCode}>
            Imprimer
          </button>
        </div>
      </section>
      {isSubmitted && (
        <PopupConfirmation
          msg={msg}
          onCancelClick={handleCancel}
          onConfirmClick={handleConfirm}
        />
      )}
    </main>
  );
}

export default Bordereau;
