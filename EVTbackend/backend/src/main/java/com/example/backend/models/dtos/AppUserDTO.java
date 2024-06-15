package com.example.backend.models.dtos;

import com.example.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String nickname;
    private String bio;
    private Role role;
}
