import React, { Component } from 'react';
import ListeCourriers from './ListeCourriers';
import { postData } from '../modules/postData.js';
import '../styles/Home.css'
import Recherche from './Recherche';
import DetailsRecherche from './DetailsRecherche';
import RechercheNom from './RechercheNom';
import NoResults from './NoResults';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { noResults: false, rechercheNom: false, statuts: [], page: 0, isRechercheActive: false, rechercheValue: [] };
    this.max = 3;
    this.nom = "";
    this.tmpName = '';
  }

  async componentDidMount() {
    this.handleResetList();
    this.props.onPageLanding(0);
  }

  async handleClick(p, operator) {
    const datas = [p, this.max, this.nom, false];
    const response = await postData(`/getLogs`, datas);
    if (operator === 'minus') {
      this.setState({ statuts: response.statuts, page: this.state.page - 1 });
    } else {
      this.setState({ statuts: response.statuts, page: this.state.page + 1 });
    }
  }

  handleRecherche = async msg => {
    const response = await postData(`/searchCourrier`, [msg]);
    if (response.statuts !== false && response.statuts !== true) {
      this.setState({ isRechercheActive: true, rechercheValue: response });
    } else if (response.statuts === false) {
      this.nom = msg;
      const response = await postData(`/getLogs`, [0, this.max, this.nom, false]);
      if (response.statuts !== false) {
        this.setState({ statuts: response.statuts, page: 0, isRechercheActive: false, rechercheNom: true });
        this.nom = response.statuts[0].nom;
      } else {
        this.setState({ noResults: true, rechercheNom: false });
        this.tmpName = this.nom;
        this.nom = '';
      }
    }
  }

  handleCloseRecherche = () => {
    this.setState({ isRechercheActive: false, rechercheValue: '' });
  }

  handleResetList = async () => {
    /**
     * datas : numéro de page, nbre max d'entrées, nom en cas de recherche, filtre "distribué ou pas"
     */
    const datas = [0, this.max, "", false];
    const response = await postData(`/getLogs`, datas);
    this.setState({ statuts: response.statuts, page: 0, isRechercheActive: false, rechercheNom: false, noResults: false });
    this.nom = "";
    console.log('longueur', this.state.statuts);
  }

  handleBtnRetour = () => {
    this.handleResetList();
  }

  render() {
    return (
      <>
        <main className='home-main'>
          <Recherche onRecherche={this.handleRecherche} />
          {
            this.state.isRechercheActive ? <DetailsRecherche courrier={this.state.rechercheValue} onCloseRecherche={this.handleCloseRecherche} /> : null
          }
          {
            this.state.rechercheNom ? <RechercheNom nom={this.nom} onRetourBtn={this.handleBtnRetour} /> : null
          }
          {
            this.state.noResults ? <NoResults nom={this.tmpName} onRetourBtn={this.handleBtnRetour} /> : null
          }
          <ListeCourriers statuts={this.state.statuts} />
          <div>
            <button onClick={() => this.handleClick(this.state.page - 1, 'minus')} style={{ visibility: this.state.page > 0 ? 'visible' : 'hidden' }}>{'<'}</button>
            <p>{this.state.page + 1}</p>
            <button onClick={() => this.handleClick(this.state.page + 1, 'plus')} style={{ visibility: this.state.statuts.length >= this.max ? 'visible' : 'hidden' }}>{'>'}</button>
          </div>
        </main>
      </>
    );
  }
}

export default Home;