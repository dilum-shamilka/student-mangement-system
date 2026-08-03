package com.sms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

    @Column(nullable=false)
    private String firstName;

    @Column(nullable=false)
    private String lastName;

    @Column(nullable=false, unique=true)
    private String email;

    private String phone;

    private String department;
    
    // StudentSettingService හි භාවිතා වන Address field එක එකතු කරන ලදී
    private String address;

    private LocalDate enrollmentDate;

    private String status;

    private LocalDateTime createdAt;

    // User Relationship
    @OneToOne
    @JoinColumn(name="user_id")
    @JsonIgnore
    private User user;

    // Courses
    @ManyToMany
    @JoinTable(
            name="student_courses",
            joinColumns=@JoinColumn(name="student_id"),
            inverseJoinColumns=@JoinColumn(name="course_id")
    )
    @JsonIgnore
    private List<Course> courses;

    // Attendance
    @OneToMany(
            mappedBy="student",
            cascade=CascadeType.ALL
    )
    @JsonIgnore
    private List<Attendance> attendance;

    // Results
    @OneToMany(
            mappedBy="student",
            cascade=CascadeType.ALL
    )
    @JsonIgnore
    private List<Result> results;

    // Notifications
    @OneToMany(
            mappedBy="student",
            cascade=CascadeType.ALL
    )
    @JsonIgnore
    private List<Notification> notifications;

    public Student(){}

    @PrePersist
    public void beforeSave(){
        if(createdAt == null){
            createdAt = LocalDateTime.now();
        }
        if(status == null){
            status = "ACTIVE";
        }
        if(enrollmentDate == null){
            enrollmentDate = LocalDate.now();
        }
    }

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public String getStudentIdNumber(){
        return studentIdNumber;
    }

    public void setStudentIdNumber(String studentIdNumber){
        this.studentIdNumber = studentIdNumber;
    }

    public String getFirstName(){
        return firstName;
    }

    public void setFirstName(String firstName){
        this.firstName = firstName;
    }

    public String getLastName(){
        return lastName;
    }

    public void setLastName(String lastName){
        this.lastName = lastName;
    }

    // StudentSettingService සඳහා අවශ්‍ය fullName getter සහ setter එකතු කරන ලදී
    public String getFullName(){
        return firstName + (lastName != null ? " " + lastName : "");
    }

    public void setFullName(String fullName){
        if(fullName != null && !fullName.isEmpty()){
            String[] parts = fullName.split(" ", 2);
            this.firstName = parts[0];
            this.lastName = parts.length > 1 ? parts[1] : "";
        }
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public String getPhone(){
        return phone;
    }

    public void setPhone(String phone){
        this.phone = phone;
    }

    public String getDepartment(){
        return department;
    }

    public void setDepartment(String department){
        this.department = department;
    }

    // Address සඳහා Getters සහ Setters එකතු කරන ලදී
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getEnrollmentDate(){
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate){
        this.enrollmentDate = enrollmentDate;
    }

    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt){
        this.createdAt = createdAt;
    }

    public User getUser(){
        return user;
    }

    public void setUser(User user){
        this.user = user;
    }

    public List<Course> getCourses(){
        return courses;
    }

    public void setCourses(List<Course> courses){
        this.courses = courses;
    }
}