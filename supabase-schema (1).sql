-- ============================================================
-- THE CARWASH @ RIETVLEI — SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- SERVICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'droplets',
  price NUMERIC(10, 2) DEFAULT 0,
  duration_minutes INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed services
INSERT INTO services (name, description, icon, price, duration_minutes) VALUES
  ('Exterior Wash',   'Complete exterior hand wash and rinse',                  'droplets',      80,  30),
  ('Hand Dry',        'Manual towel drying after wash',                         'wind',          30,  15),
  ('Vacuum',          'Full interior vacuum of seats and carpets',              'sparkles',      50,  20),
  ('Interior Wash',   'Deep clean of interior surfaces, dash and panels',       'spray-can',    120,  45),
  ('Engine Wash',     'Safe engine bay cleaning and degreasing',                'settings',     150,  60),
  ('Full Valet',      'Complete inside and outside professional detail',        'star',         350, 120),
  ('Body Polishing',  'Machine polish to restore exterior shine',               'circle-dot',   250,  90),
  ('Air Freshener',   'Premium interior fragrance treatment',                   'wind',          25,   5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_reg TEXT,
  service TEXT NOT NULL,
  service_id UUID REFERENCES services(id),
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending'
    CHECK (status IN ('Pending','Confirmed','In Progress','Completed','Cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow all reads on services (public menu)
CREATE POLICY "Public read services"
  ON services FOR SELECT USING (TRUE);

-- Allow all inserts on bookings (customers booking)
CREATE POLICY "Public insert bookings"
  ON bookings FOR INSERT WITH CHECK (TRUE);

-- Allow all reads on bookings (admin + customer my bookings)
CREATE POLICY "Public read bookings"
  ON bookings FOR SELECT USING (TRUE);

-- Allow updates (admin status changes)
CREATE POLICY "Public update bookings"
  ON bookings FOR UPDATE USING (TRUE);

-- Allow deletes (admin)
CREATE POLICY "Public delete bookings"
  ON bookings FOR DELETE USING (TRUE);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_date   ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_phone  ON bookings (phone);

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE services;
