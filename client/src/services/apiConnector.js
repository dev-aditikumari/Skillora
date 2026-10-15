import axios from "axios";


const axiosInstance = axios.create(
    {
        withCredentials : true
    }
);

export function apiConnector(method , url , bodyData , headers, params){
    return axiosInstance({
        method , url , data: bodyData || null , headers: headers || null , params : params || null
    })
}