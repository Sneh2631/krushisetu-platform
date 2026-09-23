-- ========================================================================
-- KrishiSetu PostgreSQL Schema & Row-Level Security (RLS) Policies
-- Database: Supabase PostgreSQL
-- Version: 2.0.0
-- ========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------
-- 1. Table: user_roles
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- ------------------------------------------------------------------------
-- 2. Table: profiles
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL UNIQUE,
    email TEXT,
    role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
    account_type TEXT NOT NULL CHECK (account_type IN ('farmer', 'fpo', 'buyer', 'admin')),
    state TEXT NOT NULL DEFAULT 'Gujarat',
    district TEXT NOT NULL,
    taluka TEXT,
    village TEXT NOT NULL,
    pin_code TEXT,
    pickup_address TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'gu' CHECK (preferred_language IN ('en', 'gu', 'hi')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_status TEXT NOT NULL DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Rejected', 'More Information Required')),
    rejection_reason TEXT,
    
    -- Farmer specific attributes
    fpo_name TEXT,
    crops JSONB DEFAULT '[]'::jsonb,
    farm_size TEXT,
    storage_available BOOLEAN DEFAULT TRUE,
    transport_needed BOOLEAN DEFAULT TRUE,
    bank_account_name TEXT,
    bank_account_number TEXT,
    bank_ifsc_code TEXT,
    upi_id TEXT,
    identity_doc_type TEXT,
    identity_doc_url TEXT,
    identity_doc_number TEXT,
    
    -- Buyer specific attributes
    company_name TEXT,
    buyer_type TEXT,
    gst_number TEXT,
    pan_number TEXT,
    required_commodities JSONB DEFAULT '[]'::jsonb,
    delivery_address TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_mobile ON public.profiles(mobile);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON public.profiles(district);

-- ------------------------------------------------------------------------
-- 3. Table: produce_listings
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.produce_listings (
    id TEXT PRIMARY KEY,
    listing_code TEXT NOT NULL UNIQUE,
    farmer_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farmer_name TEXT NOT NULL,
    farmer_mobile TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Vegetables', 'Fruits', 'Spices')),
    crop TEXT NOT NULL,
    crop_gu TEXT,
    variety TEXT,
    quantity NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'tonne',
    min_purchase_quantity NUMERIC(10, 2) DEFAULT 1,
    grade TEXT NOT NULL DEFAULT 'Grade A (Export / Super)',
    verified_grade TEXT,
    harvest_date DATE NOT NULL,
    freshness_condition TEXT,
    is_organic BOOLEAN DEFAULT FALSE,
    organic_cert_url TEXT,
    description TEXT,
    expected_price NUMERIC(10, 2) NOT NULL,
    price_unit TEXT NOT NULL DEFAULT 'quintal',
    suggested_price_min NUMERIC(10, 2),
    suggested_price_max NUMERIC(10, 2),
    district TEXT NOT NULL,
    taluka TEXT,
    village TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_ready_date DATE,
    pickup_available_until DATE,
    storage_available BOOLEAN DEFAULT FALSE,
    transport_needed BOOLEAN DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'Published' CHECK (status IN (
        'Draft', 'Submitted', 'Under Review', 'More Information Required',
        'Verified', 'Rejected', 'Published', 'Reserved', 'Sold', 'Completed', 'Expired'
    )),
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    admin_inspection_notes TEXT,
    corrections_requested TEXT,
    offers_count INTEGER DEFAULT 0,
    primary_image_url TEXT,
    photos JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listings_farmer_id ON public.produce_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_crop ON public.produce_listings(crop);
CREATE INDEX IF NOT EXISTS idx_listings_district ON public.produce_listings(district);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.produce_listings(status);

-- ------------------------------------------------------------------------
-- 4. Table: buyer_requirements
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.buyer_requirements (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL,
    buyer_mobile TEXT NOT NULL,
    company_name TEXT,
    category TEXT NOT NULL CHECK (category IN ('Vegetables', 'Fruits', 'Spices')),
    crop TEXT NOT NULL,
    crop_gu TEXT,
    required_quantity NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'tonne',
    target_price NUMERIC(10, 2),
    price_unit TEXT NOT NULL DEFAULT 'quintal',
    preferred_grade TEXT DEFAULT 'Grade A (Export / Super)',
    delivery_district TEXT NOT NULL,
    delivery_address TEXT,
    deadline_date DATE,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Fulfilled', 'Expired', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buyer_req_buyer_id ON public.buyer_requirements(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_req_crop ON public.buyer_requirements(crop);

-- ------------------------------------------------------------------------
-- 5. Table: deals
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deals (
    id TEXT PRIMARY KEY,
    deal_code TEXT NOT NULL UNIQUE,
    listing_id TEXT REFERENCES public.produce_listings(id) ON DELETE SET NULL,
    offer_id TEXT,
    farmer_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farmer_name TEXT NOT NULL,
    farmer_mobile TEXT NOT NULL,
    buyer_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL,
    buyer_company TEXT,
    buyer_mobile TEXT NOT NULL,
    crop TEXT NOT NULL,
    crop_gu TEXT,
    quantity NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'tonne',
    agreed_price_per_unit NUMERIC(10, 2) NOT NULL,
    price_unit TEXT NOT NULL DEFAULT 'quintal',
    total_estimated_value NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Offer Accepted' CHECK (status IN (
        'Discussion Started', 'Offer Accepted', 'Pickup Scheduled',
        'Product Collected', 'In Transit', 'Delivered', 'Payment Pending',
        'Completed', 'Cancelled', 'Disputed'
    )),
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    scheduled_pickup_date DATE,
    transport_mode TEXT DEFAULT 'Buyer Organized',
    escrow_deposited BOOLEAN DEFAULT FALSE,
    escrow_deposit_amount NUMERIC(12, 2) DEFAULT 0,
    farmer_paid BOOLEAN DEFAULT FALSE,
    milestones JSONB DEFAULT '[]'::jsonb,
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deals_farmer_id ON public.deals(farmer_id);
CREATE INDEX IF NOT EXISTS idx_deals_buyer_id ON public.deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON public.deals(status);

-- ------------------------------------------------------------------------
-- 6. Table: verification_requests
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL CHECK (user_role IN ('farmer', 'buyer', 'admin')),
    mobile TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_number TEXT,
    document_url TEXT NOT NULL,
    additional_notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Rejected', 'More Information Required')),
    admin_id TEXT,
    admin_name TEXT,
    admin_notes TEXT,
    requested_info_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_user_id ON public.verification_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_status ON public.verification_requests(status);

-- ------------------------------------------------------------------------
-- 7. Table: documents
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);

-- ------------------------------------------------------------------------
-- 8. Table: notifications
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL, -- specific user ID or 'ADMIN_ALL'
    recipient_role TEXT CHECK (recipient_role IN ('farmer', 'buyer', 'admin', 'all')),
    type TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_gu TEXT NOT NULL,
    message_en TEXT NOT NULL,
    message_gu TEXT NOT NULL,
    is_admin_only BOOLEAN NOT NULL DEFAULT FALSE,
    deal_id TEXT,
    listing_id TEXT,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_admin_only ON public.notifications(is_admin_only);

-- ------------------------------------------------------------------------
-- 9. Table: news (Public KrishiSetu Announcements)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news (
    id TEXT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_gu TEXT NOT NULL,
    summary_en TEXT NOT NULL,
    summary_gu TEXT NOT NULL,
    content_en TEXT,
    content_gu TEXT,
    category TEXT NOT NULL CHECK (category IN ('MSP & Rates', 'Government Schemes', 'Market Advisory', 'Weather & Logistics', 'Platform Updates')),
    category_gu TEXT NOT NULL,
    tag TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    author_name TEXT DEFAULT 'KrishiSetu Editorial Desk',
    image_url TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);

-- ========================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Helper functions for JWT claims & Admin verification
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() ->> 'phone' = '9274288006' OR
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()::text AND role = 'admin'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Users can view their own profile or public profile info"
    ON public.profiles FOR SELECT
    USING (
        auth.uid()::text = user_id OR
        id = auth.uid()::text OR
        public.is_admin()
    );

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (
        auth.uid()::text = user_id OR
        id = auth.uid()::text OR
        public.is_admin()
    );

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (
        auth.uid()::text = user_id OR
        id = auth.uid()::text OR
        public.is_admin()
    );

-- 2. Produce Listings Policies
CREATE POLICY "Anyone can view published produce listings"
    ON public.produce_listings FOR SELECT
    USING (
        status IN ('Published', 'Verified') OR
        farmer_id = auth.uid()::text OR
        public.is_admin()
    );

CREATE POLICY "Farmers can create listings"
    ON public.produce_listings FOR INSERT
    WITH CHECK (
        farmer_id = auth.uid()::text OR
        public.is_admin()
    );

CREATE POLICY "Farmers can update their own listings; Admins can update all"
    ON public.produce_listings FOR UPDATE
    USING (
        farmer_id = auth.uid()::text OR
        public.is_admin()
    );

-- 3. Buyer Requirements Policies
CREATE POLICY "Anyone can view active buyer requirements"
    ON public.buyer_requirements FOR SELECT
    USING (
        status = 'Active' OR
        buyer_id = auth.uid()::text OR
        public.is_admin()
    );

CREATE POLICY "Buyers can manage their requirements"
    ON public.buyer_requirements FOR ALL
    USING (
        buyer_id = auth.uid()::text OR
        public.is_admin()
    );

-- 4. Deals Policies (Strict Counterparty & Admin Isolation)
CREATE POLICY "Only deal counterparties and admin can view deal"
    ON public.deals FOR SELECT
    USING (
        farmer_id = auth.uid()::text OR
        buyer_id = auth.uid()::text OR
        public.is_admin()
    );

CREATE POLICY "Deal counterparties and admin can update deal"
    ON public.deals FOR UPDATE
    USING (
        farmer_id = auth.uid()::text OR
        buyer_id = auth.uid()::text OR
        public.is_admin()
    );

-- 5. Verification Requests Policies
CREATE POLICY "Users can view only their own verification requests"
    ON public.verification_requests FOR SELECT
    USING (
        user_id = auth.uid()::text OR
        public.is_admin()
    );

CREATE POLICY "Users can submit their verification request"
    ON public.verification_requests FOR INSERT
    WITH CHECK (
        user_id = auth.uid()::text OR
        public.is_admin()
    );

CREATE POLICY "Only admin can update verification requests"
    ON public.verification_requests FOR UPDATE
    USING (
        public.is_admin()
    );

-- 6. Documents Policies
CREATE POLICY "Users can view their own documents"
    ON public.documents FOR SELECT
    USING (
        user_id = auth.uid()::text OR
        public.is_admin()
    );

CREATE POLICY "Users can upload their own documents"
    ON public.documents FOR INSERT
    WITH CHECK (
        user_id = auth.uid()::text OR
        public.is_admin()
    );

-- 7. Notifications Policies
CREATE POLICY "Users can view only their own notifications"
    ON public.notifications FOR SELECT
    USING (
        (user_id = auth.uid()::text AND is_admin_only = FALSE) OR
        (is_admin_only = TRUE AND public.is_admin())
    );

CREATE POLICY "Users can mark their own notifications as read"
    ON public.notifications FOR UPDATE
    USING (
        user_id = auth.uid()::text OR
        public.is_admin()
    );

-- 8. News Policies (Public Read, Admin Write)
CREATE POLICY "Everyone can read published news"
    ON public.news FOR SELECT
    USING (TRUE);

CREATE POLICY "Only admin can create, update, delete news"
    ON public.news FOR ALL
    USING (
        public.is_admin()
    );

-- ========================================================================
-- INITIAL SEED DATA FOR NEWS & ADVISORIES
-- ========================================================================
INSERT INTO public.news (
    id, title_en, title_gu, summary_en, summary_gu, content_en, content_gu, category, category_gu, tag, is_pinned, author_name
) VALUES 
(
    'NEWS-2026-001',
    'Gujarat Mandi Onion MSP & Storage Subsidy 2026 Announced',
    'ગુજરાત સરકાર દ્વારા ડુંગળી સંગ્રહ સહાય અને ટેકાના ભાવ જાહેર',
    'GSAMB announces ₹200/quintal storage subvention for Saurashtra farmers storing in certified WDRA warehouses.',
    'સૌરાષ્ટ્રના ડુંગળી પકવતા ખેડૂતો માટે પ્રતિ ક્વિન્ટલ ₹200 સુધીની સંગ્રહ સબસિડી અને કૃષિસેતુ વેરીફાઈડ ખેડૂતોને ડાયરેક્ટ પ્રોક્યોરમેન્ટ લાભ.',
    'Detailed guidance on WDRA warehouse receipts and digital escrow payments under Gujarat State Agricultural Marketing Board guidelines.',
    'ગુજરાત રાજ્ય કૃષિ બજાર બોર્ડ (GSAMB) દ્વારા મહુવા, ગોંડલ અને ભાવનગર યાર્ડના ખેડૂતો માટે ખાસ ડુંગળી સહાય પેકેજ જાહેર કરવામાં આવ્યું છે.',
    'MSP & Rates',
    'ટેકાના ભાવ અને દરો',
    'Important',
    TRUE,
    'GSAMB Krishi Niyamak Desk'
),
(
    'NEWS-2026-002',
    'Deesa Potato Processing Demand Surges 35% for Food Processors',
    'ડીસા ગોલ્ડ બટાટાની વેફર અને પ્રોસેસિંગ કંપનીઓમાં 35% માંગ વધી',
    'Balaji, PepsiCo, and national buyers actively purchasing Lady Rosetta variety directly from farm gates.',
    'બાલજી, પેપ્સીકો અને અગ્રણી ફૂડ પ્રોસેસર્સ ડીસાના ખેડૂતો પાસેથી સીધા ફાર્મગેટ પરથી લાલ અને ચિપ્સોના બટાટાની ખરીદી કરી રહ્યા છે.',
    'High dry matter potato lots with Grade A certification are receiving premium rates over APMC auctions through KrishiSetu direct contracts.',
    'ચિપ્સોના અને લેડી રોઝેટા જાતના ગુણવત્તાયુક્ત બટાટા માટે ખેડૂતોને સીધા એસ્ક્રૉ ખાતામાં પેમેન્ટ સાથે પ્રતિ ક્વિન્ટલ શ્રેષ્ઠ ભાવ મળી રહ્યા છે.',
    'Market Advisory',
    'બજાર માર્ગદર્શન',
    'Trending',
    FALSE,
    'KrishiSetu Market Intelligence'
),
(
    'NEWS-2026-003',
    'Gir Kesar Mango GI Tag Certification Drive for 2026 Summer Season',
    'ગીર કેસર કેરી જીઆઈ (GI) ટેગ સર્ટિફિકેશન ડ્રાઇવ શરૂ',
    'Talala & Junagadh growers can now submit land 7/12 records to receive verified GI badges on KrishiSetu.',
    'તાલાલા અને ગીર સોમનાથના આંબા વાવતા ખેડૂતો પોતાના 7/12 ઉતારા અપલોડ કરી વેરીફાઈડ જીઆઈ ટેગ બેજ મેળવી શકે છે.',
    'Verified GI tag lots are prioritized for international and Tier-1 Indian buyers with 100% advance escrow clearing.',
    'જીઆઈ ટેગ ધરાવતી અસલ કેસર કેરી માટે પ્રીમિયમ કિંમત અને ડાયરેક્ટ એક્સપોર્ટ કનેક્ટ ઉપલબ્ધ બનશે.',
    'Government Schemes',
    'સરકારી યોજનાઓ',
    'GI Tag',
    FALSE,
    'Horticulture Dept. Gujarat'
)
ON CONFLICT (id) DO NOTHING;
