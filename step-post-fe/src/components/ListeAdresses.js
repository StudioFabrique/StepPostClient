import React, { Component } from 'react';
import { postData, getData } from '../modules/postData.js';
import Recherche from './Recherche';
import RechercheNom from './RechercheNom';
import NoResults from './NoResults';
import Destinataire from './Destinataire'

class ListeAdresses extends Component {
    constructor(props) {
        super(props);
        this.state = { adresses: [], rechercheNom: false, noResults: false };
        this.nom = "";
    }

    componentDidMount() {
        this.handleRefreshAdresses();
    }

    handleRecherche = async nom => {
        this.nom = nom;
        const response = await postData(`/adressesFavorites`, [nom]);
        if (response.destinataires !== false) {
            this.setState({ adresses: response.destinataires, rechercheNom: true, noResults: false});
        } else {
            this.setState({ noResults: true });
        }
    }

    handleBtnRetour = async () => {
        this.nom = "";
        const response = await getData('/adressesFavorites');
        this.setState({ adresses: response.destinataires, rechercheNom: false, noResults: false });
    }

    handleRefreshAdresses = async () => {
        const response = await getData('/adressesFavorites');
        this.setState({ adresses: response.destinataires, section: 'adresses' });
    }

    handleClickIcone = (newId, section) => {
        this.props.onClickIcone(newId, section);
    }

    render() {
        return (
            <>
                <section className='section-recherche'>
                    <Recherche onRecherche={this.handleRecherche} />
                </section>
                {
                    this.state.rechercheNom ?
                        <section className='section-recherche-nom'>
                            <RechercheNom nom={this.nom} onRetourBtn={this.handleBtnRetour} />
                            <span className="bouton-ajouter">
                                <h4>Nouvelle adresse</h4>
                                <button className='button' onClick={this.props.onNewAdress}>+</button>
                            </span>
                        </section> :
                        <section className='section-recherche-nom'>
                            <span className="bouton-ajouter">
                                <h4>Nouvelle adresse</h4>
                                <button className='button' onClick={this.props.onNewAdress}>+</button>
                            </span>
                        </section>
                }
                {
                    this.state.noResults && <section className='section-no-results'>
                        <NoResults nom={this.nom} onRetourBtn={this.handleBtnRetour} />
                    </section>
                }
                <section className='section-adresses'>
                    {
                        this.state.adresses.map((adresse, index) => {
                            return (
                                <Destinataire
                                    key={`${index}-${adresse.id}`}
                                    onDelete={this.handleRefreshAdresses}
                                    adresse={adresse}
                                    onClickIcone={this.handleClickIcone}
                                />
                            )
                        })
                    }
                </section>
            </>
        );
    }
}

export default ListeAdresses;