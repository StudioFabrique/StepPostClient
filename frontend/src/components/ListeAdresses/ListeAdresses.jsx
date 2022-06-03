import React, { Component } from "react";
import { postData, getData } from "../../modules/postData.js";
import RechercheNom from "../RechercheNom/RechercheNom";
import NoResults from "../NoResults/NoResults";
import Destinataire from "../Destinataire/Destinataire";
import RechercheAdresse from "../RechercheAdresse/RechercheAdresse";

class ListeAdresses extends Component {
  constructor(props) {
    super(props);
    this.state = { adresses: [], rechercheNom: false, noResults: false };
    this.nom = "";
  }

  componentDidMount() {
    this.handleRefreshAdresses();
  }

  handleRecherche = async (nom) => {
    this.nom = nom;
    if (this.nom.length === 0) {
      this.setState({ rechercheNom: false, noResults: false });
    }
    const response = await postData(`/adressesFavorites`, [nom]);
    if (response.destinataires !== false) {
      if (this.nom.length === 0) {
        this.setState({
          adresses: response.destinataires,
          rechercheNom: false,
          noResults: false,
        });
      } else {
        this.setState({
          adresses: response.destinataires,
          rechercheNom: true,
          noResults: false,
        });
      }
    } else {
      if (this.nom.length === 0) {
        this.setState({ adresses: [], noResults: false, rechercheNom: false });
      } else {
        this.setState({ adresses: [], noResults: true, rechercheNom: false });
      }
    }
  };

  handleBtnRetour = async () => {
    this.nom = "";
    const response = await getData("/adressesFavorites");
    this.setState({
      adresses: response.destinataires,
      rechercheNom: false,
      noResults: false,
    });
  };

  handleRefreshAdresses = async () => {
    const response = await getData("/adressesFavorites");
    this.setState({ adresses: response.destinataires, section: "adresses" });
  };

  handleClickIcone = (newId, section) => {
    this.props.onClickIcone(newId, section);
  };

  render() {
    return (
      <>
        <section className="section-recherche">
          <RechercheAdresse onRecherche={this.handleRecherche} />
        </section>
        {this.state.rechercheNom ? (
          <section className="section-recherche-nom">
            <RechercheNom nom={this.nom} onRetourBtn={this.handleBtnRetour} />
            <span className="bouton-ajouter">
              <h4>Nouvelle adresse</h4>
              <button onClick={this.props.onNewAdress}>
                <img src="img/plus-btn.png" alt="lien nouvelle adresse" />
              </button>
            </span>
          </section>
        ) : (
          <section className="section-recherche-nom">
            <span className="bouton-ajouter">
              <h4>Nouvelle adresse</h4>
              <button onClick={this.props.onNewAdress}>
                <img src="img/plus-btn.png" alt="lien nouvelle adresse" />
              </button>
            </span>
          </section>
        )}
        {this.state.noResults && (
          <section className="section-no-results">
            <NoResults nom={this.nom} onRetourBtn={this.handleBtnRetour} />
          </section>
        )}
        <section className="section-adresses">
          {this.state.adresses.map((adresse, index) => {
            return (
              <Destinataire
                key={`${index}-${adresse.id}`}
                onDelete={this.handleRefreshAdresses}
                adresse={adresse}
                onClickIcone={this.handleClickIcone}
              />
            );
          })}
        </section>
      </>
    );
  }
}

export default ListeAdresses;
