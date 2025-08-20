import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";
import { useDispatch } from "react-redux";
import { login } from "../slices/loginSlice";
import useCustomLogin from "../hooks/useCustomLogin";
import BannedMemberModal from "../components/BannedMemberModal";

//소셜 로그인 한 경우 카카오 서버가 여기로 데이터를 보내준다.
//카카오 앱에서 설정한 Redirect URI 경로(http://localhost:5173/member/kakao)에 대한 처리 페이지 이다.
const KakaoRedirectPage = () => {
  //소셜 로그인 후 이동할 경로
  const { moveToPath } = useCustomLogin();

  // 정지된 회원 모달 상태
  const [bannedModalOpen, setBannedModalOpen] = useState(false);
  const [banInfo, setBanInfo] = useState(null);

  //쿼리 스트링을 searchParams 에 저장
  const [searchParams] = useSearchParams(); // 카카오 서버에서 보내준 데이터가 저장됨
  //읽어온 쿼리 스트링에서 code가 가르키는 값(인가코드)을 저장
  const authCode = searchParams.get("code");

  const dispatch = useDispatch();
  useEffect(() => {
    getAccessToken(authCode)
      .then((accessToken) => {
        return getMemberWithAccessToken(accessToken);
      })
      .then((memberInfo) => {
        // 정상 로그인 처리
        dispatch(login(memberInfo));
        moveToPath("/");
      })
      .catch((error) => {
        // 403 에러이고 정지된 회원인 경우 처리
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

        // 일반 에러 처리
        alert("카카오 로그인 중 오류가 발생했습니다.");
        moveToPath("/member/login");
      });
  }, [authCode, dispatch, moveToPath]);

  const handleBannedModalClose = () => {
    setBannedModalOpen(false);
    moveToPath("/member/login");
  };

  return (
    <div>
      <div>Kakao Login Redirect</div>
      <div>{authCode}</div> {/* 카카오에서 전송해준 '인가코드'  */}
      {/* 정지된 회원 모달 */}
      <BannedMemberModal
        isOpen={bannedModalOpen}
        onClose={handleBannedModalClose}
        banInfo={banInfo}
      />
    </div>
  );
};

export default KakaoRedirectPage;
