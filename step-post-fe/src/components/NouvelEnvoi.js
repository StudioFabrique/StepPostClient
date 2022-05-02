import React, { Component } from 'react';
import { postData } from '../modules/postData';
import Destinataire from './Destinataire';
import '../styles/NouvelEnvoi.css';
import Recherche from './Recherche';
import RechercheNom from './RechercheNom';
import NoResults from './NoResults';

class NouvelEnvoi extends Component {
    constructor(props) {
        super(props);
        this.state = { baseUrl: "http://127.0.0.1:8000/api/client/", adresses: [], rechercheNom: false, noResults: false };
        this.nom = "";
    }
    componentDidMount() {
        this.handleRefreshAdresses();
        this.props.onPageLanding(1);
    }

    handleRecherche = async nom => {
        this.nom = nom;
        const response = await postData(`${this.state.baseUrl}adressesFavorites`, [nom]);
        if (response.destinataires !== false) {
            this.setState({ adresses: response.destinataires, rechercheNom: true });
        } else {
            this.setState({ noResults: true });
        }
    }

    handleBtnRetour = async () => {
        this.nom = "";
        const response = await this.getAdresses();
        this.setState({ adresses: response.destinataires, rechercheNom: false, noResults: false });
    }

    getAdresses = async () => {
        return await (await fetch(`${this.state.baseUrl}adressesFavorites`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })).json();
    }

    handleRefreshAdresses = async () => {
        const response = await this.getAdresses();
        this.setState({ adresses: response.destinataires, section: 'adresses' });
    }
    render() {
        return (
            <>
                <main className='main-nouvel-envoi'>
                    <section className='section-recherche'>
                        <Recherche onRecherche={this.handleRecherche} />
                    </section>
                    {

                        this.state.rechercheNom ? <section className='section-recherche-nom'>
                            <RechercheNom nom={this.nom} onRetourBtn={this.handleBtnRetour} />
                        </section> : null
                    }
                    {
                        this.state.noResults ? <section className='section-no-results'>
                            <NoResults nom={this.nom} onRetourBtn={this.handleBtnRetour} />
                        </section> : null
                    }
                    <section className='section-adresses'>
                        {
                            this.state.adresses.map((adresse) => {
                                console.log('adresse', adresse);
                                return (
                                    <>
                                        <Destinataire
                                            key={adresse.id}
                                            onDelete={this.handleRefreshAdresses}
                                            baseUrl={this.state.baseUrl}
                                            adresse={adresse}
                                        />
                                    </>
                                )
                            })
                        }
                    </section>
                </main>
            </>
        );
    }
}

export default NouvelEnvoi;