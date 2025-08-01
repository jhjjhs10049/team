package org.zerock.mallapi.controller.Member;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.Member.MemberDTO;
import org.zerock.mallapi.dto.Member.MemberJoinDTO;
import org.zerock.mallapi.dto.Member.MemberModifyDTO;
import org.zerock.mallapi.service.Member.MemberService;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody MemberJoinDTO memberJoinDTO) {
        try {
            log.info("Join request: " + memberJoinDTO);

            memberService.join(memberJoinDTO);
            
            return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));

        } catch (RuntimeException e) {
            log.error("Join error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Join error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("message", "회원가입 중 오류가 발생했습니다."));
        }
    }    

    // 이메일 중복확인
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        try {
            boolean exists = memberService.isEmailDuplicate(email);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            log.error("Email check error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("message", "이메일 중복 확인 중 오류가 발생했습니다."));
        }
    }

    // 닉네임 중복확인
    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        try {
            boolean exists = memberService.isNicknameDuplicate(nickname);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            log.error("Nickname check error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("message", "닉네임 중복 확인 중 오류가 발생했습니다."));
        }
    }

    // 마이페이지 - 회원 정보 조회
    @GetMapping("/mypage")
    public ResponseEntity<?> getMyPage(@RequestParam String email) {
        try {
            MemberDTO memberDTO = memberService.getMemberByEmail(email);
            return ResponseEntity.ok(memberDTO);
        } catch (Exception e) {
            log.error("MyPage get error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("message", "회원 정보 조회 중 오류가 발생했습니다."));
        }
    }

    // 마이페이지 - 회원 정보 수정
    @PutMapping("/mypage")
    public ResponseEntity<?> updateMyPage(@RequestBody MemberModifyDTO memberModifyDTO) {
        try {
            log.info("MyPage update request: " + memberModifyDTO);
            
            memberService.modifyMember(memberModifyDTO);
            
            return ResponseEntity.ok(Map.of("message", "회원 정보가 수정되었습니다."));

        } catch (RuntimeException e) {
            log.error("MyPage update error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("MyPage update error: ", e);
            return ResponseEntity.badRequest()
                .body(Map.of("message", "회원 정보 수정 중 오류가 발생했습니다."));
        }
    }
}
