import axios from "axios";

const PublicAPi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export default PublicAPi