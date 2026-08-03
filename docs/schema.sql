-- ============================================================
-- Student Management System – Database Schema (MySQL Version)
-- Run this in your MySQL database (e.g., studentms)
-- ============================================================

-- Users table (consolidated for all roles)
CREATE TABLE IF NOT EXISTS users (
                                     id                BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     first_name        VARCHAR(100) NOT NULL,
                                     last_name         VARCHAR(100) NOT NULL,
                                     email             VARCHAR(255) NOT NULL UNIQUE,
                                     password          VARCHAR(255) NOT NULL,
                                     role              VARCHAR(50)  NOT NULL,
                                     phone             VARCHAR(20),
                                     date_of_birth     DATE,
                                     enrollment_status VARCHAR(50)  DEFAULT 'PENDING',
                                     created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
                                       id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                                       course_name VARCHAR(255) NOT NULL,
                                       course_code VARCHAR(50)  NOT NULL UNIQUE,
                                       description TEXT,
                                       created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments table (references users)
CREATE TABLE IF NOT EXISTS enrollments (
                                           id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                                           student_id  BIGINT NOT NULL,
                                           course_id   BIGINT NOT NULL,
                                           enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                           CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                                           CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
                                           UNIQUE KEY uk_student_course (student_id, course_id)
);

-- Indexes
CREATE INDEX idx_users_email         ON users(email);
CREATE INDEX idx_courses_code        ON courses(course_code);
CREATE INDEX idx_enrollments_student  ON enrollments(student_id);
CREATE INDEX idx_enrollments_course   ON enrollments(course_id);