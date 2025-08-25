package org.zerock.mallapi.global.security.filter;

import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.mallapi.domain.member.dto.MemberDTO;
import org.zerock.mallapi.global.util.JWTUtil;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

//OncePerRequestFilter : Spring Security 에서 HTTP 요청당 한 번만 실행되는 필터를 만들고 싶을 때 사용
// 주로 모든 요청에 대해서 체크 할때 사용
//사용 목적 : 인증, 로깅, JWT 검증등의 공통 처리
@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

    //필터 제외 조건을 정의하는 메서드 (함수 이름을 직역 하면 필터링을 하면 안되는..)
    //여기서 제외된 것들은 doFilterInternal 에서 필터링을 거치게 된다.
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        //Preflight 요청 ? CORS 에서 브라우저가 실제 요청전에 보내는 사전 점검용 HTTP OPTIONS 요청
        //브라우저가 다른 출처(도메인, 포트, 프로토콜이 다른)에 AJAX 요청을 보내기 전에
        //서버가 해당 요청을 허용하는지 확인하기 위해 보내는 OPTIONS 메서드 요청
        //아래 조건 중 하나라도 해당하면 브라우저는 Preflight 요청을 보냅니다.
        //1. 요청 메서드가 GET, POST, HEAD 가 아닌 경우 (예: PUT, DELETE, PATCH)
        //2.Content-Type 이 application/x-www-form-urlencoded, multipart/form-data, text/plain 이외인 경우 (예: application/json)
        //3.커스텀 헤더가 포함된 경우 (예: Authorization, X-Custom-Header)
        //4.요청에 credentials 포함 시 (쿠키, 인증 헤더)        //Preflight 요청은 체크하지 않음
        if(request.getMethod().equals("OPTIONS")){
            return true;
        }        String path = request.getRequestURI();
        String method = request.getMethod();
          log.info("check uri.........." + path + " (" + method + ")");
        
        // 인증이 필요 없는 member API들만 명시적으로 허용
        if(path.equals("/api/member/login") ||
           path.equals("/api/member/join") ||
           path.equals("/api/member/kakao") ||
           path.equals("/api/member/refresh") ||
           path.startsWith("/api/member/check-") ||
           path.startsWith("/api/member/verify-password") ||
           path.startsWith("/api/member/withdraw") ||
           
           // 기타 공개 API
           path.startsWith("/api/gyms/") || 
           path.startsWith("/api/files") || 
           path.equals("/login")) {
            log.info("JWT 필터 예외 처리됨: " + path);
            return true;
        }        // /api/board의 GET 요청만 체크하지 않음 (목록 조회, 상세 조회)
        if(path.startsWith("/api/board") && "GET".equals(method)) {
            // 하지만 댓글 관련은 인증이 필요하므로 체크
            if(path.contains("/replies")) {
                log.info("JWT 필터 적용됨 (댓글 조회): " + path);
                return false; // 댓글 관련은 JWT 체크 필요
            }
            log.info("JWT 필터 예외 처리됨 (게시판 조회): " + path);
            return true;
        }

        // 나머지 /api/board 요청 (POST, PUT, DELETE)는 모두 JWT 체크 필요
        log.info("JWT 필터 적용됨: " + path);
        return false;
    }    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        
        log.info("-------JWTCheckFilter----------------");
        
        String authHeaderStr = request.getHeader("Authorization");

        try{
            // Authorization 헤더가 없거나 Bearer로 시작하지 않으면 에러 처리
            if (authHeaderStr == null || !authHeaderStr.startsWith("Bearer ")) {
                throw new RuntimeException("Authorization header is missing or invalid");
            }

            //Bearer accesstoken..
            // (Bearer 토큰) 형식인데 여기서 토큰만 필요 하다.
            // Bearer + 공백문자1칸 을 빼고 가져 와야 하므로
            // 공백문자1칸의 인덱스 값이 6 이므로 (인덱스는 0부터 시작)
            // substring() 의 매개 변수값을 7로 하였다.
            String accesstoken = authHeaderStr.substring(7);            //토큰의 유효성 검사
            Map<String, Object> claims = JWTUtil.validateToken(accesstoken);

            log.info("JWT claims: " + claims);

            //JWT 토큰 내에는 인증에 필요한 모든 정보를 가지고 있다.
            //이를 활용해서 시큐리티에 필요한 객체(MemberDTO)를 구성하자.
            String email = (String) claims.get("email");
            String pw = (String) claims.get("pw");
            String nickname = (String) claims.get("nickname");
            Boolean social = (Boolean) claims.get("social");
            
            List<?> rawRoleNames = (List<?>) claims.get("roleNames");
            log.info("Raw roleNames from JWT: " + rawRoleNames);
            
            List<String> roleNames = rawRoleNames.stream()
                    .map(Object::toString)
                    .toList();
            
            log.info("Processed roleNames: " + roleNames);

            MemberDTO memberDTO = new MemberDTO(email, pw, nickname,
                    social.booleanValue(), roleNames);  //social 만써도 될거 같은데.. 나중에 테스트

            log.info("------------------------");  
            log.info(memberDTO);
            log.info(memberDTO.getAuthorities());

            //UsernamePasswordAuthenticationToken : Spring Security 에서 사용자 인증 정보를 담기위한 객체
            //인증 성공 후 사용자 정보와 권한을 포함해서 생성하고 있다.
            UsernamePasswordAuthenticationToken authenticationToken
                    = new UsernamePasswordAuthenticationToken(memberDTO, pw, memberDTO.getAuthorities());

            //인증 정보(authenticationToken)를 등록한다.
            //인증등록에 성공하면
            //@AuthenticationPrincipal, SecurityContextHolder.getContext().getAuthentication() 등으로 인증 정보에 접근할 수 있다.
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response); // 통과

        }catch (Exception e){
            log.error("JWT Check Error.........");
            log.error(e.getMessage());

            //Gson : java 객체를 JSON 으로 바꾸거나, JSON을 자바 객체로 바꿔주는 도구
            Gson gson = new Gson();
            //자바 객체를 JSON 문자열로 변환(Map -> JSON)
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

            response.setContentType("application/json; charset=UTF-8");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();        }
    }
}
