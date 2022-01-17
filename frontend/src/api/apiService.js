import axios from "axios"
import {apiRequest} from "./request";
import {handleError, handleGetRecordsError, handleResponse} from "./apiUtils"
const baseUrl = process.env.REACT_APP_API_URL;


export async function getRecords(model, cancelationToken) {

     return axios(
         {
             method: 'POST',
             url: baseUrl + apiRequest.listRecords,
             data: model,
             cancelToken: new axios.CancelToken( c => cancelationToken = c)
         })
    .then(handleResponse)
    .catch(handleGetRecordsError);
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

export function CountRecords()
{
    return axios.get(baseUrl + apiRequest.countRecord)
    .then(handleResponse)
    .catch(handleError)
}