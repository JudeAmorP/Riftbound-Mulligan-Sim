import axios from "axios";

export const http = axios.create({
    baseURL: "https://api.riftcodex.com",
    timeout: 8000
})