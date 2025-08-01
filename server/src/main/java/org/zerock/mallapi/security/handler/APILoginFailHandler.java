package org.zerock.mallapi.security.handler;

import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;


@Log4j2
public class APILoginFailHandler implements AuthenticationFailureHandler {

    //로그인 실패시 여기서 처리
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {

        log.info("Login fail....." + exception);

        //Gson : java 객체를 JSON 으로 바꾸거나, JSON을 자바 객체로 바꿔주는 도구
        Gson gson = new Gson();

        //자바 객체를 JSON 문자열로 변환(Map -> JSON)
        String jsonStr = gson.toJson(Map.of("error", "ERROR_LOGIN"));

        response.setContentType("application/json; charset=UTF-8");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();


    }
}
