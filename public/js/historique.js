import postData from "./modules/postData.js";
import { displayDetails, displayStatuts } from "./modules/_index.js";

console.log("coucou page historique");

const courriers = document.querySelectorAll('tbody > tr:nth-child(odd)');

courriers.forEach((courrier) => {
    courrier.addEventListener('click', async function() {
        console.log('click');
        const data = [courrier.id];
        const tmp = this.nextElementSibling;
        console.log('tmp', tmp);
        const div = tmp.querySelector('td > div');
        console.log('div', div);
        const mail = await(await postData('/detailsCourrier', data));
        tmp.style.display = "flex";
        displayStatuts(mail.courrier, div);
        displayDetails(mail.destinataire, div);
    });
});