package com.sms.dto;


public class ReportDto {


    private long totalStudents;

    private long totalCourses;

    private long totalUsers;



    public ReportDto(){}



    public ReportDto(
            long totalStudents,
            long totalCourses,
            long totalUsers
    ){

        this.totalStudents = totalStudents;
        this.totalCourses = totalCourses;
        this.totalUsers = totalUsers;

    }




    public long getTotalStudents() {

        return totalStudents;

    }


    public void setTotalStudents(long totalStudents) {

        this.totalStudents = totalStudents;

    }




    public long getTotalCourses() {

        return totalCourses;

    }


    public void setTotalCourses(long totalCourses) {

        this.totalCourses = totalCourses;

    }




    public long getTotalUsers() {

        return totalUsers;

    }


    public void setTotalUsers(long totalUsers) {

        this.totalUsers = totalUsers;

    }


}