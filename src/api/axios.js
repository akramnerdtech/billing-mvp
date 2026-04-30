import axios from "axios";

const API = axios.create({
    baseURL: "https://billing-mvp-1.onrender.com/api"
});
export default API