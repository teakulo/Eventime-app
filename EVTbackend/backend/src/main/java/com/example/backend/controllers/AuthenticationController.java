package com.example.backend.controllers;

import com.example.backend.models.dtos.AuthenticationRequest;
import com.example.backend.models.dtos.AuthenticationResponse;
import com.example.backend.models.dtos.RegisterRequest;
import com.example.backend.services.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        System.out.println("AuthenticationController: Register request received for email: " + request.getEmail());
        AuthenticationResponse response = service.register(request);
        System.out.println("AuthenticationController: Register request processed for email: " + request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        System.out.println("AuthenticationController: Authenticate request received for email: " + request.getEmail());
        AuthenticationResponse response = service.authenticate(request);
        System.out.println("AuthenticationController: Authenticate request processed for email: " + request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        System.out.println("AuthenticationController: Refresh token request received.");
        service.refreshToken(request, response);
        System.out.println("AuthenticationController: Refresh token request processed.");
    }
}
