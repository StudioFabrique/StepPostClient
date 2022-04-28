if (document.querySelector('#retourBtn')) {
    document.querySelector('#retourBtn').addEventListener('click', () => {
        window.location.href = '/adressesFavorites';
    });
}

const adresses = document.querySelectorAll('.adresse');

adresses.forEach((adresse) => {
    const icones = adresse.querySelectorAll('ul > li');
    icones[1].addEventListener('click', function () {
        editAdresse(this.id);
    });
    icones[2].addEventListener('click', function () {
        deleteAdresse(this.id);
    });
});

function editAdresse(id) {
    console.log(`édition de l'adresse ${id}`);
}

async function deleteAdresse(id) {
    console.log(`suppression de l'adresse ${id}`);
    const response = await postData('/getAdresse' [id]);
}