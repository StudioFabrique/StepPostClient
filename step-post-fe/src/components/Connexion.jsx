import ConnexionForm from "./ConnexionForm";

function Connexion() {

    const handleConnexion = (result) => {
        window.location.href = "/home";
    }

    return (
        <>
            <ConnexionForm onFormSubmit={handleConnexion} />
        </>
    )
}

export default Connexion;