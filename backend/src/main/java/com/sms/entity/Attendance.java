package com.sms.entity;


import jakarta.persistence.*;



@Entity
@Table(name="attendance")
public class Attendance {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String courseName;


    private int totalClasses;


    private int attendedClasses;


    private double percentage;



    @ManyToOne
    @JoinColumn(name="student_id")
    private Student student;



    public Attendance(){}



    public Long getId(){
        return id;
    }


    public void setId(Long id){
        this.id=id;
    }



    public String getCourseName(){
        return courseName;
    }


    public void setCourseName(String courseName){
        this.courseName=courseName;
    }



    public int getTotalClasses(){
        return totalClasses;
    }


    public void setTotalClasses(int totalClasses){
        this.totalClasses=totalClasses;
    }



    public int getAttendedClasses(){
        return attendedClasses;
    }


    public void setAttendedClasses(int attendedClasses){
        this.attendedClasses=attendedClasses;
    }



    public double getPercentage(){
        return percentage;
    }


    public void setPercentage(double percentage){
        this.percentage=percentage;
    }



    public Student getStudent(){
        return student;
    }


    public void setStudent(Student student){
        this.student=student;
    }


}