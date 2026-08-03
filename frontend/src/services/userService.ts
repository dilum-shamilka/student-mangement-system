import api from "@/lib/api";



export const getUsers = async()=>{


const res =
await api.get(
"/admin/users"
);


return res.data;


};






export const updateUserRole = async(

id:number,

role:string

)=>{


const res =
await api.put(

`/admin/users/${id}/role`,

role

);


return res.data;


};







export const deleteUser = async(

id:number

)=>{


const res =
await api.delete(

`/admin/users/${id}`

);


return res.data;


};