import Courrier from './Courrier.js'
import '../styles/ListeCourriers.css'
import { useEffect, useState } from 'react';

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
    const handleCourrierClick = newId => {
        if (id) {
            courriers.find((statut) => statut.id === id).isActive = false;
        }
        if (id === newId) {
            courriers.find((statut) => statut.id === id).isActive = false;
            newId = null;
        }
        const newCourrier = courriers.find((statut) => statut.id === newId);
        if (newCourrier) {
            newCourrier.isActive = true;
        }
        updateId(newId);
    }

    return (
        <>
            <section>
                <ul>
                    {
                        courriers.map((statut) => {
                            return (
                                <li key={statut.id}>
                                    <Courrier statut={statut} baseUrl={props.baseUrl} onCourrierClick={handleCourrierClick} />
                                </li>
                            )
                        })
                    }
                </ul>
            </section>
        </>
    )
}

export default ListeCourriers;