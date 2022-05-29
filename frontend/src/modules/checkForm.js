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
        "'": ' ',
        '/': '',
        '`': '',
        '=': ''
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'`=]/g, function (s) {
            return entityMap[s];
        });
    }

    let testData = [];

    if (data.civilite) {
        data.civilite = escapeHtml(data.civilite);
    }
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