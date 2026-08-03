package com.sms.entity;


import jakarta.persistence.*;


@Entity
@Table(name="results")
public class Result {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String subjectName;


    private double marks;


    private String grade;


    private double gpa;



    @ManyToOne
    @JoinColumn(name="student_id")
    private Student student;




    public Result(){}




    public Long getId(){
        return id;
    }


    public void setId(Long id){
        this.id=id;
    }




    public String getSubjectName(){
        return subjectName;
    }


    public void setSubjectName(String subjectName){
        this.subjectName=subjectName;
    }




    public double getMarks(){
        return marks;
    }


    public void setMarks(double marks){
        this.marks=marks;
    }




    public String getGrade(){
        return grade;
    }


    public void setGrade(String grade){
        this.grade=grade;
    }




    public double getGpa(){
        return gpa;
    }


    public void setGpa(double gpa){
        this.gpa=gpa;
    }




    public Student getStudent(){
        return student;
    }


    public void setStudent(Student student){
        this.student=student;
    }


}