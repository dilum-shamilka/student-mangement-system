package com.sms.service;

import com.sms.dto.user.UserProfileResponse;
import com.sms.dto.user.UserProfileUpdateRequest;
import com.sms.entity.User;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserProfileResponse getCurrentUserProfile() {

        return mapToResponse(
                getCurrentUser()
        );
    }


    public UserProfileResponse updateCurrentUserProfile(
            UserProfileUpdateRequest request
    ) {

        User user = getCurrentUser();


        if (StringUtils.hasText(request.getFirstName())) {

            user.setFirstName(
                    request.getFirstName()
            );
        }


        if (StringUtils.hasText(request.getLastName())) {

            user.setLastName(
                    request.getLastName()
            );
        }


        if (StringUtils.hasText(request.getEmail())
                &&
                !request.getEmail()
                        .equalsIgnoreCase(user.getEmail())) {


            if (userRepository.findByEmail(request.getEmail())
                    .isPresent()) {

                throw new BadRequestException(
                        "Email already exists"
                );
            }


            user.setEmail(
                    request.getEmail()
            );
        }


        if (request.getPhone() != null) {

            user.setPhone(
                    StringUtils.hasText(request.getPhone())
                            ? request.getPhone()
                            : null
            );
        }


        if (request.getDateOfBirth() != null) {

            user.setDateOfBirth(
                    request.getDateOfBirth()
            );
        }


        if (StringUtils.hasText(request.getPassword())) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );
        }


        return mapToResponse(
                userRepository.save(user)
        );
    }


    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new BadRequestException(
                    "User is not authenticated."
            );
        }


        String email = authentication.getName();


        return userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );
    }


    private UserProfileResponse mapToResponse(User user) {

        return UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }
}