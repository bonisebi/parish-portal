'use client';

import React from 'react';
import { Clergy } from '@/types';
import { Phone, Mail, Clock, ShieldCheck, User } from 'lucide-react';

interface ClergySectionProps {
  clergyList: Clergy[];
}

export const ClergySection: React.FC<ClergySectionProps> = ({ clergyList }) => {
  return (
    <section id="clergy" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-sky-800 bg-sky-100 px-3.5 py-1 rounded-full border border-sky-200">
            Pastoral Leadership
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3 tracking-tight">
            Clergy & Priests Directory
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Our pastoral team is dedicated to guiding our spiritual community, administering the holy sacraments, and offering pastoral counseling.
          </p>
        </div>

        {/* Clergy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {clergyList.map((priest) => (
            <div
              key={priest.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row gap-6 items-start hover:border-sky-300"
            >
              {/* Photo */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 mx-auto sm:mx-0 flex items-center justify-center relative shadow-xs">
                {priest.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={priest.photo_url}
                    alt={priest.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1 space-y-3 text-center sm:text-left min-w-0">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-850 border border-sky-200 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    {priest.role}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {priest.name}
                  </h3>
                  <p className="text-xs font-semibold text-sky-700">
                    {priest.designation}
                  </p>
                </div>

                {priest.bio && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {priest.bio}
                  </p>
                )}

                {/* Contact & Hours */}
                <div className="space-y-1.5 pt-2.5 border-t border-slate-100 text-xs text-slate-600">
                  {priest.phone && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${priest.phone}`} className="hover:text-sky-700 font-bold truncate">
                        {priest.phone}
                      </a>
                    </div>
                  )}
                  {priest.email && (
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${priest.email}`} className="hover:text-sky-700 truncate font-medium">
                        {priest.email}
                      </a>
                    </div>
                  )}
                  {priest.visiting_hours && (
                    <div className="flex items-start justify-center sm:justify-start gap-2 text-slate-500 pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>Office: {priest.visiting_hours}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
