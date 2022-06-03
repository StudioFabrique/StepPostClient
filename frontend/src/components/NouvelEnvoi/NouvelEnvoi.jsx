import React, { Component } from "react";
import { toTitleCase } from "../../modules/formatter";
import Bordereau from "../Bordereau/Bordereau";
import "./NouvelEnvoi.css";
import AdresseForm from "../AdresseForm/AdresseForm";

class NouvelEnvoi extends Component {
  constructor(props) {
    super(props);
    this.state = { type: "", dest: [], section: 0, instructions: "" };
  }

  componentDidMount = async () => {
    const dest = this.props.adresse;
    if (!dest.telephone) {
      dest.telephone = "non disponible";
    }
    this.setState({ dest: dest });
  };

  handleRadioChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleRetourAdresses = () => {
    this.props.onRetour();
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.type) {
      alert("Choisissez un type de courrier svp.");
    } else {
      this.setState({ section: 2 });
    }
  };

  handleModifications = (newDest) => {
    this.setState({ dest: newDest, section: 0 });
  };

  handleRetour = () => {
    this.setState({ section: 0 });
  };

  handleModifier = () => {
    this.setState({ section: 1 });
  };

  handleInstructions = (event) => {
    this.setState({ instructions: event.target.value });
  };

  render() {
    return (
      <>
        {this.state.section === 0 && (
          <section className="section-ne-dest">
            <form className="form-ne-dest" onSubmit={this.handleSubmit}>
              <div>
                <label>
                  Lettre
                  <input
                    type="radio"
                    value="1"
                    name="type"
                    checked={this.state.type === "1"}
                    onChange={this.handleRadioChange}
                  />
                </label>
                <label>
                  Colis
                  <input
                    type="radio"
                    value="0"
                    name="type"
                    checked={this.state.type === "0"}
                    onChange={this.handleRadioChange}
                  />
                </label>
              </div>
              <article className="article-ne-dest">
                <div>
                  <p>
                    {toTitleCase(
                      `${this.state.dest.civilite} ${this.state.dest.prenom} ${this.state.dest.nom}`
                    )}
                  </p>
                  <p>{toTitleCase(this.state.dest.adresse)}</p>
                  <p>{this.state.dest.complement}</p>
                  <p>
                    {toTitleCase(
                      `${this.state.dest.codePostal} ${this.state.dest.ville}`
                    )}
                  </p>
                  <p>{`(tél : ${this.state.dest.telephone})`}</p>
                </div>
                <div>
                  <span>
                    <button className="button" onClick={this.handleModifier}>
                      Modifier
                    </button>
                  </span>
                </div>
              </article>
              <article className="article-ne-instructions">
                <label>
                  Instruction de livraison :
                  <textarea
                    cols="30"
                    rows="3"
                    name="instructions"
                    value={this.state.instructions}
                    onChange={this.handleInstructions}
                  />
                </label>
              </article>
              <article className="article-ne-buttons">
                <div>
                  <button
                    className="button"
                    onClick={this.handleRetourAdresses}
                  >
                    Retour
                  </button>
                  <input
                    type="submit"
                    className="button-valider"
                    value="valider"
                  />
                </div>
              </article>
            </form>
          </section>
        )}
        {this.state.section === 1 && (
          <AdresseForm
            id={this.state.dest}
            onEditerAdresse={this.handleModifications}
            onRetour={this.handleRetour}
          />
        )}
        {this.state.section === 2 && (
          <Bordereau
            adresse={this.state.dest}
            type={parseInt(this.state.type)}
            instructions={this.state.instructions}
            onRetour={this.handleRetour}
          />
        )}
      </>
    );
  }
}

export default NouvelEnvoi;
