import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const TMP_FILE = path.join('/tmp', 'glow_grace_sync.json');

// Initialize in-memory store across serverless calls
if (!globalThis.__glow_grace_db) {
  globalThis.__glow_grace_db = {
    bookings: [],
    mehendi: null,
    saree: null,
    gallery: null,
    lastUpdated: 0,
    adminCredentials: {
      email: 'supriyaturpati1117@gmail.com',
      password: '8074541442'
    }
  };

  // Try reading from /tmp if exists
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, 'utf-8');
      globalThis.__glow_grace_db = JSON.parse(data);
    }
  } catch (err) {
    // Ignore read errors
  }
}

export async function GET() {
  try {
    // 1. Try reading from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('glow_grace_sync')
          .select('*')
          .eq('id', 'master_sync')
          .single();

        if (data && !error && data.payload) {
          globalThis.__glow_grace_db = data.payload;
          return NextResponse.json(data.payload);
        }
      } catch (sbErr) {
        // Fall back to in-memory/file
      }
    }

    // 2. Read from in-memory global store or /tmp
    if (fs.existsSync(TMP_FILE)) {
      try {
        const fileData = fs.readFileSync(TMP_FILE, 'utf-8');
        globalThis.__glow_grace_db = JSON.parse(fileData);
      } catch {}
    }

    return NextResponse.json(globalThis.__glow_grace_db || {});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve sync data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const timestamp = Date.now();

    const updatedState = {
      bookings: body.bookings || globalThis.__glow_grace_db.bookings || [],
      mehendi: body.mehendi !== undefined ? body.mehendi : globalThis.__glow_grace_db.mehendi,
      saree: body.saree !== undefined ? body.saree : globalThis.__glow_grace_db.saree,
      gallery: body.gallery !== undefined ? body.gallery : globalThis.__glow_grace_db.gallery,
      adminCredentials: body.adminCredentials || globalThis.__glow_grace_db.adminCredentials,
      lastUpdated: timestamp
    };

    globalThis.__glow_grace_db = updatedState;

    // Persist to /tmp
    try {
      fs.writeFileSync(TMP_FILE, JSON.stringify(updatedState), 'utf-8');
    } catch {}

    // Persist to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('glow_grace_sync')
          .upsert({ id: 'master_sync', payload: updatedState, updated_at: new Date().toISOString() });
      } catch {}
    }

    return NextResponse.json({
      success: true,
      lastUpdated: timestamp,
      recordsCount: updatedState.bookings.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save sync data' },
      { status: 500 }
    );
  }
}
