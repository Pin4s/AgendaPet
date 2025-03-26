import dayjs from "dayjs";
import { openingHours } from "./utils/opening-hours";
import { registerSchedule } from "../services/register-schedule";

/////////////////////////////////////////////////////////
// CONSTANTES RELACIONADAS A CRIAÇÃO DE ELEMENTOS HTML //
// ESTÃO DENTRO DE SUAS RELATIVAS FUNÇÕES              //
/////////////////////////////////////////////////////////





//Form do dialog
const form = document.querySelector(".form")

//Constantes relativas EXCLUSIVAMENTE A ABERTURA do #dialog
const dialog = document.getElementById("dialog")
const containerBlur = document.querySelector(".container-blur")
const dialogButton = document.querySelector(".button-new-schedule button")

//Constantes relativas aos inputs de DENTRO do #dialog
const tutorNameInput = document.getElementById("client");
const petNameInput = document.getElementById("pet");
const phoneInput = document.getElementById("phone");
const serviceDescriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");
const timeSelect = document.getElementById("hours");

const selectHour = document.getElementById("hours"); //CREATE ELEMENT OPTION DENTRO DE hoursLoad()


//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\||
// !! Criação das funções abaixo !!  ||
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\||



//Define a data no input da primeira página como a data atual do usuario
export function todayDate() {

    const dateInput = document.querySelector('.form-date-select .input input[type="date"].date');

    dateInput.value = dayjs(new Date()).format('YYYY-MM-DD');
    console.log("Data da 1 pagina \nMensagem gerada por: todayDate()", dateInput.value, dateInput)

    return dateInput
}

//Abre o dialog ao clicar no botão de novo agendamento
dialog.addEventListener("toggle", () => {

    const hideButton = dialogButton.style.display

    if (hideButton === 'none') {
        dialogButton.style.display = "block"
    } else {
        dialogButton.style.display = "none"
    }

    console.log("**** By: dialog.addEventListenear ****")
    console.log("**    Toggle event aconteceu!!      **")
    console.log("**   O botão está com display:", hideButton, "**")
    console.log("**************************************")
    dialog.classList.toggle("open")
    containerBlur.classList.toggle("open")
})

//Faz ALGO ao enviar o SUBMIT do DIALOG ABERTO
form.addEventListener("submit", async (event) => {
    event.preventDefault()
    //Objeto que armazena os valores inseridos no input ANTES DO SUBMITE
    //Valores são registrados no objeto NO MOMENTO em que o evento de SUBMIT é disparado
    const formData = {
        client: tutorNameInput.value,
        pet: petNameInput.value,
        phone: phoneInput.value,
        description: serviceDescriptionInput.value,
        time: [dateInput.value, timeSelect.value],
    };

    //LIMPA OS VALORES NOS INPUTS ASSIM QUE O USUARIO REALIZA O EVENTO DE SUBMIT 
    //TRANSFORMAR ISSO EM MÉTODO POSTERIORMENTE
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            const inputElement = document.getElementById(key);
            if (inputElement) {
                inputElement.value = ''; 
            }
        }
    }

    //ENVIA OS DADOS PARA O SERVER.JSON
    await registerSchedule(formData)
})


//Define a data do dialog como data atual do usuario
export function dialogDate() {
    //Cria data do dia atual
    const today = dayjs(new Date()).format('YYYY-MM-DD');

    //Define data atual como valor do input de data
    dateInput.value = today
    console.log("Data do dialog", dateInput.value, dateInput)

    //Não permite seleção de datas passadas
    dateInput.setAttribute("min", today)
}

//Define e cria os horários disponives para agendamento
export function hoursLoad() {
    //Limpa quaisquer horários anteriores dentro do select
    //=-=-selectHour-=-= está definida no começo do código
    selectHour.innerHTML = ""

    //Realiza uma função para cada item dentro do array openingHours
    openingHours.forEach((hour) => {
        //Cria um elemento option para cada item dentro do array
        const options = document.createElement("option")

        options.value = hour
        options.textContent = hour

        //=-=-selectHour-=-= está definida no começo do código
        selectHour.appendChild(options)


        //NECESSÁRIO CRIAR A FUNÇÃO QUE BLOQUEIA HORÁRIOS JÁ AGENDADOS 
    })
}


//Função que bloqueia horários abaixo do horário atual
export function unavailableHours(){
    //Obtém DATA(Ano, mês, dia) e HORA atual
    const now = dayjs()

    //Obtem HORA atual
    const hour = now.format("HH:mm")//Hora atual
    
    //Obtém DATA atual
    const today = dayjs().format("YYYY-MM-DD")//Data atual

    //Guarda um array dentro de options | O array contem todos os option filhos de timeSelect
    const options = timeSelect.querySelectorAll("option")

    if (dateInput.value == today){
        options.forEach((option) => {

        //Caso a option (horário) seja menor do que o horário do usuario, ele será removido do html
        if (option.value < hour){
            option.remove()
        }
    })
    }
    
    console.log("VALOR DE 'TODAY': ",today)
    console.log("Valor de date.input: ", dateInput.value)

}

//Reseta horários ao trocar a data do date input
dateInput.addEventListener("change", () => {
    unavailableHours()
    hoursLoad()

})







////////////////////////////////////////////////
//  Todas as funções serão chamadas abaixo    //
////////////////////////////////////////////////



// ---registerSchedule()--- ESTÁ EM form.addEventListenear !!
todayDate()
dialogDate()
hoursLoad()
unavailableHours()
