import { useState } from "react";
import { formatDate, setEtatMessage, toTitleCase } from "../modules/formatter";
import { postData } from "../modules/postData";
import '../styles/Courrier.css';
import DetailsCourrier from "./DetailsCourrier";

function Courrier({statut, baseUrl, onCourrierClick}) {
    const [detailsCourrier, setDetailsCourrier] = useState([]);
    const [destinataire, setDestinataire] = useState([]);

    async function handleClick() {
            const response = await postData(`/detailsCourrier`, [statut.id]);
            setDetailsCourrier(response.courrier);
            setDestinataire(response.destinataire);
            onCourrierClick(statut.id);
    }

    return (
        <>
            <article className="courrier" id={`${statut.id}-${statut.bordereau}`} onClick={handleClick} style={{backgroundColor: statut.isActive ? '#E0E0E0' : 'white' }} >
                <div>
                    <h4 className="date">
                        {formatDate(statut.date)}
                    </h4>
                    <p>Bordereau n° : {statut.bordereau}</p>
                </div>
                <div>
                    <span>
                        <p>{setEtatMessage(statut.etat, toTitleCase(statut.nom))}</p>
                    </span>
                    <span>
                        {
                            statut.type === 0 ? <p>Colis</p> : <p>Lettre</p>
                        }
                    </span>
                </div>
                <div className="detailsLivraison">
                    {
                        statut.isActive ? <DetailsCourrier detailsCourrier={detailsCourrier} destinataire={destinataire} /> : null
                    }
                </div>
            </article>
        </>
    )
}
export default Courrier;