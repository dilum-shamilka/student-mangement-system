import axios from "axios";
import {
    Student,
    Course,
    DashboardStats,
    AuthResponse
} from "@/types";

export const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

// Request Interceptor: සෑම API ඉල්ලීමකටම (Request) localStorage එකේ ඇති JWT Token එක ස්වයංක්‍රීයව එකතු කරයි
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =====================
// STUDENTS
// =====================

export const fetchStudents = async (): Promise<Student[]> => {
    const response = await api.get<Student[]>("/students");
    return response.data;
};

export const createStudent = async (
    student: Omit<Student, "id">
): Promise<Student> => {
    const response = await api.post<Student>("/students", student);
    return response.data;
};

export const updateStudent = async (
    id: number,
    student: Partial<Student>
): Promise<Student> => {
    const response = await api.put<Student>(`/students/${id}`, student);
    return response.data;
};

export const deleteStudent = async (id: number) => {
    await api.delete(`/students/${id}`);
};

// =====================
// COURSES
// =====================

export const fetchCourses = async (): Promise<Course[]> => {
    const response = await api.get<Course[]>("/courses");
    return response.data;
};

export const createCourse = async (
    course: Omit<Course, "id">
): Promise<Course> => {
    const response = await api.post<Course>("/courses", course);
    return response.data;
};

export const updateCourse = async (
    id: number,
    course: Partial<Course>
): Promise<Course> => {
    const response = await api.put<Course>(`/courses/${id}`, course);
    return response.data;
};

export const deleteCourse = async (id: number) => {
    await api.delete(`/courses/${id}`);
};

// =====================
// DASHBOARD
// =====================

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
};