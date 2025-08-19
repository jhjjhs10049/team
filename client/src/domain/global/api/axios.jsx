import axios from "axios";
import { getCookie } from "../../member/util/cookieUtil";

export const API_SERVER_HOST = "http://localhost:8080";

const api = axios.create({
  baseURL: API_SERVER_HOST, // 백엔드 주소
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청에 JWT 토큰을 자동으로 추가
api.interceptors.request.use(
  (config) => {
    const memberInfo = getCookie("member");
    if (memberInfo && memberInfo.accessToken) {
      config.headers.Authorization = `Bearer ${memberInfo.accessToken}`;
      console.log("JWT 토큰 추가됨:", config.headers.Authorization);
    } else {
      console.warn("JWT 토큰이 없습니다. 로그인이 필요할 수 있습니다.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 만료 시 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("인증 오류: 로그인이 필요합니다.");
      // 필요시 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  }
);

export default api;
