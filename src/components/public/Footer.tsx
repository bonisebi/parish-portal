'use client';

import React from 'react';
import Link from 'next/link';
import { ParishProfile } from '@/types';
import { Church, MapPin, Phone, Mail, Clock, Lock, HeartHandshake } from 'lucide-react';

interface FooterProps {
  profile: ParishProfile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Santhome-Style Scripture Quote & Giving Banner in Marian Blue */}
        <div className="mb-14 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-slate-850 via-sky-950/70 to-slate-850 border border-sky-800/40 shadow-lg text-center max-w-4xl mx-auto space-y-3">
          <p className="font-medium text-base sm:text-xl text-slate-100 italic leading-relaxed">
            &ldquo;Whoever is generous to the poor lends to the Lord, and He will repay him for his deed.&rdquo;
          </p>
          <div className="text-xs font-bold text-sky-400 tracking-wider uppercase">
            — Proverbs 19:17
          </div>
          <div className="pt-2">
            <a
              href="#prayer-intentions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-sm shadow-sky-600/30 active:scale-95"
            >
              <HeartHandshake className="w-4 h-4" />
              Support Parish Ministries & Offerings
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                <Church className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Assumption Church
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Patron Saint: {profile.patron_saint}. Founded in {profile.established}. Archdiocese of Trichur. A vibrant Catholic community rooted in prayer, sacramental grace, and Christian charity.
            </p>
            <div className="text-xs text-sky-400 font-semibold">
              Liturgical Season: {profile.liturgical_season}
            </div>
          </div>

          {/* Col 2: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase text-sky-400">
              Parish Office & Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{profile.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${profile.phone}`} className="hover:text-white transition font-medium">
                  {profile.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:text-white transition font-medium">
                  {profile.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Parish Office Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase text-sky-400">
              Office Hours & Sacraments
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Parish Office:</span>
                  <div>Tuesday to Saturday: 09:00 AM - 01:00 PM & 04:00 PM - 06:30 PM</div>
                  <div>Monday: Office Closed</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Confessions:</span>
                  <div>Saturdays from 04:30 PM, or anytime upon personal request.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase text-sky-400">
              Parish Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#mass-timings" className="hover:text-sky-400 transition">
                  → Holy Mass Schedules
                </a>
              </li>
              <li>
                <a href="#vicar-message" className="hover:text-sky-400 transition">
                  → Vicar&apos;s Pastoral Address
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-sky-400 transition">
                  → Assumption Feast & Thirunal
                </a>
              </li>
              <li>
                <a href="#clergy" className="hover:text-sky-400 transition">
                  → Pastoral Clergy Team
                </a>
              </li>
              <li>
                <a href="#prayer-intentions" className="hover:text-sky-400 transition">
                  → Submit Altar Prayer Petition
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-sky-300 transition"
                >
                  <Lock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Executive Admin CMS</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 {profile.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built for the Church Community</span>
            <span>•</span>
            <Link href="/admin" className="hover:text-slate-300">
              Executive Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
