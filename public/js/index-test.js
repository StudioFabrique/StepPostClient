import { formatDate, toTitleCase } from "./modules/formatter.js";
import postData from "./modules/postData.js";

let page = 0;
let max = 3;
let nom = "";
let filtre = false;
let etat = null;

const form = document.querySelector('#form');
const searchInput = document.querySelector('#searchInput');
const section = document.querySelector('section:nth-child(3)');
let anchor = document.querySelector('.anchor');

setDatas([page, max, nom, filtre]);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    searchCourrier(searchInput.value);
    /*
    anchor.remove();
    anchor = document.createElement('div');
    anchor.classList = "anchor";
    section.appendChild(anchor);
    setDatas([page, max, searchInput.value, filtre]);
    */    
})

function closeAnchor() {
    anchor.remove();
    anchor = document.createElement('div');
    anchor.classList = "anchor";
    section.appendChild(anchor);
    etat = null;
}

async function setDatas(datas) {
    const response = await (await postData('/getEnvoi', datas));
    response.statuts.forEach((envoi) => {
        anchor.appendChild(buildArticle(envoi));
    });
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
    article.addEventListener('click', async function() {
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

function setEtatMessage(etat, nom) {
    let message;
    switch (etat) {
        case "remise":
            message = `Le courrier pour ${nom} a été pris en charge`;
            break;
        case "distribué":
            message = `Le destinataire ${nom} a bien reçu son courier`;
            break;
        case "avisé":
            message = `Le facteur a laissé un avis de passage pour : ${nom}`;
            break;
        case "instancié":
            message = ` Le courrier pour ${nom} a été déposé à un point de retrait`;
            break;
        case "npai":
            message = `Le destinataire ${nom} n'habite pas à l'adresse indiquée`;
            break;
        case "retour":
            message = `Le courrier pour ${nom} a été retourné )'expéditeur`;
            break;

    }
    return message;
}

export function displayStatuts(courrier, article) {
    courrier.forEach((elem) => {
        elem.date = formatDate(elem.date);
    });
    const timeline = document.createElement('article');
    timeline.classList = "timeline";
    const div = document.createElement('div');
    timeline.appendChild(div);
    article.appendChild(timeline);
    const anchor = div;
    for (let i = 0; i < courrier.length; i++) {
        const cercleContainer = document.createElement('div');
        cercleContainer.classList = "cercle-container";
        const cercle = document.createElement('div');
        cercle.classList = "cercle";
        cercleContainer.appendChild(cercle);
        anchor.appendChild(cercleContainer);
        cercle.style.backgroundColor = setColor(courrier[i].etat);
        cercle.id = i;
        cercleContainer.appendChild(setDetails(courrier[i].etat, "statuts"));
        cercleContainer.appendChild(setDetails(courrier[i].date, "statuts-date"));
        if (i < (courrier.length - 1)) {
            const trait = document.createElement('div');
            trait.classList = "trait";
            anchor.appendChild(trait);
            trait.style.backgroundColor = setColor(courrier[i + 1].etat);
        }
    }
    const cercles = timeline.querySelectorAll('.cercle');
    cercles[cercles.length - 1].style.backgroundColor = "#24A640";
    const traits = timeline.querySelectorAll('.trait');
    traits[traits.length - 1].style.backgroundColor = "#24A640";
}


export function closeStatut(div) {
    div.querySelector('.timeline').remove();
    div.querySelector('.details').remove();
}

export function closeDetailsRecherche(section) {
    section.querySelector('.timeline').remove();
    section.querySelector('.details').remove();
}

function setDetails(data, classe) {
    const div = document.createElement('div');
    div.className = classe;
    div.textContent = data;
    return div;
}

function setColor(statut) {
    let color;
    switch (statut) {
        case "NPAI":
            color = "red";
            break;
        case "retour":
            color = "red";
            break;
        case "distribué":
            color = "#24A640";
            break;
        default:
            color = "#FF5E1A";
            break;
    }
    return color;
}

export function displayDetails(courrier, anchor) {
    const article = document.createElement('article');
    const div = document.createElement('div');
    const nom = document.createElement('p');
    const adresse = document.createElement('p');
    const ville = document.createElement('p');
    nom.textContent = toTitleCase(`${courrier.civilite} ${courrier.prenom} ${courrier.nom}`);
    adresse.textContent = toTitleCase(courrier.adresse);
    ville.textContent = toTitleCase(`${courrier.codePostal} ${courrier.ville}`);
    article.classList = "details";
    div.appendChild(nom);
    div.appendChild(adresse);
    div.appendChild(ville);
    article.appendChild(div);
    anchor.appendChild(article);
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
            closeAnchor();
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