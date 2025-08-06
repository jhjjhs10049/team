import { useState } from "react";
import { useDispatch } from "react-redux";
//import {login} from "../../slices/loginSlice"
import { loginPostAsync } from "../slices/loginSlice";
import useCustomLogin from "../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";

const initState = {
  email: "",
  pw: "",
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const { moveToPath } = useCustomLogin();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    loginParam[e.target.name] = e.target.value;

    setLoginParam({ ...loginParam });
  };

  const handleClickLogin = () => {
    //dispatch ? 리듀서를 통해서 만들어진 새로운 애플리케이션 상태를 반영 하기 위해서 사용.
    //예로 로그인 페이지 에서 로그인이 처리 되면 useDispatch()를 이용해서 새로운 애플리케이션 상태를 배포(dispatch) 하는 경우에 사용
    //dispatch(login(loginParam)) // loginParam 이라는 상태값을 loginSlice의 reducer에 정의된 login 액션 함수에 전달(동기화된 호출)
    //dispatch( loginPostAsync(loginParam)) // loginParam 이라는 상태값을 loginPostAsync 함수에 매개변수로 전달(loginParam 에는 id/pw가 들어갈수 있다.)//비동기 호출

    dispatch(loginPostAsync(loginParam)) // 비동기 호출 이후에 처리된 결과를 ListComponent 에서 받아 보려면 unwrap()을 사용하면 된다.
      .unwrap() // error 값이 전달 되는 것을 확인해야 하는 경우나 로그인 결과를 받아야 하는 경우에 유용합니다.(action 객체를 검사할 필요 없이 payload나 에러를 직접 다룰 수 있어, 조건문 없이 바로 흐름을 잡기 좋습니다 .)
      .then((data) => {
        console.log("after unwrap...");
        console.log(data); // 로그인 성공후 나온 로그값 : email, social, nickname, pw, accessToken, refreshToken, roleNames
        if (data.error) {
          // 로그인 실패시
          alert("이메일과 패스워드를 다시 확인 하세요"); // 로그인 실패 시 경고창을 띄운 뒤, navigate나 moveToPath 호출 없이, 현재 페이지에서 상태만 유지한다.
        } else {
          alert("로그인 성공");
          //navigate({pathname : `/`}, {replace : true}) // 로그인 성공후 '/' 경로로 이동하고, 뒤로가기 했을때 로그인 화면을 볼수 없게한다.
          moveToPath("/");
        }
      });
  };
  return (
    <div className="border-2 border-sky-200 mt-4 mb-8 mx-2 p-4 rounded-lg shadow-lg bg-white">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          Login Component
        </div>
      </div>{" "}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Email</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={loginParam.email}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Password</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pw"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={loginParam.pw}
            onChange={handleChange}
          />
        </div>
      </div>{" "}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className="rounded p-4 w-36 bg-blue-500 text-xl text-white hover:bg-blue-600 transition-colors"
              onClick={handleClickLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="flex justify-center">
            계정이 없으신가요?
            <button
              className="text-blue-500 hover:text-blue-700 underline"
              onClick={() => moveToPath("/member/join")}
            >
              회원가입 하기
            </button>
          </div>
        </div>
      </div>
      <KakaoLoginComponent />
    </div>
  );
};

export default LoginComponent;
