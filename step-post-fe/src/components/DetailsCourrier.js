import { formatDate, toTitleCase } from '../modules/formatter';
import '../styles/DetailsCourrier.css'

function DetailsCourrier(props) {
    const statuts = props.detailsCourrier;
    const dest = props.destinataire;
    let tab = [];
    let l = statuts.length;
    
    for (let i = 0; i < statuts.length; i++) {
        tab.push(
            <>
                <div key={statuts[i].id} className="cercleContainer">
                    <div className='cercle' style={{ backgroundColor: (i === l - 1) ? '#24A640' : '#FF5E1A' }}></div>
                    <div className='statuts'>{statuts[i].etat}</div>
                    <div className='statuts-date'>{formatDate(statuts[i].date)} </div>
                </div>
                <div className="trait" style={{ backgroundColor: (i === l - 2) ? '#24A640' : '#FF5E1A' }}></div>
            </>
        );
    }

    return (
        <>
            <article className='timeline'>
                <div>
                    {tab}
                </div>
            </article>
            <article className='details'>
                <div key={`${dest.id}-${dest.nom}`}>
                    <p>{toTitleCase(`${dest.civilite} ${dest.prenom} ${dest.nom}`)}</p>
                    <p>{toTitleCase(`${dest.adresse}`)}</p>
                    <p>{toTitleCase(`${dest.codePostal} ${dest.ville}`)}</p>
                </div>
            </article>
        </>
    )
}

export default DetailsCourrier;