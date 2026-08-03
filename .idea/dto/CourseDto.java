package com.sms.dto;


public class CourseDto {


    private Long id;

    private String courseName;

    private String description;

    private int duration;



    public CourseDto(){

    }



    public CourseDto(
            Long id,
            String courseName,
            String description,
            int duration
    ){

        this.id=id;

        this.courseName=courseName;

        this.description=description;

        this.duration=duration;

    }



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id=id;
    }



    public String getCourseName() {
        return courseName;
    }


    public void setCourseName(String courseName) {
        this.courseName=courseName;
    }



    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description=description;
    }



    public int getDuration() {
        return duration;
    }


    public void setDuration(int duration) {
        this.duration=duration;
    }

}