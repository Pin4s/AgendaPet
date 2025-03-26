/////////////////////////////////////////////////////////////
// ARQUIVO RESPONSÁVEL POR ENVIAR OS DADOS PARA O SERVIDOR //
/////////////////////////////////////////////////////////////


//Importando a baseURL
import { apiConfig } from "./api-config";

export async function registerSchedule(formData) {
    try {
        //BUSCA OS DADOS DENTRO DE SERVER.JSON SCHEDULES
        await fetch(`${apiConfig.baseURL}/schedules`, {
            //DEFINE QUE OS DADOS SERÃO ENVIADOS E NÃO BUSCADOS (method: "POST")
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //ENVIA OS DADOS COMO JSON, E DEFINE QUAIS DADOS SERÃO ENVIADOS (formData)
            body: JSON.stringify(formData)
        })
    } catch (error) {
        console.log("==========================Mensagem gerada pelo registerSchedule==========================")
        console.log("ERRO AO ENVIAR INFORMAÇÕES PARA O SERVER.JSON")
        console.log(error)
        console.log("==============================================================================================================================")
    }
}