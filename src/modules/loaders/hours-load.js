import { openingHours } from "../../utils/opening-hours"
import { selectHour } from "../utils/DOM-Content/form-content"
import dayjs from "dayjs";

export async function hoursLoad(dataSelected) {
    try {
        selectHour.innerHTML = ""

        const response = await fetch(`${apiConfig.baseURL}/schedules`)
        const schedules = await response.json()

        console.log("Agendamentos carregados para o servidor", schedules)


        const occupiedHours = schedules
            .filter((schedule) => schedule.date === dataSelected)
            .map((schedule) => schedule.hour)

        console.log("Horários ocupados para", dataSelected, ":", occupiedHours)

        openingHours.forEach((hour) => {
            const isOccupied = occupiedHours.includes(hour)
            if (dayjs(dataSelected).isSame(dayjs(), 'day')) {
                const now = dayjs()
                const currentHour = now.format("HH:mm")
                if (!isOccupied && hour > currentHour) {
                    const options = document.createElement("option")
                    options.value = hour
                    options.textContent = hour
                    selectHour.appendChild(options)
                }
            } else {
                if (!isOccupied) {
                    const options = document.createElement("option")
                    options.value = hour
                    options.textContent = hour
                    selectHour.appendChild(options)
                }
            }
        });

        if (selectHour.options.length === 0) {
            const options = document.createElement("option")
            options.value = ""
            options.textContent = "Nenhum horário disponível"
            options.disabled = true
            selectHour.appendChild(options)
        }
    } catch (error) {
        console.log(error)
    }
}
