package com.sky.Nykaa.feature_auth;

import com.sky.Nykaa.feature_auth.jwt.JwtUtil;
import com.sky.Nykaa.feature_user.User;
import com.sky.Nykaa.feature_user.UserRepository;
import com.sky.Nykaa.feature_user.UserService;
import com.sky.Nykaa.feature_user.dto.LoginRequest;
import com.sky.Nykaa.feature_user.dto.RegisterRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository; // For checking if a user exists

    @Autowired
    private UserService userService; // For loading user details

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Registers a new user in the system.
     * @param request The registration data containing name, email, and password.
     * @return The saved User entity.
     * @throws IllegalStateException if the email is already in use.
     */
    public User registerNewUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Error: Email is already in use!");
        }

        User newUser = new User();
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole("ROLE_USER"); // Assign a default role

        return userRepository.save(newUser);
    }

    /**
     * Authenticates a user and returns a JWT if successful.
     * @param request The login data containing email and password.
     * @return A JWT string.
     */
    public String login(LoginRequest request) {
        // This tells Spring Security to attempt to authenticate the user.
        // It will use our custom UserService.loadUserByUsername() and the PasswordEncoder.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // If authentication was successful, we can generate a token.
        final UserDetails userDetails = userService.loadUserByUsername(request.getEmail());
        return jwtUtil.generateToken(userDetails);
    }
}
