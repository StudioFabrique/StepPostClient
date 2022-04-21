import { formatDate, toTitleCase } from "./formatter.js";

/**
 * fonctions utilisées dans le fichier index.js
 */

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
