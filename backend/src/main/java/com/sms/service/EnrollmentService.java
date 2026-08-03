package com.sms.service;

import com.sms.dto.enrollment.EnrollmentResponse;
import com.sms.entity.Course;
import com.sms.entity.Enrollment;
import com.sms.entity.EnrollmentStatus;
import com.sms.entity.Role;
import com.sms.entity.User;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.CourseRepository;
import com.sms.repository.EnrollmentRepository;
import com.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;


    @Transactional
    public EnrollmentResponse enrollCurrentStudent(Long courseId) {

        User student = getCurrentStudent();


        if (student.getEnrollmentStatus() != EnrollmentStatus.APPROVED) {

            throw new BadRequestException(
                    "Only approved students can enroll in courses."
            );
        }


        Course course = courseRepository.findById(courseId)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + courseId
                        )
                );


        if (enrollmentRepository.existsByStudentIdAndCourseId(
                student.getId(),
                course.getId()
        )) {

            throw new BadRequestException(
                    "You are already enrolled in this course."
            );
        }


        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .build();


        Enrollment saved = enrollmentRepository.save(enrollment);

        return mapToResponse(saved);
    }


    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getCurrentStudentEnrollments() {

        User student = getCurrentStudent();

        return enrollmentRepository
                .findByStudentId(student.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsByStudent(Long studentId) {

        User student = userRepository.findById(studentId)

                .filter(u -> u.getRole() == Role.STUDENT)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + studentId
                        )
                );


        return enrollmentRepository
                .findByStudentId(student.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    private User getCurrentStudent() {

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


        User user = userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );


        if (user.getRole() != Role.STUDENT) {

            throw new BadRequestException(
                    "Only students can enroll in courses."
            );
        }


        return user;
    }


    private EnrollmentResponse mapToResponse(
            Enrollment enrollment
    ) {

        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .courseId(enrollment.getCourse().getId())
                .courseName(enrollment.getCourse().getCourseName())
                .courseCode(enrollment.getCourse().getCourseCode())
                .enrolledAt(enrollment.getEnrolledAt())
                .build();
    }
}