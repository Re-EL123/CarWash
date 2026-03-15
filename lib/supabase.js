import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ifpjtxnqrjdhxnpmdsni.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcGp0eG5xcmpkaHhucG1kc25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTk2MjMsImV4cCI6MjA4OTA5NTYyM30.o9AYRFSJoJ1584wq7YSQYJF5UinzQUyYfeqPGAkJMo8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { params: { eventsPerSecond: 10 } },
});

// ── Bookings ────────────────────────────────────────────────
export const fetchBookings = async (filters = {}) => {
  let query = supabase.from('bookings').select('*').order('booking_date', { ascending: true });
  if (filters.date)   query = query.eq('booking_date', filters.date);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.phone)  query = query.eq('phone', filters.phone);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createBooking = async (booking) => {
  const { data, error } = await supabase.from('bookings').insert([booking]).select().single();
  if (error) throw error;
  return data;
};

export const updateBookingStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteBooking = async (id) => {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) throw error;
};

export const fetchMyBookings = async (phone) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('phone', phone)
    .order('booking_date', { ascending: false });
  if (error) throw error;
  return data;
};

// ── Services ────────────────────────────────────────────────
export const fetchServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return data;
};

export const addService = async (service) => {
  const { data, error } = await supabase.from('services').insert([service]).select().single();
  if (error) throw error;
  return data;
};

export const updateService = async (id, updates) => {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteService = async (id) => {
  const { error } = await supabase.from('services').update({ is_active: false }).eq('id', id);
  if (error) throw error;
};