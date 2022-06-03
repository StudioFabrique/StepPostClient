import React, { Component } from "react";
import { postData } from "../../modules/postData.js";
import Recherche from "../../components/Recherche/Recherche";
import DetailsRecherche from "../../components/DetailsRecherche/DetailsRecherche";
import RechercheNom from "../../components/RechercheNom/RechercheNom";
import NoResults from "../../components/NoResults/NoResults";
import Logs from "../../components/Logs/Logs";
import "./Historique.css";
import { resetSortArray } from "../../modules/sortArray.js";

class Historique extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noResults: false,
      rechercheNom: false,
      statuts: [],
      page: 0,
      isRechercheActive: false,
      rechercheValue: [],
    };
    this.max = 10;
    this.nom = "";
    this.tmpName = "";
    this.filtre = true;
    // false = 'DESC' true = 'ASC'
    this.direction = [false, false, false, false];
    this.sort = 0;
    this.total = 0;
  }

  async componentDidMount() {
    this.handleResetList();
    this.props.onPageLanding(2);
  }

  async handleClick(p, operator) {
    const datas = [
      p,
      this.max,
      this.nom,
      this.filtre,
      this.sort,
      this.direction[this.sort],
    ];
    const response = await postData(`/getLogs`, datas);
    if (operator === "minus") {
      this.setState({ statuts: response.statuts, page: this.state.page - 1 });
    } else {
      this.setState({ statuts: response.statuts, page: this.state.page + 1 });
    }
  }

  handleRecherche = async (msg) => {
    this.total = 0;
    if (this.state.isRechercheActive) {
      this.setState({ isRechercheActive: false });
    }
    const response = await postData(`/searchCourrier`, [msg]);
    if (response.statuts) {
      this.setState({ isRechercheActive: true, rechercheValue: response });
    } else if (response.statuts === false) {
      this.nom = msg;
      const response = await postData(`/getLogs`, [
        0,
        this.max,
        this.nom,
        this.filtre,
        0,
        false,
      ]);
      if (response.statuts !== false) {
        this.setState({
          statuts: response.statuts,
          page: 0,
          isRechercheActive: false,
          rechercheNom: true,
        });
        this.nom = response.statuts[0].nom;
        this.total = response.total;
      } else {
        this.setState({ noResults: true, rechercheNom: false });
        this.tmpName = this.nom;
        this.nom = "";
      }
    }
    this.direction = resetSortArray();
    this.sort = 0;
  };

  handleSort = async (sort) => {
    this.direction[sort] = !this.direction[sort];
    this.sort = sort;
    const response = await postData(`/getLogs`, [
      0,
      this.max,
      this.nom,
      this.filtre,
      this.sort,
      this.direction[this.sort],
    ]);
    this.setState({ statuts: response.statuts, page: 0 });
  };

  handleCloseRecherche = () => {
    this.setState({ isRechercheActive: false, rechercheValue: "" });
  };

  handleResetList = async () => {
    /**
     * datas : numéro de page, nbre max d'entrées, nom en cas de recherche, filtre "distribué ou pas"
     */
    this.direction = resetSortArray();
    this.sort = 0;
    const datas = [
      0,
      this.max,
      "",
      this.filtre,
      this.sort,
      this.direction[this.sort],
    ];
    const response = await postData(`/getLogs`, datas);
    this.setState({
      statuts: response.statuts,
      page: 0,
      isRechercheActive: false,
      rechercheNom: false,
      noResults: false,
    });
    this.nom = "";
    this.total = 0;
  };

  handleBtnRetour = () => {
    this.handleResetList();
  };

  render() {
    return (
      <>
        <main className="main-historique">
          <Recherche onRecherche={this.handleRecherche} />
          {this.state.isRechercheActive ? (
            <DetailsRecherche
              courrier={this.state.rechercheValue}
              onCloseRecherche={this.handleCloseRecherche}
            />
          ) : null}
          {this.state.rechercheNom ? (
            <RechercheNom
              nom={this.nom}
              total={this.total}
              onRetourBtn={this.handleBtnRetour}
            />
          ) : null}
          {this.state.noResults ? (
            <NoResults nom={this.tmpName} onRetourBtn={this.handleBtnRetour} />
          ) : null}
          <section className="section-historique">
            <table>
              <thead>
                <tr>
                  <th onClick={() => this.handleSort(0)}>Bordereau</th>
                  <th onClick={() => this.handleSort(1)}>Date</th>
                  <th onClick={() => this.handleSort(2)}>Nom</th>
                  <th onClick={() => this.handleSort(3)}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {this.state.statuts.map((courrier, index) => {
                  return (
                    <Logs
                      key={index}
                      courrier={courrier}
                      onRowClick={this.handleRecherche}
                    />
                  );
                })}
              </tbody>
              <tfoot></tfoot>
            </table>
          </section>
          <div>
            <button
              className="button"
              onClick={() => this.handleClick(this.state.page - 1, "minus")}
              style={{ visibility: this.state.page > 0 ? "visible" : "hidden" }}
            >
              {"<"}
            </button>
            <p>{this.state.page + 1}</p>
            <button
              className="button"
              onClick={() => this.handleClick(this.state.page + 1, "plus")}
              style={{
                visibility:
                  this.state.statuts.length >= this.max &&
                  this.state.statuts.length * (this.state.page + 1) !==
                    this.total
                    ? "visible"
                    : "hidden",
              }}
            >
              {">"}
            </button>
          </div>
        </main>
      </>
    );
  }
}

export default Historique;
