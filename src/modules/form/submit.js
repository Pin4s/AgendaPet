import { form } from "../utils/DOM-Constent/form-consts";
import { dateInput } from "../utils/DOM-Constent/form-consts";
import { dialogDate } from "./dialog-date";
import { dateInputMain } from "../utils/DOM-Constent/schedules-on-main-page-consts";
import { renderSchedules } from "../loaders/render-schedules";
import { registerSchedule } from "../../services/register-schedule";
import { availableHoursFilter } from "./available-hours-filter";
import { tutorNameInput, petNameInput, phoneInput, serviceDescriptionInput, timeSelect } from "../utils/DOM-Constent/form-consts";
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedDateValue = dateInput.value

    const formData = {
        client: tutorNameInput.value,
        pet: petNameInput.value,
        phone: phoneInput.value,
        description: serviceDescriptionInput.value,
        date: selectedDateValue, 
        hour: timeSelect.value,
    }

    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            const inputElement = document.getElementById(key);
            if (inputElement && key !== 'date') { 
                inputElement.value = ""
            }
        }
    }

    await registerSchedule(formData)
    renderSchedules(dateInputMain.value)
    availableHoursFilter(selectedDateValue)
    dialogDate(selectedDateValue)

})