import { regexAddress, regexMail, regexName, regexNumbers } from "./data";

export function testField(reg, value) {
    if (reg.test(value)) {
        return true;
    } else {
        return false;
    }
}

export function testFormAdress(data) {
    const entityMap = {
        '&': '',
        '<': '',
        '>': '',
        '"': '',
        "'": '',
        '/': '',
        '`': '',
        '=': ''
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    }

    let newData = [];
    let testData = [];

    if (data.civilite) { newData.push(escapeHtml(data.civilite)); }
    if (data.prenom) {
        data.prenom = escapeHtml(data.prenom);
        testData.push(true);
    } else {
        testData.push(false);
    }
    if (data.nom) {
        data.nom = escapeHtml(data.nom);
        testData.push(true);
    } else {
        testData.push(false);
    }
    if (data.adresse) {
        data.adresse = escapeHtml(data.adresse);
        testData.push(true);
    } else {
        testData.push(false);
    }
    if (data.codePostal) {
        data.codePostal = escapeHtml(data.codePostal);
        testData.push(true);
    } else {
        testData.push(false);
    }
    if (data.ville) {
        data.ville = escapeHtml(data.ville);
        testData.push(true);
    } else {
        testData.push(false);
    }
    if (data.complement) {
        data.complement = escapeHtml(data.complement);
    }
    if (data.telephone) {
        data.telephone = escapeHtml(data.telephone);
    }
    if (data.email) {
        data.email = escapeHtml(data.email);
    }
    console.log('newdata', data);
    let n = 0;
    testData.forEach((elem) => {
        if(!elem) {
         n++;
        }
    });
    if (n === 0) {
        return data;
    } else {
        return false;
    }    
}

/* export function testFormAdress(data) {
    console.log("items", data);
    let result = [];
    if (data.civilite) {
        result.push(testField(regexName, data.civilite));
    }
    result.push(testField(regexName, data.prenom));
    result.push(testField(regexName, data.ville));
    result.push(testField(regexName, data.nom));
    result.push(testField(regexNumbers, data.codePostal));
    result.push(testField(regexAddress, data.adresse));
    if (data.complement) {
        result.push(testField(regexAddress, data.complement));
    }
    if (data.telephone && data.telephone !== "non disponible") {
        result.push(testField(regexNumbers, data.telephone));
    }
    if (data.email) {
        result.push(testField(regexMail, data.email));
    }
    let n = 0;
    result.forEach((elem) => {
        if(!elem) {
         n++;
        }
    });
    console.log('test', result);
    return (n === 0);
} */