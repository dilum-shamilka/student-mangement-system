package com.sms.dto;


public class StudentProfileDto {


    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String address;

    private String course;



    public StudentProfileDto(){

    }



    public StudentProfileDto(
            Long id,
            String fullName,
            String email,
            String phone,
            String address,
            String course
    ){

        this.id=id;

        this.fullName=fullName;

        this.email=email;

        this.phone=phone;

        this.address=address;

        this.course=course;

    }





    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id=id;
    }




    public String getFullName() {
        return fullName;
    }


    public void setFullName(String fullName) {
        this.fullName=fullName;
    }




    public String getEmail() {
        return email;
    }


    public void setEmail(String email) {
        this.email=email;
    }




    public String getPhone() {
        return phone;
    }


    public void setPhone(String phone) {
        this.phone=phone;
    }




    public String getAddress() {
        return address;
    }


    public void setAddress(String address) {
        this.address=address;
    }




    public String getCourse() {
        return course;
    }


    public void setCourse(String course) {
        this.course=course;
    }

}