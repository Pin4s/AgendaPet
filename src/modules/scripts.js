import dayjs from "dayjs";
import { openingHours } from "./utils/opening-hours";


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

//Objeto que armazena os valores inseridos no input
const formData = {
    client: tutorNameInput.value,
    pet: petNameInput.value,
    phone: phoneInput.value,
    description: serviceDescriptionInput.value,
    time: [dateInput.value, timeSelect.value],
};

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
    console.log("**   O botão está com display:", hideButton,"**")
    console.log("**************************************")
    dialog.classList.toggle("open")
    containerBlur.classList.toggle("open")
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
export function hoursLoad(){
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




////////////////////////////////////////////////
//  Todas as funções serão chamadas abaixo    //
////////////////////////////////////////////////


todayDate()
dialogDate()
hoursLoad()


