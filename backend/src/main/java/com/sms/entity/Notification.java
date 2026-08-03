package com.sms.entity;


import jakarta.persistence.*;

import java.time.LocalDateTime;



@Entity
@Table(name="notifications")
public class Notification {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String title;


    private String message;


    private LocalDateTime createdAt;



    @ManyToOne
    @JoinColumn(name="student_id")
    private Student student;



    public Notification(){}



    @PrePersist
    public void beforeSave(){

        if(createdAt==null){

            createdAt=LocalDateTime.now();

        }

    }




    public Long getId(){
        return id;
    }


    public void setId(Long id){
        this.id=id;
    }



    public String getTitle(){
        return title;
    }


    public void setTitle(String title){
        this.title=title;
    }



    public String getMessage(){
        return message;
    }


    public void setMessage(String message){
        this.message=message;
    }



    public LocalDateTime getCreatedAt(){
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt){
        this.createdAt=createdAt;
    }



    public Student getStudent(){
        return student;
    }


    public void setStudent(Student student){
        this.student=student;
    }


}