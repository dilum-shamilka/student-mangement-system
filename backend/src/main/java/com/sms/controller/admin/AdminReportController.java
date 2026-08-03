package com.sms.controller.admin;



import com.sms.dto.ReportDto;

import com.sms.service.admin.AdminReportService;


import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;




@RestController

@RequestMapping("/api/admin/reports")

public class AdminReportController {



private final AdminReportService service;




public AdminReportController(
        AdminReportService service
){

this.service = service;

}





@GetMapping

public ResponseEntity<ReportDto> getReport(){


return ResponseEntity.ok(

service.getReport()

);


}



}