package com.sms.service;

import com.sms.dto.course.CourseRequest;
import com.sms.dto.course.CourseResponse;
import com.sms.entity.Course;
import com.sms.exception.BadRequestException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;


    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    public CourseResponse getCourseById(Long id) {

        Course course = courseRepository.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + id
                        )
                );

        return mapToResponse(course);
    }


    public CourseResponse createCourse(CourseRequest request) {

        if (courseRepository.findByCourseCode(request.getCourseCode()).isPresent()) {

            throw new BadRequestException(
                    "Course code already exists"
            );
        }


        Course course = Course.builder()
                .courseName(request.getCourseName())
                .courseCode(request.getCourseCode())
                .description(request.getDescription())
                .build();


        return mapToResponse(
                courseRepository.save(course)
        );
    }


    public CourseResponse updateCourse(
            Long id,
            CourseRequest request
    ) {

        Course course = courseRepository.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: " + id
                        )
                );


        if (!course.getCourseCode().equals(request.getCourseCode())
                &&
                courseRepository.findByCourseCode(request.getCourseCode()).isPresent()) {

            throw new BadRequestException(
                    "Course code already exists"
            );
        }


        course.setCourseName(request.getCourseName());
        course.setCourseCode(request.getCourseCode());
        course.setDescription(request.getDescription());


        return mapToResponse(
                courseRepository.save(course)
        );
    }


    public void deleteCourse(Long id) {

        if (!courseRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Course not found with id: " + id
            );
        }

        courseRepository.deleteById(id);
    }


    private CourseResponse mapToResponse(Course course) {

        return CourseResponse.builder()
                .id(course.getId())
                .courseName(course.getCourseName())
                .courseCode(course.getCourseCode())
                .description(course.getDescription())
                .createdAt(course.getCreatedAt())
                .build();
    }
}