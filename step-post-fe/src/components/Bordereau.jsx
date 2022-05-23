import React, { Component, useEffect, useState } from "react";
import { getData, getQrcode, postData } from "../modules/postData";
import Adresse from "./Adresse";
import "../styles/Bordereau.css";
import { qrcodeUrl } from "../modules/data";
import PopupConfirmation from "./PopupConfirmation";

function Bordereau(props) {
  let valider = false;
  const msg = "Confirmer l'impression du bordereau svp.";
  let type;
  const [qrcode, updateQrcode] = useState("");
  const [bordereau, updateBordereau] = useState("-----");
  const [isSubmitted, updateIsSubmitted] = useState(false);
  const [exp, upsdateExp] = useState([]);
  const [dest, updateDest] = useState([]);

  useEffect(() => {
    updateDest(props.adresse);
    upsdateExp(props.exp);
    console.log("exp", exp);
    type = props.type;
    if (!dest.telephone) {
      dest.telephone = "non disponible";
    }
    console.log("type", type);
    console.log("dest", dest);
  }, [props]);

  useEffect(() => {
    if (qrcode !== "") {
      window.print();
    }
  }, [qrcode]);

  const handleRetour = () => {
    props.onRetour();
  };

  const handleQrCode = async () => {
    if (!valider) {
      if (type === "lettre") {
        type = 1;
      } else {
        type = 0;
      }
      updateIsSubmitted(true);
    } else {
      alert("Votre bordereau est déjà en cours d'impression.");
    }
  };

  const setExp = async () => {
    return await getData("/expediteur");
  };

  const handleConfirm = async () => {
    const response = await postData("/qrcode", [dest.id, type]);
    updateQrcode(response.qrcode);
    updateBordereau(response.bordereau);
    valider = true;
    updateIsSubmitted(false);
  };
  const handleCancel = () => {
    updateIsSubmitted(false);
    valider = false;
  };
  /* class Bordereau extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exp: [],
      dest: [],
      qrcode: "",
      bordereau: "-----",
      isSubmitted: false,
    };
    this.type = "";
    this.valider = false;
    this.dest = this.props.adresse;
    this.msg = "Confirmer l'impression du bordereau svp.";
  }

  componentDidMount = async () => {
    const response = await getData("/expediteur");
    if (!this.dest.telephone) {
      this.dest.telephone = "non disponible";
    }
    this.setState({
      exp: response.exp,
      dest: this.dest,
      type: this.props.type,
    });
  };

  componentDidUpdate = () => {
    if (qrcode !== "") {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  };

  handleRetour = () => {
    this.props.onRetour();
  };

  handleQrCode = async () => {
    if (!this.valider) {
      if (this.type === "lettre") {
        this.type = 1;
      } else {
        this.type = 0;
      }
      this.setState({ isSubmitted: true });
    } else {
      alert("Votre bordereau est déjà en cours d'impression.");
    }
  };

  handleConfirm = async () => {
    const response = await postData("/qrcode", [dest.id, this.type]);
    this.setState({
      qrcode: response.qrcode,
      bordereau: response.bordereau,
    });
    this.valider = true;
    this.setState({ isSubmitted: false });
  };

  handleCancel = () => {
    this.setState({ isSubmitted: false, valider: false });
  }; */

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
                checked={type === "lettre"}
                readOnly
              />
              <label htmlFor="lettre">Lettre</label>
              <input
                type="checkbox"
                name="type"
                checked={type === "colis"}
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
              <img src={qrcode} alt="qrcode" />
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
