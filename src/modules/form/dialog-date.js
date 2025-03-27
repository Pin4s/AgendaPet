import { dateInput } from "../utils/DOM-Constent/form-consts";

export function dialogDate(date) {
    dateInput.value = date
    console.log("Data do dialog", dateInput.value, dateInput);

    dateInput.setAttribute("min", today);
}
