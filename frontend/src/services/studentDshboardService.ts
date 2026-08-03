import api from "@/lib/api";



export const getStudentDashboard = async()=>{


    const response = await api.get(
        "/student/dashboard"
    );


    return response.data;

};