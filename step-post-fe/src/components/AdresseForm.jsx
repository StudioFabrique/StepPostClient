import React, { Component } from 'react';
import { postData } from '../modules/postData';
import PopupEdition from './PopupEdition';
import '../styles/AdresseForm.css';
import { toTitleCase } from '../modules/formatter';
import { testFormAdress } from '../modules/checkForm';

class AdresseForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            civilite: '',
            nom: '',
            prenom: '',
            adresse: '',
            complement: '',
            codePostal: '',
            ville: '',
            telephone: '',
            email: '',
            id: '',
            items: [],
            isSubmitted: false,
            erreur: false,
        }
        this.dest = this.props.id;
        this.onAjouterAdresse = this.props.onAjouterAdresse;
    }

    componentDidMount = () => {
        if (this.dest) {
            this.resetAdresse();
        }
    }

    resetAdresse = () => {
        this.setState({
            civilite: this.dest.civilite,
            nom: this.dest.nom,
            prenom: this.dest.prenom,
            adresse: this.dest.adresse,
            complement: this.dest.complement,
            codePostal: this.dest.codePostal,
            ville: this.dest.ville,
            telephone: this.dest.telephone,
            email: this.dest.email,
            id: this.dest.id,
        });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const items = [{
            civilite: this.state.civilite,
            nom: this.state.nom,
            prenom: this.state.prenom,
            adresse: this.state.adresse,
            complement: this.state.complement,
            codePostal: this.state.codePostal,
            ville: this.state.ville,
            telephone: this.state.telephone,
            email: this.state.email,
            id: this.state.id,
        }];
        console.log('toto', testFormAdress(items[0]));
        if (testFormAdress(items[0])) {
            this.setState({ items: items[0], isSubmitted: true, erreur: false });
        } else {
            this.setState({ erreur: true });
        }
    }

    handleCancel = () => {
        if (this.dest) {
            this.resetAdresse();
        }
        this.setState({ isSubmitted: false });
    }

    handleConfirm = () => {
        if (this.dest) {
            this.props.onEditerAdresse(this.state.items);
        } else {
            this.props.onAjouterAdresse(this.state.items);
        }
        this.setState({ isSubmitted: false });
    }

    render() {
        return (
            <>
                <article className='article-form-adresse'>
                    <div>
                        <h3>Retour à la liste d'adresses</h3>
                        <div>
                            <button className="button" onClick={() => this.props.onRetour()}>Retour</button>
                        </div>
                    </div>
                    <form className="form-edition" onSubmit={this.handleSubmit}>
                        <div>
                            <label>Civilité
                                <select value={this.state.civilite} name="civilite" onChange={this.handleChange}>
                                    <option value="">----</option>
                                    <option value="mr">Mr</option>
                                    <option value="mme">Mme</option>
                                </select>
                            </label>
                            <p>( Les champs marqués d'un * sont obligatoires )</p>
                        </div>
                        <div>
                            <label><div><p>Prénom / Service</p><p className="obligatoire">*</p></div>
                                <input type="text" value={toTitleCase(this.state.prenom)} name="prenom" onChange={this.handleChange} />
                            </label>
                            <label><div><p>Nom / Entreprise</p><p className="obligatoire">*</p></div>
                                <input type="text" value={toTitleCase(this.state.nom)} name="nom" onChange={this.handleChange} />
                            </label>
                        </div>
                        <div>
                            <label><div><p>Adresse</p><p className="obligatoire">*</p></div>
                                <textarea rows="2" value={toTitleCase(this.state.adresse)} name="adresse" onChange={this.handleChange} />
                            </label>
                        </div>
                        <div>
                            <label><div><p>Complément d'adresse</p><p className="obligatoire"></p></div>
                                <textarea rows="2" value={toTitleCase(this.state.complement)} name="complement" onChange={this.handleChange} />
                            </label>
                        </div>
                        <div>
                            <label><div><p>Code Postal</p><p className="obligatoire">*</p></div>
                                <input type="text" value={toTitleCase(this.state.codePostal)} name="codePostal" onChange={this.handleChange} />
                            </label>
                            <label><div><p>Ville</p><p className="obligatoire">*</p></div>
                                <input type="text" value={toTitleCase(this.state.ville)} name="ville" onChange={this.handleChange} />
                            </label>
                        </div>
                        <div>
                            <label>Téléphone
                                <input type="text" value={toTitleCase(this.state.telephone)} name="telephone" onChange={this.handleChange} />
                            </label>
                            <label>Email
                                <input type="text" value={this.state.email} name="email" onChange={this.handleChange} />
                            </label>
                        </div>
                        {
                            this.state.erreur &&
                            <div className='msg-form-erreur'>
                                <p>Un des champs est mal rempli !</p>
                            </div>
                        }
                        <div>
                            <input className="button" type="submit" value="Envoyer" />
                        </div>
                    </form>
                </article>
                {
                    this.state.isSubmitted && <PopupEdition onCancelClick={this.handleCancel} onConfirmClick={this.handleConfirm} />
                }
            </>
        );
    }
}

export default AdresseForm;