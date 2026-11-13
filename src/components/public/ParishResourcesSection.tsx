'use client';

import React from 'react';
import { FileText, BookOpen, UserPlus, Heart, ArrowRight } from 'lucide-react';

export const ParishResourcesSection: React.FC = () => {
  const resources = [
    {
      title: 'Parish Weekly Notice',
      subtitle: 'Sunday Bulletin & Announcements',
      desc: 'Read or download the complete weekly parish announcements, scripture reflections, and holy mass intentions schedule.',
      icon: FileText,
      actionText: 'View Weekly Bulletin',
      href: '#mass-timings',
      tag: 'Weekly PDF',
    },
    {
      title: 'Parish Diary & Calendar',
      subtitle: 'Liturgical Feast Cycles & Ward Dates',
      desc: 'Stay informed about upcoming novenas, family ward prayer meetings, first communions, and catechism exam schedules.',
      icon: BookOpen,
      actionText: 'Explore Calendar',
      href: '#events',
      tag: 'Calendar',
    },
    {
      title: 'Join the Parish Family',
      subtitle: 'New Parishioner & Ward Registration',
      desc: 'Recently moved to Pallikkunnu or Varandarappilly? Register your family with our parish census and connect with your local ward unit.',
      icon: UserPlus,
      actionText: 'Register Family Unit',
      href: '#contact',
      tag: 'Registration',
    },
    {
      title: 'Pious Associations & Ministries',
      subtitle: 'St. Vincent de Paul, KCYM & Choir',
      desc: 'Discover active parish organizations: Sunday Catechism, Youth Movement, Altar Servers Guild, Mothers Forum, and Charity care.',
      icon: Heart,
      actionText: 'Discover Ministries',
      href: '#contact',
      tag: 'Ministries',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-sky-800 bg-sky-100 px-3.5 py-1 rounded-full border border-sky-200">
            Parish Life
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3 tracking-tight">
            Parish Services & Quick Portals
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Essential tools for Pallikkunnu parishioners and families to stay engaged, access bulletins, and register for parish life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between group hover:border-sky-400 hover:bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-sky-800 transition">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-sky-700 mb-2">
                    {item.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-200/60">
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition group-hover:translate-x-1"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
