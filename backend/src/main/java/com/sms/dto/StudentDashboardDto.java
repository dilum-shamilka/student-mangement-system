package com.sms.dto;


public class StudentDashboardDto {


    private String studentName;

    private long totalCourses;

    private double attendancePercentage;

    private long totalResults;

    private long totalNotifications;



    public StudentDashboardDto(){

    }



    public StudentDashboardDto(
            String studentName,
            long totalCourses,
            double attendancePercentage,
            long totalResults,
            long totalNotifications
    ){

        this.studentName = studentName;

        this.totalCourses = totalCourses;

        this.attendancePercentage = attendancePercentage;

        this.totalResults = totalResults;

        this.totalNotifications = totalNotifications;

    }




    public String getStudentName() {
        return studentName;
    }


    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }



    public long getTotalCourses() {
        return totalCourses;
    }


    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }



    public double getAttendancePercentage() {
        return attendancePercentage;
    }


    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }



    public long getTotalResults() {
        return totalResults;
    }


    public void setTotalResults(long totalResults) {
        this.totalResults = totalResults;
    }



    public long getTotalNotifications() {
        return totalNotifications;
    }


    public void setTotalNotifications(long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }


}