import React, { Component } from 'react';
import '../styles/AdressesFavorites.css';
import ListeAdresses from './ListeAdresses';
import NouvelEnvoi from './NouvelEnvoi';
import AdresseForm from './AdresseForm';
import { postData } from '../modules/postData';

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
        this.setState({section: section});
    }

    handleRetour = () => {
        this.setState({section: 0});
    }

    handleNouvelleAdresse = () => {
        this.setState({section: 3});
    }

    handleAjouterAdresse = async adresse => {
        const response = await postData('/addAdresse', adresse);
        this.setState({section: 0});
    }

    handleEditerAdresse = async adresse => {
        const response = await postData('/editAdresse', adresse);
        this.setState({section: 0});
    }

    render() {
        return (
                <main className='main-nouvel-envoi'>
                    {
                        this.state.section === 0 ? <ListeAdresses onClickIcone={this.handleSectionUpdate} onNewAdress={this.handleNouvelleAdresse} /> : null
                    }
                    {
                        this.state.section === 1 ? <NouvelEnvoi adresse={this.newId} /> : null
                    }
                    {
                        this.state.section === 2 ? <AdresseForm id={this.newId} onRetour={this.handleRetour} onEditerAdresse={this.handleEditerAdresse} /> : null
                    }
                    {
                        this.state.section === 3 ? <AdresseForm onRetour={this.handleRetour} onAjouterAdresse={this.handleAjouterAdresse} /> : null
                    }
                </main>
        );
    }
}

export default AdressesFavorites;