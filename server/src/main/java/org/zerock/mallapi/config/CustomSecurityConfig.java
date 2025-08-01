package org.zerock.mallapi.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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
import org.zerock.mallapi.security.filter.JWTCheckFilter;
import org.zerock.mallapi.security.handler.APILoginFailHandler;
import org.zerock.mallapi.security.handler.APILoginSuccessHandler;
import org.zerock.mallapi.security.handler.CustomAccessDeniedHandler;

import java.util.Arrays;

@Configuration
@Log4j2
@RequiredArgsConstructor
@EnableMethodSecurity// 메서드 보안 활성화(@PreAuthorize, @PostAuthorize 등이 사용가능 해진다)
public class CustomSecurityConfig {

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


        http.formLogin(config -> {
            config.loginPage("/api/member/login");
            //로그인 성공시 처리를 APILoginSuccessHandler 로 설정
            config.successHandler(new APILoginSuccessHandler());
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
    }

}
