package com.sky.Nykaa.feature_user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

// Represents the data required for a user to log in.
@Data
public class LoginRequest {
    @NotEmpty @Email
    private String email;
    @NotEmpty
    private String password;
}