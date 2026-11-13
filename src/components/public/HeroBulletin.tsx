'use client';

import React from 'react';
import { ParishProfile } from '@/types';
import { Bell, Sparkles, Clock, HeartHandshake, MapPin } from 'lucide-react';

interface HeroBulletinProps {
  profile: ParishProfile;
}

export const HeroBulletin: React.FC<HeroBulletinProps> = ({ profile }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-sky-950 to-slate-900 text-white pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Global Notice / Bulletin Bar */}
        {profile.bulletin_note && (
          <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-100 flex items-start gap-3.5 backdrop-blur-xs shadow-lg">
            <span className="p-2 rounded-xl bg-sky-500/25 text-sky-300 shrink-0 mt-0.5">
              <Bell className="w-4 h-4 animate-pulse" />
            </span>
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-extrabold text-sky-300 mr-2 uppercase tracking-wider text-[11px] sm:text-xs">
                Parish Announcement:
              </strong>
              {profile.bulletin_note}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-900/40 border border-sky-700/60 text-sky-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Patron: {profile.patron_saint}</span>
              <span className="text-sky-600">•</span>
              <span>Est. {profile.established}</span>
            </div>

            <div className="space-y-1">
              <span className="text-sm sm:text-base font-semibold text-sky-300 tracking-wide block">
                Welcome to
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Our Lady of Assumption Church <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-400 to-blue-200 text-2xl sm:text-4xl lg:text-4xl xl:text-5xl">
                  Pallikkunnu
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
              {profile.tagline}. Under the Archdiocese of Trichur, serving our faith community in Varandarappilly with prayer and service.
            </p>

            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{profile.address}</span>
            </div>

            <div className="pt-2 flex flex-wrap gap-3 sm:gap-4">
              <a
                href="#mass-timings"
                className="inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-sky-600/30 active:scale-95"
              >
                <Clock className="w-4 h-4" />
                Holy Mass Schedules
              </a>
              <a
                href="#prayer-intentions"
                className="inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition active:scale-95 hover:border-sky-500/50"
              >
                <HeartHandshake className="w-4 h-4 text-sky-400" />
                Submit Altar Petitions
              </a>
            </div>
          </div>

          {/* Hero Church Façade Image Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl p-2 bg-gradient-to-b from-sky-400/30 via-slate-800/50 to-sky-600/20 border border-sky-400/30 shadow-2xl backdrop-blur-md">
              <div className="rounded-2xl overflow-hidden bg-slate-900 relative aspect-4/3 sm:aspect-square lg:aspect-4/3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/church-facade.jpg"
                  alt="Assumption Church Pallikkunnu Façade"
                  className="w-full h-full object-cover object-top hover:scale-103 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm">
                      Assumption Church, Pallikkunnu
                    </div>
                    <div className="text-[11px] text-sky-300 font-medium">
                      Archdiocese of Trichur • Varandarappilly
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    Est. 1875
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
