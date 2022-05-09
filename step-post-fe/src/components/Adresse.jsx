import { toTitleCase } from "../modules/formatter";

function Adresse(props) {
    const adresse = props.adresse;
    return (
        <article className='article-ne-adresse'>
            <div>
                <p>{toTitleCase(`${adresse.civilite} ${adresse.prenom} ${adresse.nom}`)}</p>
                <p>{toTitleCase(adresse.adresse)}</p>
                <p>{toTitleCase(adresse.complement)}</p>
                <p>{toTitleCase(`${adresse.codePostal} ${adresse.ville}`)}</p>
            </div>
            {
                props.isDest ?
                    <div>
                        {
                            props.instructions ?
                                <>
                                    <p>Instructions de livraison :</p>
                                    <p>{props.instructions}</p>
                                </>
                                : null
                        }
                        <p>( tél : {adresse.telephone} )</p>
                    </div>
                    : null
            }
        </article>
    )
}

export default Adresse;