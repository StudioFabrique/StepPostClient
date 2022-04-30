import DetailsCourrier from "./DetailsCourrier";
import '../styles/DetailsRecherche.css';

function DetailsRecherche(props) {
    const courrier = props.courrier;
    console.log('courrier', courrier);

    function handleClick() {
        props.onCloseRecherche();
    }

    return (
        <>
            <div class="detailsRecherche">
                <h4>Courrier n° : {courrier.destinataire.bordereau}</h4>
                <DetailsCourrier detailsCourrier={courrier.statuts} destinataire={courrier.destinataire} />
                <button className="button" onClick={handleClick}>Fermer</button>
            </div>
        </>
    )
}

export default DetailsRecherche;