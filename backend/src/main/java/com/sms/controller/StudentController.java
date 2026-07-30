package com.sms.controller;


import com.sms.entity.Student;
import com.sms.service.StudentService;


import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/api/v1/students")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://localhost:5173"
        }
)
public class StudentController {



    private final StudentService service;



    public StudentController(
            StudentService service
    ){

        this.service=service;

    }





    @GetMapping
    public List<Student> getAll(){

        return service.getAll();

    }





    @PostMapping
    public Student create(
            @RequestBody Student student
    ){

        return service.save(student);

    }





    @PutMapping("/{id}")
    public Student update(
            @PathVariable Long id,
            @RequestBody Student student
    ){

        return service.update(
                id,
                student
        );

    }





    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ){

        service.delete(id);

    }


}