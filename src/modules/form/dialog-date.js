import { dateInput } from "../utils/DOM-Content/form-content";
import { today } from "../utils/today";

export function dialogDate(date) {
    dateInput.value = date
    console.log("Data do dialog", dateInput.value, dateInput);

    dateInput.setAttribute("min", today);
}
