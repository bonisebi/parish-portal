'use client';

import React from 'react';
import { ParishEvent } from '@/types';
import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react';

interface EventsSectionProps {
  events: ParishEvent[];
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  const publishedEvents = events.filter((e) => e.status === 'Published');
  const highlighted = publishedEvents.find((e) => e.is_highlight);
  const otherEvents = publishedEvents.filter((e) => e.id !== highlighted?.id);

  // Helper to extract day and month for date badge
  const parseDateBadge = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        return { day: '15', month: 'AUG' };
      }
      const day = d.getDate().toString().padStart(2, '0');
      const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      return { day, month };
    } catch {
      return { day: '15', month: 'AUG' };
    }
  };

  return (
    <section id="events" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-sky-800 bg-sky-100 px-3.5 py-1 rounded-full border border-sky-200">
            Parish Celebrations
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3 tracking-tight">
            Upcoming Feasts & Events
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Celebrate faith, fellowship, and Marian devotion. Join us for novenas, solemn feasts (Thirunal), and community ministries at Pallikkunnu.
          </p>
        </div>

        {/* Featured Feast Banner (Assumption Feast) */}
        {highlighted && (
          <div className="mb-12 rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 text-white p-7 sm:p-10 shadow-xl border border-sky-500/25 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  Featured Annual Thirunal
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {highlighted.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {highlighted.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-xs font-semibold">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <span>{highlighted.date_display}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-xs font-medium">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>{highlighted.time_display}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-xs font-medium">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    <span>{highlighted.venue}</span>
                  </div>
                </div>
              </div>

              {/* Church Façade Thumbnail in Banner */}
              <div className="lg:col-span-4 hidden lg:block">
                <div className="rounded-2xl overflow-hidden border border-sky-400/30 shadow-lg aspect-4/3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/church-facade.jpg"
                    alt="Assumption Feast Shrine"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Other Events with Calendar Date Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherEvents.map((event) => {
            const badge = parseDateBadge(event.start_date);
            return (
              <div
                key={event.id}
                className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition hover:border-sky-400 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Big Calendar Date Badge in Marian Light Blue */}
                    <div className="w-14 h-15 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 flex flex-col items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition">
                      <span className="text-[10px] uppercase font-bold tracking-wider">
                        {badge.month}
                      </span>
                      <span className="text-xl font-extrabold leading-none mt-0.5">
                        {badge.day}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                    {event.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="font-semibold text-slate-900">{event.date_display}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{event.time_display}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
