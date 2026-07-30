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

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      const response = await api.post<AuthResponse>(endpoint, formData);
      const authData = response.data;

      if (authData?.token) {
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData));
        router.push("/dashboard");
      } else {
        setError("Invalid server response");
      }
    } catch (err: any) {
      console.error("Authentication Error:", err);

      if (err.response) {
        setError(
          err.response.data?.message ||
          err.response.data ||
          "Invalid email or password"
        );
      } else if (err.request) {
        setError("Cannot connect to server. Please start Spring Boot backend.");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-800">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
            AcademiaSMS Portal
          </h1>

          <p className="text-xs text-slate-500 mt-2 font-medium">
            {isRegister ? "Create your account" : "Sign in to dashboard"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  placeholder="Admin User"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                placeholder="admin@sms.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-sm flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.99] transition-all disabled:opacity-70 mt-2"
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                {isRegister ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
          className="mt-6 text-xs text-slate-500 hover:text-indigo-600 font-medium w-full text-center transition-colors"
        >
          {isRegister ? "Already have account? Login" : "Create new account"}
        </button>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-600" />
          <span>JWT Spring Boot Security</span>
        </div>
      </div>
    </div>
  );
}