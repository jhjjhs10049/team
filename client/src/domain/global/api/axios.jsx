import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080";

const api = axios.create({
  baseURL: API_SERVER_HOST, // 백엔드 주소
  withCredentials: true,
});

export default api;
