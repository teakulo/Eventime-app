package com.example.backend.models.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationResponse {
    private String token;
    private String refreshToken;
}
