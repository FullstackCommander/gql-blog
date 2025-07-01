import axios from "axios";

const uploadApi = axios.create({
  baseURL: import.meta.env.VITE_UPLOAD_URL,

});

export default uploadApi;