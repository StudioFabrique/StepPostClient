import { useState } from "react";
import { getToken } from "../modules/postData";
import '../styles/ConnexionForm.css';

function ConnexionForm({message, onFormSubmit }) {
    const [email, updateEmail] = useState('');
    const [password, updatePassword] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();
        const response = await getToken('http://127.0.0.1:8000/api/login_check', [email, password]);
        console.log('response', response);
        if (response.code === 401) {
            //window.location.href = '/';
            console.log('toto');
            onFormSubmit(false, "Email ou mot de passe incorrect(s), essayez à nouveau svp");
        } else {
            sessionStorage.setItem('token', response.token);
            onFormSubmit(true, '');
        }
    }

    return (
        <>
            <main className="connexion-form-main">
                <section>
                    <h2>Connexion</h2>
                </section>
                <section>
                    <form onSubmit={handleSubmit}>
                        <label>Adresse email :&nbsp;
                            <input type="email" onChange={(e) => updateEmail(e.target.value)} />
                        </label>
                        <label>Mot de passe :&nbsp;
                            <input type="password" onChange={(e) => updatePassword(e.target.value)} />
                        </label>
                        {
                            !message ? <p>{message}</p> : null
                        }
                        <div>
                            <button className="bouton">Envoyer</button>
                        </div>
                    </form>
                </section>
            </main>
        </>
    )
}

export default ConnexionForm;