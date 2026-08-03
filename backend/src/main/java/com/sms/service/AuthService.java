package com.sms.service;

import com.sms.dto.auth.AuthResponse;
import com.sms.dto.auth.LoginRequest;
import com.sms.dto.auth.RegisterRequest;
import com.sms.entity.User;
import com.sms.exception.BadRequestException;
import com.sms.repository.UserRepository;
import com.sms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;


    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new BadRequestException("Email already exists");
        }


        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .build();


        userRepository.save(user);
    }


    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );


        User user = userRepository.findByEmail(request.getEmail())

                .orElseThrow(() ->
                        new BadRequestException(
                                "Invalid email or password"
                        )
                );


        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );


        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}