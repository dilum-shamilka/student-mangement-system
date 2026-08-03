package com.sms.dto;

import java.util.Map;

public class DashboardStatsDto {

    private long totalStudents;
    private long activeStudents;
    private long totalCourses;
    private long totalDepartments;
    private Map<String, Long> studentsByDepartment;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalStudents, long activeStudents, long totalCourses, long totalDepartments, Map<String, Long> studentsByDepartment) {
        this.totalStudents = totalStudents;
        this.activeStudents = activeStudents;
        this.totalCourses = totalCourses;
        this.totalDepartments = totalDepartments;
        this.studentsByDepartment = studentsByDepartment;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getActiveStudents() {
        return activeStudents;
    }

    public void setActiveStudents(long activeStudents) {
        this.activeStudents = activeStudents;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public Map<String, Long> getStudentsByDepartment() {
        return studentsByDepartment;
    }

    public void setStudentsByDepartment(Map<String, Long> studentsByDepartment) {
        this.studentsByDepartment = studentsByDepartment;
    }
}
