import DetailsCourrier from "./DetailsCourrier";

function DetailsRecherche(props) {
    const courrier = props.courrier;
    console.log('courrier', courrier);

    function handleClick() {
        props.onCloseRecherche();
    }

    return (
        <>
            <article className="detailsRecherche">
                    <div>
                        <h4>Courrier n° : {courrier.destinataire.bordereau}</h4>
                        <button className="button" onClick={handleClick}>Fermer</button>
                    </div>
                    <DetailsCourrier detailsCourrier={courrier.statuts} destinataire={courrier.destinataire} />
            </article>
        </>
    )
}

export default DetailsRecherche;