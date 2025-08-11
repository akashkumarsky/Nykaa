package com.sky.Nykaa.feature_user;


import com.sky.Nykaa.feature_user.dto.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // This endpoint allows a logged-in user to get their own profile information.
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // Here, userDetails is the object provided by Spring Security after authenticating the JWT.
        // We can use it to find the full user details from the database.
        // Note: This requires a method in UserService/UserRepository to find by email.
        // For now, we'll just return the email, but this would be expanded.

        UserDto userDto = new UserDto();
        // In a real app, you would use the email from userDetails.getUsername()
        // to fetch the full User object from the database and populate the DTO.
        userDto.setEmail(userDetails.getUsername());

        return ResponseEntity.ok(userDto);
    }
}