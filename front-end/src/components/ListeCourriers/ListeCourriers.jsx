import Courrier from "../Courrier/Courrier.jsx";
import { useEffect, useState } from "react";
import BoutonAjouter from "../BoutonAjouter/BoutonAjouter.jsx";
import { getCourriers } from "../../modules/pagination";

function ListeCourriers(props) {
  const [courriers, updateCourriers] = useState([]);
  const [id, updateId] = useState(null);
  const [page, updatePage] = useState(null);
  const max = 3;

  useEffect(() => {
    updatePage(0);
    updateCourriers(getCourriers(page, max, props.courriers));
  }, [props.courriers]);

  useEffect(() => {
    updateCourriers(getCourriers(page, max, props.courriers));
    updateId(null);
  }, [page]);

  // effet d'arcodéon

  const handleCourrierClick = (newId) => {
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
  };

  return (
    <section className="listecourriers-section">
      <div>
        <h3>Statut de vos envois en cours</h3>
        <BoutonAjouter msg={"Nouvel envoi : "} url={"/carnet-d-adresses"} />
      </div>
      <ul>
        {courriers.map((courrier, index) => {
          return (
            <li key={index}>
              <Courrier
                courrier={courrier}
                onCourrierClick={handleCourrierClick}
              />
            </li>
          );
        })}
      </ul>
      <div className="button-group">
        <button
          style={{ visibility: page > 0 ? "visible" : "hidden" }}
          onClick={() => updatePage(page - 1)}
        >
          {" < "}
        </button>
        <p>{page + 1}</p>
        <button
          style={{
            visibility:
              courriers.length >= max &&
              courriers.length * page + 1 !== props.courriers.length
                ? "visible"
                : "hidden",
          }}
          onClick={() => updatePage(page + 1)}
        >
          {" > "}
        </button>
      </div>
    </section>
  );
}

export default ListeCourriers;
