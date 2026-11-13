# Parish Web Portal & CMS

A complete Catholic / Christian parish web portal with a public visitor interface and a secure administrative Content Management System (CMS).

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **Supabase (PostgreSQL + Auth + RLS)**.

---

## 🌟 Key Features

### 1. Public Visitor Portal (`/`)
* **Liturgical Season Indicator:** Dynamic season tag (Ordinary Time, Lent, Easter, Advent, Christmas) with liturgical color badges.
* **Global Parish Announcement Ticker:** Pinned bulletin alerts from the Vicar/Secretary for urgent notices.
* **Holy Mass Timings Directory:**
  * Day filters: *Sunday, Saturday Anticipated, Weekday, Special (1st Friday)*.
  * Liturgical language filter: *Malayalam, English, Latin, Hindi*.
  * Displays celebrant, venue (chapel/auditorium), and special intentions.
* **Upcoming Feasts & Events (Thirunal):**
  * Hero banner for the annual featured feast.
  * Chronologically organized cards for novenas, youth ministry, catechism, and medical camps.
* **Clergy & Pastoral Team Directory:**
  * Photos, designations, click-to-call phone numbers, email, and counseling office hours.
* **Altar Prayer Petitions:**
  * Interactive form for parishioners to submit petitions to be placed at the altar.
  * Anti-spam honeypot protection.

### 2. Executive CMS Administration (`/admin`)
* **Secure Auth Guard:** Protected route with session verification (`/admin/login`).
* **KPI Dashboard Overview:** Live counts of Masses, upcoming Feasts, Pastoral Clergy, and unread Prayer Intentions.
* **Holy Mass Schedule CRUD:** Add, update, or remove mass slots.
* **Feasts & Events CMS:** Schedule feast dates, upload program details, toggle highlight status.
* **Clergy Profile Manager:** Add or edit priests, contact info, and visiting hours.
* **Altar Prayer Inbox:** Read incoming prayer petitions submitted by parishioners, mark them as **Offered at Altar**, or delete them.
* **Parish Profile & Bulletin Editor:** Change church name, address, phone, liturgical season, and publish global bulletin announcements.

---

## 🚀 Getting Started

### 1. Run in Development Mode
```bash
cd "c:\bgeorge\AI Projects\parish-portal"
npm run dev
```
Visit **[http://localhost:3000](http://localhost:3000)** in your browser!

> **Note on Demo Mode:** If Supabase keys are not configured yet, the app runs in **Local Demo Mode** using realistic seed data and browser storage. You can test and modify everything in the CMS right away without waiting for database setup!

### 2. Connect Supabase (Free PostgreSQL Backend)

1. Create a free project at **[supabase.com](https://supabase.com)**.
2. Go to the **SQL Editor** tab in your Supabase project dashboard.
3. Open [`supabase/schema.sql`](./supabase/schema.sql), copy its contents, and run it in the SQL Editor. This sets up all tables, indexes, RLS security policies, and initial sample data.
4. Copy your project credentials from **Project Settings -> API**:
   - `Project URL`
   - `anon public` key
5. Paste them into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```
6. Restart your dev server (`npm run dev`). The portal will automatically switch to your live Supabase database!

---

## 🔒 Security & Admin Setup

* **Disable Public Signups:** In your Supabase Dashboard, go to **Authentication -> Providers -> Email** and uncheck *"Enable Email Signups"*.
* **Create Admin Account:** In **Authentication -> Users**, click *"Invite user"* or *"Add user"* to invite the Vicar, Secretary, or Trustees with their email and password.
* **Row Level Security (RLS):** All tables are locked by PostgreSQL RLS. Visitors can only read published content and submit prayer petitions. Only authenticated admins have full write, edit, and delete permissions.

---

## 🚢 Deploying to Vercel (100% Free Tier)

1. Push this directory to your GitHub repository.
2. Go to **[vercel.com](https://vercel.com)** and click **"Add New Project"**.
3. Import your GitHub repository.
4. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Click **Deploy**. Your parish portal will be live with free global CDN and HTTPS!
