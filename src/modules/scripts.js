import dayjs from "dayjs";
import { openingHours } from "./utils/opening-hours";
import { registerSchedule } from "../services/register-schedule";
import { apiConfig } from "../services/api-config";

/////////////////////////////////////////////////////////
// CONSTANTES RELACIONADAS A CRIAÇÃO DE ELEMENTOS HTML //
// CONSTANTES RELATIVAS A CRIAÇÃO DE ELEMENTOS HTML //
/////////////////////////////////////////////////////////

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

const selectHour = document.getElementById("hours"); //CREATE ELEMENT OPTION DENTRO DE hoursLoad()

// Elementos da página principal para renderizar os agendamentos
const dateInputMain = document.querySelector('.form-date-select .input input[type="date"].date');
const periodMorningList = document.getElementById('period-morning');
const periodAfternoonList = document.getElementById('period-afternoon');
const periodNightList = document.getElementById('period-night');

//Variavel que recebe o valor do date input, vai trocar toda hora
let selectedDate = dateInput.value;

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\||
// !! Criação das funções abaixo !!  ||
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\||

//Define a data no input da primeira página como a data atual do usuario
export function todayDate() {
    dateInputMain.value = dayjs(new Date()).format("YYYY-MM-DD");
    console.log(
        "Data da 1 pagina \nMensagem gerada por: todayDate()",
        dateInputMain.value,
        dateInputMain
    );

    return dateInputMain;
}

//Abre o dialog ao clicar no botão de novo agendamento
dialog.addEventListener("toggle", () => {
    const hideButton = dialogButton.style.display;

    if (hideButton === "none") {
        dialogButton.style.display = "block";
    } else {
        dialogButton.style.display = "none";
    }

    console.log("**** By: dialog.addEventListenear ****");
    console.log("**    Toggle event aconteceu!!      **");
    console.log("**   O botão está com display:", hideButton, "**");
    console.log("**************************************");
    dialog.classList.toggle("open");
    containerBlur.classList.toggle("open");
});

dateInput.addEventListener("change", () => {
    const data = dateInput.value

    dialogDate(dateInput.value)
    console.log("Data selecionada:", data);
    return data
    
})

//Faz ALGO ao enviar o SUBMIT do DIALOG ABERTO
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // **PRESERVA O VALOR DO dateInput ANTES DE LIMPAR OS CAMPOS**
    const selectedDateValue = dateInput.value;


    //Objeto que armazena os valores inseridos no input ANTES DO SUBMITE
    //Valores são registrados no objeto NO MOMENTO em que o evento de SUBMIT é disparado
    const formData = {
        client: tutorNameInput.value,
        pet: petNameInput.value,
        phone: phoneInput.value,
        description: serviceDescriptionInput.value,
        date: selectedDateValue, // Usa o valor preservado
        hour: timeSelect.value,
    };

    //LIMPA OS VALORES NOS INPUTS ASSIM QUE O USUARIO REALIZA O EVENTO DE SUBMIT
    //TRANSFORMAR ISSO EM MÉTODO POSTERIORMENTE
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            const inputElement = document.getElementById(key);
            if (inputElement && key !== 'date') { // Não limpa o campo de data
                inputElement.value = "";
            }
        }
    }

    
    //ENVIA OS DADOS PARA O SERVER.JSON
    await registerSchedule(formData);
    renderSchedules(dateInputMain.value)
    hoursLoad(selectedDateValue); // Refresh available hours after submission  // Usa o valor preservado
    dialogDate(selectedDateValue) // Usa o valor preservado
});

//Define a data do dialog como data atual do usuario
export function dialogDate(date) {
    //Cria data do dia atual

    //Define data atual como valor do input de data
    dateInput.value = date
    console.log("Data do dialog", dateInput.value, dateInput);

    //Não permite seleção de datas passadas
    dateInput.setAttribute("min", today);
}

//Define e cria os horários disponives para agendamento
export async function hoursLoad(dataSelected) {
    try {
        //Limpa quaisquer horários anteriores dentro do select
        selectHour.innerHTML = "";

        //Recebe valores dentro de schedules
        const response = await fetch(`${apiConfig.baseURL}/schedules`);
        const schedules = await response.json();

        console.log("Agendamentos carregados para o servidor", schedules);

        //Filtra horários ocupados para a data selecionada
        const occupiedHours = schedules
            .filter((schedule) => schedule.date === dataSelected)
            .map((schedule) => schedule.hour);

        console.log("Horários ocupados para", dataSelected, ":", occupiedHours);

        //Realiza uma função para cada item dentro do array openingHours
        openingHours.forEach((hour) => {
            //Verifica se o horário já está ocupado
            const isOccupied = occupiedHours.includes(hour);

            // If the selected date is today, apply the unavailableHours filter
            if (dayjs(dataSelected).isSame(dayjs(), 'day')) {
                const now = dayjs();
                const currentHour = now.format("HH:mm");
                if (!isOccupied && hour > currentHour) { // Only add if it's not occupied and is later than the current time
                    const options = document.createElement("option");
                    options.value = hour;
                    options.textContent = hour;
                    selectHour.appendChild(options);
                }
            } else {
                if (!isOccupied) { // If the selected date is not today, just filter by occupied hours
                    const options = document.createElement("option");
                    options.value = hour;
                    options.textContent = hour;
                    selectHour.appendChild(options);
                }
            }
        });

        if (selectHour.options.length === 0) {
            const options = document.createElement("option");
            options.value = "";
            options.textContent = "Nenhum horário disponível";
            options.disabled = true;
            selectHour.appendChild(options);
        }
    } catch (error) {
        console.log(
            "-------------Erro em hoursLoad()-----------\n",
            error,
            "\n----------------------------------------------"
        );
    }
}

//Função que bloqueia horários abaixo do horário atual
export function unavailableHours() {
    //Obtém DATA(Ano, mês, dia) e HORA atual
    const now = dayjs();

    //Obtem HORA atual
    const hour = now.format("HH:mm"); //Hora atual

    //Obtém DATA atual
    const today = dayjs().format("YYYY-MM-DD"); //Data atual

    //Guarda um array dentro de options | O array contem todos os option filhos de timeSelect
    const options = timeSelect.querySelectorAll("option");

    if (dateInput.value == today) {
        options.forEach((option) => {
            //Caso a option (horário) seja menor do que o horário do usuario, ele será removido do html
            if (option.value < hour) {
                option.remove();
            }
        });
    }

    console.log("VALOR DE 'TODAY': ", today);
    console.log("Valor de date.input: ", dateInput.value);
}

// Função para criar um elemento de agendamento
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
        // Implementar a lógica de remoção aqui (usando o ID do agendamento, por exemplo)
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


//Renderiza agendamentos na pagina
async function renderSchedules(date) {
    // Limpa as listas existentes
    periodMorningList.innerHTML = '';
    periodAfternoonList.innerHTML = '';
    periodNightList.innerHTML = '';

    try {
        const response = await fetch(`${apiConfig.baseURL}/schedules`);
        const data = await response.json(); // A resposta da API deve ser um objeto JSON

        // Verifique se 'data' é um array antes de prosseguir
        if (Array.isArray(data)) {
            const schedules = data; // Agora 'schedules' é um array

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

//Reseta horários ao trocar a data do date input
dateInputMain.addEventListener("change", () => {
    selectedDate = dateInputMain.value;
    renderSchedules(selectedDate);
});

window.addEventListener("DOMContentLoaded", () => {
    renderSchedules(dateInputMain.value);
})

////////////////////////////////////////////////
//  Todas as funções serão chamadas abaixo    //
////////////////////////////////////////////////

// ---registerSchedule()--- ESTÁ EM form.addEventListenear !!
todayDate();
dialogDate(today);
hoursLoad(dateInput.value); // Load hours initially based on the default date.
unavailableHours();