import DetailsCourrier from "../DetailsCourrier/DetailsCourrier";

function DetailsRecherche(props) {
  const courrier = props.courrier;

  const handleClick = () => {
    props.onCloseRecherche();
  };

  const handleImpression = () => {
    window.print();
  };

  return (
    <>
      <article className="detailsRecherche">
        <div>
          <span>
            <h4>Courrier n° : {courrier.bordereau}</h4>
            <img
              src="img/icone-print.png"
              alt="icone impression"
              onClick={handleImpression}
            />
          </span>
          <button className="button" onClick={handleClick}>
            Fermer
          </button>
        </div>
        <DetailsCourrier
          statuts={courrier.statuts}
          destinataire={{
            civilite: courrier.civilite,
            prenom: courrier.prenom,
            nom: courrier.nom,
            adresse: courrier.adresse,
            codePostal: courrier.codePostal,
            ville: courrier.ville,
          }}
        />
      </article>
    </>
  );
}

export default DetailsRecherche;
