import { dateInput } from "../utils/DOM-Constent/form-consts";

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