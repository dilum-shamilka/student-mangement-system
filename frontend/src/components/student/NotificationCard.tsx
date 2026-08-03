"use client";


export default function NotificationCard(
{
notification
}:any
){



return(

<div className="
bg-white
shadow
rounded
p-5
mb-4
">


<h2 className="
font-bold
text-xl
">

{notification.title}

</h2>



<p className="mt-2">

{notification.message}

</p>




<p className="
text-sm
text-gray-500
mt-3
">

{notification.createdAt}

</p>



</div>


);


}