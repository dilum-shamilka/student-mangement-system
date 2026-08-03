"use client";


import {useEffect,useState} from "react";

import {getProfile}

from "@/services/profileService";



export default function ProfilePage(){



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
await getProfile(id);


setStudent(data);


};





return(


<div className="p-6">


<h1 className="text-3xl font-bold mb-5">

My Profile

</h1>



<div className="bg-white shadow rounded-xl p-5">


<p>
Name : {student?.fullName}
</p>


<p>
Email : {student?.email}
</p>


<p>
Phone : {student?.phone}
</p>


<p>
Course : {student?.course}
</p>


<p>
Address : {student?.address}
</p>



</div>


</div>


);


}