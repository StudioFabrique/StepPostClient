import React, { Component } from "react";
import PopupConfirmation from "../PopupConfirmation/PopupConfirmation";
import "./AdresseForm.css";
import {} from "../../modules/formatter";
import { testFormAdress } from "../../modules/checkForm";

class AdresseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      civilite: "",
      nom: "",
      prenom: "",
      adresse: "",
      complement: "",
      codePostal: "",
      ville: "",
      telephone: "",
      email: "",
      id: "",
      items: [],
      isSubmitted: false,
      erreur: false,
    };
    this.dest = this.props.id;
    this.onAjouterAdresse = this.props.onAjouterAdresse;
  }

  componentDidMount = () => {
    if (this.dest) {
      this.resetAdresse();
    }
  };

  resetAdresse = () => {
    if (!this.dest.civilite) {
      this.dest.civilite = "";
    }
    if (!this.dest.complement) {
      this.dest.complement = "";
    }
    if (!this.dest.telephone) {
      this.dest.telephone = "";
    }
    if (!this.dest.email) {
      this.dest.email = "";
    }
    this.setState({
      civilite: this.dest.civilite,
      nom: this.dest.nom,
      prenom: this.dest.prenom,
      adresse: this.dest.adresse,
      complement: this.dest.complement,
      codePostal: this.dest.codePostal,
      ville: this.dest.ville,
      telephone: this.dest.telephone,
      email: this.dest.email,
      id: this.dest.id,
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const items = [
      {
        civilite: this.state.civilite,
        nom: this.state.nom,
        prenom: this.state.prenom,
        adresse: this.state.adresse,
        complement: this.state.complement,
        codePostal: this.state.codePostal,
        ville: this.state.ville,
        telephone: this.state.telephone,
        email: this.state.email,
        id: this.state.id,
      },
    ];
    const result = testFormAdress(items[0]);
    if (result !== false) {
      this.setState({ items: result, isSubmitted: true, erreur: false });
    } else {
      this.setState({ erreur: true });
    }
  };

  handleCancel = () => {
    if (this.dest) {
      this.resetAdresse();
    }
    this.setState({ isSubmitted: false });
  };

  handleReset = () => {
    if (this.dest) {
      this.resetAdresse();
    } else {
      this.setState({
        civilite: "",
        nom: "",
        prenom: "",
        adresse: "",
        complement: "",
        codePostal: "",
        ville: "",
        telephone: "",
        email: "",
        id: "",
      });
    }
    console.log("state", this.state);
  };

  handleConfirm = () => {
    if (this.dest) {
      this.props.onEditerAdresse(this.state.items);
    } else {
      this.props.onAjouterAdresse(this.state.items);
    }
    this.setState({ isSubmitted: false });
  };

  render() {
    return (
      <>
        <article className="article-form-adresse">
          <div>
            <h3>Retour à la liste d'adresses</h3>
            <div>
              <button className="button" onClick={() => this.props.onRetour()}>
                Retour
              </button>
            </div>
          </div>
          <form className="form-edition" onSubmit={this.handleSubmit}>
            <div>
              <label>
                Civilité
                <select
                  value={this.state.civilite}
                  name="civilite"
                  onChange={this.handleChange}
                >
                  <option value="">----</option>
                  <option value="mr">Mr</option>
                  <option value="mme">Mme</option>
                </select>
              </label>
              <p>( Les champs marqués d'un * sont obligatoires )</p>
            </div>
            <div>
              <label>
                <div>
                  <p>Prénom / Service</p>
                  <p className="obligatoire">*</p>
                </div>
                <input
                  type="text"
                  placeholder="Jean"
                  value={this.state.prenom}
                  name="prenom"
                  onChange={this.handleChange}
                />
              </label>
              <label>
                <div>
                  <p>Nom / Entreprise</p>
                  <p className="obligatoire">*</p>
                </div>
                <input
                  type="text"
                  placeholder="Dupont"
                  value={this.state.nom}
                  name="nom"
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                <div>
                  <p>Adresse</p>
                  <p className="obligatoire">*</p>
                </div>
                <textarea
                  placeholder="2 rue du Château"
                  rows="2"
                  value={this.state.adresse}
                  name="adresse"
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                <div>
                  <p>Complément d'adresse</p>
                  <p className="obligatoire"></p>
                </div>
                <textarea
                  placeholder="au fond de la cour"
                  rows="2"
                  value={this.state.complement}
                  name="complement"
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                <div>
                  <p>Code Postal</p>
                  <p className="obligatoire">*</p>
                </div>
                <input
                  placeholder="64000"
                  type="text"
                  value={this.state.codePostal}
                  name="codePostal"
                  onChange={this.handleChange}
                />
              </label>
              <label>
                <div>
                  <p>Ville</p>
                  <p className="obligatoire">*</p>
                </div>
                <input
                  placeholder="Pau"
                  type="text"
                  value={this.state.ville}
                  name="ville"
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Téléphone
                <input
                  placeholder="0559585756"
                  type="text"
                  value={
                    this.state.telephone !== "non disponible"
                      ? this.state.telephone
                      : ""
                  }
                  name="telephone"
                  onChange={this.handleChange}
                />
              </label>
              <label>
                Email
                <input
                  placeholder="jean.dupont@exemple.fr"
                  type="text"
                  value={this.state.email}
                  name="email"
                  onChange={this.handleChange}
                />
              </label>
            </div>
            {this.state.erreur && (
              <div className="msg-form-erreur">
                <p>Un des champs est mal rempli !</p>
              </div>
            )}
            <div>
              <button
                className="button"
                type="button"
                onClick={this.handleReset}
              >
                Reinitialiser
              </button>
              <input className="button-valider" type="submit" value="Valider" />
            </div>
          </form>
        </article>
        {this.state.isSubmitted && (
          <PopupConfirmation
            msg={"Confirmez les modifications svp."}
            onCancelClick={this.handleCancel}
            onConfirmClick={this.handleConfirm}
          />
        )}
      </>
    );
  }
}

export default AdresseForm;
