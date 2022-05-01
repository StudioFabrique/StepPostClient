import Courrier from './Courrier.js'
import '../styles/ListeCourriers.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ListeCourriers(props) {
    const [courriers, updateCourriers] = useState([]);
    const [id, updateId] = useState(null);
    useEffect(() => { toto() }, [props]);

    function toto() {
        updateId(null);
        const tmp = [];
        props.statuts.forEach((elem) => {
            tmp.push({
                bordereau: elem.bordereau,
                date: elem.date,
                etat: elem.etat,
                id: elem.id,
                nom: elem.nom,
                prenom: elem.prenom,
                type: elem.type,
                isActive: false,
            });
        });
        updateCourriers(tmp);
    }

    // effet d'arcodéon

    const handleCourrierClick = newId => {
        if (id) {
            courriers.find((statut) => statut.id === id).isActive = false;
        }
        if (id === newId) {
            courriers.find((statut) => statut.id === id).isActive = false;
            newId = null;
        } else {
            const newCourrier = courriers.find((statut) => statut.id === newId);
            newCourrier.isActive = true;
        }
        updateId(newId);
    }

    return (
        <>
            <section className='listecourriers-section'>
                <div>
                    <h3>Statut de vos envois en cours</h3>
                    <span>
                        <h4>Nouvel envoi</h4>
                        <Link to="/nouvel-envoi">
                            <button>+</button>
                        </Link>
                    </span>
                </div>
                <ul>
                    {
                        courriers.map((statut) => {
                            return (
                                <>
                                    <li key={statut.id}>
                                        <Courrier statut={statut} baseUrl={props.baseUrl} onCourrierClick={handleCourrierClick} />
                                    </li>
                                </>
                            )
                        })
                    }
                </ul>
            </section>
        </>
    )
}

export default ListeCourriers;