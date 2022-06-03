import { Link } from "react-router-dom";
import "./BoutonAjouter.css";

function BoutonAjouter(props) {
  return (
    <span className="bouton-ajouter">
      <h4>{props.msg}</h4>
      <div>
        <Link to={props.url}>
          <button>
            <img src="img/plus-btn.png" alt="lien nouveau courrier" />
          </button>
        </Link>
      </div>
    </span>
  );
}

export default BoutonAjouter;
