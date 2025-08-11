package com.sky.Nykaa.feature_auth;

import com.sky.Nykaa.feature_user.User;
import com.sky.Nykaa.feature_user.UserService;
import com.sky.Nykaa.feature_user.dto.LoginRequest;
import com.sky.Nykaa.feature_user.dto.RegisterRequest;
import com.sky.Nykaa.feature_user.dto.UserDto;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService; // To get full user details after login

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User registeredUser = authService.registerNewUser(registerRequest);
        return new ResponseEntity<>(mapUserToDto(registeredUser), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest);
        // After a successful login, fetch the user's details to return them.
        User user = userService.findUserByEmail(loginRequest.getEmail());
        LoginResponse response = new LoginResponse(token, mapUserToDto(user));
        return ResponseEntity.ok(response);
    }

    // Helper to map the User entity to a safe DTO
    private UserDto mapUserToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole());
        return userDto;
    }

    // A private inner class for the login response structure
    @Data
    private static class LoginResponse {
        private final String jwtToken;
        private final UserDto user;
    }
}