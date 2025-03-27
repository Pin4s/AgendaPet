import { apiConfig } from "./api-config"

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