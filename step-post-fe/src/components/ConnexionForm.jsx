import { useState } from "react";
import { testField } from "../modules/chjeckForm";
import { getToken } from "../modules/postData";
import '../styles/ConnexionForm.css';
import { regexMail, regexPassword } from '../modules/data.js';

function ConnexionForm({ message, onFormSubmit }) {
    const [email, updateEmail] = useState('');
    const [password, updatePassword] = useState('');
    const [erreur, updateErreur] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();
        let testMail = testField(regexMail, email);
        let testPassword = testField(regexPassword, password);

        if (testMail && testPassword) {
            const response = await getToken('http://127.0.0.1:8000/api/login_check', [email, password]);
            console.log('response', response);
            if (response.code === 401) {
                onFormSubmit(false);
                updateErreur(true);
            } else {
                sessionStorage.setItem('token', response.token);
                updateErreur(false);
                onFormSubmit(true);
            }
        } else updateErreur(true);
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
                            <input type="email" autofocus onChange={(e) => updateEmail(e.target.value)} />
                        </label>
                        <label>Mot de passe :&nbsp;
                            <input type="password" onChange={(e) => updatePassword(e.target.value)} />
                        </label>
                        {
                            erreur ? <p>Email ou mot de passe incorrect(s), essayez à nouveau svp</p> : null
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