"use client";


import {
useEffect,
useState
} from "react";


import {
getDashboardStats
} from "@/services/dashboardService";



export default function DashboardPage(){



const [data,setData]=useState<any>(null);



useEffect(()=>{


loadData();


},[]);




const loadData=async()=>{


try{


const res =
await getDashboardStats();


setData(res);


}
catch(error){

console.log(error);

}



};





return(


<div className="p-6">


<h1 className="text-2xl font-bold mb-6">

Admin Dashboard

</h1>



<div className="grid grid-cols-4 gap-5">



<div className="bg-white shadow p-5 rounded">

<h2>Total Students</h2>

<p className="text-3xl font-bold">

{data?.totalStudents ?? 0}

</p>

</div>





<div className="bg-white shadow p-5 rounded">

<h2>Total Courses</h2>

<p className="text-3xl font-bold">

{data?.totalCourses ?? 0}

</p>

</div>





<div className="bg-white shadow p-5 rounded">

<h2>Active Students</h2>

<p className="text-3xl font-bold">

{data?.activeStudents ?? 0}

</p>

</div>





<div className="bg-white shadow p-5 rounded">

<h2>Total Users</h2>

<p className="text-3xl font-bold">

{data?.totalUsers ?? 0}

</p>

</div>



</div>


</div>


);


}