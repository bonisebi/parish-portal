'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ParishProfile,
  MassTiming,
  ParishEvent,
  Clergy,
  PrayerRequest,
  LiturgicalSeason,
} from '@/types';
import { parishService } from '@/lib/parishService';
import { mockParishProfile, mockMassTimings, mockParishEvents, mockClergy, mockPrayerRequests } from '@/lib/mockData';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  Clock,
  Calendar,
  Users,
  HeartHandshake,
  Plus,
  Trash2,
  CheckCircle,
  Database,
  Save,
  Check,
  LayoutDashboard,
  Settings,
  ArrowRight,
} from 'lucide-react';

type TabType = 'overview' | 'masses' | 'events' | 'clergy' | 'prayers' | 'profile';

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active tab directly derived from URL query (?tab=...)
  const activeTab = (searchParams.get('tab') as TabType) || 'overview';

  const switchTab = (tab: TabType) => {
    router.push(`/admin?tab=${tab}`);
  };

  // State
  const [profile, setProfile] = useState<ParishProfile>(mockParishProfile);
  const [masses, setMasses] = useState<MassTiming[]>(mockMassTimings);
  const [events, setEvents] = useState<ParishEvent[]>(mockParishEvents);
  const [clergy, setClergy] = useState<Clergy[]>(mockClergy);
  const [prayers, setPrayers] = useState<PrayerRequest[]>(mockPrayerRequests);

  const [loading, setLoading] = useState(true);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // New Mass Form State
  const [newMass, setNewMass] = useState<Omit<MassTiming, 'id'>>({
    type: 'Sunday',
    day_name: 'Sunday Morning',
    time_display: '07:00 AM',
    sort_order: 1,
    language: 'Malayalam',
    church: 'Main Church',
    celebrant: 'Fr. Vicar',
    intention_note: '',
  });

  // New Event Form State
  const [newEvent, setNewEvent] = useState<Omit<ParishEvent, 'id'>>({
    title: '',
    category: 'Feast / Thirunal',
    start_date: '2026-08-15',
    end_date: '',
    date_display: '',
    time_display: '05:00 PM',
    venue: 'Main Church',
    description: '',
    image_url: '',
    is_highlight: false,
    status: 'Published',
  });

  // New Clergy Form State
  const [newClergy, setNewClergy] = useState<Omit<Clergy, 'id'>>({
    name: '',
    role: 'Assistant Vicar',
    designation: 'Assistant Parish Priest',
    photo_url: '',
    phone: '',
    email: '',
    visiting_hours: 'Mon - Fri: 10:00 AM - 01:00 PM',
    bio: '',
    sort_order: 10,
  });

  // Load initial data
  useEffect(() => {
    async function refreshAll() {
      try {
        const [prof, massList, eventList, clergyList, prayerList] = await Promise.all([
          parishService.getProfile(),
          parishService.getMassTimings(),
          parishService.getEvents(),
          parishService.getClergy(),
          parishService.getPrayerRequests(),
        ]);
        setProfile(prof);
        setMasses(massList);
        setEvents(eventList);
        setClergy(clergyList);
        setPrayers(prayerList);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    refreshAll();
  }, []);

  const showNotification = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  // 1. Mass Timings CRUD
  const handleAddMass = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await parishService.addMassTiming(newMass);
    setMasses((prev) => [...prev, created]);
    showNotification('Holy mass schedule added successfully!');
    setNewMass({
      type: 'Sunday',
      day_name: 'Sunday Morning',
      time_display: '07:00 AM',
      sort_order: 1,
      language: 'Malayalam',
      church: 'Main Church',
      celebrant: 'Fr. Vicar',
      intention_note: '',
    });
  };

  const handleDeleteMass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mass timing?')) return;
    await parishService.deleteMassTiming(id);
    setMasses((prev) => prev.filter((m) => m.id !== id));
    showNotification('Mass timing deleted.');
  };

  // 2. Events CRUD
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    const created = await parishService.addEvent(newEvent);
    setEvents((prev) => [created, ...prev]);
    showNotification('Parish event/feast published successfully!');
    setNewEvent({
      title: '',
      category: 'Feast / Thirunal',
      start_date: '2026-08-15',
      end_date: '',
      date_display: '',
      time_display: '05:00 PM',
      venue: 'Main Church',
      description: '',
      image_url: '',
      is_highlight: false,
      status: 'Published',
    });
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await parishService.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showNotification('Event deleted.');
  };

  // 3. Clergy CRUD
  const handleAddClergy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClergy.name.trim()) return;
    const created = await parishService.addClergy(newClergy);
    setClergy((prev) => [...prev, created]);
    showNotification('Clergy profile created.');
    setNewClergy({
      name: '',
      role: 'Assistant Vicar',
      designation: 'Assistant Parish Priest',
      photo_url: '',
      phone: '',
      email: '',
      visiting_hours: 'Mon - Fri: 10:00 AM - 01:00 PM',
      bio: '',
      sort_order: 10,
    });
  };

  const handleDeleteClergy = async (id: string) => {
    if (!confirm('Are you sure you want to remove this priest profile?')) return;
    await parishService.deleteClergy(id);
    setClergy((prev) => prev.filter((c) => c.id !== id));
    showNotification('Clergy profile removed.');
  };

  // 4. Prayer Requests Status
  const handlePrayerStatus = async (id: string, status: 'Unread' | 'Offered' | 'Archived') => {
    await parishService.updatePrayerStatus(id, status);
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    showNotification(`Prayer marked as ${status}.`);
  };

  const handleDeletePrayer = async (id: string) => {
    if (!confirm('Delete this prayer petition?')) return;
    await parishService.deletePrayerRequest(id);
    setPrayers((prev) => prev.filter((p) => p.id !== id));
    showNotification('Prayer petition deleted.');
  };

  // 5. Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await parishService.updateProfile(profile);
    showNotification('Parish profile and bulletin updated successfully!');
  };

  const unreadPrayersCount = prayers.filter((p) => p.status === 'Unread').length;

  if (loading) {
    return (
      <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium">Loading parish database records...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Parish CMS Administration
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Assumption Church Pallikkunnu • Liturgical schedules, feast announcements, clergy directory & prayers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-sky-100 text-sky-800 border border-sky-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Supabase Live Connected' : 'Local Demo Storage'}</span>
          </div>
        </div>
      </div>

      {/* Floating Save Notification */}
      {savedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-stone-700 animate-fade-in text-xs font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* KPI Cards Overview (Clickable to switch tab) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => switchTab('masses')}
          className={`p-5 rounded-2xl border shadow-xs cursor-pointer transition ${
            activeTab === 'masses'
              ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
              : 'bg-white border-stone-200 hover:border-sky-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-stone-400 tracking-wider">
              Holy Masses
            </span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {masses.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Active schedule slots</div>
        </div>

        <div
          onClick={() => switchTab('events')}
          className={`p-5 rounded-2xl border shadow-xs cursor-pointer transition ${
            activeTab === 'events'
              ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
              : 'bg-white border-stone-200 hover:border-sky-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-stone-400 tracking-wider">
              Feasts & Events
            </span>
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {events.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Published & upcoming</div>
        </div>

        <div
          onClick={() => switchTab('clergy')}
          className={`p-5 rounded-2xl border shadow-xs cursor-pointer transition ${
            activeTab === 'clergy'
              ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
              : 'bg-white border-stone-200 hover:border-sky-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-stone-400 tracking-wider">
              Clergy Team
            </span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {clergy.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Pastoral leadership</div>
        </div>

        <div
          onClick={() => switchTab('prayers')}
          className={`p-5 rounded-2xl border shadow-xs cursor-pointer transition ${
            activeTab === 'prayers'
              ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
              : unreadPrayersCount > 0
              ? 'border-sky-300 bg-sky-50/30 hover:border-sky-400'
              : 'bg-white border-stone-200 hover:border-sky-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-stone-400 tracking-wider">
              Prayer Petitions
            </span>
            <HeartHandshake className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2 flex items-center gap-2">
            {prayers.length}
            {unreadPrayersCount > 0 && (
              <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white">
                {unreadPrayersCount} new
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Submitted by parishioners</div>
        </div>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-2">
        <button
          onClick={() => switchTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => switchTab('masses')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'masses'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Mass Timings ({masses.length})</span>
        </button>

        <button
          onClick={() => switchTab('events')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'events'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Feasts & Thirunal ({events.length})</span>
        </button>

        <button
          onClick={() => switchTab('clergy')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'clergy'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Clergy Directory ({clergy.length})</span>
        </button>

        <button
          onClick={() => switchTab('prayers')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'prayers'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Prayer Intentions ({prayers.length})</span>
          {unreadPrayersCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-sky-500" />
          )}
        </button>

        <button
          onClick={() => switchTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition shrink-0 flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Parish Profile & Bulletin</span>
        </button>
      </div>

      {/* Tab 0: Dashboard Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Quick Actions Hub */}
          <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-sky-400/20 text-sky-200 px-3 py-1 rounded-full border border-sky-400/30">
                  Quick Management Hub
                </span>
                <span className="text-xs text-sky-200">Season: <strong>{profile.liturgical_season}</strong></span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Welcome to Assumption Church Administration
              </h2>
              <p className="text-xs sm:text-sm text-sky-100/90 max-w-2xl leading-relaxed">
                Click any of the quick shortcuts below to update Holy Mass schedules, publish feast announcements, update clergy office hours, or review altar intentions submitted by parishioners.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  onClick={() => switchTab('masses')}
                  className="px-4 py-2.5 rounded-xl bg-white text-sky-900 text-xs font-bold hover:bg-sky-50 transition shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-sky-700" />
                  Add Mass Timing
                </button>

                <button
                  onClick={() => switchTab('events')}
                  className="px-4 py-2.5 rounded-xl bg-sky-700/80 hover:bg-sky-600 text-white text-xs font-bold border border-sky-500/40 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Post Feast / Thirunal
                </button>

                <button
                  onClick={() => switchTab('clergy')}
                  className="px-4 py-2.5 rounded-xl bg-sky-700/80 hover:bg-sky-600 text-white text-xs font-bold border border-sky-500/40 transition flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  Clergy Team
                </button>

                <button
                  onClick={() => switchTab('prayers')}
                  className="px-4 py-2.5 rounded-xl bg-sky-700/80 hover:bg-sky-600 text-white text-xs font-bold border border-sky-500/40 transition flex items-center gap-1.5"
                >
                  <HeartHandshake className="w-4 h-4" />
                  Altar Prayers ({unreadPrayersCount} unread)
                </button>

                <button
                  onClick={() => switchTab('profile')}
                  className="px-4 py-2.5 rounded-xl bg-sky-700/80 hover:bg-sky-600 text-white text-xs font-bold border border-sky-500/40 transition flex items-center gap-1.5"
                >
                  <Settings className="w-4 h-4" />
                  Edit Bulletin Notice
                </button>
              </div>
            </div>
          </div>

          {/* Two-Column Overview Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mass Schedule Preview */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Holy Mass Schedules</h3>
                    <p className="text-[11px] text-stone-500">{masses.length} total active timing slots</p>
                  </div>
                </div>
                <button
                  onClick={() => switchTab('masses')}
                  className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {masses.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No mass slots configured yet. Click Manage to add one.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {masses.slice(0, 4).map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                    >
                      <div>
                        <span className="font-bold text-stone-900">{m.time_display}</span>
                        <span className="text-stone-500 ml-2">({m.day_name})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-stone-200/80 text-[10px] font-semibold text-stone-700">
                          {m.language}
                        </span>
                        <span className="text-stone-400 text-[11px]">{m.celebrant}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feasts & Announcements Preview */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">Feasts & Parish Events</h3>
                    <p className="text-[11px] text-stone-500">{events.length} published announcements</p>
                  </div>
                </div>
                <button
                  onClick={() => switchTab('events')}
                  className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  No events or feasts scheduled yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {events.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 truncate max-w-[200px] sm:max-w-xs">{e.title}</span>
                        {e.is_highlight && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {e.date_display} • {e.time_display} • {e.venue}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Mass Timings */}
      {activeTab === 'masses' && (
        <div className="space-y-8 animate-fade-in">
          {/* Add New Mass Form */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-700" /> Add New Mass Timing Slot
            </h3>
            <form onSubmit={handleAddMass} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Mass Type</label>
                <select
                  value={newMass.type}
                  onChange={(e) => setNewMass({ ...newMass, type: e.target.value as MassTiming['type'] })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Saturday Anticipated">Saturday Anticipated</option>
                  <option value="Weekday">Weekday</option>
                  <option value="Special">Special / First Friday</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Time (e.g. 06:30 AM)</label>
                <input
                  type="text"
                  required
                  value={newMass.time_display}
                  onChange={(e) => setNewMass({ ...newMass, time_display: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Day Display (e.g. Sun Morning)</label>
                <input
                  type="text"
                  required
                  value={newMass.day_name}
                  onChange={(e) => setNewMass({ ...newMass, day_name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Language</label>
                <select
                  value={newMass.language}
                  onChange={(e) => setNewMass({ ...newMass, language: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
                >
                  <option value="Malayalam">Malayalam</option>
                  <option value="English">English</option>
                  <option value="Latin">Latin</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Church / Venue</label>
                <input
                  type="text"
                  required
                  value={newMass.church}
                  onChange={(e) => setNewMass({ ...newMass, church: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Celebrant</label>
                <input
                  type="text"
                  required
                  value={newMass.celebrant}
                  onChange={(e) => setNewMass({ ...newMass, celebrant: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">Intention Note (Optional)</label>
                <input
                  type="text"
                  value={newMass.intention_note || ''}
                  onChange={(e) => setNewMass({ ...newMass, intention_note: e.target.value })}
                  placeholder="e.g. Novena to St. Jude following Mass"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-semibold text-xs transition shadow-sm"
                >
                  Add Mass Schedule
                </button>
              </div>
            </form>
          </div>

          {/* Table of Masses */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Time & Day</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Venue & Celebrant</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {masses.map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div>{m.time_display}</div>
                      <div className="text-[11px] font-normal text-stone-500">{m.day_name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                        {m.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{m.language}</td>
                    <td className="py-3 px-4">
                      <div>{m.church}</div>
                      <div className="text-[11px] text-stone-500">{m.celebrant}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">{m.intention_note || '—'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteMass(m.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete Mass"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Feasts & Events */}
      {activeTab === 'events' && (
        <div className="space-y-8 animate-fade-in">
          {/* Add Event Form */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-700" /> Post New Parish Feast or Event
            </h3>
            <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">Event / Feast Title</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Annual Thirunal of St. Mary"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Category</label>
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as ParishEvent['category'] })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
                >
                  <option value="Feast / Thirunal">Feast / Thirunal</option>
                  <option value="Novenas & Adoration">Novenas & Adoration</option>
                  <option value="Catechism">Catechism</option>
                  <option value="Youth Ministry">Youth Ministry</option>
                  <option value="Community & Charity">Community & Charity</option>
                  <option value="Special Service">Special Service</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Date Display Text</label>
                <input
                  type="text"
                  required
                  value={newEvent.date_display}
                  onChange={(e) => setNewEvent({ ...newEvent, date_display: e.target.value })}
                  placeholder="e.g. Aug 10 - Aug 15, 2026"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Time Display</label>
                <input
                  type="text"
                  required
                  value={newEvent.time_display}
                  onChange={(e) => setNewEvent({ ...newEvent, time_display: e.target.value })}
                  placeholder="e.g. 05:00 PM Daily"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Venue</label>
                <input
                  type="text"
                  required
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  placeholder="e.g. Main Church Grounds"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-stone-700 mb-1">Event Description & Program</label>
                <textarea
                  rows={3}
                  value={newEvent.description || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Detail the liturgical ceremonies, flag hoisting, novena timings, and special celebrations..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="sm:col-span-3 flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={newEvent.is_highlight}
                    onChange={(e) => setNewEvent({ ...newEvent, is_highlight: e.target.checked })}
                    className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span>Mark as Featured Main Parish Feast banner</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-semibold text-xs transition shadow-sm"
                >
                  Publish Parish Event
                </button>
              </div>
            </form>
          </div>

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                      {ev.category}
                    </span>
                    {ev.is_highlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-stone-900">{ev.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-2">{ev.description}</p>
                  <div className="text-[11px] text-stone-400 pt-1">
                    {ev.date_display} • {ev.time_display} • {ev.venue}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEvent(ev.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 self-start"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Clergy Directory */}
      {activeTab === 'clergy' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
            <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-700" /> Add Priest Profile
            </h3>
            <form onSubmit={handleAddClergy} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Priest Name</label>
                <input
                  type="text"
                  required
                  value={newClergy.name}
                  onChange={(e) => setNewClergy({ ...newClergy, name: e.target.value })}
                  placeholder="e.g. Fr. Joseph K."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Role</label>
                <input
                  type="text"
                  required
                  value={newClergy.role}
                  onChange={(e) => setNewClergy({ ...newClergy, role: e.target.value })}
                  placeholder="e.g. Vicar / Assistant Vicar"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={newClergy.designation}
                  onChange={(e) => setNewClergy({ ...newClergy, designation: e.target.value })}
                  placeholder="e.g. Vicar & Forane Archpriest"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newClergy.phone || ''}
                  onChange={(e) => setNewClergy({ ...newClergy, phone: e.target.value })}
                  placeholder="+91 98470 00000"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newClergy.email || ''}
                  onChange={(e) => setNewClergy({ ...newClergy, email: e.target.value })}
                  placeholder="priest@pallikkunnuchurch.org"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={newClergy.photo_url || ''}
                  onChange={(e) => setNewClergy({ ...newClergy, photo_url: e.target.value })}
                  placeholder="https://...image.jpg"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">Visiting / Office Hours</label>
                <input
                  type="text"
                  value={newClergy.visiting_hours || ''}
                  onChange={(e) => setNewClergy({ ...newClergy, visiting_hours: e.target.value })}
                  placeholder="e.g. Tue - Sat: 09:30 AM - 12:30 PM"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-stone-700 mb-1">Pastoral Bio</label>
                <textarea
                  rows={2}
                  value={newClergy.bio || ''}
                  onChange={(e) => setNewClergy({ ...newClergy, bio: e.target.value })}
                  placeholder="Short introduction or pastoral background..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-semibold text-xs transition shadow-sm"
                >
                  Save Clergy Profile
                </button>
              </div>
            </form>
          </div>

          {/* Clergy List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clergy.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex justify-between gap-4">
                <div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                    {c.role}
                  </span>
                  <h4 className="text-base font-bold text-stone-900 mt-1">{c.name}</h4>
                  <div className="text-xs text-stone-500">{c.designation}</div>
                  <div className="text-[11px] text-stone-400 mt-2">
                    {c.phone} • {c.email}
                  </div>
                  {c.visiting_hours && (
                    <div className="text-[11px] text-stone-500 mt-1">Office: {c.visiting_hours}</div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteClergy(c.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 self-start"
                  title="Delete priest profile"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Prayer Intentions Inbox */}
      {activeTab === 'prayers' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">
              Altar Prayer Petitions ({prayers.length})
            </h3>
            <span className="text-xs text-stone-500">
              Submitted online by parishioners for Mass intentions
            </span>
          </div>

          {prayers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 text-stone-500 text-xs">
              No prayer petitions in inbox.
            </div>
          ) : (
            <div className="space-y-3">
              {prayers.map((p) => (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    p.status === 'Unread'
                      ? 'bg-sky-50/40 border-sky-200 shadow-xs'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{p.name}</span>
                      {p.phone && (
                        <span className="text-xs text-stone-500">({p.phone})</span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'Unread'
                            ? 'bg-sky-600 text-white'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      &quot;{p.intention}&quot;
                    </p>
                    {p.created_at && (
                      <div className="text-[10px] text-stone-400">
                        Submitted on {new Date(p.created_at).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {p.status === 'Unread' ? (
                      <button
                        onClick={() => handlePrayerStatus(p.id, 'Offered')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark as Offered at Altar
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePrayerStatus(p.id, 'Unread')}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium"
                      >
                        Mark Unread
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePrayer(p.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete petition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Parish Profile & Global Notice */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs max-w-4xl space-y-6 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              Parish Profile & Global Announcement
            </h3>
            <p className="text-xs text-stone-500">
              Update the church identity, contact details, and the global marquee bulletin displayed to all visitors.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Parish Church Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Liturgical Season</label>
                <select
                  value={profile.liturgical_season}
                  onChange={(e) => setProfile({ ...profile, liturgical_season: e.target.value as LiturgicalSeason })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
                >
                  <option value="Ordinary Time">Ordinary Time (Green)</option>
                  <option value="Lent">Lent (Purple / Violet)</option>
                  <option value="Easter">Easter (White & Gold)</option>
                  <option value="Advent">Advent (Violet)</option>
                  <option value="Christmas">Christmas (White & Gold)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Patron Saint</label>
                <input
                  type="text"
                  value={profile.patron_saint}
                  onChange={(e) => setProfile({ ...profile, patron_saint: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Established Year</label>
                <input
                  type="text"
                  value={profile.established}
                  onChange={(e) => setProfile({ ...profile, established: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">Parish Motto / Tagline</label>
                <input
                  type="text"
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">Parish Physical Address</label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Parish Office Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Parish Office Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Global Notice Marquee / Banner */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Global Bulletin Announcement Banner
              </label>
              <textarea
                rows={3}
                value={profile.bulletin_note}
                onChange={(e) => setProfile({ ...profile, bulletin_note: e.target.value })}
                placeholder="Important announcements, feast alerts, or urgent notices shown at the top of the visitor portal..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 leading-relaxed"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                This message appears highlighted in the hero banner of the website.
              </p>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-semibold text-xs transition shadow-md"
              >
                <Save className="w-4 h-4" />
                Save Parish Settings & Bulletin
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium">Loading parish administration...</span>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
