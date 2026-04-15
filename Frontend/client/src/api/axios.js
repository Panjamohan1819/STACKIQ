import axios from 'axios'

const API = axios.create({
    // Bypassing .env here so we don't have to restart the Vite server 
    // and using 127.0.0.1 explicitly to dodge IPv6 blocking.
    baseURL: 'http://127.0.0.1:5134/prepapp'
})

API.interceptors.request.use((req)=>{
    const token = localStorage.getItem("token");
    if(token){
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

export  default API;