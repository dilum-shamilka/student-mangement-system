package com.sms.service;

import com.sms.dto.student.StudentResponse;
import com.sms.entity.EnrollmentStatus;
import com.sms.entity.Role;
import com.sms.entity.User;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final UserRepository userRepository;


    public List<StudentResponse> getAllStudents() {

        return userRepository.findByRole(Role.STUDENT)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    public StudentResponse getCurrentStudent() {

        return mapToResponse(
                getCurrentStudentEntity()
        );
    }


    public StudentResponse getStudentById(Long id) {

        User user = userRepository.findById(id)

                .filter(u -> u.getRole() == Role.STUDENT)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        )
                );


        return mapToResponse(user);
    }


    public StudentResponse updateEnrollmentStatus(
            Long id,
            EnrollmentStatus status
    ) {

        User user = userRepository.findById(id)

                .filter(u -> u.getRole() == Role.STUDENT)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        )
                );


        user.setEnrollmentStatus(status);


        return mapToResponse(
                userRepository.save(user)
        );
    }


    public void deleteStudent(Long id) {

        User user = userRepository.findById(id)

                .filter(u -> u.getRole() == Role.STUDENT)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        )
                );


        userRepository.delete(user);
    }


    private User getCurrentStudentEntity() {

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
                    "Only students can access this resource."
            );
        }


        return user;
    }


    private StudentResponse mapToResponse(User user) {

        return StudentResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .dateOfBirth(user.getDateOfBirth())
                .enrollmentStatus(user.getEnrollmentStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}