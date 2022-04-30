import { useState } from "react";
import ConnexionForm from "./ConnexionForm";

function Logs() {

    const [isLogged, setIsLogged] = useState(false);
    const [message, updateMessage] = useState('');

    const handleConnexion = (result, msg) => {
        setIsLogged(result);
        updateMessage(msg);
    }

    return (
        <>
        {
            !isLogged ? 
            <ConnexionForm message={message} onFormSubmit={handleConnexion} /> :
            <section>
                <h4>Vous êtes connecté</h4>
                <button onClick={() => window.location.href = "/"}>Retour à l'accueil</button>
            </section>
        }
        </>
    )
}

export default Logs;