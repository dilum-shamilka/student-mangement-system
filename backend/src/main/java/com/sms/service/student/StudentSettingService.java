package com.sms.service.student;


import com.sms.dto.request.StudentUpdateRequest;

import com.sms.dto.request.ChangePasswordRequest;

import com.sms.entity.Student;

import com.sms.repository.StudentRepository;


import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;




@Service
public class StudentSettingsService {



    private final StudentRepository studentRepository;

    private final PasswordEncoder passwordEncoder;




    public StudentSettingsService(
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder
    ){

        this.studentRepository = studentRepository;

        this.passwordEncoder = passwordEncoder;

    }






    public Student updateProfile(
            Long id,
            StudentUpdateRequest request
    ){


        Student student =

        studentRepository.findById(id)

        .orElseThrow(
            ()->new RuntimeException("Student not found")
        );



        student.setFullName(
                request.getFullName()
        );


        student.setPhone(
                request.getPhone()
        );


        student.setAddress(
                request.getAddress()
        );



        return studentRepository.save(student);

    }






    public String changePassword(
            String oldPassword,
            String newPassword
    ){


        // password checking logic here


        return "Password Updated Successfully";

    }



}