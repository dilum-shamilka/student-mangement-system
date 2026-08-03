package com.sms.service.admin;



import com.sms.dto.ReportDto;

import com.sms.repository.StudentRepository;
import com.sms.repository.CourseRepository;
import com.sms.repository.UserRepository;


import org.springframework.stereotype.Service;




@Service
public class AdminReportService {



private final StudentRepository studentRepository;

private final CourseRepository courseRepository;

private final UserRepository userRepository;





public AdminReportService(

StudentRepository studentRepository,

CourseRepository courseRepository,

UserRepository userRepository

){


this.studentRepository = studentRepository;

this.courseRepository = courseRepository;

this.userRepository = userRepository;


}






public ReportDto getReport(){



return new ReportDto(

studentRepository.count(),

courseRepository.count(),

userRepository.count()

);


}



}