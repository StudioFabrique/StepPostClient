import React, { Component } from "react";
import ListeCourriers from "../../components/ListeCourriers/ListeCourriers";
import { postData } from "../../modules/fetchData";
import "./Home.css";
import Recherche from "../../components/Recherche/Recherche";
import DetailsRecherche from "../../components/DetailsRecherche/DetailsRecherche";
import RechercheNom from "../../components/RechercheNom/RechercheNom";
import NoResults from "../../components/NoResults/NoResults";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noResults: false,
      rechercheNom: false,
      statuts: [],
      page: 0,
      isRechercheActive: false,
      rechercheValue: {},
    };
  }

  async componentDidMount() {
    this.handleResetList();
    this.props.onPageLanding(0);
  }

  async handleClick(p, operator) {
    const datas = [p, this.max, this.nom, false];
    const response = await postData(`/get-courriers`, datas);
    if (operator === "minus") {
      this.setState({ statuts: response.statuts, page: this.state.page - 1 });
    } else {
      this.setState({ statuts: response.statuts, page: this.state.page + 1 });
    }
  }

  handleCloseRecherche = () => {
    this.setState({ isRechercheActive: false, rechercheValue: {} });
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
    const response = await postData("/nom", [value, true]);
    if (response.result === false) {
      this.setState({ noResults: true });
    } else {
      this.setState({ statuts: response.result, rechercheNom: true });
    }
  };

  handleResetList = async () => {
    /**
     * true signifie ici qu'on veut en retours les courriers en cours de distribution.
     */
    const response = await postData(`/courriers`, [true]);
    this.setState({
      statuts: response.result,
      isRechercheActive: false,
      rechercheNom: false,
      noResults: false,
    });
  };

  handleBtnRetour = () => {
    this.handleResetList();
  };

  render() {
    return (
      <main className="home-main">
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
        <ListeCourriers courriers={this.state.statuts} />
      </main>
    );
  }
}

export default Home;
