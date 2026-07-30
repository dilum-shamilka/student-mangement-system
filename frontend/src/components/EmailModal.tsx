'use client';

import React, { useState } from 'react';
import { X, Send, Mail } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSuccessMessage('');

    try {
      // මෙහිදී ඔබේ Backend API එකට ඊමේල් දත්ත යැවීමට කෝඩ් එක ලියන්න පුළුවන්.
      // උදාහරණයක් ලෙස: await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ recipient, subject, message }) });

      // දැනට සිමියුලේට් කිරීමට setTimeout එකක් පාවිච්චි කරමු:
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage('Email sent successfully!');
      setRecipient('');
      setSubject('');
      setMessage('');

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Failed to send email', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">

          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Mail className="w-5 h-5 text-cyan-400" />
              <h2>Send Email to Student</h2>
            </div>
            <button
                onClick={onClose}
                className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {successMessage && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm p-3 rounded-xl text-center font-medium">
                {successMessage}
              </div>
          )}

          {/* Form */}
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Recipient Email</label>
              <input
                  type="email"
                  required
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 outline-none border border-slate-700 focus:border-cyan-500 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Subject</label>
              <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 outline-none border border-slate-700 focus:border-cyan-500 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Message</label>
              <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full bg-slate-800 text-white rounded-xl px-4 py-2.5 outline-none border border-slate-700 focus:border-cyan-500 text-sm resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </form>

        </div>
      </div>
  );
}