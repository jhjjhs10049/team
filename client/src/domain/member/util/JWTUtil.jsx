import axios from "axios";
import { getCookie, setCookie } from "./cookieUtil";
import { API_SERVER_HOST } from "../../global/api/axios.jsx";

/*****************************************************************************************************
 * 최초 로그인시 -> 액세트 토큰 과 리프레쉬 토큰을 을 서버로 부터 전송 받아서 쿠키에 저장
 * 액세스 토큰이 만료 된 경우 -> 클라이언트가 리프레쉬 토큰을 서버에 보내서 새로운 액세스 토큰을 요청하고 전송받는다.
 * 리프레쉬 토큰도 만료된 경우 -> 로그인 페이지로 리다이렉트 한다.
 *****************************************************************************************************/

/***************************************************************************************************************
 * API 호출에서 JWT 토큰을 처리하는 유틸리티
 * jwtAxios는 axios에 토큰 처리 기능이 추가된 인스턴스입니다.
 * 코드의 흐름을 살펴보자.
 * API 함수가 호출되었을 때 jwtAxios.get을 바로 실행하는게 아니라 인터셉터가 먼저 실행된다.
 * jwtAxios.interceptors.request.use( beforeReq, requestFail) 가 먼저 실행 되는 것이다.
 * 매개변수인 beforeReq , requestFail 함수가 호출된다.
 * 그런데 requestFail 는 오류가 발생 했을때만 호출된다.
 * 정상일때 config를 리턴 해준다.
 * 그런데 매개변수 뿐만 아니라 리턴으로도 사용되고 있는 config 는 어떤 객체일까?
 * config ?
 * config는 Axios 요청을 설정할 때 사용하는 옵션들을 담고 있는 객체로, 아래와 같은 주요 속성을 포함합니다
 * url, method (예: get, post)
 * baseURL, headers, params, data
 * timeout, withCredentials, responseType 등 다양한 설정이 가능합니다.
 * 정상처리가 되었다면
 * 수정된 config 객체를 반환하고
 * jwtAxios.interceptors.response.use(beforeRes, responseFail)  를 수행합니다.
 * 이후에 원래 수행 하려고 했던 getOne 혹은 getList가 수행 됩니다.
 ****************************************************************************************************************/

const jwtAxios = axios.create();

const refreshJWT = async (accessToken, refreshToken) => {
  // Access Token이 만료된 경우 Refresh Token을 활용해서 새로운 토큰 요청
  const host = API_SERVER_HOST;
  const header = { headers: { Authorization: `Bearer ${accessToken}` } };

  const res = await axios.get(
    `${host}/api/member/refresh?refreshToken=${refreshToken}`,
    header
  );

  return res.data;
};

//before request
const beforeReq = (config) => {
  console.log("=== JWT 인터셉터: 요청 전 처리 ===");
  console.log("요청 URL:", config.url);
  console.log("요청 메소드:", config.method);

  const memberInfo = getCookie("member");

  if (!memberInfo) {
    console.error("JWT 인터셉터: 쿠키에 member 정보가 없음");
    return Promise.reject({
      response: { data: { error: "REQUIRE_LOGIN" } },
    });
  }

  console.log("JWT 인터셉터: 쿠키에서 토큰 정보 확인됨");
  const { accessToken } = memberInfo;
  config.headers.Authorization = `Bearer ${accessToken}`;
  console.log("JWT 인터셉터: Authorization 헤더 설정 완료");

  return config;
};

//fail request
const requestFail = (err) => {
  return Promise.reject(err);
};

//before return response
const beforeRes = async (res) => {
  const data = res.data;
  if (data && data.error === "ERROR_ACCESS_TOKEN") {
    const memberCookieValue = getCookie("member");

    // accessToken와 refreshToken을 서버로 전송해서 새로운 토큰을 받아온다.
    const result = await refreshJWT(
      memberCookieValue.accessToken,
      memberCookieValue.refreshToken
    );

    memberCookieValue.accessToken = result.accessToken;
    memberCookieValue.refreshToken = result.refreshToken;

    setCookie("member", JSON.stringify(memberCookieValue), 1);

    // 원래의 호출을 새로운 토큰으로 재시도
    const originalResult = res.config;
    originalResult.headers.Authorization = `Bearer ${result.accessToken}`;

    return await axios(originalResult);
  }

  return res;
};

//fail response
const responseFail = (err) => {
  return Promise.reject(err);
};

//인터셉터를 사용해서 JWT 관련 요청과 응답을 처리
jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
