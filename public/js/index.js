import postData from "./modules/postData.js";
import { closeDetailsRecherche, closeStatut, displayDetails, displayStatuts } from "./modules/_index.js";

console.log('hello');

const search = document.querySelector('#form');
const searchInput = document.querySelector('#searchInput');
const courrierLog = document.querySelectorAll('.courrier');
let etat = null;

// recherche du courrier par n° de bordereau ou par nom
search.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = [searchInput.value];
    try {
        const result = await postData('/searchCourrier', data);
        if (!result.statuts) {
            window.location.href = "/searchCourrierByNom/?nom=" + searchInput.value;
        } else if (result.statuts === true) {
            console.log('ce courrier a déjà été livré, veuillez regarder dans votre historiques');
        } else {
            const section = document.querySelector('#detailsRecherche');
            section.style.display = "flex";
            if (section.querySelector('.timeline') !== null) {
                closeDetailsRecherche(section);
            }
            displayStatuts(result.statuts, section);
            displayDetails(result.statuts, section);
        }
    } catch (err) {
        console.log("coucou");
    }
});

// affichage de la timeline du courrier sur lequel l'user a clické
courrierLog.forEach((elem) => {
    elem.addEventListener('click', async function() {
        const data = [elem.id];
        const courrier = await postData('/detailsCourrier', data);
        const div = this.querySelector('#detailsLivraison');
        if (etat === null) {
            displayStatuts(courrier.courrier, div);
            displayDetails(courrier.courrier, div);
            etat = elem.id;
        } else if (etat === elem.id) {
            closeStatut(div);
            etat = null;
        } else {
            closeStatut(div);
            displayStatuts(courrier.courrier, div);
            displayDetails(courrier.courrier, div);
            etat = elem.id;
        }
    });
});
