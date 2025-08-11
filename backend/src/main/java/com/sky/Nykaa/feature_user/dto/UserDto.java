package com.sky.Nykaa.feature_user.dto;

import lombok.Data;

// Represents the data of a user that is safe to send to the client.
// Notice it does NOT include the password.
@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
}