package com.sms.controller;

import com.sms.dto.enrollment.EnrollmentRequest;
import com.sms.dto.enrollment.EnrollmentResponse;
import com.sms.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<EnrollmentResponse> enroll(
            @Valid @RequestBody EnrollmentRequest request
    ) {

        return ResponseEntity.ok(
                enrollmentService.enrollCurrentStudent(request.getCourseId())
        );
    }

    @GetMapping("/me")
    public ResponseEntity<List<EnrollmentResponse>> getMyEnrollments() {

        return ResponseEntity.ok(
                enrollmentService.getCurrentStudentEnrollments()
        );
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentResponse>> getEnrollmentsByStudent(
            @PathVariable Long studentId
    ) {

        return ResponseEntity.ok(
                enrollmentService.getEnrollmentsByStudent(studentId)
        );
    }
}