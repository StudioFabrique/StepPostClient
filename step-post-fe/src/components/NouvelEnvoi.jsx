import React, { Component } from 'react';
import { getData, getQrcode, postData } from '../modules/postData';
import Adresse from './Adresse';
import '../styles/NouvelEnvoi.css';

class NouvelEnvoi extends Component {
    constructor(props) {
        super(props);
        this.state = { exp: [], dest: [], type: true, qrcode: '', bordereau: '-----' };
        this.dest = this.props.adresse;
    }

    componentDidMount = async () => {
        const response = await getData('/expediteur');
        if (!this.dest.telephone) {
            this.dest.telephone = 'non disponible';
        }
        this.setState({ exp: response.exp, dest: this.dest });
        console.log('exp', this.state.exp);

    }

    handleRetour = () => {
    }

    handleChange = (event) => {
        this.setState({ type: !this.state.type });
    }

    handleQrCode = async () => {
        let type;
        if (this.state.type) {
            type = 1;
        } else {
            type = 0;
        }
        console.log('type', type);
        const response = await postData('/qrcode', [this.state.dest.id, type]);
        console.log('qrcode : ', response);
        this.setState({
            qrcode: `http://127.0.0.1:8000/assets/qrcodes/${response.qrcode}`,
            bordereau: response.bordereau
        });
        console.log('type-php', response.type);
    }

    render() {
        return (
            <>
                <section className='section-bordereau-exp'>
                    <article className='article-exp-left'>
                        <div>
                            <img src="img/logo.png" alt="logo step post" />
                            <div>
                                <input type="radio" name="type" value="lettre" onChange={this.handleChange} />
                                <label htmlFor="lettre">Lettre</label>
                                <input type="radio" name="type" value="colis" onChange={this.handleChange} />
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
                                <Adresse adresse={this.state.dest} isDest={true} />
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
                <button onClick={this.handleQrCode}>Qrcode</button>
            </>
        );
    }
}

export default NouvelEnvoi;