package com.example.backend.models.dtos;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String password;
}
