import api from "@/lib/api";



export const getStudentCourses = async()=>{


const res =
await api.get(

"/student/courses"

);


return res.data;


};