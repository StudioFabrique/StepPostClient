import React, { Component } from 'react';
import { toTitleCase } from '../modules/formatter';
import AdresseForm from './AdresseForm';
import Bordereau from './Bordereau';
import '../styles/NouvelEnvoi.css';

class NouvelEnvoi extends Component {
    constructor(props) {
        super(props);
        this.state = { type: '', dest: [], section: 0, instructions: '' }
    }

    componentDidMount = () => {
        console.log(this.state.section);
        const dest = this.props.adresse;
        if (!dest.telephone) {
            dest.telephone = 'non disponible';
        }
        this.setState({ dest: dest });
        console.log('dest', this.state.dest);
    }

    handleRadioChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        console.log('type', this.state.type);
    }

    handleRetourAdresses = () => {
        this.props.onRetour();
    }

    handleSubmit = (event) => {
        this.handShake();
        event.preventDefault();
        console.log('submit', this.state.type);
        if (!this.state.type) {
            alert('Choisissez un type de courrier svp.');
        } else {
            console.log(`${this.state.type} envoyé !`);
            this.setState({ section: 2 });
        }
    }

    handleModifications = (newDest) => {
        this.handShake();
        this.setState({ dest: newDest, section: 0 });
    }

    handleRetour = () => {
        this.handShake();
        this.setState({ section: 0 });
    }

    handleModifier = () => {
        this.handShake();
        this.setState({ section: 1 });
    }

    handleInstructions = (event) => {
        this.setState({ instructions: event.target.value });
    }

    handShake = async () => {
        const response = await getData('/handshake');
        if (response.code === 401) {
            window.location.href = '/logout';
        }
    }

    render() {
        return (
            <>
                {
                    this.state.section === 0 &&
                    <section className="section-ne-dest">
                        <form className="form-ne-dest" onSubmit={this.handleSubmit}>
                            <div>
                                <label>Lettre
                                    <input type="radio" value="lettre" name="type" checked={this.state.type === "lettre"} onChange={this.handleRadioChange} />
                                </label>
                                <label>Colis
                                    <input type="radio" value="colis" name="type" checked={this.state.type === "colis"} onChange={this.handleRadioChange} />
                                </label>
                            </div>
                            <article className='article-ne-dest' >
                                <div>
                                    <p>
                                        {toTitleCase(`${this.state.dest.civilite} ${this.state.dest.prenom} ${this.state.dest.nom}`)}
                                    </p>
                                    <p>{toTitleCase(this.state.dest.adresse)}</p>
                                    <p>{this.state.dest.complement}</p>
                                    <p>{toTitleCase(`${this.state.dest.codePostal} ${this.state.dest.ville}`)}</p>
                                    <p>{`(tél : ${this.state.dest.telephone})`}</p>
                                </div>
                                <div>
                                    <span>
                                        <button className='button' onClick={this.handleModifier}>Modifier</button>
                                    </span>
                                </div>
                            </article>
                            <article className='article-ne-instructions' >
                                <label>Instruction de livraisons :
                                    <textarea cols="30" rows="3" name="instructions" value={this.state.instructions} onChange={this.handleInstructions} />
                                </label>
                            </article>
                            <article className='article-ne-buttons'>
                                <div>
                                    <button className="button" onClick={this.handleRetourAdresses}>Retour</button>
                                    <input type="submit" className='button' value="valider" />
                                </div>
                            </article>
                        </form>
                    </section>
                }
                {
                    this.state.section === 1 &&
                    <AdresseForm id={this.state.dest} onEditerAdresse={this.handleModifications} onRetour={this.handleRetour} />
                }
                {
                    this.state.section === 2 &&
                    <Bordereau adresse={this.state.dest} type={this.state.type} instructions={this.state.instructions} onRetour={this.handleRetour} />
                }
            </>
        )
    }
}

export default NouvelEnvoi;