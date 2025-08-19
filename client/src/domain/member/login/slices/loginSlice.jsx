import { createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../../api/memberApi";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie, removeCookie, setCookie } from "../../util/cookieUtil";

// 1. 초기 상태 정의 및 쿠키 로딩
const initState = {
  email: "",
};

const loadMemberCookie = () => {
  const memberInfo = getCookie("member");
  if (memberInfo && memberInfo.nickname) {
    memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
  }
  return memberInfo;
};

// 2. 비동기 로그인 처리
export const loginPostAsync = createAsyncThunk("loginPostAsync", (param) => {
  return loginPost(param);
});

// 3. 동기 로그인/로그아웃 처리
const loginSlice = createSlice({
  name: "LoginSlice",
  initialState: loadMemberCookie() || initState,
  reducers: {
    login: (state, action) => {
      const data = action.payload;
      return { email: data.email };
    },
    logout: () => {
      removeCookie("member");
      return { ...initState };
    },
  },

  // 4. 비동기 로그인 요청결과에 따라 상태 및 쿠키 업데이트
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        const payload = action.payload;
        if (!payload.error) {
          setCookie("member", JSON.stringify(payload));
        }
        return payload;
      })
      .addCase(loginPostAsync.pending, () => {
        console.log("pending");
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        console.log("rejected");

        // 서버에서 반환된 에러 정보를 확인
        const response = action.meta?.response;

        // 정지된 회원의 경우 특별 처리
        if (response?.status === 403) {
          // 403 Forbidden 상태코드는 정지된 회원을 의미
          console.log("정지된 회원 로그인 시도 감지");
          return {
            ...initState,
            error: "MEMBER_BANNED",
            banInfo: response?.data?.banInfo,
          };
        }

        return state;
      });
  },
});
export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
