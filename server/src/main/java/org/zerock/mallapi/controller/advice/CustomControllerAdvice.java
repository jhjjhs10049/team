package org.zerock.mallapi.controller.advice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
// 모든 Controller에서 발생하는 예외를 전역적으로 처리하고, 응답을 JSON 형식으로 반환 (REST API에 적합)
public class CustomControllerAdvice {
    @ExceptionHandler(NoSuchElementException.class)
    // 서비스나 컨트롤러에서 NoSuchElementException이 발생하면 이 메서드가 실행됨
    protected ResponseEntity<?> notExist(NoSuchElementException e) {
        
        String msg = e.getMessage();

        // 예외 메시지가 비어있거나 null인 경우, 기본 메시지를 설정
        if (msg == null || msg.isEmpty()) {
            msg = "해당 리소스가 존재하지 않습니다.";
        }
        // NoSuchElementException이 발생했을 때, HTTP 상태 코드 404(Not Found)와 함께 메시지를 반환
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", msg));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    // 메서드 인자 검증에 실패했을 때 발생하는 예외를 처리
    protected ResponseEntity<?> handleIllegalArgumentException(MethodArgumentNotValidException e) {

        String msg = e.getMessage();

        // 예외 메시지가 비어있거나 null인 경우, 기본 메시지를 설정
        if (msg == null || msg.isEmpty()) {
            msg = "유효하지 않은 인자입니다.";
        }
        // MethodArgumentNotValidException이 발생했을 때, HTTP 상태 코드 406(NOT_ACCEPTABLE)와 함께 메시지를 반환
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(Map.of("msg", msg));
    }
}
