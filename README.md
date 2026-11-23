# Glow & Grace (గ్లో & గ్రేస్)
### Online Mehendi and Saree Pre-Pleating Service Booking Platform

Glow & Grace is a modern, responsive web application designed for booking and managing doorstep Mehendi artistry and professional Saree Pre-Pleating services. Built strictly according to the Software Requirements Specification (SRS v1.0).

---

## 🌟 Key Highlights

- **Bilingual Interface (English & Telugu)**: Seamless language switcher in navigation, with persistent preferences and complete support for Telugu script (`Noto Sans Telugu`).
- **Mehendi Artistry Catalogue**: Filter by category (Bridal, Arabic, Traditional, Simple, Engagement, Festive), view pricing, duration, and book instantly.
- **Saree Pre-Pleating Catalogue**: Handcrafted box-fold styles, Kanjeevaram silk pleating, designer fabrics, and multi-saree quantity calculator.
- **Interactive Doorstep Booking Wizard**: 3-step booking flow calculating dynamic estimated cost, event dates, preferred time, and venue addresses.
- **Customer Booking History & Tracking**: Real-time status tracking (`Pending`, `Confirmed`, `Rejected`, `Completed`) with cancellation request handling.
- **Secure Administrator Cockpit**:
  - Live business metrics & KPIs (Total Bookings, Pending, Confirmed, Completed, Revenue).
  - Booking approval system (one-click Accept / Decline / Mark Completed).
  - Payment status tracking (`Unpaid` / `Paid`).
  - Mehendi & Saree design management.
  - Bilingual translation review panel.
- **Direct WhatsApp & Instant Contact**: Floating WhatsApp action button and direct customer messaging.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with custom Indian celebratory bridal theme (Henna, Maroon, Gold)
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL, Storage, Realtime, Row Level Security)
- **Internationalization**: Context-based bilingual engine (`en` & `te`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Add your Supabase project credentials if connecting to live cloud database:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
*(Note: A built-in mock data adapter is included so the entire application, booking flow, and admin dashboard work seamlessly out-of-the-box in local development!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Administrator Access
- **Admin Login Route**: `/admin/login`
- **Demo Credentials**:
  - Email: `admin@glowandgrace.com`
  - Password: `admin123`

---

## 🗄️ Database Setup
The complete PostgreSQL database schema with Row Level Security (RLS) policies and tables (`profiles`, `mehendi_designs`, `saree_styles`, `bookings`, `gallery`, `conversations`, `messages`, `notifications`) is located in:
`supabase/schema.sql`
