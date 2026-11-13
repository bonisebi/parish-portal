'use client';

import React, { useEffect, useState } from 'react';
import { ParishProfile, MassTiming, ParishEvent, Clergy } from '@/types';
import { parishService } from '@/lib/parishService';
import { mockParishProfile, mockMassTimings, mockParishEvents, mockClergy } from '@/lib/mockData';
import { Navbar } from '@/components/public/Navbar';
import { HeroBulletin } from '@/components/public/HeroBulletin';
import { PastoralMessageSection } from '@/components/public/PastoralMessageSection';
import { MassTimingsSection } from '@/components/public/MassTimingsSection';
import { EventsSection } from '@/components/public/EventsSection';
import { ParishResourcesSection } from '@/components/public/ParishResourcesSection';
import { ClergySection } from '@/components/public/ClergySection';
import { PrayerSection } from '@/components/public/PrayerSection';
import { Footer } from '@/components/public/Footer';

export default function HomePage() {
  const [profile, setProfile] = useState<ParishProfile>(mockParishProfile);
  const [masses, setMasses] = useState<MassTiming[]>(mockMassTimings);
  const [events, setEvents] = useState<ParishEvent[]>(mockParishEvents);
  const [clergy, setClergy] = useState<Clergy[]>(mockClergy);
  const [, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profData, massData, eventData, clergyData] = await Promise.all([
          parishService.getProfile(),
          parishService.getMassTimings(),
          parishService.getEvents(),
          parishService.getClergy(),
        ]);
        setProfile(profData);
        setMasses(massData);
        setEvents(eventData);
        setClergy(clergyData);
      } catch (err) {
        console.error('Error loading parish data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-amber-600 selection:text-white">
      <Navbar profile={profile} />

      <main className="flex-1">
        <HeroBulletin profile={profile} />
        <PastoralMessageSection />
        <MassTimingsSection timings={masses} />
        <EventsSection events={events} />
        <ParishResourcesSection />
        <ClergySection clergyList={clergy} />
        <PrayerSection />
      </main>

      <Footer profile={profile} />
    </div>
  );
}
