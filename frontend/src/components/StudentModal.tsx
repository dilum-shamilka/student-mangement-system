'use client';

import React, { useEffect, useState } from "react";
import { X, UserPlus, Check } from "lucide-react";
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
    const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

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
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const change = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error as user types
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const validate = () => {
        const newErrors: { email?: string; phone?: string } = {};

        // Email Validation
        if (form.email && form.email.trim() !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                newErrors.email = "Please enter a valid email address.";
            }
        } else {
            newErrors.email = "Email address is required.";
        }

        // Phone Validation
        if (form.phone && form.phone.trim() !== "") {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(form.phone)) {
                newErrors.phone = "Please enter a valid phone number.";
            }
        } else {
            newErrors.phone = "Phone number is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave(form);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200 text-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {initialData ? "Edit Student" : "Add Student"}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">Manage student details & status</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-3.5">
                    {/* Text Inputs */}
                    {["studentIdNumber", "firstName", "lastName", "email", "phone"].map(
                        (field) => {
                            const fieldError = errors[field as keyof typeof errors];
                            return (
                                <div key={field} className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-600 capitalize block">
                                        {field.replace(/([A-Z])/g, " $1")}
                                    </label>
                                    <input
                                        name={field}
                                        value={(form as any)[field] || ""}
                                        onChange={change}
                                        placeholder={`Enter ${field}`}
                                        className={`w-full bg-slate-50 text-slate-800 rounded-xl px-3.5 py-2 outline-none border text-xs placeholder-slate-400 transition-all ${
                                            fieldError
                                                ? "border-rose-300 bg-rose-50/50 focus:border-rose-500"
                                                : "border-slate-200 focus:border-indigo-500 focus:bg-white"
                                        }`}
                                    />
                                    {fieldError && (
                                        <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                                            {fieldError}
                                        </p>
                                    )}
                                </div>
                            );
                        }
                    )}

                    {/* Enrollment Date Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Enrollment Date</label>
                        <input
                            type="date"
                            name="enrollmentDate"
                            value={form.enrollmentDate || ""}
                            onChange={change}
                            className="w-full bg-slate-50 text-slate-800 rounded-xl px-3.5 py-2 outline-none border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs transition-all"
                        />
                    </div>

                    {/* Department Select */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Department</label>
                        <select
                            name="department"
                            value={form.department || "Software Engineering"}
                            onChange={change}
                            className="w-full bg-slate-50 text-slate-800 rounded-xl px-3.5 py-2 outline-none border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs transition-all"
                        >
                            <option value="Computer Science">Computer Science</option>
                            <option value="Software Engineering">Software Engineering</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="Data Science">Data Science</option>
                        </select>
                    </div>

                    {/* Status Select */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Status</label>
                        <select
                            name="status"
                            value={form.status || "ACTIVE"}
                            onChange={change}
                            className="w-full bg-slate-50 text-slate-800 rounded-xl px-3.5 py-2 outline-none border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs transition-all"
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-cyan-500 flex items-center justify-center gap-1.5 transition-all"
                        >
                            <Check className="w-4 h-4" />
                            Save Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}