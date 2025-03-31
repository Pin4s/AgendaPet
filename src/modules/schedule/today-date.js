import dayjs from "dayjs";
const dateInputMain = document.querySelector('.form-date-select .input input[type="date"].date');

export function todayDate() {
    dateInputMain.value = dayjs(new Date()).format("YYYY-MM-DD");
    console.log(
        "Data da 1 pagina \nMensagem gerada por: todayDate()",
        dateInputMain.value,
        dateInputMain
    );

    return dateInputMain;
}