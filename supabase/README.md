# Wolvo Agency — Supabase CMS & Admin Dashboard Integration Guide

This guide details how to connect the **Wolvo Agency Website** to your **Supabase** backend for secure, dynamic Content Management System (CMS) capabilities.

---

## 1. Quick Overview

- **Separate Admin Panel:** Accessible at `https://yourdomain.com/admin` or `https://yourdomain.com/#/admin` (or `admin.yourdomain.com`).
- **No Public Admin Links:** There are zero admin buttons or login links on the public company website.
- **Dynamic Content Synchronization:** Any article, service, case study project, or testimonial added, edited, or removed in the dashboard automatically updates across all relevant sections of the public website.
- **Production-Grade Security:** Row Level Security (RLS) ensures public visitors can only read published content, while only verified administrators can make modifications.

---

## 2. Step-by-Step Setup

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project**, name it (e.g., `wolvo-website`), and choose a secure database password.

### Step 2: Run the SQL Schema Script
1. In the Supabase Dashboard, open **SQL Editor** from the left navigation.
2. Click **New Query**.
3. Copy the entire contents of [`supabase/schema.sql`](./schema.sql) and paste it into the editor.
4. Click **Run**.
   - This creates the 5 tables: `admins`, `articles`, `services`, `projects`, and `testimonials`.
   - Enables Row Level Security (RLS) on all tables with public `SELECT` policies for published records and admin full-access policies.
   - Sets up the `site-media` storage bucket for image and asset uploads.
   - Enables Realtime replication.
   - Seeds initial content matching the live website.

### Step 3: Create an Administrator Account
1. In the Supabase Dashboard, go to **Authentication -> Users**.
2. Click **Add User** -> **Create User**.
3. Enter your admin email and a secure password (e.g., `admin@wolvo.agency`).
4. Copy the created user's **User UID** (a UUID like `e8a08c02-...`).
5. In the **SQL Editor**, run this query to grant them administrator privileges:
   ```sql
   INSERT INTO public.admins (id, email, role)
   VALUES ('PASTE-USER-UID-HERE', 'admin@wolvo.agency', 'admin');
   ```

### Step 4: Configure Environment Variables
1. In your Supabase Dashboard, go to **Project Settings -> API**.
2. Copy your **Project URL** and the **anon public** API key.
3. In your project root, open or create `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart your development server (`npm run dev`) or build for production (`npm run build`).

---

## 3. Accessing the Admin Dashboard

- Navigate directly in your browser to:
  - Local: `http://localhost:5174/admin` or `http://localhost:5174/#/admin`
  - Production: `https://yourdomain.com/admin` or `https://yourdomain.com/#/admin`
- Enter your admin credentials created in Step 3.
- In **Preview / Local Mode** (when Supabase credentials aren't set yet), you can test the entire admin panel with:
  - Email: `admin@wolvo.agency`
  - Password: `admin123`

---

## 4. Managed Content Sections

| Section | Management Features |
| :--- | :--- |
| **Articles / Blogs** | Title, slug, category, summary, date, procedural cover style, custom cover photo upload, body sections with subheadings & paragraphs, featured flag, draft/published status. |
| **Services** | Title, short title, description, Lucide icon picker, deliverables tag list, card visual photo upload, image alt, sort order, draft/published status. |
| **Recent Projects** | Client name, title, category, description, client challenge, Wolvo solution, measurable business metric (e.g., `+42%`), full case study copy, live site URL, services and technologies chips, screenshot upload, mockup visual style, draft/published status. |
| **Client Stories** | Client name, role, company, quote, star rating (1-5 stars), client avatar photo upload, draft/published status. |
| **Media Library** | Drag-and-drop file upload to Supabase Storage `site-media` bucket, 1-click copy public URL, image preview. |

---

## 5. Security Architecture

1. **Row Level Security (RLS):**
   - Public requests (anon key) can **ONLY** query records where `status = 'published'`.
   - Drafts and deleted items are invisible to public visitors.
   - Only authenticated users with an authorized record in `public.admins` can `INSERT`, `UPDATE`, or `DELETE`.
2. **Never Expose Service Role Key:**
   - The application uses only the public `anon` key. All privileged mutations are gated by Supabase JWT session tokens and database RLS.
3. **Storage Bucket Restrictions:**
   - Public read access for assets in `site-media`.
   - Write and delete permissions restricted to authenticated admins.
