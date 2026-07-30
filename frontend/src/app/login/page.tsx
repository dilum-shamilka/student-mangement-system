'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

import { api } from '@/lib/api';
import { AuthResponse } from '@/types';


export default function LoginPage() {

  const router = useRouter();

  const [isRegister,setIsRegister] = useState(false);

  const [loading,setLoading] = useState(false);

  const [error,setError] = useState('');



  const [formData,setFormData] = useState({

    email:'',
    password:'',
    fullName:''

  });



  const handleSubmit = async(
    e:React.FormEvent
  )=>{


    e.preventDefault();


    setLoading(true);

    setError('');



    try{


      const endpoint = isRegister
        ? "/auth/register"
        : "/auth/login";



      const response = await api.post<AuthResponse>(
        endpoint,
        formData
      );



      const authData = response.data;



      if(authData?.token){


        localStorage.setItem(
          "token",
          authData.token
        );



        localStorage.setItem(
          "user",
          JSON.stringify(authData)
        );



        router.push("/dashboard");


      }else{


        setError(
          "Invalid server response"
        );

      }



    }catch(err:any){



      console.error(
        "Authentication Error:",
        err
      );



      if(err.response){


        setError(

          err.response.data?.message ||
          err.response.data ||
          "Invalid email or password"

        );


      }

      else if(err.request){


        setError(
          "Cannot connect to server. Please start Spring Boot backend."
        );


      }

      else{


        setError(
          "Something went wrong"
        );

      }



    }finally{


      setLoading(false);


    }


  };




  return (

<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">


<div className="glass-card w-full max-w-md rounded-3xl p-8 border border-slate-800">


<div className="text-center mb-8">


<div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">

<GraduationCap className="w-8 h-8 text-white"/>

</div>



<h1 className="text-2xl font-bold gradient-text">

AcademiaSMS Portal

</h1>


<p className="text-xs text-slate-400 mt-2">

{
isRegister
?
"Create your account"
:
"Sign in to dashboard"
}

</p>


</div>





{
error &&

<div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">

{error}

</div>

}




<form 
onSubmit={handleSubmit}
className="space-y-4"
>



{
isRegister &&

<div>


<label className="text-xs text-slate-300">
Full Name
</label>


<div className="relative">


<User className="absolute left-3 top-3 w-4 h-4 text-slate-400"/>


<input

required

type="text"

value={formData.fullName}

onChange={
e=>
setFormData({
...formData,
fullName:e.target.value
})
}

className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 py-3 text-sm text-white"

placeholder="Admin User"

/>


</div>


</div>

}







<div>


<label className="text-xs text-slate-300">

Email

</label>


<div className="relative">


<Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400"/>


<input

required

type="email"

value={formData.email}

onChange={
e=>
setFormData({
...formData,
email:e.target.value
})
}

className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 py-3 text-sm text-white"

placeholder="admin@sms.com"

/>


</div>


</div>







<div>


<label className="text-xs text-slate-300">

Password

</label>


<div className="relative">


<Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400"/>


<input


required

type="password"


value={formData.password}


onChange={
e=>
setFormData({
...formData,
password:e.target.value
})
}


className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 py-3 text-sm text-white"


placeholder="********"


/>


</div>


</div>







<button


disabled={loading}


className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white flex justify-center items-center gap-2"


>


{

loading

?

"Loading..."

:

<>

{
isRegister
?
"Create Account"
:
"Sign In"
}

<ArrowRight className="w-4 h-4"/>

</>

}


</button>





</form>






<button

onClick={
()=>{

setIsRegister(!isRegister);

setError('');

}

}

className="mt-6 text-xs text-slate-400 hover:text-cyan-400 w-full"

>


{

isRegister

?

"Already have account? Login"

:

"Create new account"

}


</button>





<div className="mt-5 flex justify-center items-center gap-2 text-xs text-slate-500">


<ShieldCheck className="w-4 h-4 text-cyan-500"/>


JWT Spring Boot Security


</div>




</div>


</div>


  );

}