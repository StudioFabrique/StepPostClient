import { getData } from "./modules/getData.js";

try {
    const response = await getData('/isLogged');
    if (!response.isLogged) {
        document.querySelector('#logout').style.display = "none";
    }
}
catch (err) {
    console.log((err));
}
