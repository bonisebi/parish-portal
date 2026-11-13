'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService, AdminUser } from '@/lib/authService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  Church,
  LayoutDashboard,
  Clock,
  Calendar,
  Users,
  HeartHandshake,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

function SidebarNav() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      href: '/admin?tab=overview',
    },
    {
      id: 'masses',
      label: 'Mass Timings Schedule',
      icon: Clock,
      href: '/admin?tab=masses',
    },
    {
      id: 'events',
      label: 'Feasts & Events',
      icon: Calendar,
      href: '/admin?tab=events',
    },
    {
      id: 'clergy',
      label: 'Clergy & Priests',
      icon: Users,
      href: '/admin?tab=clergy',
    },
    {
      id: 'prayers',
      label: 'Altar Prayer Inbox',
      icon: HeartHandshake,
      href: '/admin?tab=prayers',
    },
    {
      id: 'profile',
      label: 'Parish Profile & Bulletin',
      icon: Settings,
      href: '/admin?tab=profile',
    },
  ];

  return (
    <nav className="p-3 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              isActive
                ? 'bg-sky-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(pathname !== '/admin/login');

  useEffect(() => {
    if (pathname === '/admin/login') return;

    let isMounted = true;
    async function verifyAuth() {
      const sessionUser = await authService.getSessionUser();
      if (!isMounted) return;
      if (!sessionUser) {
        router.push('/admin/login');
      } else {
        setUser(sessionUser);
      }
      setLoading(false);
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-stone-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">Securing Parish CMS Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-200 flex flex-col justify-between shrink-0 border-r border-stone-800">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                <Church className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-white">Parish CMS</h1>
                <p className="text-[11px] text-slate-400">Assumption Church Pallikkunnu</p>
              </div>
            </div>
          </div>

          {/* User info badge */}
          <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold border border-sky-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">
                {user?.email}
              </div>
              <div className="text-[10px] flex items-center gap-1.5 font-medium mt-0.5">
                {user?.isSupabaseAuth ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Authenticated (Supabase JWT)
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">
                    ● Local Session
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links with Suspense */}
          <Suspense fallback={<div className="p-4 text-xs text-slate-500">Loading menu...</div>}>
            <SidebarNav />
          </Suspense>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          {!isSupabaseConfigured && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>Demo Storage Active. Add Supabase keys to connect live database.</span>
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Website
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out CMS
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
