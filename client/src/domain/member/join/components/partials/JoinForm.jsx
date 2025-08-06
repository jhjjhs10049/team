import { useState } from "react";
import { joinPost } from "../../../api/memberApi";
import useCustomLogin from "../../../login/hooks/useCustomLogin";
import ResultModal from "../../../../../common/components/ResultModal";
import EmailSection from "./EmailSection";
import PasswordSection from "./PasswordSection";
import NicknameSection from "./NicknameSection";
import AddressSection from "./AddressSection";

const initState = {
  email: "",
  pw: "",
  pwConfirm: "",
  nickname: "",
  phone: "",
  postalCode: "",
  roadAddress: "",
  detailAddress: "",
};

const JoinForm = () => {
  const [joinParam, setJoinParam] = useState({ ...initState });
  const [result, setResult] = useState(null);
  const [emailCheck, setEmailCheck] = useState({
    checked: false,
    available: false,
    message: "",
  });
  const [nicknameCheck, setNicknameCheck] = useState({
    checked: false,
    available: false,
    message: "",
  });

  const { moveToPath } = useCustomLogin();

  const handleChange = (e) => {
    joinParam[e.target.name] = e.target.value;
    setJoinParam({ ...joinParam });

    // 이메일이 변경되면 중복확인 상태 리셋
    if (e.target.name === "email") {
      setEmailCheck({
        checked: false,
        available: false,
        message: "",
      });
    }

    // 닉네임이 변경되면 중복확인 상태 리셋
    if (e.target.name === "nickname") {
      setNicknameCheck({
        checked: false,
        available: false,
        message: "",
      });
    }
  };

  const handleClickJoin = async () => {
    try {
      // 입력 값 검증
      if (
        !joinParam.email ||
        !joinParam.pw ||
        !joinParam.pwConfirm ||
        !joinParam.nickname
      ) {
        alert("모든 필수 필드를 입력해주세요.");
        return;
      }

      if (joinParam.pw.length < 6) {
        alert("비밀번호는 6자리 이상 입력해주세요.");
        return;
      }
      if (joinParam.pw !== joinParam.pwConfirm) {
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
      }

      // 이메일 중복확인 체크
      if (!emailCheck.checked) {
        alert("이메일 중복확인을 해주세요.");
        return;
      }

      if (!emailCheck.available) {
        alert("사용할 수 없는 이메일입니다. 다른 이메일을 선택해주세요.");
        return;
      }

      // 닉네임 중복확인 체크
      if (!nicknameCheck.checked) {
        alert("닉네임 중복확인을 해주세요.");
        return;
      }

      if (!nicknameCheck.available) {
        alert("사용할 수 없는 닉네임입니다. 다른 닉네임을 선택해주세요.");
        return;
      }

      // 서버에 전송할 데이터에서 pwConfirm 제외
      const { pwConfirm: _pwConfirm, ...submitData } = joinParam;
      const response = await joinPost(submitData);
      console.log("Join success:", response);
      setResult("회원가입이 완료되었습니다!");
    } catch (error) {
      console.error("Join error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);

      if (error.response?.data?.message) {
        alert(`회원가입 오류: ${error.response.data.message}`);
      } else if (error.response?.status === 400) {
        alert("입력 데이터에 오류가 있습니다. 다시 확인해주세요.");
      } else if (error.response?.status === 500) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert(`회원가입 중 오류가 발생했습니다: ${error.message}`);
      }
    }
  };

  const closeModal = () => {
    setResult(null);
    setJoinParam({ ...initState }); // 폼 초기화
    setEmailCheck({
      checked: false,
      available: false,
      message: "",
    });
    setNicknameCheck({
      checked: false,
      available: false,
      message: "",
    });
    moveToPath("/member/login"); // 로그인 페이지로 이동
  };

  return (
    <div className="border-2 border-sky-200 mt-4 mb-8 mx-2 p-4 rounded-lg shadow-lg bg-white">
      {result ? (
        <ResultModal
          title={"회원가입 결과"}
          content={result}
          callbackFn={closeModal}
        />
      ) : null}
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          Join Component
        </div>
      </div>
      {/* 이메일 섹션 */}
      <EmailSection
        email={joinParam.email}
        emailCheck={emailCheck}
        setEmailCheck={setEmailCheck}
        onChange={handleChange}
      />
      {/* 비밀번호 섹션 */}
      <PasswordSection
        pw={joinParam.pw}
        pwConfirm={joinParam.pwConfirm}
        onChange={handleChange}
      />
      {/* 닉네임 섹션 */}
      <NicknameSection
        nickname={joinParam.nickname}
        nicknameCheck={nicknameCheck}
        setNicknameCheck={setNicknameCheck}
        onChange={handleChange}
      />
      {/* 전화번호 섹션 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Phone (선택)</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="phone"
            type="tel"
            placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
            value={joinParam.phone}
            onChange={handleChange}
          />
        </div>
      </div>{" "}
      {/* 주소 섹션 */}
      <AddressSection
        postalCode={joinParam.postalCode}
        roadAddress={joinParam.roadAddress}
        detailAddress={joinParam.detailAddress}
        setJoinParam={setJoinParam}
        joinParam={joinParam}
        onChange={handleChange}
      />
      {/* 가입 버튼 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className="rounded p-4 w-36 bg-green-500 text-xl text-white hover:bg-green-600 transition-colors"
              onClick={handleClickJoin}
            >
              Join
            </button>
          </div>
        </div>
      </div>
      {/* 로그인 링크 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="flex justify-center">
            이미 계정이 있으신가요?
            <button
              className="text-blue-500 hover:text-blue-700 underline"
              onClick={() => moveToPath("/member/login")}
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinForm;
