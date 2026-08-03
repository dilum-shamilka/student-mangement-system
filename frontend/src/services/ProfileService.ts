import api from "@/lib/api";



export const getProfile = async(
id:number
)=>{


const res =
await api.get(

`/student/profile/${id}`

);


return res.data;


};