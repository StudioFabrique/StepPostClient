import React, { Component } from "react";
import "./AdressesFavorites.css";
import ListeAdresses from "../../components/ListeAdresses/ListeAdresses";
import NouvelEnvoi from "../../components/NouvelEnvoi/NouvelEnvoi";
import AdresseForm from "../../components/AdresseForm/AdresseForm";
import { postData } from "../../modules/fetchData";

class AdressesFavorites extends Component {
  constructor(props) {
    super(props);
    // section 0 : liste d'adresses, 1 : création de bordereau, 2 : édition d'adresse, 3 : création d'adresse
    this.state = { section: 0 };
    this.newId = null;
  }

  componentDidMount() {
    this.props.onPageLanding(1);
  }

  handleSectionUpdate = (newId, section) => {
    this.newId = newId;
    this.setState({ section: section });
  };

  handleRetour = () => {
    this.setState({ section: 0 });
  };
  //  affiche le formulaire d'ajout d'adresse
  handleNouvelleAdresse = () => {
    this.setState({ section: 3 });
  };
  //  envoie la nouvelle adresse au service back-end pour l'enregistrer
  handleAjouterAdresse = async (adresse) => {
    await postData("/add-adresse", adresse);
    this.setState({ section: 0 });
  };
  //  envoie l'adresse modifiée au back-end pour la mettre à jour
  handleEditerAdresse = async (adresse) => {
    await postData("/edit-adresse", adresse);
    this.setState({ section: 0 });
  };

  render() {
    return (
      <main className="main-nouvel-envoi">
        {this.state.section === 0 && (
          <ListeAdresses
            onClickIcone={this.handleSectionUpdate}
            onNewAdress={this.handleNouvelleAdresse}
          />
        )}
        {this.state.section === 1 && (
          <NouvelEnvoi adresse={this.newId} onRetour={this.handleRetour} />
        )}
        {this.state.section === 2 && (
          <AdresseForm
            id={this.newId}
            onRetour={this.handleRetour}
            onEditerAdresse={this.handleEditerAdresse}
          />
        )}
        {this.state.section === 3 && (
          <AdresseForm
            onRetour={this.handleRetour}
            onAjouterAdresse={this.handleAjouterAdresse}
          />
        )}
      </main>
    );
  }
}

export default AdressesFavorites;
