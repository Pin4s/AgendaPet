
import { apiConfig } from "./api-config";

export async function registerSchedule(formData) {
    try {
        await fetch(`${apiConfig.baseURL}/schedules`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(formData)
        })
    } catch (error) {
        console.log("Não foi possível enviar os dados",error)
    }
}