package com.hireai.hireai.service;

import com.hireai.hireai.dto.LoginRequest;
import com.hireai.hireai.dto.LoginResponse;
import com.hireai.hireai.dto.RegisterRequest;
import com.hireai.hireai.entity.User;
import com.hireai.hireai.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequest request) {
        User existingUser = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (existingUser != null) {
            throw new RuntimeException("User already exists with this email");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );
    }
}