import postData from "./modules/postData.js";
import { closeDetailsRecherche, closeStatut, displayDetails, displayStatuts } from "./modules/_index.js";

console.log('hello');

const search = document.querySelector('#form');
const searchInput = document.querySelector('#searchInput');
const courrierLog = document.querySelectorAll('.courrier');
const closeBtn = document.querySelector('#closeBtn');
const detailsRecherche = document.querySelector('#detailsRecherche');
let etat = null;


closeBtn.addEventListener('click', () => {
    detailsRecherche.style.display = "none";
});

// recherche du courrier par n° de bordereau ou par nom
search.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = [searchInput.value];
    const section = document.querySelector('#detailsRecherche');
    const div = section.querySelector('div:nth-child(2)');
    try {
        const result = await postData('/searchCourrier', data);
        console.log('result', result.destinataire);
        if (!result.statuts) {
            window.location.href = "/searchCourrierByNom/?nom=" + searchInput.value;
        } else if (result.statuts === true) {
            console.log('ce courrier a déjà été livré, veuillez regarder dans votre historique');
        } else {
            section.style.display = "flex";
            section.querySelector('h4').textContent = "Courrier n° : " + result.destinataire.bordereau;
            if (section.querySelector('.timeline') !== null) {
                closeDetailsRecherche(section);
            }
            displayStatuts(result.statuts, div);
            displayDetails(result.destinataire, div);
        }
    } catch (err) {
        console.log("toto");
    }
});

// affichage de la timeline du courrier sur lequel l'user a clické
courrierLog.forEach((elem) => {
    elem.addEventListener('click', async function() {
        const data = [elem.id];
        const div = this.querySelector('.detailsLivraison');
        if (etat === null) {
            const courrier = await postData('/detailsCourrier', data);
            displayStatuts(courrier.courrier, div);
            displayDetails(courrier.destinataire, div);
            etat = elem.id;
        } else if (etat === elem.id) {
            closeStatut(div);
            etat = null;
        } else {
            const article = document.getElementById(etat);
            console.log(article.querySelector('.detailsLivraison'));
            closeStatut(article.querySelector('.detailsLivraison'));
            const courrier = await postData('/detailsCourrier', data);
            displayStatuts(courrier.courrier, div);
            displayDetails(courrier.destinataire, div);
            etat = elem.id;
        }
    });
});
