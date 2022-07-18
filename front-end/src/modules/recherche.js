import { testField } from "./checkForm";
import { regexName, regexNumbers } from "./data";

export function testRechercheForm(value) {
  let testName = testField(regexName, value);
  let testNumbers = testField(regexNumbers, value);
  if (testNumbers) {
    return "bordereau";
  } else if (testName) {
    return "nom";
  }
  return false;
}
