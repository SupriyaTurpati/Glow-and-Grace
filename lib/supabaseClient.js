import { createClient } from '@supabase/supabase-js';
import { dataStore } from './dataStore';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' &&
  !supabaseUrl.includes('example.com')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local persistent store proxy
export const localStore = {
  getBookings: dataStore.getBookings,
  saveBooking: dataStore.addBooking,
  updateBookingStatus: dataStore.updateBookingStatus,
  deleteBooking: dataStore.deleteBooking,
  getMockUser: dataStore.getMockUser,
  setMockUser: dataStore.setMockUser,
};
