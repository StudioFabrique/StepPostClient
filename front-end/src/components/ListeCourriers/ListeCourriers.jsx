import Courrier from "../Courrier/Courrier.jsx";
import { useEffect, useState } from "react";
import BoutonAjouter from "../BoutonAjouter/BoutonAjouter.jsx";

function ListeCourriers(props) {
  const [courriers, updateCourriers] = useState([]);
  const [id, updateId] = useState(null);
  useEffect(() => {
    init();
  }, [props]);

  function init() {
    updateId(null);
    const tmp = [];
    props.statuts.forEach((elem) => {
      tmp.push({
        bordereau: elem.bordereau,
        date: elem.date,
        etat: elem.etat,
        id: elem.id,
        nom: elem.nom,
        prenom: elem.prenom,
        type: elem.type,
        isActive: false,
      });
    });
    updateCourriers(tmp);
  }

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
        {courriers.map((statut, index) => {
          return (
            <li key={index}>
              <Courrier
                statut={statut}
                baseUrl={props.baseUrl}
                onCourrierClick={handleCourrierClick}
              />
            </li>
          );
        })}
      </ul>
      <div>
        <button
          onClick={() => this.handleClick(this.state.page - 1, "minus")}
          style={{ visibility: this.state.page > 0 ? "visible" : "hidden" }}
        >
          {"<"}
        </button>
        <p>{this.state.page + 1}</p>
        <button
          onClick={() => this.handleClick(this.state.page + 1, "plus")}
          style={{
            visibility:
              this.state.statuts.length >= this.max &&
              this.state.statuts.length * (this.state.page + 1) !== this.total
                ? "visible"
                : "hidden",
          }}
        >
          {">"}
        </button>
      </div>
    </section>
  );
}

export default ListeCourriers;
