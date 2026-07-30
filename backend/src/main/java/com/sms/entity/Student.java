package com.sms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name="students")
public class Student {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(
            name="student_id_number",
            nullable=false,
            unique=true
    )
    private String studentIdNumber;



    @Column(
            name="first_name",
            nullable=false
    )
    private String firstName;



    @Column(
            name="last_name",
            nullable=false
    )
    private String lastName;



    @Column(
            nullable=false,
            unique=true
    )
    private String email;



    private String phone;



    @Column(nullable=false)
    private String department;



    @Column(nullable=false)
    private LocalDate enrollmentDate;



    @Column(nullable=false)
    private String status;



    @Column(
            name="created_at",
            updatable=false
    )
    private LocalDateTime createdAt;



    public Student(){}



    @PrePersist
    public void beforeSave(){

        if(createdAt==null){
            createdAt = LocalDateTime.now();
        }


        if(status==null){
            status="ACTIVE";
        }


        if(enrollmentDate==null){
            enrollmentDate=LocalDate.now();
        }

    }



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id=id;
    }



    public String getStudentIdNumber() {
        return studentIdNumber;
    }


    public void setStudentIdNumber(String studentIdNumber) {
        this.studentIdNumber=studentIdNumber;
    }



    public String getFirstName() {
        return firstName;
    }


    public void setFirstName(String firstName) {
        this.firstName=firstName;
    }



    public String getLastName() {
        return lastName;
    }


    public void setLastName(String lastName) {
        this.lastName=lastName;
    }



    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email=email;
    }



    public String getPhone() {
        return phone;
    }


    public void setPhone(String phone) {
        this.phone=phone;
    }



    public String getDepartment() {
        return department;
    }


    public void setDepartment(String department) {
        this.department=department;
    }



    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }


    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate=enrollmentDate;
    }



    public String getStatus() {
        return status;
    }


    public void setStatus(String status) {
        this.status=status;
    }



    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt=createdAt;
    }

}