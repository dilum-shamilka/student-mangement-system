export interface Student {

    id:number;

    studentIdNumber:string;

    firstName:string;

    lastName:string;

    email:string;

    phone:string;

    department:string;

    status:
    | "ACTIVE"
    | "INACTIVE"
    | "PENDING"
    | "GRADUATED"
    | "SUSPENDED";

    enrollmentDate:string;

    createdAt?:string;

}



export interface Course {

    id:number;

    courseCode:string;

    title:string;

    description:string;

    credits:number;

    instructor:string;

    department:string;

}



export interface DashboardStats {

    totalStudents:number;

    activeStudents:number;

    totalCourses:number;

    totalDepartments:number;

    studentsByDepartment:
    Record<string,number>;

}



export interface AuthResponse {

    token:string;

    type?:string;

    fullName?:string;

    email?:string;

    role?:string;

}