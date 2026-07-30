'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import StudentModal from '../../components/StudentModal';
import EmailModal from '../../components/EmailModal'; // 1. EmailModal එක ඉම්පෝට් කරන්න

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
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // 2. Email Modal එක සඳහා state එකක් එකතු කරන්න
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
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* 3. Header එකට onOpenEmail prop එක ලබා දෙන්න */}
          <Header
              title="Student Management"
              description="Manage registered students"
              onOpenEmail={() => setIsEmailModalOpen(true)}
          />

          <main className="p-6 space-y-6">
            <div className="glass-card rounded-2xl p-4 flex justify-between items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search student..."
                    className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none"
                />
              </div>

              <button
                  onClick={() => {
                    setEditingStudent(null);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded-xl text-white"
              >
                <Plus size={16}/>
                Add Student
              </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="p-4 text-left">Student ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Department</th>
                  <th className="p-4 text-left">Enrollment Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
                </thead>

                <tbody>
                {filteredStudents.map(student => (
                    <tr
                        key={student.id}
                        className="border-t border-slate-800 hover:bg-slate-900"
                    >
                      <td className="p-4 text-cyan-400 font-mono">
                        {student.studentIdNumber}
                      </td>

                      <td className="p-4 text-white">
                        {student.firstName} {student.lastName}
                      </td>

                      <td className="p-4 text-slate-300">
                        <div className="flex gap-2 items-center">
                          <Mail size={14}/>
                          {student.email}
                        </div>
                      </td>

                      <td className="p-4 text-slate-300">
                        <div className="flex gap-2 items-center">
                          <Phone size={14}/>
                          {student.phone}
                        </div>
                      </td>

                      <td className="p-4 text-slate-300">
                        {student.department}
                      </td>

                      <td className="p-4 text-slate-300">
                        {student.enrollmentDate}
                      </td>

                      <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                        {student.status}
                      </span>
                      </td>

                      <td className="p-4 flex gap-2 justify-center">
                        <button
                            onClick={() => {
                              setEditingStudent(student);
                              setIsModalOpen(true);
                            }}
                            className="bg-slate-800 p-2 rounded-lg text-white"
                        >
                          <Edit3 size={15}/>
                        </button>

                        <button
                            onClick={() => handleDelete(student.id)}
                            className="bg-red-500/20 text-red-400 p-2 rounded-lg"
                        >
                          <Trash2 size={15}/>
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </main>

          <StudentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveStudent}
              initialData={editingStudent}
          />

          {/* 4. Email Modal එක මෙහි render කරන්න */}
          <EmailModal
              isOpen={isEmailModalOpen}
              onClose={() => setIsEmailModalOpen(false)}
          />
        </div>
      </div>
  );
}