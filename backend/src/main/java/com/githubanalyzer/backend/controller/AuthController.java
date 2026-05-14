package com.githubanalyzer.backend.controller;

import com.githubanalyzer.backend.dto.AuthResponse;
import com.githubanalyzer.backend.dto.LoginRequest;
import com.githubanalyzer.backend.dto.RegisterRequest;
import com.githubanalyzer.backend.dto.UserResponse;
import com.githubanalyzer.backend.entity.User;
import com.githubanalyzer.backend.service.AuthService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );
    }
}