'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import { Users, BookOpen, Building2, UserCheck, Plus, ArrowRight, GraduationCap } from 'lucide-react';
import { fetchDashboardStats, fetchStudents, fetchCourses } from '@/lib/api';
import { Course, DashboardStats, Student } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, studentsData, coursesData] = await Promise.all([
          fetchDashboardStats(),
          fetchStudents(),
          fetchCourses(),
        ]);
        setStats(statsData);
        setStudents(studentsData);
        setCourses(coursesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="System Dashboard" description="Overview of academic metrics and student operations" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Enrolled"
              value={stats?.totalStudents || 0}
              subtitle="Registered Students"
              icon={Users}
              trend="12%"
              color="cyan"
            />
            <StatCard
              title="Active Students"
              value={stats?.activeStudents || 0}
              subtitle="Currently Attending"
              icon={UserCheck}
              trend="8%"
              color="emerald"
            />
            <StatCard
              title="Active Courses"
              value={stats?.totalCourses || 0}
              subtitle="Offered this Semester"
              icon={BookOpen}
              color="indigo"
            />
            <StatCard
              title="Departments"
              value={stats?.totalDepartments || 0}
              subtitle="Academic Divisions"
              icon={Building2}
              color="amber"
            />
          </div>

          {/* Department Breakdown & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department Breakdown Progress Bars */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-100">Students by Department</h2>
                  <p className="text-xs text-slate-400">Distribution across major academic disciplines</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                  Updated Live
                </span>
              </div>

              <div className="space-y-4">
                {stats?.studentsByDepartment &&
                  Object.entries(stats.studentsByDepartment).map(([dept, count]) => {
                    const total = stats.totalStudents || 1;
                    const percentage = Math.round((count / total) * 100);

                    return (
                      <div key={dept} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-300">{dept}</span>
                          <span className="font-mono text-slate-400">
                            {count} students ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 mb-1">Quick Operations</h2>
                <p className="text-xs text-slate-400 mb-5">Frequently accessed administrative tasks</p>

                <div className="space-y-3">
                  <Link
                    href="/students"
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <span>Manage Students Directory</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/courses"
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span>Manage Academic Courses</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">

              </div>
            </div>
          </div>

          {/* Recent Enrolled Students Preview */}
          <div className="glass-card rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-100">Recent Student Enrolments</h2>
                <p className="text-xs text-slate-400">Latest active student registrations</p>
              </div>
              <Link
                href="/students"
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View All Directory <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Student ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Department</th>
                    <th className="p-3 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {students.slice(0, 5).map((student) => (
                    <tr key={student.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-mono font-medium text-cyan-400">{student.studentIdNumber}</td>
                      <td className="p-3 font-medium text-slate-200">{student.firstName} {student.lastName}</td>
                      <td className="p-3 text-slate-400">{student.email}</td>
                      <td className="p-3 text-slate-300">{student.department}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          student.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
