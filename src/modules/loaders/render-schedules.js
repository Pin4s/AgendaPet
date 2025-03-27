import { periodMorningList, periodAfternoonList, periodNightList } from "../utils/DOM-Constent/schedules-on-main-page-consts";
import { createScheduleItem } from "./create-schedule-item";
import { dateInputMain } from "../utils/DOM-Constent/schedules-on-main-page-consts";
import { apiConfig } from "../../services/api-config";

window.addEventListener("DOMContentLoaded", async () => {
    await renderSchedules(dateInputMain.value);


})

export async function renderSchedules(date) {

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