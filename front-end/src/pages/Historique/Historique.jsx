import React, { Component } from "react";
import { postData } from "../../modules/fetchData";
import Recherche from "../../components/Recherche/Recherche";
import DetailsRecherche from "../../components/DetailsRecherche/DetailsRecherche";
import RechercheNom from "../../components/RechercheNom/RechercheNom";
import NoResults from "../../components/NoResults/NoResults";
import "./Historique.css";
import ListeHistoriques from "../../components/ListeHistoriques/ListeHistoriques";
import { triTableau } from "../../modules/triTableaux";

class Historique extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noResults: false,
      rechercheNom: false,
      statuts: [],
      isRechercheActive: false,
      rechercheValue: [],
      loading: false,
    };
    this.filtre = [false, false, false, false];
  }

  async componentDidMount() {
    this.refreshList();
    this.props.onPageLanding(2);
  }

  handleBtnRetour = () => {
    this.refreshList();
  };

  handleCloseRecherche = () => {
    this.setState({ isRechercheActive: false, rechercheValue: "" });
  };

  handleRechercheBordereau = async (value) => {
    this.setState({
      noResults: false,
      isRechercheActive: false,
    });
    const response = await postData("/bordereau", [value]);
    if (response.result === false) {
      this.setState({ noResults: true });
    } else {
      this.setState({
        isRechercheActive: true,
        rechercheValue: response.result,
      });
    }
  };

  handleRechercheNom = async (value) => {
    this.setState({
      noResults: false,
      isRechercheActive: false,
      rechercheNom: false,
    });
    const response = await postData("/nom", [value, false]);
    if (response.result === false) {
      this.setState({ noResults: true });
    } else {
      this.setState({ statuts: response.result, rechercheNom: true });
    }
  };

  handleSort = async (value) => {
    this.setState({ loading: true });
    this.filtre[value] = !this.filtre[value];
    this.setState({
      statuts: await triTableau(this.state.statuts, value, this.filtre[value]),
      loading: false,
    });
  };

  refreshList = async () => {
    const response = await postData(`/courriers`, [false]);
    this.setState({
      statuts: response.result,
      isRechercheActive: false,
      rechercheNom: false,
      noResults: false,
    });
  };

  render() {
    return (
      <main className="main-historique">
        <Recherche
          onRechercheBordereau={this.handleRechercheBordereau}
          onRechercheNom={this.handleRechercheNom}
        />
        {this.state.isRechercheActive && (
          <DetailsRecherche
            courrier={this.state.rechercheValue}
            onCloseRecherche={this.handleCloseRecherche}
          />
        )}
        {this.state.rechercheNom && (
          <RechercheNom
            nom={this.state.statuts[0].nom}
            civilite={this.state.statuts[0].civilite}
            total={this.state.statuts.length}
            onRetourBtn={this.handleBtnRetour}
          />
        )}
        {this.state.noResults && (
          <NoResults onRetourBtn={this.handleBtnRetour} />
        )}
        {!this.state.loading && (
          <ListeHistoriques
            courriers={this.state.statuts}
            onHistoriqueRowClick={this.handleRechercheBordereau}
            onSort={this.handleSort}
          />
        )}
      </main>
    );
  }
}

export default Historique;
