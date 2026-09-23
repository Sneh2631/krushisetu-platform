-- ========================================================================
-- Migration: 20260901000000_krishisetu_core_schema.sql
-- Description: Core tables, indices, RLS policies, and seed data for KrishiSetu
-- ========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table: user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table: profiles
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

-- 3. Table: produce_listings
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

-- 4. Table: buyer_requirements
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

-- 5. Table: deals
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

-- 6. Table: verification_requests
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

-- 7. Table: documents
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

-- 8. Table: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
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

-- 9. Table: news
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
