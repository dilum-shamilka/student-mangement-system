package com.sms.dto;


import java.time.LocalDateTime;



public class NotificationDto {



    private Long id;


    private String title;


    private String message;


    private LocalDateTime createdAt;





    public NotificationDto(){

    }






    public NotificationDto(
            Long id,
            String title,
            String message,
            LocalDateTime createdAt
    ){

        this.id=id;

        this.title=title;

        this.message=message;

        this.createdAt=createdAt;

    }





    public Long getId(){

        return id;

    }


    public String getTitle(){

        return title;

    }


    public String getMessage(){

        return message;

    }


    public LocalDateTime getCreatedAt(){

        return createdAt;

    }


}