'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ParishProfile } from '@/types';
import { Church, Menu, X, Shield, Clock, Calendar, Users, HeartHandshake, MapPin, MessageSquare } from 'lucide-react';

interface NavbarProps {
  profile: ParishProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Liturgical season styling
  const getSeasonConfig = (season: string) => {
    switch (season) {
      case 'Lent':
      case 'Advent':
        return {
          dot: 'bg-purple-600',
          badge: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      case 'Christmas':
      case 'Easter':
        return {
          dot: 'bg-amber-600',
          badge: 'bg-amber-50 text-amber-900 border-amber-300',
        };
      default:
        return {
          dot: 'bg-sky-500',
          badge: 'bg-sky-50 text-sky-800 border-sky-200',
        };
    }
  };

  const seasonStyle = getSeasonConfig(profile.liturgical_season);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Church Title */}
          <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-sky-700 text-white flex items-center justify-center shadow-md shadow-sky-600/25 group-hover:scale-102 transition border border-sky-400/30">
              <Church className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-nowrap">
                <span className="font-extrabold text-base sm:text-lg md:text-xl text-slate-900 tracking-tight leading-tight truncate">
                  Assumption Church
                </span>
                {/* Liturgical Season Tag (Desktop) */}
                <span
                  className={`hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${seasonStyle.badge}`}
                >
                  <span className={`w-2 h-2 rounded-full ${seasonStyle.dot}`} />
                  <span>{profile.liturgical_season}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5 font-medium">
                Pallikkunnu, Thrissur • Est. {profile.established}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items (Light Blue / Clean Santhome style) */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-semibold text-slate-700 whitespace-nowrap">
            <a
              href="#mass-timings"
              className="px-3.5 py-2 rounded-xl hover:text-sky-700 hover:bg-sky-50/70 flex items-center gap-1.5 transition"
            >
              <Clock className="w-4 h-4 text-sky-500" />
              Schedules
            </a>
            <a
              href="#vicar-message"
              className="px-3.5 py-2 rounded-xl hover:text-sky-700 hover:bg-sky-50/70 flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-4 h-4 text-sky-500" />
              Vicar&apos;s Message
            </a>
            <a
              href="#events"
              className="px-3.5 py-2 rounded-xl hover:text-sky-700 hover:bg-sky-50/70 flex items-center gap-1.5 transition"
            >
              <Calendar className="w-4 h-4 text-sky-500" />
              Thirunal & Events
            </a>
            <a
              href="#clergy"
              className="px-3.5 py-2 rounded-xl hover:text-sky-700 hover:bg-sky-50/70 flex items-center gap-1.5 transition"
            >
              <Users className="w-4 h-4 text-sky-500" />
              Clergy
            </a>
            <a
              href="#prayer-intentions"
              className="px-3.5 py-2 rounded-xl hover:text-sky-700 hover:bg-sky-50/70 flex items-center gap-1.5 transition"
            >
              <HeartHandshake className="w-4 h-4 text-sky-500" />
              Petitions
            </a>
            <a
              href="#contact"
              className="px-3.5 py-2 rounded-xl hover:text-sky-700 hover:bg-sky-50/70 flex items-center gap-1.5 transition"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              Contact
            </a>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            {/* Liturgical Season Tag on standard desktop */}
            <span
              className={`inline-flex 2xl:hidden items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border mr-1 ${seasonStyle.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${seasonStyle.dot}`} />
              <span>{profile.liturgical_season}</span>
            </span>

            {/* Admin Portal Button */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition shadow-sm hover:shadow active:scale-95 shadow-sky-600/20"
            >
              <Shield className="w-3.5 h-3.5" />
              Parish Admin
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <span
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${seasonStyle.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${seasonStyle.dot}`} />
              <span>{profile.liturgical_season}</span>
            </span>

            <Link
              href="/admin"
              className="p-2 text-slate-700 hover:text-sky-700 rounded-xl hover:bg-sky-50 border border-slate-200 text-xs"
              title="Parish Admin CMS"
            >
              <Shield className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus:outline-hidden transition"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5 text-sky-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {isOpen && (
          <div className="xl:hidden py-4 border-t border-slate-200 space-y-1.5 animate-fade-in">
            <div className="px-3.5 py-2 mb-2 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Liturgical Season:</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${seasonStyle.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${seasonStyle.dot}`} />
                {profile.liturgical_season}
              </span>
            </div>

            <a
              href="#mass-timings"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-sky-50 hover:text-sky-800 text-sm font-semibold transition"
            >
              <span className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-600" />
                Holy Mass Schedules
              </span>
              <span className="text-xs text-slate-400 font-medium">Timings</span>
            </a>

            <a
              href="#vicar-message"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-sky-50 hover:text-sky-800 text-sm font-semibold transition"
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                Vicar&apos;s Pastoral Address
              </span>
              <span className="text-xs text-slate-400 font-medium">Letter</span>
            </a>

            <a
              href="#events"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-sky-50 hover:text-sky-800 text-sm font-semibold transition"
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-sky-600" />
                Thirunal & Feasts
              </span>
              <span className="text-xs text-slate-400 font-medium">Events</span>
            </a>

            <a
              href="#clergy"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-sky-50 hover:text-sky-800 text-sm font-semibold transition"
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-sky-600" />
                Pastoral Clergy Team
              </span>
              <span className="text-xs text-slate-400 font-medium">Priests</span>
            </a>

            <a
              href="#prayer-intentions"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-sky-50 hover:text-sky-800 text-sm font-semibold transition"
            >
              <span className="flex items-center gap-2.5">
                <HeartHandshake className="w-4 h-4 text-sky-600" />
                Submit Altar Intention
              </span>
              <span className="text-xs text-slate-400 font-medium">Prayer</span>
            </a>

            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-800 hover:bg-sky-50 hover:text-sky-800 text-sm font-semibold transition"
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500" />
                Parish Office & Location
              </span>
              <span className="text-xs text-slate-400 font-medium">Pallikkunnu</span>
            </a>

            <div className="pt-2 border-t border-slate-200">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition shadow-sm shadow-sky-600/20"
              >
                <Shield className="w-4 h-4" />
                Executive Admin Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
