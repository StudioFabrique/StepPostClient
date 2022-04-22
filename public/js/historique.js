import postData from "./modules/postData.js";
import { closeDetailsRecherche, displayDetails, displayStatuts } from "./modules/_index.js";

console.log("coucou page historique");

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
