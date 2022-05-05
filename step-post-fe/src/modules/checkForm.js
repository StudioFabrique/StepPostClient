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
    if (data.telephone) {
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
    return (n === 0);
    console.log('test', result);
}