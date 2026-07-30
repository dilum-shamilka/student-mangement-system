'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CourseModal from '../../components/CourseModal';
import { BookOpen, Plus, Search, Edit3, Trash2, User, Award } from 'lucide-react';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../../lib/api';
import { Course } from '../../types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const loadCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    if (editingCourse) {
      const updated = await updateCourse(editingCourse.id, courseData);
      setCourses(courses.map((c) => (c.id === editingCourse.id ? { ...c, ...updated } : c)));
    } else {
      const created = await createCourse(courseData as Omit<Course, 'id'>);
      setCourses([created, ...courses]);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Course Management" description="Academic curriculum, module details, and instructor allocations" />

        <main className="p-6 space-y-6 overflow-y-auto">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search course code, title, instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={() => {
                setEditingCourse(null);
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium text-xs shadow-md shadow-indigo-500/10 hover:from-indigo-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Course
            </button>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md flex flex-col justify-between relative group hover:border-slate-300 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                      {course.courseCode}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      <Award className="w-3 h-3 text-amber-500" />
                      {course.credits} Credits
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{course.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{course.description}</p>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Instructor:</span>
                      <span className="font-medium flex items-center gap-1 text-slate-700">
                        <User className="w-3.5 h-3.5 text-cyan-600" /> {course.instructor}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-medium text-slate-700">{course.department}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingCourse(course);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Edit Course"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCourse}
          initialData={editingCourse}
        />
      </div>
    </div>
  );
}