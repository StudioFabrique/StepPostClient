import { useEffect, useState } from "react";
import { testStr } from "../modules/checkForm";
import { postData } from "../modules/postData";
import '../styles/EditerAdresse.css';
import PopupEdition from "./PopupEdition";

function EditerAdresse(props) {

    const dest = props.id;
    const [isSubmitted, updateSubmitted] = useState(false);
    const [civilite, updateCivilite] = useState('');
    const [nom, updateNom] = useState();
    const [prenom, updatePrenom] = useState('');
    const [adresse, updateAdresse] = useState('');
    const [complement, updateComplement] = useState('');
    const [codePostal, updateCodePostal] = useState('');
    const [ville, updateVille] = useState('');
    const [email, updateEmail] = useState('');
    const [telephone, updateTelephone] = useState('');
    const [testForm, updateTestForm] = useState(false);

    useEffect(() => { init() }, [props]);

    const init = () => {
        updateCivilite(dest.civilite);
        updateNom(dest.nom);
        updatePrenom(dest.prenom);
        updateAdresse(dest.adresse);
        updateComplement(dest.complement);
        updateCodePostal(dest.codePostal);
        updateVille(dest.ville);
        updateTelephone(dest.telephone);
        updateEmail(dest.email);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        updateSubmitted(true);
    }

    const handleConfirm = async () => {
        const newAdresse = [
            dest.id,
            civilite,
            nom,
            prenom,
            adresse,
            complement,
            codePostal,
            ville,
            telephone,
            email,
        ];
        const response = await postData('/editAdresse', newAdresse);
        updateSubmitted(false);
        props.onRetour();
    }
    const handleCancel = () => {
        init();
        updateSubmitted(false);
    }

    return (
        <>
            <article>
                <form className="form-edition" onSubmit={handleSubmit}>
                    <div>
                        <label>Civilité
                            <select onChange={(e) => updateCivilite(e.target.value)}>
                                <option value="">----</option>
                                <option value="mr">Mr</option>
                                <option value="mme">Mme</option>
                            </select>
                        </label>
                        <p>( Les champs marqués d'un * sont obligatoires )</p>
                    </div>
                    <div>
                        <label><div><p>Prénom / Service</p><p className="obligatoire">*</p></div>
                            <input type="text" value={prenom} onChange={(e) => updatePrenom(e.target.value)} style={{ border: testStr(prenom) ? "1px green solid" : "1px red soldid" }} />
                        </label>
                        <label><div><p>Nom / Entreprise</p><p className="obligatoire">*</p></div>
                            <input type="text" value={nom} onChange={(e) => updateNom(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        <label><div><p>Adresse</p><p className="obligatoire">*</p></div>
                            <textarea cols="35" rows="3" value={adresse} onChange={(e) => updateAdresse(e.target.value)} ></textarea>
                        </label>
                    </div>
                    <div>
                        <label><div><p>Code Postal</p><p className="obligatoire">*</p></div>
                            <input type="text" value={codePostal} onChange={(e) => updateCodePostal(e.target.value)} />
                        </label>
                        <label><div><p>Ville</p><p className="obligatoire">*</p></div>
                            <input type="text" value={ville} onChange={(e) => updateVille(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        <label>Téléphone
                            <input type="text" value={telephone} onChange={(e) => updateTelephone(e.target.value)} />
                        </label>
                        <label>Email
                            <input type="text" value={email} onChange={(e) => updateEmail(e.target.value)} />
                        </label>
                    </div>
                    <div>
                        <button className="button" type="submit">Mettre à jour</button>
                    </div>
                </form>
                <div>
                    <h3>Retour à la liste d'adresses</h3>
                    <div>
                        <button className="button" onClick={() => props.onRetour()}>Retour</button>
                    </div>
                </div>
                {
                    isSubmitted ? <PopupEdition onCancelClick={handleCancel} onConfirmClick={handleConfirm} /> : null
                }
            </article>
        </>
    )
}

export default EditerAdresse;