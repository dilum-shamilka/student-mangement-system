"use client";


import {useEffect,useState} from "react";

import { getStudentDashboard } from "../../../services/studentDashboardService";

export default function StudentDashboard(){



const [student,setStudent]=useState<any>(null);





useEffect(()=>{


const user =
JSON.parse(

localStorage.getItem("user") || "{}"

);



if(user.id){

load(user.id);

}



},[]);







const load=async(id:number)=>{


const data =
await getStudentDashboard(id);


setStudent(data);


};






return(


<div className="p-6">


<h1 className="text-3xl font-bold mb-5">

Student Dashboard

</h1>



{

student &&

<div className="bg-white shadow rounded-xl p-5">


<h2 className="text-xl font-bold">

{student.fullName}

</h2>


<p>
Email : {student.email}
</p>


<p>
Course : {student.course}
</p>


</div>


}



</div>


);


}