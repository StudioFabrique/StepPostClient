import { formatDate, toTitleCase } from "./modules/formatter.js";
import postData from "./modules/postData.js";
import { setCurrentPage, displayStatuts, displayDetails, setEtatMessage, closeDetailsRecherche, closeStatut } from "./modules/affichage.js";

let page = 0;
let max = 3;
let nom = "";
let filtre = false;
let etat = null;

const form = document.querySelector('#form');
const searchInput = document.querySelector('#searchInput');
const section = document.querySelector('section:nth-child(4)');
let anchor = document.querySelector('.anchor');
const prevBtn = document.querySelector('#prevPage');
const nextBtn = document.querySelector('#nextPage');

setDatas([page, max, nom, filtre]);

document.querySelector('#closeBtn').addEventListener('click', () => {
    document.querySelector('#detailsRecherche').style.display = "none";
});

nextBtn.addEventListener('click', () => {
    page++;
    setDatas([page, max, nom, filtre]);
});

prevBtn.addEventListener('click', () => {
    page--;
    setDatas([page, max, nom, filtre]);
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    searchCourrier(searchInput.value);
});

function closeAnchor() {
    anchor.remove();
    anchor = document.createElement('div');
    anchor.classList = "anchor";
    section.appendChild(anchor);
    etat = null;
}

async function setDatas(datas) {
    closeAnchor();
    const response = await (await postData('/getEnvoi', datas));
    console.log('response', response);
    if (response.statuts === false) {
        if (document.querySelector('#detailsRecherche').style.display === "flex") {
            document.querySelector('#detailsRecherche').style.display = "none";
        }
        document.querySelector('section:nth-child(4)').style.display = "none";
        const article = document.querySelector('.errorMessage');
        console.log(article);
        article.style.display = "flex";
    } else {
        response.statuts.forEach((envoi) => {
            anchor.appendChild(buildArticle(envoi));
        });
        setCurrentPage(page);
        if (page === 0) {
            prevBtn.style.display = "none";
        } else {
            prevBtn.style.display = "flex";
        }
        if (response.statuts.length < max) {
            nextBtn.style.display = "none";
        } else {
            nextBtn.style.display = "flex";
        }
    }
}

function buildArticle(envoi) {
    const article = document.createElement('article');
    article.classList = "courrier";
    article.id = envoi.id;
    const div1 = document.createElement('div');
    const h4 = document.createElement('h4');
    h4.classList = "date";
    h4.textContent = formatDate(envoi.date);
    const p = document.createElement('p');
    p.textContent = `Bordererau n° : ${envoi.bordereau}`;
    div1.appendChild(h4);
    div1.appendChild(p);
    article.appendChild(div1);
    const div2 = document.createElement('div');
    const span1 = document.createElement('span');
    span1.textContent = setEtatMessage(envoi.etat, toTitleCase(envoi.nom));
    div2.appendChild(span1);
    const span2 = document.createElement('span');
    const p2 = document.createElement('p');
    if (envoi.type === 0) {
        p2.textContent = "Colis";
    } else {
        p2.textContent = "Lettre";
    }
    div2.appendChild(p2);
    article.appendChild(div2);
    const div3 = document.createElement('div');
    div3.classList = "detailsLivraison";
    article.appendChild(div3);
    setEventListeners(article);
    return article;
}

function setEventListeners(article) {
    article.addEventListener('click', async function () {
        const data = [this.id];
        const div = this.querySelector('.detailsLivraison');
        if (etat === null) {
            const courrier = await postData('/detailsCourrier', data);
            displayStatuts(courrier.courrier, div);
            displayDetails(courrier.destinataire, div);
            this.style.backgroundColor = "#E0E0E0";
            etat = this.id;
        } else if (etat === this.id) {
            closeStatut(div);
            this.style.backgroundColor = "white";
            etat = null;
        } else {
            const article = document.getElementById(etat);
            closeStatut(article.querySelector('.detailsLivraison'));
            article.style.backgroundColor = "white";
            this.style.backgroundColor = "#E0E0E0";
            const courrier = await postData('/detailsCourrier', data);
            displayStatuts(courrier.courrier, div);
            displayDetails(courrier.destinataire, div);
            etat = this.id;
        }
    });
}

async function searchCourrier(tmp) {
    try {
        const section = document.querySelector('#detailsRecherche');
        if (section.style.display === "flex") {
            section.style.display = "none";
        }
        const data = [tmp, true];
        const response = await postData('/searchCourrier', data);
        console.log(response);
        if (response.statuts === false) {
            console.log("oops");
            setDatas([0, max, tmp, false]);
        } else {
            const section = document.querySelector('#detailsRecherche');
            const div = section.querySelector('div:nth-child(2)');
            section.style.display = "flex";
            animatedTimeline(section);
            section.querySelector('h4').textContent = "Courrier n° : " + response.destinataire.bordereau;
            if (section.querySelector('.timeline') !== null) {
                closeDetailsRecherche(section);
            }
            displayStatuts(response.statuts, div);
            displayDetails(response.destinataire, div);
        }
    } catch (err) {
        console.log('erreur');
    }
}

function animatedTimeline(div) {
    div.animate([
        {
            opacity: "0"
        },
        {
            opacity: "1"
        }
    ], {
        duration: 500
    });
}

document.querySelector('#goBackBtn').addEventListener('click', () => {
    page = 0; 
    document.querySelector('#searchInput').value = "";
    nom = "";
    document.querySelector('section:nth-child(4)').style.display = "flex";
    setDatas([page, max, nom, false]);
    document.querySelector('.errorMessage').style.display = "none";
});