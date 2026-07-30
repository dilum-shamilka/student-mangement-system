package com.sms.service;

import com.sms.dto.DashboardStatsDto;
import com.sms.repository.CourseRepository;
import com.sms.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    public DashboardStatsDto getDashboardStats() {
        long totalStudents = studentRepository.count();
        // Fixed: Now uses the optimized database count query
        long activeStudents = studentRepository.countByStatus("ACTIVE"); 
        long totalCourses = courseRepository.count();

        List<Object[]> deptCounts = studentRepository.countStudentsByDepartment();
        Map<String, Long> studentsByDepartment = new HashMap<>();
        for (Object[] row : deptCounts) {
            String dept = (String) row[0];
            Long count = (Long) row[1];
            studentsByDepartment.put(dept, count);
        }

        long totalDepartments = studentsByDepartment.keySet().size();

        return new DashboardStatsDto(totalStudents, activeStudents, totalCourses, totalDepartments, studentsByDepartment);
    }
}