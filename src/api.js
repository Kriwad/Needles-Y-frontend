import axios from 'axios';
import { ACCESS_TOKEN } from './constants'

const api = axios.create({
  baseURL : import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
  (config)=> {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token){
      config.headers.Authorization = `Bearer ${token} `
    }
    return config 
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.request);
    } else {
      console.error("Unexpected Error:", error.message);
    }
    return Promise.reject(error);
  }
);
export default api