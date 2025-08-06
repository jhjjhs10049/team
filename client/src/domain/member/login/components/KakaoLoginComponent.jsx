import { Link } from "react-router-dom";
import { getKakaoLoginLink } from "../../api/kakaoApi";

const KakaoLoginComponent = () => {

    const link = getKakaoLoginLink()
    //KAKAO LOGIN 버튼 클릭 -> 카카오 로그인 페이지로 이동 -> 
    //카카오가 개발자가 등록해 놓은 redirect_uri(KakaoRedirectPage) 로 인가코드를 전송
    //KakaoRedirectPage 는 인가코드를 카카오 서버에 보내고 -> accessToken 을 받아온다.
    //API 서버에 accessToken 을 보내고 -> API 서버는 다시 카카오 에게 accessToken 을 보낸다
    //API 서버는 카카오로 부터 사용자 정보를 얻어온다. 
    return (
        <div className="flex flex-col">    
            <div className="flex justify-center w-full">
                <div className="text-3xl text-center m-6 text-white font-extrabold w-3/4 bg-yellow-500 shadow-sm rounded p-2">
                    <Link to={link}>KAKAO LOGIN</Link>
                </div>
            </div>
        </div>
    )
}

export default KakaoLoginComponent;