import { formatDate, toTitleCase } from "./modules/formatter.js";
import postData from "./modules/postData.js";
import { closeDetailsRecherche, displayDetails, displayStatuts, setEtatColor, setCurrentPage } from "./modules/affichage.js";

console.log("coucou page historique-test");

let url = '/getLogs';
let page = 0;
let max = 10;
let nom = "";
const table = document.querySelector('table');
let tbody = document.querySelector('tbody');
const prevBtn = document.querySelector('#prevPage');
const nextBtn = document.querySelector('#nextPage');


setTable();

nextBtn.addEventListener('click', () => {
    page++;
    setTable();
});

prevBtn.addEventListener('click', () => {
    page--;
    setTable();
});

async function setTable() {
    nextBtn.style.visibility = "hidden";
    currentPage.style.visibility = "hidden";
    prevBtn.style.visibility = "hidden";
    tbody.remove()
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
    const response = await postData(url, [page, max, nom, true]);
    if (response.statuts === false) {
        if (document.querySelector('#detailsRecherche').style.display === "flex") {
            document.querySelector('#detailsRecherche').style.display = "none";
        }
        const article = document.querySelector('.errorMessage');
        article.style.display = "flex";
        animatedTimeline(article);
        return;
    }
    // remplissage du tableau
    response.statuts.forEach((courrier) => {
        const tr = document.createElement('tr');
        const cell = [];
        for (let i = 0; i < 4; i++) {
            const td = document.createElement('td');
            cell.push(td);
        }
        cell[0].textContent = courrier.bordereau;
        cell[1].classList = "date";
        cell[1].textContent = formatDate(courrier.date);
        cell[2].textContent = toTitleCase(`${courrier.nom} ${courrier.prenom}`);
        const cercle = document.createElement('div');
        cercle.classList = "cercle";
        cercle.style.backgroundColor = setEtatColor(courrier.etat);
        const p = document.createElement('p');
        p.textContent = toTitleCase(courrier.etat);
        cell[3].appendChild(cercle);
        cell[3].appendChild(p);
        cell.forEach((td) => {
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    nextBtn.style.visibility = "visible";
    currentPage.style.visibility = "visible";
    prevBtn.style.visibility = "visible";
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
    const trs = document.querySelectorAll('tbody > tr');
    console.log(trs);
    trs.forEach((tr) => {
        tr.addEventListener('click', function () {
            console.log('click ok');
            searchCourrier(this.querySelector('td:nth-child(1)').textContent);
            window.location.href = "#recherche";
        });
    });
}

// gestion du bouton recherche
document.querySelector('#searchBtn').addEventListener('click', async () => {
    const data = document.querySelector('#searchInput').value;
    searchCourrier(data);
});

async function searchCourrier(tmp) {
    try {
        const section = document.querySelector('#detailsRecherche');
        if (section.style.display === "flex") {
            section.style.display = "none";
        }
        const data = [tmp, true];
        const response = await postData('/searchLogs', data);
        if (response.statuts === false) {
            console.log("oops");
            page = 0;
            nom = tmp;
            setTable();
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
        console.log('toto');
    }
}

document.querySelector('#closeBtn').addEventListener('click', () => {
    document.querySelector('#detailsRecherche').style.display = "none";
});

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
    setTable();
    document.querySelector('.errorMessage').style.display = "none";
});
