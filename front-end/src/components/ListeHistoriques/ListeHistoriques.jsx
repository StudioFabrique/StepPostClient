import { useEffect, useState } from "react";
import { getCourriers } from "../../modules/pagination";
import HistoriqueRow from "../HistoriqueRow/HistoriqueRow";

function ListeHistoriques(props) {
  const [courriers, updateCourriers] = useState([]);
  const [page, updatePage] = useState(null);
  const max = 10;

  useEffect(() => {
    updatePage(0);
    updateCourriers(getCourriers(page, max, props.courriers));
  }, [props.courriers]);

  useEffect(() => {
    updateCourriers(getCourriers(page, max, props.courriers));
  }, [page]);

  const handleRowClick = (value) => {
    props.onHistoriqueRowClick(value);
  };

  return (
    <section className="section-historique">
      <table>
        <thead>
          <tr>
            <th onClick={() => props.onSort(0)}>Bordereau</th>
            <th onClick={() => props.onSort(1)}>Date</th>
            <th onClick={() => props.onSort(2)}>Nom</th>
            <th onClick={() => props.onSort(3)}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {courriers.map((courrier, index) => {
            return (
              <HistoriqueRow
                courrier={courrier}
                onRowClick={handleRowClick}
                key={index}
              />
            );
          })}
        </tbody>
      </table>
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

export default ListeHistoriques;
