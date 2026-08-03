"use client";


import {
useEffect,
useState
} from "react";


import {
getAttendance
}
from "@/app/services/attendanceService";


import AttendanceTable
from "@/components/student/AttendanceTable";




export default function AttendancePage(){



const [attendance,setAttendance]=
useState<any[]>([]);





useEffect(()=>{


const load=async()=>{


const data =
await getAttendance();


setAttendance(data);


};


load();


},[]);







return(

<div className="p-6">


<h1 className="
text-3xl
font-bold
mb-5
">

My Attendance

</h1>




<AttendanceTable

attendance={attendance}

/>


</div>


);


}