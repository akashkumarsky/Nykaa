package com.sky.Nykaa.feature_user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Represents the data required to register a new user.
@Data
public class RegisterRequest {
    @NotEmpty
    private String firstName;
    @NotEmpty
    private String lastName;
    @NotEmpty @Email
    private String email;
    @NotEmpty @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
}