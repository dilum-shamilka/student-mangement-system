import api from "@/lib/api";



export const getReports = async()=>{


const res = await api.get(

"/admin/reports"

);


return res.data;


};