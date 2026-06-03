package com.hireai.hireai.controller;

import com.hireai.hireai.dto.LoginRequest;
import com.hireai.hireai.dto.LoginResponse;
import com.hireai.hireai.dto.RegisterRequest;
import com.hireai.hireai.entity.User;
import com.hireai.hireai.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}