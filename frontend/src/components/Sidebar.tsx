'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  GraduationCap
} from 'lucide-react';


export default function Sidebar() {

  const pathname = usePathname();


  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Students',
      href: '/students',
      icon: Users
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpen
    },
  ];



  const handleLogout = () => {

    if(typeof window !== 'undefined'){

      localStorage.removeItem('token');

      localStorage.removeItem('user');

      window.location.href = '/login';

    }

  };



  return (

    <aside
      className="
      hidden
      md:flex
      w-64
      glass-panel
      border-r
      border-slate-800/80
      flex-col
      justify-between
      h-screen
      sticky
      top-0
      "
    >


      {/* TOP SECTION */}

      <div>


        {/* Brand */}

        <div
          className="
          h-16
          flex
          items-center
          px-6
          border-b
          border-slate-800/60
          gap-3
          "
        >


          <div
            className="
            w-9
            h-9
            rounded-xl
            bg-gradient-to-tr
            from-cyan-500
            to-indigo-600
            flex
            items-center
            justify-center
            shadow-lg
            shadow-cyan-500/20
            "
          >

            <GraduationCap
              className="w-5 h-5 text-white"
            />

          </div>



          <div>

            <h1
              className="
              font-bold
              text-lg
              leading-tight
              gradient-text
              "
            >
              AcademiaSMS
            </h1>


            <p
              className="
              text-[10px]
              text-slate-400
              font-mono
              tracking-wider
              uppercase
              "
            >
              Enterprise Portal
            </p>


          </div>


        </div>




        {/* Navigation */}

        <nav
          className="
          p-4
          space-y-1.5
          mt-2
          "
        >


          {
            navItems.map((item)=>{


              const Icon = item.icon;

              const isActive =
                pathname === item.href;



              return (

                <Link

                  key={item.name}

                  href={item.href}


                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive

                      ?

                      `
                      bg-gradient-to-r
                      from-cyan-500/20
                      to-indigo-500/10
                      text-cyan-400
                      border
                      border-cyan-500/30
                      shadow-md
                      shadow-cyan-500/10
                      `

                      :

                      `
                      text-slate-400
                      hover:text-slate-200
                      hover:bg-slate-800/50
                      `
                    }
                  `}

                >


                  <Icon

                    className={`
                    w-5
                    h-5

                    ${
                      isActive
                      ?
                      'text-cyan-400'
                      :
                      'text-slate-400'
                    }

                    `}

                  />


                  {item.name}


                </Link>

              );


            })
          }


        </nav>



      </div>





      {/* USER PROFILE */}


      <div
        className="
        p-4
        border-t
        border-slate-800/60
        "
      >



        <div
          className="
          bg-slate-900/60
          rounded-xl
          p-3
          mb-3
          border
          border-slate-800
          flex
          items-center
          gap-3
          "
        >


          <div
            className="
            w-8
            h-8
            rounded-full
            bg-slate-800
            flex
            items-center
            justify-center
            text-xs
            font-bold
            text-cyan-400
            border
            border-cyan-500/30
            "
          >
            AD
          </div>




          <div
            className="
            flex-1
            overflow-hidden
            "
          >

            <p
              className="
              text-xs
              font-semibold
              text-slate-200
              truncate
              "
            >
              System Admin
            </p>


            <p
              className="
              text-[10px]
              text-slate-400
              truncate
              "
            >
              admin@sms.com
            </p>


          </div>



        </div>





        <button

          onClick={handleLogout}

          className="
          w-full
          flex
          items-center
          justify-center
          gap-2
          px-4
          py-2.5
          rounded-xl
          text-sm
          font-medium
          text-rose-400
          hover:text-rose-300
          hover:bg-rose-500/10
          transition-colors
          border
          border-rose-500/20
          "

        >


          <LogOut
            className="w-4 h-4"
          />


          Sign Out


        </button>



      </div>



    </aside>

  );

}