'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import StudentModal from '../../components/StudentModal';
import EmailModal from '../../components/EmailModal';

import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';

import {
  fetchStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from '../../lib/api';

import { Student } from '../../types';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch(error) {
      console.error("Failed loading students", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSaveStudent = async(studentData: Partial<Student>) => {
    try {
      if(editingStudent?.id){
        const updated = await updateStudent(editingStudent.id, studentData);
        setStudents(prev =>
            prev.map(student =>
                student.id === editingStudent.id ? { ...student, ...updated } : student
            )
        );
      } else {
        const created = await createStudent(studentData as Omit<Student,'id'>);
        setStudents(prev => [created, ...prev]);
      }

      setIsModalOpen(false);
      setEditingStudent(null);
    } catch(error){
      console.error("Save student error", error);
    }
  };

  const handleDelete = async(id: number) => {
    const confirmDelete = window.confirm("Delete this student?");
    if(!confirmDelete) return;

    try{
      await deleteStudent(id);
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch(error){
      console.error("Delete error", error);
    }
  };

  const filteredStudents = students.filter(student => {
    const search = searchTerm.toLowerCase();
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();

    return (
        fullName.includes(search) ||
        student.studentIdNumber.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.phone.toLowerCase().includes(search) ||
        student.department.toLowerCase().includes(search)
    );
  });

  return (
      <div className="flex min-h-screen bg-slate-50 text-slate-800">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
              title="Student Management"
              description="Manage registered students"
              onOpenEmail={() => setIsEmailModalOpen(true)}
          />

          <main className="p-6 space-y-6 overflow-y-auto">
            {/* Search & Actions Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-auto sm:min-w-[280px]">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search student..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <button
                  onClick={() => {
                    setEditingStudent(null);
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-4 py-2.5 rounded-xl text-white font-medium text-xs shadow-md shadow-indigo-500/10 transition-all"
              >
                <Plus size={16}/>
                Add Student
              </button>
            </div>

            {/* Students Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-slate-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4 text-left">Student ID</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Phone</th>
                    <th className="p-4 text-left">Department</th>
                    <th className="p-4 text-left">Enrollment Date</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(student => (
                      <tr
                          key={student.id}
                          className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="p-4 text-indigo-600 font-mono font-medium">
                          {student.studentIdNumber}
                        </td>

                        <td className="p-4 font-medium text-slate-900">
                          {student.firstName} {student.lastName}
                        </td>

                        <td className="p-4 text-slate-600">
                          <div className="flex gap-1.5 items-center">
                            <Mail size={14} className="text-slate-400" />
                            {student.email}
                          </div>
                        </td>

                        <td className="p-4 text-slate-600">
                          <div className="flex gap-1.5 items-center">
                            <Phone size={14} className="text-slate-400" />
                            {student.phone}
                          </div>
                        </td>

                        <td className="p-4 text-slate-700">
                          {student.department}
                        </td>

                        <td className="p-4 text-slate-500">
                          {student.enrollmentDate}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            student.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {student.status}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-1.5 justify-center">
                            <button
                                onClick={() => {
                                  setEditingStudent(student);
                                  setIsModalOpen(true);
                                }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 p-2 rounded-lg transition-colors"
                                title="Edit Student"
                            >
                              <Edit3 size={15}/>
                            </button>

                            <button
                                onClick={() => handleDelete(student.id)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-lg transition-colors"
                                title="Delete Student"
                            >
                              <Trash2 size={15}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          <StudentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveStudent}
              initialData={editingStudent}
          />

          <EmailModal
              isOpen={isEmailModalOpen}
              onClose={() => setIsEmailModalOpen(false)}
          />
        </div>
      </div>
  );
}