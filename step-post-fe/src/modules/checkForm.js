import { regexAddress, regexMail, regexName, regexNumbers } from "./data";

export function testField(reg, value) {
    if (reg.test(value)) {
        return true;
    } else {
        return false;
    }
}

export function testFormAdress(data) {
    console.log("items", data);
    let result = false;
    if (data.civilite) {
        result = testField(regexName, data.civilite);
    }
    result = testField(regexName, data.prenom);
    result = testField(regexName, data.ville);
    result = testField(regexName, data.nom);
    result = testField(regexNumbers, data.codePostal);
    result = testField(regexAddress, data.adresse);
    if (data.complement) {
        result = testField(regexAddress, data.complement);
    }
    if (data.telephone) {
        result = testField(regexAddress, data.telephone);
    }
    if (data.email) {
        result = testField(regexMail, data.email);
    }
    console.log('test', result);
    return result;
}