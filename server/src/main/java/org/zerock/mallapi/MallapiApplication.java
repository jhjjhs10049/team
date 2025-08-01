package org.zerock.mallapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// 스프링 부트 애플리케이션을 초기화하고 실행하기 위한 설정 어노테이션
public class MallapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MallapiApplication.class, args);
		//스프링 컨테이너(ApplicationContext)가 생성되고
		// 모든 자동 설정이 적용되며
		// 내부적으로 Tomcat 서버가 실행됩니다 (포트 8080 기본)
		// 애플리케이션이 실행 가능한 웹 애플리케이션으로 뜸
	}

}
