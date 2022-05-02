import ConnexionForm from "./ConnexionForm";

function Connexion({onIsLogged}) {

    const handleConnexion = (result) => {
        if (result) {
            window.location.href = "/home";
        }
    }

    return (
        <>
            <ConnexionForm onFormSubmit={handleConnexion} />
        </>
    )
}

export default Connexion;