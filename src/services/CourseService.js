import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export function getCourses() {
  return axios.get();
}

export default {
    getCourses
}