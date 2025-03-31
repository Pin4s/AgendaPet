import dayjs from "dayjs";

const today = dayjs(new Date()).format("YYYY-MM-DD");

const dialog = document.getElementById("dialog");
const containerBlur = document.querySelector(".container-blur");
const dialogButton = document.querySelector(".button-new-schedule button");

const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");
const dateInputMain = document.querySelector('.form-date-select .input input[type="date"].date');


let selectedDate = dateInput.value;

dialog.addEventListener("toggle", () => {
    const hideButton = dialogButton.style.display;

    if (hideButton === "none") {
        dialogButton.style.display = "block"
    } else {
        dialogButton.style.display = "none"
    }

    dialog.classList.toggle("open")
    containerBlur.classList.toggle("open")
});

dateInput.addEventListener("change", () => {
    const data = dateInput.value
    availableHoursFilter(data)
    dialogDate(dateInput.value)
    console.log("Data selecionada:", data)
    return data

})

phoneInput.addEventListener("input", (event) => {
    let numericValue = event.target.value.replace(/\D/g, '')


    const maxLength = 11
    numericValue = numericValue.slice(0, maxLength)


    let formattedValue = numericValue
    const len = numericValue.length

    if (len === 0) {
        formattedValue = ''
    } else if (len <= 2) {

        formattedValue = numericValue.replace(/^(\d{1,2})/, '($1')
    } else if (len === 3) {

        formattedValue = numericValue.replace(/^(\d{2})(\d{1})/, '($1) $2')
    } else if (len <= 7) {
    
        formattedValue = numericValue.replace(/^(\d{2})(\d{1})(\d{1,4})/, '($1) $2 $3')
    } else {

        formattedValue = numericValue.replace(/^(\d{2})(\d{1})(\d{4})(\d{1,4})/, '($1) $2 $3-$4')
    }

    event.target.value = formattedValue;
});


phoneInput.addEventListener("paste", (event) => {

    event.preventDefault();


    const pasteData = (event.clipboardData || window.clipboardData).getData('text')

    const numericPasteData = pasteData.replace(/\D/g, '')

    let currentValue = event.target.value.replace(/\D/g, '')
    let combinedValue = (currentValue + numericPasteData).slice(0, 11)


    let formattedCombinedValue = combinedValue
    const combinedLen = combinedValue.length

     if (combinedLen === 0) {
        formattedCombinedValue = '';
    } else if (combinedLen <= 2) {
        formattedCombinedValue = combinedValue.replace(/^(\d{1,2})/, '($1')
    } else if (combinedLen === 3) {
        formattedCombinedValue = combinedValue.replace(/^(\d{2})(\d{1})/, '($1) $2')
    } else if (combinedLen <= 7) {
        formattedCombinedValue = combinedValue.replace(/^(\d{2})(\d{1})(\d{1,4})/, '($1) $2 $3')
    } else {
        formattedCombinedValue = combinedValue.replace(/^(\d{2})(\d{1})(\d{4})(\d{1,4})/, '($1) $2 $3-$4')
    }

    event.target.value = formattedCombinedValue;
});

dateInputMain.addEventListener("change", () => {
    selectedDate = dateInputMain.value
    renderSchedules(selectedDate);
});

import { todayDate } from "./schedule/today-date";
import { dialogDate } from "./form/dialog-date";
import { renderSchedules } from "./loaders/render-schedules";
import { availableHoursFilter } from "./form/available-hours-filter";
import { blockHoursPast } from "./form/block-hours-past";

todayDate();
dialogDate(today);
availableHoursFilter(dateInput.value);
blockHoursPast();