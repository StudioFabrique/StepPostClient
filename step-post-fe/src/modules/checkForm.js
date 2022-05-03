import { regexMail, regexName, regexNumbers } from "./data";

export function testField(reg, value) {
    if (reg.test(value)) {
        return true;
    } else {
        return false;
    }
}

export function testStr(string) {
    return testField(regexName, string);
}

export function testNbr(nbr) {
    return testField(regexNumbers, nbr);
}

export function testMail(mail) {
    return testMail(regexMail, mail);
}