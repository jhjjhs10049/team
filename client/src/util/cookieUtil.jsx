import { Cookies } from "react-cookie";


// 로그인을 유지하거나 애플리케이션의 상태가 변경되는 상황에 대해서는 정상 동작 하지만
// "새로 고침"을 할 경우 애플리케이션의 상태역시 초기화 되는 문제가 발생한다.
// 예 : 로그인 상태 에서 "새로고침(F5)" 을 하게 되면 자동으로 로그아웃이 되는 문제가 생긴다.
// 이문제를 해결하기 위해서 애플리케이션의 상태 데이터를 보관하고 
// 애플리케이션이 로딩될 때 저장된 정보들을 로딩 해서 사용해야 한다.
// 그래서 쿠키를 사용합니다.  
const cookies = new Cookies()

export const setCookie = (name, value, days) => {
    const expires = new Date()
    //expires.getUTCDate() : expires 가 가리키는 날짜의 UTC 기준 일(day) 값을 반환(현재 시간이 아닌 일(day) 을 반환한다.)
    // 예를 들어 expires가 2025년 7월 11일 15시 UTC 라면 11(day)을 반환한다.
    // 일(day) 만 처리 하므로 년,월 을 따로 처리해서 가져와야 한다.
    // UTC ? 세계 표준 시각입니다.
    // UTC 왜 쓰나? 시간대 차이 없이 항상 전 세계에서 동일한 시간으로 다루고 싶어서
    // 예를 들면, 서버, 로그, 쿠키 만요 시간, API 요청 시간 등 시간대 혼동을 막기 위해 많이 쓴다.
    expires.setUTCDate(expires.getUTCDate() + days) // 보관 기한

    return cookies.set(name, value, {path:'/', expires : expires})
}

export const getCookie = (name) => {
    return cookies.get(name)
}

export const removeCookie = (name, path="/") => {
    cookies.remove(name, {path})
}