'use client';

import React from 'react';
import { Quote, Sparkles } from 'lucide-react';

export const PastoralMessageSection: React.FC = () => {
  return (
    <section id="vicar-message" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-sky-800 bg-sky-100 px-3.5 py-1 rounded-full border border-sky-200">
            Pastoral Heart
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3 tracking-tight">
            Message from Our Pastoral Leadership
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Spiritual guidance, pastoral blessings, and words of encouragement for our Pallikkunnu parish family.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Vicar's Pastoral Letter (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-6 right-6 text-slate-100 pointer-events-none">
              <Quote className="w-20 h-20" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Vicar&apos;s Pastoral Address
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Dear Parishioners & Friends in Christ,
              </h3>

              <div className="space-y-3.5 text-slate-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Peace and divine grace to each of you in the holy name of our Lord Jesus Christ and through the maternal intercession of Our Lady of the Assumption!
                </p>
                <p>
                  Welcome to the official digital portal of our beloved Assumption Church, Pallikkunnu. Established in 1875, our parish has stood as a beacon of prayer, faith, and mutual love in Varandarappilly. Whether you are actively attending daily Holy Qurbana, a youth member, or one of our parishioners residing abroad, this website connects us as one Eucharistic family.
                </p>
                <p>
                  Here you will find our latest Holy Mass timings, novena schedules, parish feast celebrations (Thirunal), and altar intention requests. May Our Lady of Assumption wrap our families in her protective mantle.
                </p>
              </div>
            </div>

            {/* Vicar Signature Block */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"
                  alt="Fr. Vicar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">
                  Fr. Davis Chittilappilly
                </h4>
                <p className="text-xs text-sky-800 font-semibold">
                  Vicar & Parish Priest
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Our Lady of Assumption Church, Pallikkunnu
                </p>
              </div>
            </div>
          </div>

          {/* Archbishop's Blessing (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-7 sm:p-9 shadow-lg border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
                Episcopal Blessing
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Archbishop&apos;s Message
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed italic">
                &ldquo;It is a joy to witness Our Lady of Assumption Parish, Pallikkunnu embrace modern digital tools to unite the faithful and announce the Gospel. May this parish portal strengthen fellowship across all family units, deepen love for the Holy Eucharist, and spread Christ&apos;s peace across Thrissur Archdiocese.&rdquo;
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
                  alt="Archbishop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">
                  Mar Andrews Thazhath
                </h4>
                <p className="text-xs text-sky-300 font-semibold">
                  Archbishop of Trichur
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Syro-Malabar Catholic Archdiocese
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
