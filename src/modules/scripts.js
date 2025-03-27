import dayjs from "dayjs";
import { openingHours } from "../utils/opening-hours";
import { registerSchedule } from "../services/register-schedule";
import { apiConfig } from "../services/api-config";


const today = dayjs(new Date()).format("YYYY-MM-DD");

//Form do dialog
const form = document.querySelector(".form");

//Constantes relativas EXCLUSIVAMENTE A ABERTURA do #dialog
const dialog = document.getElementById("dialog");
const containerBlur = document.querySelector(".container-blur");
const dialogButton = document.querySelector(".button-new-schedule button");

//Constantes relativas aos inputs de DENTRO do #dialog
const tutorNameInput = document.getElementById("client");
const petNameInput = document.getElementById("pet");
const phoneInput = document.getElementById("phone");
const serviceDescriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("hours");

const selectHour = document.getElementById("hours");
// Elementos da página principal para renderizar os agendamentos
const dateInputMain = document.querySelector('.form-date-select .input input[type="date"].date');
const periodMorningList = document.getElementById('period-morning');
const periodAfternoonList = document.getElementById('period-afternoon');
const periodNightList = document.getElementById('period-night');

//Variavel que recebe o valor do date input
let selectedDate = dateInput.value;

//JA FOI
export function todayDate() {
    dateInputMain.value = dayjs(new Date()).format("YYYY-MM-DD");
    console.log(
        "Data da 1 pagina \nMensagem gerada por: todayDate()",
        dateInputMain.value,
        dateInputMain
    );

    return dateInputMain;
}

dialog.addEventListener("toggle", () => {
    const hideButton = dialogButton.style.display;

    if (hideButton === "none") {
        dialogButton.style.display = "block";
    } else {
        dialogButton.style.display = "none";
    }

    dialog.classList.toggle("open");
    containerBlur.classList.toggle("open");
});

dateInput.addEventListener("change", () => {
    const data = dateInput.value

    dialogDate(dateInput.value)
    console.log("Data selecionada:", data);
    return data

})

//JA FOI
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

//JA FOI
export function dialogDate(date) {
    dateInput.value = date
    console.log("Data do dialog", dateInput.value, dateInput);

    dateInput.setAttribute("min", today);
}

//JA FOI
export async function availableHoursFlter(dataSelected) {
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

//JA FOI
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

//JA FOI
function createScheduleItem(schedule) {
    const listItem = document.createElement('li');
    listItem.dataset.id = schedule.id

    const timeStrong = document.createElement('strong');
    timeStrong.textContent = schedule.hour;

    const boxInfosDiv = document.createElement('div');
    boxInfosDiv.classList.add('box-infos');

    const petNameSpan = document.createElement('span');
    petNameSpan.classList.add('pet-name');
    petNameSpan.textContent = schedule.pet;

    const separatorSpan = document.createElement('span');
    separatorSpan.classList.add('separator');
    separatorSpan.textContent = '/';

    const clientNameSpan = document.createElement('span');
    clientNameSpan.textContent = schedule.client;

    boxInfosDiv.appendChild(petNameSpan);
    boxInfosDiv.appendChild(separatorSpan);
    boxInfosDiv.appendChild(clientNameSpan);

    const serviceDescriptionSpan = document.createElement('span');
    serviceDescriptionSpan.classList.add('service-description');
    serviceDescriptionSpan.textContent = schedule.description;

    const removeButtonSpan = document.createElement('span');
    removeButtonSpan.classList.add('remove-button');
    removeButtonSpan.textContent = 'Remover agendamento';

    removeButtonSpan.addEventListener('click', async (event) => {

        const item = event.target.closest("li")
        const id = item.dataset.id

        await removeSchedule(id)
        renderSchedules(dateInputMain.value)
    });

    listItem.appendChild(timeStrong);
    listItem.appendChild(boxInfosDiv);
    listItem.appendChild(serviceDescriptionSpan);
    listItem.appendChild(removeButtonSpan);

    return listItem;
}

//JA FOI
async function renderSchedules(date) {

    periodMorningList.innerHTML = '';
    periodAfternoonList.innerHTML = '';
    periodNightList.innerHTML = '';

    try {
        const response = await fetch(`${apiConfig.baseURL}/schedules`);
        const data = await response.json();

        if (Array.isArray(data)) {
            const schedules = data;

            const filteredSchedules = schedules.filter(schedule => schedule.date === date);

            //Periodos

            const morningSchedules = filteredSchedules.filter(schedule => {
                const hour = parseInt(schedule.hour.split(":")[0]);
                return hour >= 9 && hour < 12;
            });

            const afternoonSchedules = filteredSchedules.filter(schedule => {
                const hour = parseInt(schedule.hour.split(':')[0]);
                return hour >= 13 && hour < 18;
            });

            const nightSchedules = filteredSchedules.filter(schedule => {
                const hour = parseInt(schedule.hour.split(':')[0]);
                return hour >= 19 && hour < 21;
            });


            //Renederiza por periodo
            morningSchedules.forEach(schedule => {
                const item = createScheduleItem(schedule);
                periodMorningList.appendChild(item);
            });

            afternoonSchedules.forEach(schedule => {
                const item = createScheduleItem(schedule);
                periodAfternoonList.appendChild(item);
            });

            nightSchedules.forEach(schedule => {
                const item = createScheduleItem(schedule);
                periodNightList.appendChild(item);
            });
        } else {
            console.error("A resposta da API não é um array:", data);
            alert("Erro: A resposta da API não está no formato esperado.");
        }


    } catch (error) {
        console.log("Não foi possivel renderizar os itens. ", error);
        alert("Houve um erro. Não foi possível renderizar os itens");
    }
}

//JA FOI EM API
export async function removeSchedule(id) {
    try {
        await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
            method: "DELETE",
        })
    } catch (error) {
        console.log(erro)
        alert("NãO FOI POSSIVEL CANCELAR")
    }
}


phoneInput.addEventListener("input", (event) => {
    let phoneValue = event.target.value;

    phoneValue = phoneValue.replace(/\D/g, '');


    if (phoneValue.length > 11) {
        phoneValue = phoneValue.slice(0, 11);
    }

    if (phoneValue.length <= 10) {
        phoneValue = phoneValue.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
        phoneValue = phoneValue.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
    }

    event.target.value = phoneValue;
});


dateInputMain.addEventListener("change", () => {
    selectedDate = dateInputMain.value;
    renderSchedules(selectedDate);
});

//JA FOI
window.addEventListener("DOMContentLoaded", () => {
    renderSchedules(dateInputMain.value);


})

//vai pra scripts.js
todayDate();
dialogDate(today);
availableHoursFlter(dateInput.value);
blockHoursPast();