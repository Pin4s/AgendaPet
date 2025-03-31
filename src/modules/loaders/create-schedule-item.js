import { dateInputMain } from "../utils/DOM-Content/schedules-on-main-page-content";
import { removeSchedule } from "../../services/remove-schedule";
import { renderSchedules } from "./render-schedules";

export function createScheduleItem(schedule) {
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