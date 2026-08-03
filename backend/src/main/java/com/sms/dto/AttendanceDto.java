package com.sms.dto;


public class AttendanceDto {


    private Long id;

    private String courseName;

    private int totalClasses;

    private int attendedClasses;

    private double percentage;



    public AttendanceDto(){

    }




    public AttendanceDto(
            Long id,
            String courseName,
            int totalClasses,
            int attendedClasses,
            double percentage
    ){

        this.id=id;

        this.courseName=courseName;

        this.totalClasses=totalClasses;

        this.attendedClasses=attendedClasses;

        this.percentage=percentage;

    }





    public Long getId(){
        return id;
    }


    public String getCourseName(){
        return courseName;
    }


    public int getTotalClasses(){
        return totalClasses;
    }


    public int getAttendedClasses(){
        return attendedClasses;
    }


    public double getPercentage(){
        return percentage;
    }


}