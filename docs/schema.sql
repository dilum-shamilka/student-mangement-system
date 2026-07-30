-- ========================================================
-- Student Management System - MySQL Schema
-- ========================================================

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================
-- Users Table
-- ========================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Students Table
-- ========================================================
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    department VARCHAR(100) NOT NULL,
    enrollment_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Courses Table
-- ========================================================
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    credits INT NOT NULL DEFAULT 3,
    instructor VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Student Courses (Junction Table)
-- ========================================================
CREATE TABLE student_courses (
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade VARCHAR(5),

    PRIMARY KEY (student_id, course_id),

    CONSTRAINT fk_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
);

-- ========================================================
-- Seed Data
-- ========================================================

INSERT INTO users (email, password, full_name, role) VALUES
('admin@sliit.edu.lk', '$2a$10$76QcMjT3o.M4.0vM1wF08.t1QfWp5tX1yU5W6v9O9eP6hG1w9O2WS', 'Nimal Perera', 'ROLE_ADMIN'),
('kasun.perera@gmail.com', '$2a$10$76QcMjT3o.M4.0vM1wF08.t1QfWp5tX1yU5W6v9O9eP6hG1w9O2WS', 'Kasun Perera', 'ROLE_STUDENT');

INSERT INTO students
(student_id_number, first_name, last_name, email, phone, department, enrollment_date, status)
VALUES
('STU-2026-001','Kasun','Perera','kasun.perera@gmail.com','0771234567','Software Engineering','2026-01-15','ACTIVE'),
('STU-2026-002','Nadeesha','Fernando','nadeesha.fernando@gmail.com','0712345678','Information Technology','2026-01-15','ACTIVE'),
('STU-2026-003','Chamodi','Silva','chamodi.silva@gmail.com','0753456789','Computer Science','2026-01-15','ACTIVE'),
('STU-2026-004','Dinuka','Jayasinghe','dinuka.j@gmail.com','0764567890','Cyber Security','2026-01-15','ACTIVE'),
('STU-2026-005','Tharushi','Wijesinghe','tharushi.w@gmail.com','0785678901','Data Science','2026-01-15','INACTIVE');

INSERT INTO courses
(course_code, title, description, credits, instructor, department)
VALUES
('SE101','Programming Fundamentals','Introduction to Java Programming',4,'Dr. Sunil Perera','Software Engineering'),
('IT201','Database Management Systems','SQL and MySQL/PostgreSQL Concepts',3,'Prof. Chaminda Silva','Information Technology'),
('CY401','Cyber Security','Network Security and Ethical Hacking',3,'Prof. Saman Jayawardena','Cyber Security');


INSERT INTO student_courses (student_id, course_id, grade) VALUES
                                                               (1, 1, 'A'),
                                                               (1, 2, 'A-'),
                                                               (2, 2, 'B+'),
                                                               (3, 3, 'A'),
                                                               (4, 1, 'A+'),
                                                               (5, 1, 'B');