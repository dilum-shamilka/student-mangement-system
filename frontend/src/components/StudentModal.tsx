'use client';

import React, { useEffect, useState } from "react";
import { Student } from "@/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (student: Partial<Student>) => void;
    initialData?: Student | null;
}

export default function StudentModal({
                                         isOpen,
                                         onClose,
                                         onSave,
                                         initialData,
                                     }: Props) {
    const [form, setForm] = useState<Partial<Student>>({});

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            setForm({
                studentIdNumber: "",
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                department: "Software Engineering",
                status: "ACTIVE",
                enrollmentDate: new Date().toISOString().split("T")[0],
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const change = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <form
                onSubmit={submit}
                className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-3"
            >
                <h2 className="text-xl font-bold text-white">
                    {initialData ? "Edit Student" : "Add Student"}
                </h2>

                {/* Text Inputs */}
                {["studentIdNumber", "firstName", "lastName", "email", "phone"].map(
                    (field) => (
                        <div key={field} className="space-y-1">
                            <label className="text-xs text-slate-400 capitalize">
                                {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                                name={field}
                                value={(form as any)[field] || ""}
                                onChange={change}
                                placeholder={`Enter ${field}`}
                                className="w-full bg-slate-800 text-white rounded-xl px-4 py-2 outline-none border border-slate-700 focus:border-cyan-500 text-sm"
                            />
                        </div>
                    )
                )}

                {/* Enrollment Date Input */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400">Enrollment Date</label>
                    <input
                        type="date"
                        name="enrollmentDate"
                        value={form.enrollmentDate || ""}
                        onChange={change}
                        className="w-full bg-slate-800 text-white rounded-xl px-4 py-2 outline-none border border-slate-700 focus:border-cyan-500 text-sm"
                    />
                </div>

                {/* Department Select */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400">Department</label>
                    <select
                        name="department"
                        value={form.department || "Software Engineering"}
                        onChange={change}
                        className="w-full bg-slate-800 text-white rounded-xl px-4 py-2 outline-none border border-slate-700 text-sm"
                    >
                        <option>Computer Science</option>
                        <option>Software Engineering</option>
                        <option>Information Technology</option>
                        <option>Cyber Security</option>
                        <option>Data Science</option>
                    </select>
                </div>

                {/* Status Select */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400">Status</label>
                    <select
                        name="status"
                        value={form.status || "ACTIVE"}
                        onChange={change}
                        className="w-full bg-slate-800 text-white rounded-xl px-4 py-2 outline-none border border-slate-700 text-sm"
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 transition-colors text-white py-2 rounded-xl font-medium mt-2"
                >
                    Save Student
                </button>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-slate-700 hover:bg-slate-600 transition-colors text-white py-2 rounded-xl font-medium"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}