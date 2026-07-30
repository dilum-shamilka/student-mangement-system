package com.sms.service;


import com.sms.entity.Student;
import com.sms.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;



@Service
public class StudentService {


    private final StudentRepository repository;


    public StudentService(
            StudentRepository repository
    ){
        this.repository=repository;
    }




    public List<Student> getAll(){

        return repository.findAll();

    }




    public Student save(Student student){

        return repository.save(student);

    }





    public Student update(
            Long id,
            Student data
    ){


        Student student =
                repository.findById(id)
                        .orElseThrow(
                                ()->new RuntimeException(
                                        "Student not found"
                                )
                        );



        student.setStudentIdNumber(
                data.getStudentIdNumber()
        );


        student.setFirstName(
                data.getFirstName()
        );


        student.setLastName(
                data.getLastName()
        );


        student.setEmail(
                data.getEmail()
        );


        student.setPhone(
                data.getPhone()
        );


        student.setDepartment(
                data.getDepartment()
        );


        student.setStatus(
                data.getStatus()
        );


        student.setEnrollmentDate(
                data.getEnrollmentDate()
        );



        return repository.save(student);

    }




    public void delete(Long id){

        repository.deleteById(id);

    }


}