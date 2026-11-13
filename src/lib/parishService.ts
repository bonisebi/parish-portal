import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  MassTiming,
  ParishEvent,
  Clergy,
  ParishProfile,
  PrayerRequest,
} from '@/types';
import {
  mockMassTimings,
  mockParishEvents,
  mockClergy,
  mockParishProfile,
  mockPrayerRequests,
} from './mockData';

// Local storage keys for offline/demo/instant mode
const STORAGE_KEYS = {
  PROFILE: 'parish_profile_v1',
  MASSES: 'parish_mass_timings_v1',
  EVENTS: 'parish_events_v1',
  CLERGY: 'parish_clergy_v1',
  PRAYERS: 'parish_prayers_v1',
};

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error', err);
  }
}

export const parishService = {
  // 1. Profile
  async getProfile(): Promise<ParishProfile> {
    const local = getLocal<ParishProfile | null>(STORAGE_KEYS.PROFILE, null);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('parish_profile')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (!error && data) {
          // If local has newer timestamp, prefer local
          if (local && local.updated_at && data.updated_at) {
            if (new Date(local.updated_at).getTime() > new Date(data.updated_at).getTime()) {
              return local;
            }
          }
          return data as ParishProfile;
        }
      } catch (err) {
        console.error('Supabase getProfile error:', err);
      }
    }
    return local || mockParishProfile;
  },

  async updateProfile(updates: Partial<ParishProfile>): Promise<ParishProfile> {
    const current = getLocal<ParishProfile>(STORAGE_KEYS.PROFILE, mockParishProfile);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    setLocal(STORAGE_KEYS.PROFILE, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('parish_profile')
          .upsert({ id: 1, ...updates, updated_at: new Date().toISOString() })
          .select()
          .maybeSingle();

        if (!error && data) {
          setLocal(STORAGE_KEYS.PROFILE, data as ParishProfile);
          return data as ParishProfile;
        } else if (error) {
          console.warn('Supabase updateProfile warning (RLS check):', error.message);
        }
      } catch (err) {
        console.error('Supabase updateProfile error:', err);
      }
    }

    return updated;
  },

  // 2. Mass Timings
  async getMassTimings(): Promise<MassTiming[]> {
    const local = getLocal<MassTiming[] | null>(STORAGE_KEYS.MASSES, null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('mass_timings')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          // If local storage has items added by admin that are not in Supabase yet, merge them
          if (local && local.length > 0) {
            const supabaseIds = new Set(data.map((d: MassTiming) => d.id));
            const unsynced = local.filter((m) => !supabaseIds.has(m.id));
            if (unsynced.length > 0) {
              return [...(data as MassTiming[]), ...unsynced].sort((a, b) => a.sort_order - b.sort_order);
            }
          }
          return data as MassTiming[];
        }
      } catch (err) {
        console.error('Supabase getMassTimings error:', err);
      }
    }

    if (local && local.length > 0) return local;
    return mockMassTimings;
  },

  async addMassTiming(item: Omit<MassTiming, 'id'>): Promise<MassTiming> {
    const newItem: MassTiming = { ...item, id: crypto.randomUUID() };
    const current = getLocal<MassTiming[]>(STORAGE_KEYS.MASSES, mockMassTimings);
    const updated = [...current, newItem].sort((a, b) => a.sort_order - b.sort_order);
    setLocal(STORAGE_KEYS.MASSES, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('mass_timings')
          .insert(item)
          .select()
          .single();

        if (!error && data) {
          const finalItem = data as MassTiming;
          const synced = updated.map((m) => (m.id === newItem.id ? finalItem : m));
          setLocal(STORAGE_KEYS.MASSES, synced);
          return finalItem;
        } else if (error) {
          console.warn('Supabase addMassTiming warning (RLS check):', error.message);
        }
      } catch (err) {
        console.error('Supabase addMassTiming error:', err);
      }
    }

    return newItem;
  },

  async updateMassTiming(id: string, updates: Partial<MassTiming>): Promise<void> {
    const current = getLocal<MassTiming[]>(STORAGE_KEYS.MASSES, mockMassTimings);
    const updated = current.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setLocal(STORAGE_KEYS.MASSES, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('mass_timings').update(updates).eq('id', id);
        if (error) console.warn('Supabase updateMassTiming warning:', error.message);
      } catch (err) {
        console.error('Supabase updateMassTiming error:', err);
      }
    }
  },

  async deleteMassTiming(id: string): Promise<void> {
    const current = getLocal<MassTiming[]>(STORAGE_KEYS.MASSES, mockMassTimings);
    const updated = current.filter((m) => m.id !== id);
    setLocal(STORAGE_KEYS.MASSES, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('mass_timings').delete().eq('id', id);
        if (error) console.warn('Supabase deleteMassTiming warning:', error.message);
      } catch (err) {
        console.error('Supabase deleteMassTiming error:', err);
      }
    }
  },

  // 3. Events & Feasts
  async getEvents(): Promise<ParishEvent[]> {
    const local = getLocal<ParishEvent[] | null>(STORAGE_KEYS.EVENTS, null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('parish_events')
          .select('*')
          .order('start_date', { ascending: true });

        if (!error && data && data.length > 0) {
          if (local && local.length > 0) {
            const supabaseIds = new Set(data.map((d: ParishEvent) => d.id));
            const unsynced = local.filter((e) => !supabaseIds.has(e.id));
            if (unsynced.length > 0) {
              return [...(data as ParishEvent[]), ...unsynced];
            }
          }
          return data as ParishEvent[];
        }
      } catch (err) {
        console.error('Supabase getEvents error:', err);
      }
    }

    if (local && local.length > 0) return local;
    return mockParishEvents;
  },

  async addEvent(item: Omit<ParishEvent, 'id'>): Promise<ParishEvent> {
    const newItem: ParishEvent = { ...item, id: crypto.randomUUID() };
    const current = getLocal<ParishEvent[]>(STORAGE_KEYS.EVENTS, mockParishEvents);
    const updated = [newItem, ...current];
    setLocal(STORAGE_KEYS.EVENTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('parish_events')
          .insert(item)
          .select()
          .single();

        if (!error && data) {
          const finalItem = data as ParishEvent;
          const synced = updated.map((e) => (e.id === newItem.id ? finalItem : e));
          setLocal(STORAGE_KEYS.EVENTS, synced);
          return finalItem;
        } else if (error) {
          console.warn('Supabase addEvent warning (RLS check):', error.message);
        }
      } catch (err) {
        console.error('Supabase addEvent error:', err);
      }
    }

    return newItem;
  },

  async updateEvent(id: string, updates: Partial<ParishEvent>): Promise<void> {
    const current = getLocal<ParishEvent[]>(STORAGE_KEYS.EVENTS, mockParishEvents);
    const updated = current.map((e) => (e.id === id ? { ...e, ...updates } : e));
    setLocal(STORAGE_KEYS.EVENTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('parish_events').update(updates).eq('id', id);
        if (error) console.warn('Supabase updateEvent warning:', error.message);
      } catch (err) {
        console.error('Supabase updateEvent error:', err);
      }
    }
  },

  async deleteEvent(id: string): Promise<void> {
    const current = getLocal<ParishEvent[]>(STORAGE_KEYS.EVENTS, mockParishEvents);
    const updated = current.filter((e) => e.id !== id);
    setLocal(STORAGE_KEYS.EVENTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('parish_events').delete().eq('id', id);
        if (error) console.warn('Supabase deleteEvent warning:', error.message);
      } catch (err) {
        console.error('Supabase deleteEvent error:', err);
      }
    }
  },

  // 4. Clergy
  async getClergy(): Promise<Clergy[]> {
    const local = getLocal<Clergy[] | null>(STORAGE_KEYS.CLERGY, null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('clergy')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          if (local && local.length > 0) {
            const supabaseIds = new Set(data.map((d: Clergy) => d.id));
            const unsynced = local.filter((c) => !supabaseIds.has(c.id));
            if (unsynced.length > 0) {
              return [...(data as Clergy[]), ...unsynced].sort((a, b) => a.sort_order - b.sort_order);
            }
          }
          return data as Clergy[];
        }
      } catch (err) {
        console.error('Supabase getClergy error:', err);
      }
    }

    if (local && local.length > 0) return local;
    return mockClergy;
  },

  async addClergy(item: Omit<Clergy, 'id'>): Promise<Clergy> {
    const newItem: Clergy = { ...item, id: crypto.randomUUID() };
    const current = getLocal<Clergy[]>(STORAGE_KEYS.CLERGY, mockClergy);
    const updated = [...current, newItem].sort((a, b) => a.sort_order - b.sort_order);
    setLocal(STORAGE_KEYS.CLERGY, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('clergy').insert(item).select().single();
        if (!error && data) {
          const finalItem = data as Clergy;
          const synced = updated.map((c) => (c.id === newItem.id ? finalItem : c));
          setLocal(STORAGE_KEYS.CLERGY, synced);
          return finalItem;
        } else if (error) {
          console.warn('Supabase addClergy warning (RLS check):', error.message);
        }
      } catch (err) {
        console.error('Supabase addClergy error:', err);
      }
    }

    return newItem;
  },

  async updateClergy(id: string, updates: Partial<Clergy>): Promise<void> {
    const current = getLocal<Clergy[]>(STORAGE_KEYS.CLERGY, mockClergy);
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setLocal(STORAGE_KEYS.CLERGY, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('clergy').update(updates).eq('id', id);
        if (error) console.warn('Supabase updateClergy warning:', error.message);
      } catch (err) {
        console.error('Supabase updateClergy error:', err);
      }
    }
  },

  async deleteClergy(id: string): Promise<void> {
    const current = getLocal<Clergy[]>(STORAGE_KEYS.CLERGY, mockClergy);
    const updated = current.filter((c) => c.id !== id);
    setLocal(STORAGE_KEYS.CLERGY, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('clergy').delete().eq('id', id);
        if (error) console.warn('Supabase deleteClergy warning:', error.message);
      } catch (err) {
        console.error('Supabase deleteClergy error:', err);
      }
    }
  },

  // 5. Prayer Requests
  async getPrayerRequests(): Promise<PrayerRequest[]> {
    const local = getLocal<PrayerRequest[] | null>(STORAGE_KEYS.PRAYERS, null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('prayer_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data as PrayerRequest[];
        }
      } catch (err) {
        console.error('Supabase getPrayerRequests error:', err);
      }
    }

    if (local && local.length > 0) return local;
    return mockPrayerRequests;
  },

  async submitPrayerRequest(item: { name: string; phone?: string; intention: string }): Promise<PrayerRequest> {
    const newItem: PrayerRequest = {
      ...item,
      id: crypto.randomUUID(),
      status: 'Unread',
      created_at: new Date().toISOString(),
    };

    const current = getLocal<PrayerRequest[]>(STORAGE_KEYS.PRAYERS, mockPrayerRequests);
    const updated = [newItem, ...current];
    setLocal(STORAGE_KEYS.PRAYERS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('prayer_requests')
          .insert({ ...item, status: 'Unread' });

        if (error) {
          console.warn('Supabase prayer submit warning:', error.message);
        }
      } catch (err) {
        console.error('Supabase prayer submit error:', err);
      }
    }

    return newItem;
  },

  async updatePrayerStatus(id: string, status: 'Unread' | 'Offered' | 'Archived'): Promise<void> {
    const current = getLocal<PrayerRequest[]>(STORAGE_KEYS.PRAYERS, mockPrayerRequests);
    const updated = current.map((p) => (p.id === id ? { ...p, status } : p));
    setLocal(STORAGE_KEYS.PRAYERS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('prayer_requests').update({ status }).eq('id', id);
        if (error) console.warn('Supabase updatePrayerStatus warning:', error.message);
      } catch (err) {
        console.error('Supabase updatePrayerStatus error:', err);
      }
    }
  },

  async deletePrayerRequest(id: string): Promise<void> {
    const current = getLocal<PrayerRequest[]>(STORAGE_KEYS.PRAYERS, mockPrayerRequests);
    const updated = current.filter((p) => p.id !== id);
    setLocal(STORAGE_KEYS.PRAYERS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('prayer_requests').delete().eq('id', id);
        if (error) console.warn('Supabase deletePrayerRequest warning:', error.message);
      } catch (err) {
        console.error('Supabase deletePrayerRequest error:', err);
      }
    }
  },
};
