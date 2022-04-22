import { formatDate, toTitleCase } from "./modules/formatter.js";
import postData from "./modules/postData.js";
import { closeDetailsRecherche, displayDetails, displayStatuts } from "./modules/_index.js";

console.log("coucou page historique-test");

let page = 0;
let max = 25;
const tbody = document.querySelector('tbody');
const currentPage = document.querySelector('#page');
const prevBtn = document.querySelector('#prevPage');
const nextBtn = document.querySelector('#nextPage');

currentPage.textContent = page + 1;

const response = await postData('/getLogs', [page, max]);
checkButtons();
console.log(response);
// remplissage du tableau
response.statuts.forEach((courrier) => {
    const tr = document.createElement('tr');
    const cell = [];
    for (let i = 0; i < 4; i++) {
        const td = document.createElement('td');
        cell.push(td);
    }
    cell[0].classList = "date";
    cell[0].textContent = formatDate(courrier.date);
    cell[1].textContent = toTitleCase(`${courrier.nom} ${courrier.prenom}`);
    const cercle = document.createElement('div');
    cercle.classList = "cercle";
    cercle.style.backgroundColor = setEtatColor(courrier.etat);
    const p = document.createElement('p');
    p.textContent = toTitleCase(courrier.etat);
    cell[2].appendChild(cercle);
    cell[2].appendChild(p);
    cell[3].textContent = courrier.bordereau;
    cell.forEach((td) => {
        tr.appendChild(td);
    });
    tbody.appendChild(tr);
});

nextBtn.addEventListener('click', () => {
    
})



function checkButtons() {
    if (page === 0) {
        prevBtn.style.display = "none";
    } else {
        prevBtn.style.display = "flex";
    }
    if (response.statuts.length > max) {
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "flex";
    }
}

function setEtatColor(etat) {
    let color;
    switch (etat) {
        case "distribué":
            color = "#24A640";
            break;
        default:
            color = "red";
            break;
    }
    return color;
}

















/*

const etats = document.querySelectorAll('.etat');
etats.forEach((etat) => {
    etat.querySelector('.cercle').style.backgroundColor = setEtatColor(etat.querySelector('p').textContent);
});

document.querySelector('#searchBtn').addEventListener('click', async () => {
    const data = document.querySelector('#searchInput').value;
    searchCourrier(data);
});

const trs = document.querySelectorAll('tbody > tr')
trs.forEach((tr) => {
    tr.addEventListener('click', function () {
        searchCourrier(this.querySelector('td:nth-child(4)').textContent);
        window.location.href = "#recherche";
    });
});

async function searchCourrier(tmp) {
    try {
        const data = [tmp];
        const response = await postData('/searchLogs', data);
        if (response.statuts === false) {
            console.log("oops");
        } else {
            const section = document.querySelector('#detailsRecherche');
            const div = section.querySelector('div:nth-child(2)');
            section.style.display = "flex";
            section.querySelector('h4').textContent = "Courrier n° : " + response.destinataire.bordereau;
            if (section.querySelector('.timeline') !== null) {
                closeDetailsRecherche(section);
            }
            displayStatuts(response.statuts, div);
            displayDetails(response.destinataire, div);
        }
    } catch (err) {
        console.log('toto');
    }
}

document.querySelector('#closeBtn').addEventListener('click', () => {
    document.querySelector('#detailsRecherche').style.display = "none";
});

function setEtatColor(etat) {
    let color;
    switch (etat) {
        case "Distribué":
            color = "#24A640";
            break;
        default:
            color = "red";
            break;
    }
    return color;
}
*/