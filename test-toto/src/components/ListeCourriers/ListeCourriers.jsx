import Courrier from "../Courrier/Courrier.jsx";
import { useEffect, useState } from "react";
import { getCourriers } from "../../modules/pagination.js";

function ListeCourriers(props) {
  const [listeCourriers, updateListeCourriers] = useState([]);
  const [courriers, updateCourriers] = useState([]);
  const [id, updateId] = useState(null);
  const [page, updatePage] = useState(null);
  const max = 3;

  useEffect(() => {
    updateListeCourriers(props.courriers);
    updatePage(0);
    updateCourriers(getCourriers(page, max, listeCourriers));
  }, [props.courriers]);

  useEffect(() => {
    updateCourriers(getCourriers(page, max, listeCourriers));
    updateId(null);
  }, [page]);

  //  effet d'accordéon
  const handleCourrierClick = (newId) => {
    if (id) {
      courriers.find((item) => item.id === id).isActive = false;
    }
    if (id === newId) {
      newId = null;
    } else {
      courriers.find((item) => item.id === newId).isActive = true;
    }
    updateId(newId);
  };

  return (
    <section className="listecourriers-section">
      <div>
        <h3>Liste de vos envois en cours</h3>
      </div>
      <ul>
        {courriers.map((courrier, index) => {
          return (
            <li key={index}>
              <Courrier courrier={courrier} onClick={handleCourrierClick} />
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
              courriers.length * page + 1 !== listeCourriers.length
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
