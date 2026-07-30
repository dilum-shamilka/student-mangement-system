package com.sms.repository;


import com.sms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {


    long countByStatus(String status);


    @Query("""
            SELECT s.department, COUNT(s)
            FROM Student s
            GROUP BY s.department
            """)
    List<Object[]> countStudentsByDepartment();


}