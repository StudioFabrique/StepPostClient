import React, { Component } from 'react';
import '../styles/NouvelEnvoi.css';
import ListeAdresses from './ListeAdresses';
import CreationBordereau from './CreationBordereau';
import EditerAdresse from './EditerAdresse';
import AdresseForm from './AdresseForm';
import { postData } from '../modules/postData';

class NouvelEnvoi extends Component {
    constructor(props) {
        super(props);
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
        console.log('response', response);
        this.setState({section: 0});
    }

    handleEditerAdresse = async adresse => {
        console.log('confirm', adresse);
        const response = await postData('/editAdresse', adresse);
        this.setState({section: 0});
    }

    render() {
        return (
            <>
                <main className='main-nouvel-envoi'>
                    {
                        this.state.section === 0 ? <ListeAdresses onClickIcone={this.handleSectionUpdate} onNewAdress={this.handleNouvelleAdresse} /> : null
                    }
                    {
                        this.state.section === 1 ? <CreationBordereau id={this.newId} /> : null
                    }
                    {
                        this.state.section === 2 ? <AdresseForm id={this.newId} onRetour={this.handleRetour} onEditerAdresse={this.handleEditerAdresse} /> : null
                    }
                    {
                        this.state.section === 3 ? <AdresseForm onRetour={this.handleRetour} onAjouterAdresse={this.handleAjouterAdresse} /> : null
                    }
                </main>
            </>
        );
    }
}

export default NouvelEnvoi;