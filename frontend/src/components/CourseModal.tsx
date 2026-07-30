'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, Check } from 'lucide-react';
import { Course } from '../types';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Partial<Course>) => void;
  initialData?: Course | null;
}

export default function CourseModal({ isOpen, onClose, onSave, initialData }: CourseModalProps) {
  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    description: '',
    credits: 3,
    instructor: '',
    department: 'Computer Science',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        courseCode: initialData.courseCode || '',
        title: initialData.title || '',
        description: initialData.description || '',
        credits: initialData.credits || 3,
        instructor: initialData.instructor || '',
        department: initialData.department || 'Computer Science',
      });
    } else {
      setFormData({
        courseCode: '',
        title: '',
        description: '',
        credits: 3,
        instructor: '',
        department: 'Computer Science',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Partial<Course>);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-slate-800 p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {initialData ? 'Edit Course Details' : 'Add New Course'}
              </h2>
              <p className="text-xs text-slate-400">Configure academic course information</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Course Code</label>
              <input
                type="text"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                placeholder="CS101"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                required
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Course Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              placeholder="Full Stack Web Development"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Instructor</label>
              <input
                type="text"
                required
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                placeholder="Prof. Grace Hopper"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none resize-none"
              placeholder="Brief course overview..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-indigo-500 to-cyan-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-cyan-500 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {initialData ? 'Update Course' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
