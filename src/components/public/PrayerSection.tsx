'use client';

import React, { useState } from 'react';
import { parishService } from '@/lib/parishService';
import { HeartHandshake, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const PrayerSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [intention, setIntention] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (!name.trim() || !intention.trim()) {
      setErrorMsg('Please enter your name and prayer intention.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await parishService.submitPrayerRequest({
        name: name.trim(),
        phone: phone.trim() || undefined,
        intention: intention.trim(),
      });
      setSuccess(true);
      setName('');
      setPhone('');
      setIntention('');
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not submit prayer petition. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="prayer-intentions" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-sky-50/80 via-white to-sky-50/40 rounded-3xl p-7 sm:p-12 border border-sky-200/90 shadow-md">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white mx-auto flex items-center justify-center shadow-md shadow-sky-600/25 mb-3">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-800">
              Altar Intentions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-2 tracking-tight">
              Request a Prayer or Holy Mass Intention
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              &quot;Ask, and it will be given you; search, and you will find.&quot; (Matthew 7:7).
              Submit your prayer petitions for healing, thanksgiving, departed souls, or family blessings. Your petitions will be placed at the altar of Our Lady of Assumption Church, Pallikkunnu.
            </p>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 max-w-lg mx-auto animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                Petition Placed at the Altar
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Thank you. Your prayer intention has been faithfully received and will be remembered during Holy Mass and Eucharistic Adoration at Pallikkunnu Church.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 inline-flex text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
              >
                Submit another prayer intention
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Honeypot field (hidden from humans) */}
              <input
                type="text"
                name="b_field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-sky-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Thomas V."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98470 00000"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prayer Petition / Intention <span className="text-sky-600">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="Please state your prayer intention (e.g. For recovery of good health, thanksgiving for blessings, departed soul of...)"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500 leading-relaxed font-medium"
                />
              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-md shadow-sky-600/20 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Placing at Altar...' : 'Submit Prayer Petition'}
                </button>
                <p className="text-[11px] text-slate-500 mt-2">
                  All intentions are treated with utmost reverence and pastoral confidentiality.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
