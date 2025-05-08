import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chat-application-u5dm.onrender.com/api/",
  withCredentials: true,
});