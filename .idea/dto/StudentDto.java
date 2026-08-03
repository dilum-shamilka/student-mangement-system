package com.sms.dto;


public class StudentDto {


private Long id;

private String firstName;

private String lastName;

private String email;

private String phone;

private String department;



public StudentDto(){}



public StudentDto(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String department
){

this.id=id;
this.firstName=firstName;
this.lastName=lastName;
this.email=email;
this.phone=phone;
this.department=department;

}



public Long getId(){
return id;
}


public String getFirstName(){
return firstName;
}


public String getLastName(){
return lastName;
}


public String getEmail(){
return email;
}


public String getPhone(){
return phone;
}


public String getDepartment(){
return department;
}


}