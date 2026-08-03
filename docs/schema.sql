-- ========================================================
-- Student Management System - MySQL Final Schema
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS student_courses;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;


SET FOREIGN_KEY_CHECKS = 1;



-- ========================================================
-- USERS
-- ========================================================

CREATE TABLE users (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_STUDENT'

);



-- ========================================================
-- STUDENTS
-- ========================================================

CREATE TABLE students (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,


    student_id_number VARCHAR(50)
    UNIQUE NOT NULL,


    first_name VARCHAR(100)
    NOT NULL,


    last_name VARCHAR(100)
    NOT NULL,


    email VARCHAR(255)
    UNIQUE NOT NULL,


    phone VARCHAR(50),


    department VARCHAR(100)
    NOT NULL,


    enrollment_date DATE
    NOT NULL,


    status VARCHAR(50)
    DEFAULT 'ACTIVE',


    created_at DATETIME(6)


);



-- ========================================================
-- COURSES
-- ========================================================


CREATE TABLE courses (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,


    course_code VARCHAR(50)
    UNIQUE NOT NULL,


    title VARCHAR(255)
    NOT NULL,


    description TEXT,


    credits INT
    NOT NULL,


    instructor VARCHAR(255)
    NOT NULL,


    department VARCHAR(100)
    NOT NULL


);



-- ========================================================
-- STUDENT COURSES
-- ========================================================


CREATE TABLE student_courses (

    student_id BIGINT NOT NULL,

    course_id BIGINT NOT NULL,


    PRIMARY KEY(
        student_id,
        course_id
    ),


    CONSTRAINT fk_student_course_student

    FOREIGN KEY(student_id)

    REFERENCES students(id)

    ON DELETE CASCADE,


    CONSTRAINT fk_student_course_course

    FOREIGN KEY(course_id)

    REFERENCES courses(id)

    ON DELETE CASCADE

);



-- ========================================================
-- ATTENDANCE
-- ========================================================


CREATE TABLE attendance (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,


    course_name VARCHAR(255),


    total_classes INT NOT NULL,


    attended_classes INT NOT NULL,


    percentage DOUBLE NOT NULL,


    student_id BIGINT,


    FOREIGN KEY(student_id)

    REFERENCES students(id)

    ON DELETE CASCADE

);



-- ========================================================
-- RESULTS
-- ========================================================


CREATE TABLE results (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,


    subject_name VARCHAR(255),


    marks DOUBLE NOT NULL,


    grade VARCHAR(255),


    gpa DOUBLE NOT NULL,


    student_id BIGINT,


    FOREIGN KEY(student_id)

    REFERENCES students(id)

    ON DELETE CASCADE

);



-- ========================================================
-- NOTIFICATIONS
-- ========================================================


CREATE TABLE notifications (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,


    title VARCHAR(255),


    message VARCHAR(255),


    created_at DATETIME(6),


    student_id BIGINT,


    FOREIGN KEY(student_id)

    REFERENCES students(id)

    ON DELETE CASCADE

);





-- ========================================================
-- INSERT USERS
-- ========================================================


INSERT INTO users
(full_name,email,password,role)

VALUES

(
'Admin User',
'admin@sms.com',
'$2a$10$76QcMjT3o.M4.0vM1wF08.t1QfWp5tX1yU5W6v9O9eP6hG1w9O2WS',
'ROLE_ADMIN'
),


(
'Kasun Perera',
'kasun@gmail.com',
'$2a$10$76QcMjT3o.M4.0vM1wF08.t1QfWp5tX1yU5W6v9O9eP6hG1w9O2WS',
'ROLE_STUDENT'
);





-- ========================================================
-- INSERT STUDENTS
-- ========================================================


INSERT INTO students

(student_id_number,
first_name,
last_name,
email,
phone,
department,
enrollment_date,
status)

VALUES


(
'STU001',
'Kasun',
'Perera',
'kasun@gmail.com',
'0771234567',
'Software Engineering',
'2026-01-15',
'ACTIVE'
),


(
'STU002',
'Nadeesha',
'Fernando',
'nadeesha@gmail.com',
'0712345678',
'Information Technology',
'2026-01-15',
'ACTIVE'
);





-- ========================================================
-- INSERT COURSES
-- ========================================================


INSERT INTO courses

(course_code,title,description,credits,instructor,department)

VALUES


(
'SE101',
'Programming Fundamentals',
'Java Programming',
4,
'Dr. Sunil Perera',
'Software Engineering'
),


(
'DB201',
'Database Systems',
'MySQL and SQL',
3,
'Dr. Chaminda Silva',
'Information Technology'
);





-- ========================================================
-- STUDENT COURSE DATA
-- ========================================================


INSERT INTO student_courses

(student_id,course_id)

VALUES

(1,1),
(1,2),
(2,2);