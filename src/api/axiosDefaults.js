import axios from "axios";

axios.defaults.baseURL = "https://moments-api-clone-1a930203bd9f.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
