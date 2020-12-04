import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export function saveSlots(trialClass) {
  return axios.post(trialClass);
}

export default {
  saveSlots
}