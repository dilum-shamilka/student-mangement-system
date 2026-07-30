package com.sms.service;

import com.sms.entity.Course;
import com.sms.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;


    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }


    public Course getCourseById(Long id) {

        return courseRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Course not found")
                );
    }


    public Course saveCourse(Course course) {

        return courseRepository.save(course);
    }


    public Course updateCourse(Long id, Course courseDetails) {

        Course course = getCourseById(id);

        course.setCourseCode(courseDetails.getCourseCode());
        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setCredits(courseDetails.getCredits());
        course.setInstructor(courseDetails.getInstructor());
        course.setDepartment(courseDetails.getDepartment());


        return courseRepository.save(course);
    }


    public void deleteCourse(Long id) {

        courseRepository.deleteById(id);

    }

}