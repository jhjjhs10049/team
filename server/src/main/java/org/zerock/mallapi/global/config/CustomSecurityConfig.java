package org.zerock.mallapi.global.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.zerock.mallapi.global.security.filter.JWTCheckFilter;
import org.zerock.mallapi.global.security.handler.APILoginFailHandler;
import org.zerock.mallapi.global.security.handler.APILoginSuccessHandler;
import org.zerock.mallapi.global.security.handler.CustomAccessDeniedHandler;
import org.zerock.mallapi.global.security.CustomAuthenticationProvider;

import java.util.Arrays;

@Configuration
@Log4j2
@EnableMethodSecurity// 메서드 보안 활성화(@PreAuthorize, @PostAuthorize 등이 사용가능 해진다)
public class CustomSecurityConfig {

    @Autowired
    private ApplicationContext applicationContext;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("--------------security config---------------------------");

        http.cors(httpSecurityCorsConfigurer -> {
            // @Bean 으로 만든 corsConfigurationSource 추가
            httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
        });
          //세션 사용하지 않음
        http.sessionManagement(sessionConfig ->
                sessionConfig.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        //csrf 토큰 사용하지 않음
        http.csrf(config -> config.disable());

        // HTTP 요청 권한 설정
        http.authorizeHttpRequests(auth -> {
            auth.requestMatchers("/api/member/login").permitAll() // 로그인 요청 허용
                .requestMatchers("/api/member/join").permitAll() // 회원가입 허용
                .requestMatchers("/api/member/check-**").permitAll() // 중복체크 허용
                .requestMatchers("/api/member/kakao").permitAll() // 카카오 로그인 허용
                .anyRequest().authenticated(); // 나머지는 인증 필요
        });

        // Custom AuthenticationProvider 등록
        http.authenticationProvider(applicationContext.getBean(CustomAuthenticationProvider.class));        http.formLogin(config -> {
            config.loginProcessingUrl("/api/member/login"); // 로그인 처리 URL
            config.usernameParameter("username"); // username 파라미터 이름
            config.passwordParameter("password"); // password 파라미터 이름
            config.permitAll(); // 로그인 관련 모든 요청 허용
            //로그인 성공시 처리를 APILoginSuccessHandler 로 설정
            config.successHandler(apiLoginSuccessHandler());
            //로그인 실패시 처리를 APILoginFailHandler 로 설정
            config.failureHandler(new APILoginFailHandler());
        });

        //자기가 만든 필터(JWTCheckFilter) 를 기존필터(UsernamePasswordAuthenticationFilter)
        //앞에 추가해서 기존필터 보다 먼저 실행 되게 한다.
        //UsernamePasswordAuthenticationFilter : 로그인을 처리하는 기본 필터 입니다.
        // post/login 요청시 실행됩니다.
        http.addFilterBefore(new JWTCheckFilter(),
                UsernamePasswordAuthenticationFilter.class); //JWT 체크

        //@PreAuthorize 와 같은 접근 제한 어노테이션에서
        // 접근 제한 처리 되었을때 CustomAccessDeniedHandler 에서 처리 하도록 설정
        http.exceptionHandling(config -> {
            config.accessDeniedHandler(new CustomAccessDeniedHandler());
        });

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(
                Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(
                Arrays.asList("Authorization", "Cache-Control", "Content-Type")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }    @Bean
    public APILoginSuccessHandler apiLoginSuccessHandler() {
        return new APILoginSuccessHandler();
    }

}
