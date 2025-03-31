import { dateInput } from "../utils/DOM-Constent/form-consts";
import { today } from "../utils/today";

export function dialogDate(date) {
    dateInput.value = date
    console.log("Data do dialog", dateInput.value, dateInput);

    dateInput.setAttribute("min", today);
}
