package com.sms.dto;


public class DashboardStatsDto {


    private long totalStudents;

    private long totalCourses;

    private long activeStudents;

    private long totalUsers;



    public DashboardStatsDto(){}



    public DashboardStatsDto(
            long totalStudents,
            long totalCourses,
            long activeStudents,
            long totalUsers
    ){

        this.totalStudents = totalStudents;

        this.totalCourses = totalCourses;

        this.activeStudents = activeStudents;

        this.totalUsers = totalUsers;

    }





    public long getTotalStudents(){

        return totalStudents;

    }



    public void setTotalStudents(long totalStudents){

        this.totalStudents = totalStudents;

    }




    public long getTotalCourses(){

        return totalCourses;

    }



    public void setTotalCourses(long totalCourses){

        this.totalCourses = totalCourses;

    }





    public long getActiveStudents(){

        return activeStudents;

    }



    public void setActiveStudents(long activeStudents){

        this.activeStudents = activeStudents;

    }





    public long getTotalUsers(){

        return totalUsers;

    }



    public void setTotalUsers(long totalUsers){

        this.totalUsers = totalUsers;

    }


}