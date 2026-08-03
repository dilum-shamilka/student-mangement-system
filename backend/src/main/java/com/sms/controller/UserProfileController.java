package com.sms.controller;

import com.sms.dto.user.UserProfileResponse;
import com.sms.dto.user.UserProfileUpdateRequest;
import com.sms.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile() {

        return ResponseEntity.ok(
                userProfileService.getCurrentUserProfile()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateCurrentUserProfile(
            @Valid @RequestBody UserProfileUpdateRequest request
    ) {

        return ResponseEntity.ok(
                userProfileService.updateCurrentUserProfile(request)
        );
    }
}