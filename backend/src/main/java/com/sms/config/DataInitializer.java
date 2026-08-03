package com.sms.config;

import com.sms.entity.Role;
import com.sms.entity.User;
import com.sms.repository.CourseRepository;
import com.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin and Student users if no users exist
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail("admin@sms.com");
            admin.setFirstName("System");       // Changed from setFullName
            admin.setLastName("Admin");         // Added last name
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            User studentUser = new User();
            studentUser.setEmail("student@sms.com");
            studentUser.setFirstName("Default");  // Changed from setFullName
            studentUser.setLastName("Student");   // Added last name
            studentUser.setPassword(passwordEncoder.encode("student123"));
            studentUser.setRole(Role.STUDENT);
            userRepository.save(studentUser);
        }
    }
}