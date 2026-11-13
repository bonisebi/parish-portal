export type LiturgicalSeason = 'Advent' | 'Christmas' | 'Lent' | 'Easter' | 'Ordinary Time';

export interface MassTiming {
  id: string;
  type: 'Sunday' | 'Weekday' | 'Saturday Anticipated' | 'Special';
  day_name: string;
  time_display: string;
  sort_order: number;
  language: string;
  church: string;
  celebrant: string;
  intention_note?: string | null;
  created_at?: string;
}

export interface ParishEvent {
  id: string;
  title: string;
  category: 'Feast / Thirunal' | 'Novenas & Adoration' | 'Catechism' | 'Youth Ministry' | 'Community & Charity' | 'Special Service';
  start_date: string;
  end_date?: string | null;
  date_display: string;
  time_display: string;
  venue: string;
  description?: string | null;
  image_url?: string | null;
  is_highlight: boolean;
  status: 'Draft' | 'Published';
  created_at?: string;
}

export interface Clergy {
  id: string;
  name: string;
  role: string;
  designation: string;
  photo_url?: string | null;
  phone?: string | null;
  email?: string | null;
  visiting_hours?: string | null;
  bio?: string | null;
  sort_order: number;
  created_at?: string;
}

export interface ParishProfile {
  id: number;
  name: string;
  tagline: string;
  patron_saint: string;
  established: string;
  liturgical_season: LiturgicalSeason;
  address: string;
  phone: string;
  email: string;
  bulletin_note: string;
  updated_at?: string;
}

export interface PrayerRequest {
  id: string;
  name: string;
  phone?: string | null;
  intention: string;
  status: 'Unread' | 'Offered' | 'Archived';
  created_at?: string;
}
