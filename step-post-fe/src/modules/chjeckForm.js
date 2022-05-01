export function testField(reg, value) {
    if (reg.test(value)) {
        return true;
    } else {
        return false;
    }
}