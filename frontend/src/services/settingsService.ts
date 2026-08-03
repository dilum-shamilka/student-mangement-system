import api from "@/lib/api";



export const updateProfile = async(
id:number,
data:any
)=>{


const response =
await api.put(
`/student/settings/${id}`,
data
);


return response.data;


};