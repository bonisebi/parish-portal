'use client';

import React, { useState, useMemo } from 'react';
import { MassTiming } from '@/types';
import { Clock, Church, User, Info, Filter, Languages, Sparkles, Car } from 'lucide-react';

interface MassTimingsSectionProps {
  timings: MassTiming[];
}

export const MassTimingsSection: React.FC<MassTimingsSectionProps> = ({ timings }) => {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedLang, setSelectedLang] = useState<string>('All');

  const dayFilters = ['All', 'Sunday', 'Saturday Anticipated', 'Weekday', 'Special'];
  const languages = useMemo(() => {
    const set = new Set(timings.map((t) => t.language));
    return ['All', ...Array.from(set)];
  }, [timings]);

  const filtered = useMemo(() => {
    return timings.filter((item) => {
      const matchDay = selectedDay === 'All' || item.type === selectedDay;
      const matchLang = selectedLang === 'All' || item.language === selectedLang;
      return matchDay && matchLang;
    });
  }, [timings, selectedDay, selectedLang]);

  return (
    <section id="mass-timings" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-sky-800 bg-sky-100 px-3.5 py-1 rounded-full border border-sky-200">
            Church Schedules
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3 tracking-tight">
            Holy Mass & Sacramental Timings
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Join our Pallikkunnu parish community in Eucharistic celebration. Filter schedules by day or language.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-sky-50/50 p-4 sm:p-5 rounded-2xl border border-sky-100 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Day Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Day:
              </span>
              {dayFilters.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                    selectedDay === day
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white hover:bg-sky-100/70 text-slate-700 border border-slate-200'
                  }`}
                >
                  {day === 'All' ? 'All Schedules' : day}
                </button>
              ))}
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-sky-600" />
              <label htmlFor="lang-select" className="text-xs font-bold text-slate-700">
                Language:
              </label>
              <select
                id="lang-select"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-semibold"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'All' ? 'All Languages' : lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mass Schedule Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">No holy mass timings found matching the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between group hover:border-sky-400"
              >
                <div>
                  {/* Top Bar: Type & Language */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.type}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-sky-50 text-sky-800 border border-sky-200">
                      {item.language}
                    </span>
                  </div>

                  {/* Mass Time Highlight */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        {item.time_display}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{item.day_name}</div>
                    </div>
                  </div>

                  {/* Church Venue & Celebrant */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Church className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="font-semibold text-slate-800">{item.church}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Celebrant: <span className="font-semibold text-slate-800">{item.celebrant}</span></span>
                    </div>
                  </div>
                </div>

                {/* Optional Intention Note */}
                {item.intention_note && (
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-[11px] text-sky-950 bg-sky-50/70 p-2 rounded-xl border border-sky-200/60 leading-snug">
                    <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item.intention_note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Confession & Parking Notice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Confession Box */}
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-sky-900/50 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Sacrament of Reconciliation
                </span>
                <span className="text-xs text-sky-300/80 font-medium">Holy Confession</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
                Confession & Eucharistic Adoration
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span>Sundays:</span>
                  <span className="font-bold text-sky-300">10:00 AM – 11:00 AM</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span>First Fridays of the Month:</span>
                  <span className="font-bold text-sky-300">07:30 PM – 08:30 PM</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span>Saturdays (Prior to Evening Holy Mass):</span>
                  <span className="font-bold text-sky-300">04:30 PM – 05:15 PM</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic pt-4 mt-2">
              *Confession is always gladly available anytime upon personal request to Fr. Vicar.
            </p>
          </div>

          {/* Parish Notice & Campus Advisory */}
          <div className="bg-sky-50/70 rounded-3xl p-6 sm:p-8 border border-sky-200/80 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-200/80 text-sky-900 border border-sky-300 text-xs font-bold uppercase tracking-wider">
                <Car className="w-3.5 h-3.5 text-sky-800" />
                Parish Advisory & Parking
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Campus Guidelines for Parishioners
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Kindly park four-wheelers and two-wheelers inside the designated parish church ground and parish hall parking slots. Please avoid parking on the main road in Pallikkunnu to maintain clear traffic flow.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                  <span>Catechism students should assemble in the auditorium by 09:45 AM.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                  <span>Adoration Chapel is open 24 hours for silent prayer.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sky-200/70 text-xs text-sky-900 font-semibold">
              Thank you for keeping our church campus peaceful, reverent, and welcoming.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
