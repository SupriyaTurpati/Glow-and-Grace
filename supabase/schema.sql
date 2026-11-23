-- ====================================================================
-- GLOW AND GRACE - DATABASE SCHEMA DEFINITION (SUPABASE / POSTGRESQL)
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Customers & Administrators)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    city_area VARCHAR(255),
    preferred_language VARCHAR(5) DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Mehendi Designs Catalogue
CREATE TABLE IF NOT EXISTS public.mehendi_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_te VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('bridal', 'simple', 'arabic', 'traditional', 'engagement', 'festival')),
    description_en TEXT NOT NULL,
    description_te TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL,
    popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Saree Pre-Pleating Styles Catalogue
CREATE TABLE IF NOT EXISTS public.saree_styles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_te VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('basic', 'bridal', 'traditional', 'designer', 'custom')),
    description_en TEXT NOT NULL,
    description_te TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL,
    popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('mehendi', 'saree', 'both')),
    mehendi_design_id UUID REFERENCES public.mehendi_designs(id) ON DELETE SET NULL,
    saree_style_id UUID REFERENCES public.saree_styles(id) ON DELETE SET NULL,
    saree_count INTEGER DEFAULT 1,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    service_location TEXT NOT NULL,
    additional_requirements TEXT,
    estimated_cost NUMERIC(10, 2) NOT NULL CHECK (estimated_cost >= 0),
    final_cost NUMERIC(10, 2) CHECK (final_cost >= 0),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancellation_requested', 'cancelled', 'completed')),
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Completed Work Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('mehendi', 'saree')),
    title_en VARCHAR(255) NOT NULL,
    title_te VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Realtime Chat Conversations & Messages
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    message_text TEXT NOT NULL,
    is_admin_reply BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mehendi_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saree_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Catalogues and Gallery are publicly readable
CREATE POLICY "Public read active mehendi designs" ON public.mehendi_designs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active saree styles" ON public.saree_styles FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery" ON public.gallery FOR SELECT USING (true);

-- Customers can view and update their own profiles
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Customers can insert bookings and read their own bookings
CREATE POLICY "Customers create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = customer_id OR customer_phone = (SELECT phone FROM public.profiles WHERE id = auth.uid()));

-- Admins full access policy based on profiles.role = 'admin'
CREATE POLICY "Admins full access on profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage mehendi" ON public.mehendi_designs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage saree" ON public.saree_styles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage bookings" ON public.bookings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins manage gallery" ON public.gallery FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
