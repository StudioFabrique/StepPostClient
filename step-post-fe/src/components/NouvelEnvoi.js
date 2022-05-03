import React, { Component } from 'react';
import '../styles/NouvelEnvoi.css';
import ListeAdresses from './ListeAdresses';
import CreationBordereau from './CreationBordereau';
import EditerAdresse from './EditerAdresse';

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

    render() {
        return (
            <>
                <main className='main-nouvel-envoi'>
                    {
                        this.state.section === 0 ? <ListeAdresses onClickIcone={this.handleSectionUpdate} /> : null
                    }
                    {
                        this.state.section === 1 ? <CreationBordereau id={this.newId} /> : null
                    }
                    {
                        this.state.section === 2 ? <EditerAdresse id={this.newId} onRetour={this.handleRetour} /> : null
                    }
                </main>
            </>
        );
    }
}

export default NouvelEnvoi;