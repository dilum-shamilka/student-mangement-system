package com.sms.controller.student;



import com.sms.dto.request.StudentUpdateRequest;

import com.sms.service.student.StudentSettingsService;


import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;




@RestController

@RequestMapping("/api/student/settings")

public class StudentSettingsController {



    private final StudentSettingsService service;



    public StudentSettingsController(
            StudentSettingsService service
    ){

        this.service = service;

    }






    @PutMapping("/{id}")

    public ResponseEntity<?> updateProfile(

            @PathVariable Long id,

            @RequestBody StudentUpdateRequest request

    ){


        return ResponseEntity.ok(

                service.updateProfile(id,request)

        );


    }






}