import { useEffect, useState } from "react";
import { toTitleCase } from "../../modules/formatter";

function RechercheNom(props) {
  const [msg, updateMsg] = useState("");

  useEffect(() => {
    console.log("toto", props);
    if (props.civilite) {
      updateMsg(toTitleCase(`${props.civilite} ${props.nom}`));
    } else {
      updateMsg(`${toTitleCase(props.nom)}`);
    }
  }, [props]);

  function handleClick() {
    props.onRetourBtn();
  }

  return (
    <>
      <div className="rechercheNom">
        {props.total ? (
          <h4>
            Résultat de la recherche :{" "}
            {`${props.total} courrier(s) pour ${msg}`}
          </h4>
        ) : (
          <h4>Résultat de la recherche pour : {msg}</h4>
        )}
        <button className="button" onClick={handleClick}>
          Retour
        </button>
      </div>
    </>
  );
}

export default RechercheNom;
