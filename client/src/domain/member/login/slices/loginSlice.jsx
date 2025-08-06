import { createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../../api/memberApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie, removeCookie, setCookie } from "../../util/cookieUtil";

// 로그인 상태를 저장할 기본 객체
const initState = {
  email: "",
};

const loadMemberCookie = () => {
  // 쿠키에서 member 정보를 가져와서 객체로 변환
  const memberInfo = getCookie("member");
  // 닉네임이 URI 인코딩되어있을수 있음으로 디코드하여 원래값으로 바꿈
  if (memberInfo && memberInfo.nickname) {
    memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
  }
  return memberInfo;
};
// 비동기 로그인 요청을 처리하기 위한 createAsyncThunk
// param을 입력받아 pending(로딩중), fulfilled(성공), rejected(실패) 상태를 관리
export const loginPostAsync = createAsyncThunk("loginPostAsync", (param) => {
  return loginPost(param);
});
// 로그인 할때는 서버랑 통신을 하므로 비동기 방식을 사용하고 로그아웃 할때는 (reducers)동기 방식을 사용한다.
// 그래서 로그인 할때는 reducers 에 있는 login 을 사용하지 않고 비동기 방식(loginPostAsync)을 사용한다.

// 소셜 로그인시에는 카카오등 소셜에서 이미 인증 완료된 상태이므로 즉시 처리 가능하기에 동기방식 사용
// 카카오 인증 → 리다이렉트 → accessToken 받음 → login 호출 → 바로 상태 저장

const loginSlice = createSlice({
  // 이름 지정
  name: "LoginSlice",
  // 쿠키가 있으면 쿠키저장 없으면 initState 8번째줄 email: '' 초기값 등록
  initialState: loadMemberCookie() || initState,

  reducers: {
    // reducers? initState 에 저장된 값을 다루는 함수들(리듀서 안에 함수는 동기 함수이며, 비동기 함수는 리듀서 밖에서 처리해야한다.)
    // state 는 기본값이 {email : ''} 인 객체 state 는 LoginSlice 의 현재상태 객체입니다. initialState 로 지정했던 값들입니다.
    // action 유저가 소셜 로그인을 하면 action 에 값들이 저장되어 날아 옵니다. (이메일, 토큰등)
    login: (state, action) => {
      //action의 payload 라는 속성을 이용해서 LoginComponent 가 전달 하는 데이터를 받음
      const data = action.payload;
      // email 속성에 action.payload.email 값을 저장
      return { email: data.email };
    },
    logout: () => {
      // 로그아웃 액션이 호출되면 쿠키에서 member 정보를 제거
      removeCookie("member");
      // 로그아웃 시 쿠키를 제거하고 초기 상태로 되돌림
      return { ...initState };
    },
  },
  // 비동기 통신의 상태에 따라 동작하는 함수들을 작성한다.  (builder 는 스프링에서 사용하던 것과 같은 개념이리고 생각하자)
  // 일반로그인시엔 서버검증이 필요함으로 비동기 처리
  // 사용자 입력 → loginPostAsync 호출 → 서버 API 호출 → 대기 → 응답 처리
  extraReducers: (builder) => {
    // state 는 기본값이 {email : ''} 인 객체 state 는 LoginSlice 의 현재상태 객체입니다. initialState 로 지정했던 값들입니다.
    // action 유저가 id/pw 로 로그인을 하면 action 에 id/pw 가 저장되어 날아 옵니다.
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        // action의 payload 라는 속성을 이용해서 LoginComponent 가 전달 하는 데이터를 받음
        const payload = action.payload;
        // 에러가 없다면 쿠키에 member 정보를 저장
        // 쿠키에 저장할 때는 JSON 문자열로 변환하여 저장하고 만료일을 1일로지정
        if (!payload.error) {
          setCookie("member", JSON.stringify(payload), 1);
        }
        return payload;
      })
      // 로딩중
      .addCase(loginPostAsync.pending, () => {
        console.log("pending");
      })
      // 실패
      .addCase(loginPostAsync.rejected, () => {
        console.log("rejected");
      });
  },
});
// action 생성 함수들을 export 한다. (컴포넌트에서 사용하기 위해)
export const { login, logout } = loginSlice.actions;
// 리듀서를 export 한다. (store 에서 사용하기 위해)
export default loginSlice.reducer;
