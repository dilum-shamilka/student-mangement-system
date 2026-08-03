package com.sms.exception;


import com.sms.dto.response.ApiResponse;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;



import java.util.Map;



@RestControllerAdvice
public class GlobalExceptionHandler {




    @ExceptionHandler(
            ResourceNotFoundException.class
    )
    public ResponseEntity<ApiResponse> 
    handleNotFound(
            ResourceNotFoundException ex
    ){


        return new ResponseEntity<>(

                new ApiResponse(

                        false,

                        ex.getMessage(),

                        null

                ),

                HttpStatus.NOT_FOUND

        );

    }








    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse>
    handleException(
            Exception ex
    ){


        return new ResponseEntity<>(

                new ApiResponse(

                        false,

                        ex.getMessage(),

                        null

                ),

                HttpStatus.INTERNAL_SERVER_ERROR

        );

    }




}