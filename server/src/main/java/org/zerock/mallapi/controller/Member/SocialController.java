package org.zerock.mallapi.controller.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.Member.MemberDTO;
import org.zerock.mallapi.dto.Member.MemberModifyDTO;
import org.zerock.mallapi.service.Member.MemberService;
import org.zerock.mallapi.util.JWTUtil;

import java.util.Map;

/*************************************************************************
 * 리액트에서 카카오 로그인 -> 카카오 서버로 부터 인가 코드 받음
 * 인가 코드를 카카오 서버로 전송 -> 카카오 서버에서 accessToken 전송 해줌
 * accessToken 을 API 서버로 전송 -> API 서버는 카카오 서버에 accessToken 전송
 * 카카오 서버는 API 서버에 email 전송
 * API 서버는 리액트에 email 전송
 ***************************************************************************/

@RestController
@Log4j2
@RequiredArgsConstructor
public class SocialController {

    private final MemberService memberService;    @GetMapping("/api/member/kakao")
    public Map<String,Object> getMemberFromKakao(String accessToken){

        log.info("카카오 로그인 요청 - accessToken: " + accessToken);

        try {
            if (accessToken == null || accessToken.trim().isEmpty()) {
                log.error("accessToken이 없습니다.");
                return Map.of("error", "ACCESS_TOKEN_REQUIRED");
            }

            // 카카오에 accessToken 을 전송하고 사용자 정보를 받아온다.
            MemberDTO memberDTO = memberService.getKakaoMember(accessToken);
            
            if (memberDTO == null) {
                log.error("카카오에서 사용자 정보를 받지 못했습니다.");
                return Map.of("error", "KAKAO_USER_INFO_ERROR");
            }

            log.info("카카오 사용자 정보 조회 성공: " + memberDTO.getEmail());

            Map<String,Object> claims = memberDTO.getClaims();

            String jwtAccessToken = JWTUtil.generateToken(claims, 10);
            String jwtRefreshToken = JWTUtil.generateToken(claims, 60*24); //1일

            claims.put("accessToken", jwtAccessToken);
            claims.put("refreshToken", jwtRefreshToken);

            log.info("JWT 토큰 생성 완료 - 사용자: " + memberDTO.getEmail());

            // 리액트의 KakaoRedirectPage 에서 "/api/member/kakao" 를 요청 하였다.
            // 그래서 KakaoRedirectPage 로 사용자 정보 전송
            return claims;
            
        } catch (Exception e) {
            log.error("카카오 로그인 처리 중 오류 발생", e);
            return Map.of("error", "KAKAO_LOGIN_ERROR", "message", e.getMessage());
        }
    }

    @PutMapping("/api/member/modify")
    public Map<String ,String > modify(@RequestBody MemberModifyDTO memberModifyDTO){

        log.info("member modify : " + memberModifyDTO);

        memberService.modifyMember(memberModifyDTO);

        return Map.of("result", "modified");
    }
}
