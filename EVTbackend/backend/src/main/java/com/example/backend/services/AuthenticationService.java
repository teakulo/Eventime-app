package com.example.backend.services;

import com.example.backend.models.dtos.AuthenticationRequest;
import com.example.backend.models.dtos.AuthenticationResponse;
import com.example.backend.models.dtos.RegisterRequest;
import com.example.backend.models.entities.AppUser;
import com.example.backend.repositories.AppUserRepository;

import com.example.backend.enums.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationResponse register(RegisterRequest request) {
        log.debug("Registering user with email: {}", request.getEmail());
        Role role = (request.getRole() != null) ? request.getRole() : Role.USER;
        AppUser user = AppUser.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .nickname(request.getNickname())
                .role(role)
                .build();
        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        log.debug("Generated JWT token and refresh token for user: {}", request.getEmail());
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.debug("Authenticating user with email: {}", request.getEmail());
        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("Invalid credentials for user: {}", request.getEmail());
            throw new RuntimeException("Invalid credentials");
        }
        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        log.debug("Authentication successful for user: {}", request.getEmail());
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        log.debug("Refreshing token");
        String refreshToken = request.getHeader("Authorization").substring(7);
        String username = jwtService.extractUsername(refreshToken);

        if (username != null) {
            AppUser user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (jwtService.validateToken(refreshToken, user)) {
                String newToken = jwtService.generateToken(user);
                Map<String, String> tokens = new HashMap<>();
                tokens.put("token", newToken);
                tokens.put("refreshToken", refreshToken);
                response.setContentType("application/json");
                new ObjectMapper().writeValue(response.getOutputStream(), tokens);
                log.debug("Refresh token validated and new JWT token issued for user: {}", username);
            } else {
                log.error("Invalid refresh token for user: {}", username);
                throw new RuntimeException("Invalid refresh token");
            }
        } else {
            log.error("Refresh token does not contain a valid username.");
            throw new RuntimeException("Invalid refresh token");
        }
    }
}
