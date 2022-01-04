import axios from "axios"
import {apiRequest} from "./request";
import {handleError, handleResponse} from "./apiUtils"
const baseUrl = process.env.REACT_APP_API_URL;


export async function getRecords(model) {

     return axios.post(baseUrl + apiRequest.listRecords, model)
    .then(handleResponse)
    .catch(handleError);
}
export function DeleteRecord(id) {

    return axios.get(baseUrl + apiRequest.deleteRecord + "?id=" + id)
    .then(handleResponse)
    .catch(handleError);
}

export function clearDatabase()
{
    return axios.get(baseUrl + apiRequest.clearDatabase)
    .then(handleResponse)
    .catch(handleError)
}