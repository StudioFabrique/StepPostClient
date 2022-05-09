import React, { Component } from 'react';
import { toTitleCase } from '../modules/formatter';
import AdresseForm from './AdresseForm';
import Bordereau from './Bordereau';

class NouvelEnvoi extends Component {
    constructor(props) {
        super(props);
        this.state = { type: '', dest: [], section: 0 }
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
        this.setState({ type: event.target.value });
        console.log('type', this.state.type);
    }

    handleRetourAdresses = () => {
        this.props.onRetour();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('submit', this.state.type);
        if (!this.state.type) {
            console.log('oops');
        } else {
            console.log(`${this.state.type} envoyé !`);
            this.setState({section : 2});
        }
    }

    handleModifications = (newDest) => {
        this.setState({ dest: newDest, section: 0});
    }

    handleRetour = () => {
        this.setState({ section: 0 });
    }

    handleModifier = () => {
        this.setState({ section: 1 });
    }

    render() {
        return (
            <>
                {
                    this.state.section === 0 &&
                    <section className="section-ne-dest">
                        <div>
                            <p>
                                {toTitleCase(`${this.state.dest.civilite} ${this.state.dest.prenom} ${this.state.dest.nom}`)}
                            </p>
                            <p>{toTitleCase(this.state.dest.adresse)}</p>
                            <p>{toTitleCase(`${this.state.dest.codePostal} ${this.state.dest.ville}`)}</p>
                            <p>{`(tél : ${this.state.dest.telephone})`}</p>
                            <span>
                                <button className='button' onClick={this.handleModifier}>Modifier</button>
                            </span>
                        </div>
                        <form className="form-ne-dest" onSubmit={this.handleSubmit}>{/* 
                        <label>Instruction de livraisons :
                            <textarea cols="30" rows="3" value={this.state.dest.complement} />
                        </label> */}
                            <label>Lettre
                                <input type="radio" value="lettre" checked={this.state.type === "lettre"} onChange={this.handleRadioChange} />
                            </label>
                            <label>Colis
                                <input type="radio" value="colis" checked={this.state.type === "colis"} onChange={this.handleRadioChange} />
                            </label>
                            <button className="button" onClick={this.handleRetourAdresses}>Retour</button>
                            <input type="submit" className='button' value="valider" />
                        </form>
                    </section>
                }
                {
                    this.state.section === 1 &&
                    <AdresseForm id={this.state.dest} onEditerAdresse={this.handleModifications} onRetour={this.handleRetour} />
                }
                {
                    this.state.section === 2 &&
                    <Bordereau adresse={this.state.dest} type={this.state.type} onRetour={this.handleRetour} />
                }
            </>
        )
    }
}

export default NouvelEnvoi;