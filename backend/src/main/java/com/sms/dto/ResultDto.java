package com.sms.dto;



public class ResultDto {



    private Long id;

    private String subjectName;

    private double marks;

    private String grade;

    private double gpa;





    public ResultDto(){

    }





    public ResultDto(
            Long id,
            String subjectName,
            double marks,
            String grade,
            double gpa
    ){

        this.id=id;

        this.subjectName=subjectName;

        this.marks=marks;

        this.grade=grade;

        this.gpa=gpa;

    }






    public Long getId(){

        return id;

    }


    public String getSubjectName(){

        return subjectName;

    }


    public double getMarks(){

        return marks;

    }


    public String getGrade(){

        return grade;

    }


    public double getGpa(){

        return gpa;

    }


}