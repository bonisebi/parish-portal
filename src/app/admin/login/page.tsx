'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/authService';
import { Shield, Lock, User, ArrowLeft, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect to /admin
  useEffect(() => {
    async function checkAuth() {
      const user = await authService.getSessionUser();
      if (user) {
        router.push('/admin');
      }
    }
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await authService.login(username, password);
    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMsg(res.error || 'Failed to sign in. Please check credentials.');
      setLoading(false);
    }
  };

  const handleQuickFillAndLogin = async () => {
    setUsername('admin');
    setPassword('admin');
    setLoading(true);
    setErrorMsg('');
    const res = await authService.login('admin', 'admin');
    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMsg(res.error || 'Login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30">
            <Shield className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-5 text-center text-2xl font-bold text-white tracking-tight">
          Parish Executive CMS
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Assumption Church Pallikkunnu Administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-slate-800">
          {/* Quick Access Credentials Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-sky-500/10 border border-sky-400/25 text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-sky-300">
                <KeyRound className="w-4 h-4 text-sky-400" />
                Parish Admin Sign In
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Simple Auth
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Username: <strong className="text-white">admin</strong></span>
              <span>Password: <strong className="text-white">admin</strong> / <strong className="text-white">admin123</strong></span>
            </div>
            <button
              type="button"
              onClick={handleQuickFillAndLogin}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-sky-600/25 hover:bg-sky-600/35 border border-sky-500/40 text-sky-200 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              Quick Sign In (admin / admin)
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-600/30 transition disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In with admin / admin'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Parish Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
