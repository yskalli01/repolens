package com.githubanalyzer.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/register", "/api/auth/login", "/api/health").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/repositories/*/*/languages").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/repositories/*/*/contributors").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/repositories/*/*/branches").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/repositories/*/*/readme").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/repositories/*/*/technologies").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/repositories/*/*/score").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/repositories/*/*/quality-signals").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/repositories/reports/shared/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/repositories/reports/shared/*/report.pdf").permitAll()
                        .requestMatchers("/api/repositories/analyze", "/api/repositories/analyze/full").authenticated()
                        .requestMatchers("/api/repositories/history/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}