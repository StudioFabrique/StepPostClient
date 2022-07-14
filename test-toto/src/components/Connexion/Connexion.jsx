import { useState } from "react";
import { testField } from "../../modules/checkForm";
import { getToken } from "../../modules/fetchData";
import { regexMail, regexPassword } from "../../modules/data.js";
import { useAuth } from "../AuthProvider/AuthProvider";
import "./Connexion.css";

function Connexion() {
  const auth = useAuth();
  const onLogin = auth.onLogin;
  const [email, updateEmail] = useState("");
  const [password, updatePassword] = useState("");
  const [erreur, updateErreur] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let testMail = testField(regexMail, email);
    let testPassword = testField(regexPassword, password);
    if (testMail && testPassword) {
      try {
        const response = await getToken(email, password);
        if (response.code === 401) {
          updateErreur(true);
        } else {
          localStorage.setItem("token", response.token);
          updateErreur(false);
          onLogin(response.token);
        }
      } catch (err) {}
    } else {
      updateErreur(true);
    }
  };
  return (
    <main className="connexion-form-main">
      <section className="section-connexion-titre">
        <h2>Connexion</h2>
      </section>
      <section className="section-connexion-form">
        <form className="form-connexion" onSubmit={handleSubmit}>
          <label>
            Adresse email :&nbsp;
            <input
              type="email"
              placeholder="jean.dupont@exemple.fr"
              autoFocus
              onChange={(e) => updateEmail(e.target.value)}
            />
          </label>
          <label>
            Mot de passe :&nbsp;
            <input
              type="password"
              placeholder="Abcd@1234"
              onChange={(e) => updatePassword(e.target.value)}
            />
          </label>
          {erreur ? (
            <p>Email ou mot de passe incorrect(s), essayez à nouveau svp</p>
          ) : null}
          <div>
            <button type="submit" className="button-valider">
              Envoyer
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Connexion;
