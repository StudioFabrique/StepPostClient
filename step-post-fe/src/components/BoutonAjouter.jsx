import { Link } from "react-router-dom";
import '../styles/BoutonAjouter.css';

function BoutonAjouter(props) {
    return (
        <span className="bouton-ajouter">
            <h4>{props.msg}</h4>
            <div>
                <Link to={props.url}>
                    <button>+</button>
                </Link>
            </div>
        </span>
    )
}

export default BoutonAjouter;