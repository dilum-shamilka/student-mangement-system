package com.sms.config;

import com.sms.entity.Course;
import com.sms.entity.Role;
import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.repository.CourseRepository;
import com.sms.repository.StudentRepository;
import com.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin user if no user exists
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail("admin@sms.com");
            admin.setFullName("System Admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);

            User studentUser = new User();
            studentUser.setEmail("student@sms.com");
            studentUser.setFullName("Default Student");
            studentUser.setPassword(passwordEncoder.encode("student123"));
            studentUser.setRole(Role.ROLE_STUDENT);
            userRepository.save(studentUser);
        }

        // Seed default Students if none exist
        if (studentRepository.count() == 0) {
            Student student1 = new Student();
            student1.setFirstName("John");
            student1.setLastName("Doe");
            student1.setEmail("john.student@sms.com");
            student1.setDepartment("Computer Science");
            student1.setStudentIdNumber("STU001");
            studentRepository.save(student1);

            Student student2 = new Student();
            student2.setFirstName("Jane");
            student2.setLastName("Smith");
            student2.setEmail("jane.student@sms.com");
            student2.setDepartment("Information Technology");
            student2.setStudentIdNumber("STU002");
            studentRepository.save(student2);
        }
    }
}