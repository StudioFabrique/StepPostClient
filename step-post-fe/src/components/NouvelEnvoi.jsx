import React, { Component } from 'react';
import { getData, getQrcode } from '../modules/postData';
import Adresse from './Adresse';
import '../styles/NouvelEnvoi.css';

class NouvelEnvoi extends Component {
    constructor(props) {
        super(props);
        this.state = { exp: [], dest: [], lettre: true, colis: false, qrcode: '' };
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
        this.setState({ lettre: event.target.checked, colis: !this.state.lettre });
    }

    handleToto = async () => {
        const response = await getQrcode('123456789');
        console.log('qrcode : ', response);
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
                        <div></div>
                    </article>
                </section>
                <section className='section-bordereau-dest'>
                    <article className='article-dest-left'>
                        <div>
                            <img src={this.state.qrcode} />
                        </div>
                        <div>
                            <p>Bordereau n° 12345</p>
                        </div>
                    </article>
                    <article className='article-dest-right'>
                        <div>
                            <h3>Destinataire</h3>
                        </div>
                        <div>
                            <Adresse adresse={this.state.dest} isDest={true} />
                        </div>
                        <div>
                            <p>(signature)</p>
                        </div>
                    </article>
                    <button onClick={this.handleToto}>Toto</button>
                </section>
            </>
        );
    }
}

export default NouvelEnvoi;