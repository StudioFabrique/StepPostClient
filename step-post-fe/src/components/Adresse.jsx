import { toTitleCase } from "../modules/formatter";

function Adresse(props) {
    const adresse = props.adresse;
    return (
        <article className='article-ne-adresse'>
            <p>{toTitleCase(`${adresse.civilite} ${adresse.prenom} ${adresse.nom}`)}</p>
            <p>{toTitleCase(adresse.adresse)}</p>
            <p>{toTitleCase(adresse.complement)}</p>
            <p>{toTitleCase(`${adresse.codePostal} ${adresse.ville}`)}</p>
            {
                props.isDest ? <p>( tél : {adresse.telephone} )</p> : null
            }
        </article>
    )
}

export default Adresse;