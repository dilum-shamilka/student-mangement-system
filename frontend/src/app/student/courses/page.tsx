"use client";


import {useEffect,useState} from "react";

import {
getStudentCourses
}
from "@/services/studentcourseservice";



export default function CoursesPage(){



const [courses,setCourses]=useState<any[]>([]);




useEffect(()=>{


load();


},[]);





const load=async()=>{


const data =
await getStudentCourses();


setCourses(data);


};





return(


<div className="p-6">


<h1 className="text-3xl font-bold mb-5">

My Courses

</h1>



<div className="grid md:grid-cols-3 gap-5">


{

courses.map(course=>(


<div

key={course.id}

className="bg-white shadow rounded-xl p-5"

>


<h2 className="font-bold">

{course.title}

</h2>


<p>
Code : {course.courseCode}
</p>


<p>
Credits : {course.credits}
</p>


</div>


))


}



</div>



</div>


);


}