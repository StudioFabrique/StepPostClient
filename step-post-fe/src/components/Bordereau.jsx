import React, { Component } from 'react';
import { getData, getQrcode, postData } from '../modules/postData';
import Adresse from './Adresse';
import '../styles/Bordereau.css';
import { qrcodeUrl } from '../modules/data';
import PopupConfirmation from "./PopupConfirmation";

class Bordereau extends Component {
    constructor(props) {
        super(props);
        this.state = { exp: [], dest: [], type: '', qrcode: '', bordereau: '-----', valider: false, isSubmitted: false };
        this.dest = this.props.adresse;
        this.msg = "Confirmer l'impression du bordereau svp.";
    }

    componentDidMount = async () => {
        const response = await getData('/expediteur');
        if (!this.dest.telephone) {
            this.dest.telephone = 'non disponible';
        }
        this.setState({ exp: response.exp, dest: this.dest, type: this.props.type });
        console.log('exp', this.state.exp);

    }

    handleRetour = () => {
        this.props.onRetour();
    }

    handleQrCode = () => {
        if (!this.state.valider) {
            this.setState({isSubmitted: true})
        } else {
            alert("Votre bordereau est déjà en cours d'impression.");
        }
    }

    handleConfirm = async () => {
        let type;
        if (this.state.type) {
            type = 1;
        } else {
            type = 0;
        }
        const response = await postData('/qrcode', [this.state.dest.id, type]);
        this.setState({
            qrcode: `${qrcodeUrl}${response.qrcode}`,
            bordereau: response.bordereau,
            valider: true,
            isSubmitted: false
        });
    }

    handleCancel = () => {
        this.setState({isSubmitted: false});
    }

    render() {
        return (
            <>
                <section className='section-bordereau-buttons' >
                    <div>
                        <button className='button' onClick={this.handleQrCode}>Imprimer</button>
                        <button className='button' onClick={this.handleRetour}>Retour</button>
                    </div>
                </section>
                <section className='section-bordereau-exp'>
                    <article className='article-exp-left'>
                        <div>
                            <img src="img/logo.png" alt="logo step post" />
                            <div>
                                <input type="checkbox" name="type" checked={this.state.type === 'lettre'} readOnly />
                                <label htmlFor="lettre">Lettre</label>
                                <input type="checkbox" name="type" checked={this.state.type === 'colis'} readOnly />
                                <label htmlFor="colis">Colis</label>
                            </div>
                            <p>Date et cachet STEP POST</p>
                        </div>
                        <div>
                            <p>STEP POST Opérateur Postal</p>
                            <p>Autorisation n°12-0098</p>
                            <p>Technopolis Hélioparc</p>
                            <p>2 av. du Président Pierre Angot 64000 PAU</p>
                            <p>RCS de Pau 434 805 644</p>
                        </div>
                    </article>
                    <article className="article-exp-right">
                        <div>
                            <h2>SIGNEO</h2>
                            <p>Le service recommandé de Step Post</p>
                        </div>
                        <div>
                            <h3>Expéditeur</h3>
                            <span>
                                <Adresse adresse={this.state.exp} isDest={false} />
                            </span>
                        </div>
                    </article>
                </section>
                <section className='section-bordereau-dest'>
                    <article className='article-dest-left'>
                        <div>
                            {
                                this.state.qrcode ?
                                    <img src={this.state.qrcode} alt='qrcode' /> :
                                    <h5>Le QR code et le numéro de bordereau seront générés lors de l'impression.</h5>
                            }
                        </div>
                        <div>
                            <p>Bordereau n° {this.state.bordereau}</p>
                        </div>
                    </article>
                    <article className='article-dest-right'>
                        <div>
                            <h3>Destinataire</h3>
                            <span>
                                <Adresse adresse={this.state.dest} instructions={this.props.instructions} isDest={true} />
                            </span>
                        </div>
                        <div>
                            <p>Signature :</p>
                            <span>
                                <p>Date :</p>
                                <p>.. / .. / ..</p>
                            </span>
                        </div>
                    </article>
                </section>
                {
                    this.state.isSubmitted && <PopupConfirmation msg={this.msg} onCancelClick={this.handleCancel} onConfirmClick={this.handleConfirm} />
                }
            </>
        );
    }
}

export default Bordereau;