import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginPostAsync } from "../slices/loginSlice";
import useCustomLogin from "../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";
import BannedMemberModal from "./BannedMemberModal";

const initState = {
  email: "",
  pw: "",
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });
  const [bannedModalOpen, setBannedModalOpen] = useState(false);
  const [banInfo, setBanInfo] = useState(null);
  const { moveToPath } = useCustomLogin();

  // Redux 상태에서 ban 정보 가져오기
  const loginState = useSelector((state) => state.loginSlice);
  const reduxBanInfo = loginState.banInfo;

  const dispatch = useDispatch();

  const handleChange = (e) => {
    loginParam[e.target.name] = e.target.value;
    setLoginParam({ ...loginParam });
  };

  const handleClickLogin = () => {
    dispatch(loginPostAsync(loginParam))
      .unwrap()
      .then((data) => {
        if (data.error) {
          alert("이메일과 패스워드를 다시 확인 하세요");
        } else {
          alert("로그인 성공");
          moveToPath("/");
        }
      })
      .catch((error) => {
        // BannedMemberError인 경우 처리
        if (
          error.name === "BannedMemberError" ||
          error.message === "MEMBER_BANNED"
        ) {
          // Redux에서 가져온 banInfo 우선 사용, 없으면 error에서 가져오기
          const banInfoData = reduxBanInfo ||
            error.banInfo || {
              reason: "규정 위반",
              bannedAt: new Date().toISOString(),
              bannedUntil: null,
            };

          setBanInfo(banInfoData);
          setBannedModalOpen(true);
          return;
        }

        // AxiosError에서 직접 서버 응답 데이터 확인 (fallback)
        if (error.response && error.response.status === 403) {
          const responseData = error.response.data;

          if (responseData.error === "MEMBER_BANNED") {
            const banInfoData = responseData.banInfo || {
              reason: "규정 위반",
              bannedAt: new Date().toISOString(),
              bannedUntil: null,
            };

            setBanInfo(banInfoData);
            setBannedModalOpen(true);
            return;
          }
        }

        // 일반적인 로그인 실패
        alert("이메일과 패스워드를 다시 확인하세요");
      });
  };

  return (
    <div className="border-2 border-sky-200 mt-4 mb-8 mx-2 p-4 rounded-lg shadow-lg bg-white">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          Login Component
        </div>
      </div>
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
      </div>
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
        </div>{" "}
      </div>
      <KakaoLoginComponent />
      {/* 정지된 회원 모달 */}
      <BannedMemberModal
        isOpen={bannedModalOpen}
        onClose={() => setBannedModalOpen(false)}
        banInfo={banInfo}
      />
    </div>
  );
};

export default LoginComponent;
