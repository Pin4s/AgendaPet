import { form } from "../utils/DOM-Constent/form-consts";
import { dialogDate } from "../scripts";
import { dateInputMain } from "../utils/DOM-Constent/schedules-on-main-page-consts";
import { renderSchedules } from "../loaders/render-schedules";
import { registerSchedule } from "../../services/register-schedule";
import { availableHoursFlter } from "../scripts";


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedDateValue = dateInput.value

    const formData = {
        client: tutorNameInput.value,
        pet: petNameInput.value,
        phone: phoneInput.value,
        description: serviceDescriptionInput.value,
        date: selectedDateValue, // Usa o valor preservado
        hour: timeSelect.value,
    }

    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            const inputElement = document.getElementById(key);
            if (inputElement && key !== 'date') { // Não limpa o campo de data
                inputElement.value = ""
            }
        }
    }

    await registerSchedule(formData)
    renderSchedules(dateInputMain.value)
    availableHoursFlter(selectedDateValue)
    dialogDate(selectedDateValue)

})