import { dateInput } from "../utils/DOM-Content/form-content";
import dayjs from "dayjs";
import { timeSelect } from "../utils/DOM-Content/form-content";

export function blockHoursPast() {

    const now = dayjs();
    const hour = now.format("HH:mm");
    const today = dayjs().format("YYYY-MM-DD");
    const options = timeSelect.querySelectorAll("option");

    if (dateInput.value == today) {
        options.forEach((option) => {

            if (option.value < hour) {
                option.remove();
            }
        });
    }

    console.log("VALOR DE 'TODAY': ", today);
    console.log("Valor de date.input: ", dateInput.value);
}