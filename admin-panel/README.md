# Wolvo Standalone Admin CMS Application

An independent, secure **Content Management System (CMS)** for the Wolvo digital agency company website, built with **React**, **TypeScript**, **Vite**, and **Supabase**.

---

## 1. Complete Separation Architecture

This admin application is **completely separated** from the public company website:

| Application | Directory | Default Port | Deployment Target | Admin Route on Public Site? |
| :--- | :--- | :--- | :--- | :--- |
| **Public Website** | `/` (root) | `5174` | `wolvoinfotech.com` | **None** (`/admin` does not exist) |
| **Private Admin CMS** | `/admin-panel` | `5175` | `admin.wolvoinfotech.com` | **Dedicated standalone app** |

---

## 2. Quick Start

### Step 1: Install Dependencies & Run

Open a terminal in the `admin-panel/` directory:

```bash
cd admin-panel
npm install
npm run dev
```

The admin application will start on **`http://localhost:5175/`**.

### Step 2: Sign In

- **Preview Mode (Demo):**
  - **Email:** `admin@wolvo.agency`
  - **Password:** `admin123`
  - *(or click "Fill Demo Admin Credentials" on the login screen).*

- **Production Mode:**
  - Authenticates against your live Supabase project Auth and verifies role membership in `public.admins`.

---

## 3. Connecting to Supabase

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   VITE_PUBLIC_WEBSITE_URL=https://wolvoinfotech.com
   ```
3. Run the SQL schema from `../supabase/schema.sql` in your Supabase SQL Editor.
4. Add your admin user to `public.admins`:
   ```sql
   INSERT INTO public.admins (user_id, role)
   VALUES ('YOUR_USER_UUID', 'admin');
   ```

---

## 4. Production Deployment

To build for production:

```bash
npm run build
```

This compiles a standalone single-page application into `admin-panel/dist/`.

Deploy this directory directly to:
- **Cloudflare Pages**
- **Vercel** (`Root Directory: admin-panel`)
- **Netlify** (`Base directory: admin-panel`)
- Or a custom sub-domain like `admin.wolvoinfotech.com`.

---

## 5. Security Summary

- **Authentication:** Supabase Auth with encrypted JWT sessions.
- **Role-Based Access Control (RBAC):** Every action requires validation in `public.admins`.
- **Row Level Security (RLS):** Anonymous visitors can only read published content. All create, update, and delete actions require admin privileges.
- **Audit Logs:** Immutable audit trail records every content change with user email and timestamp.
- **Zero Public Leakage:** The public website bundle contains zero admin routes, zero admin forms, and zero admin assets.
