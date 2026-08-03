import api from "@/lib/api";


export const getNotifications = async()=>{


const res =
await api.get(
"/student/notifications"
);


return res.data;


};