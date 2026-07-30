'use client';

import React, { useState, useEffect } from 'react';
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

  // User details සඳහා state එකක්
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    // localStorage එකෙන් user දත්ත ලබා ගැනීම
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data from localStorage', error);
        }
      }
    }
  }, []);

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

  // Name එකෙන් මුල් අකුරු (Initials) සදා ගැනීම (උදා: "System Admin" -> "SA")
  const getInitials = (name?: string) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside
      className="
      hidden
      md:flex
      w-64
      bg-white
      border-r
      border-slate-200
      shadow-sm
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
          border-slate-100
          gap-3
          "
        >
          <div
            className="
            w-9
            h-9
            rounded-xl
            bg-gradient-to-tr
            from-indigo-600
            to-violet-600
            flex
            items-center
            justify-center
            shadow-lg
            shadow-indigo-500/20
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
              text-slate-900
              "
            >
              DSP ACADEMY
            </h1>

            <p
              className="
              text-[10px]
              text-slate-500
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
              const isActive = pathname === item.href;

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
                      from-indigo-50
                      to-indigo-100/50
                      text-indigo-600
                      border
                      border-indigo-200/60
                      shadow-sm
                      shadow-indigo-500/5
                      `
                      :
                      `
                      text-slate-600
                      hover:text-slate-900
                      hover:bg-slate-100/80
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
                      'text-indigo-600'
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
        border-slate-100
        "
      >
        <div
          className="
          bg-slate-50
          rounded-xl
          p-3
          mb-3
          border
          border-slate-200/80
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
            bg-indigo-100
            flex
            items-center
            justify-center
            text-xs
            font-bold
            text-indigo-600
            border
            border-indigo-200
            "
          >
            {getInitials(user?.name)}
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
              text-slate-800
              truncate
              "
            >
              {user?.name || 'System Admin'}
            </p>

            <p
              className="
              text-[10px]
              text-slate-500
              truncate
              "
            >
              {user?.email || 'admin@sms.com'}
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
          text-rose-600
          hover:text-rose-700
          hover:bg-rose-50
          transition-colors
          border
          border-rose-200
          hover:border-rose-300
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