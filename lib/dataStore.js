import { INITIAL_MEHENDI_DESIGNS, INITIAL_SAREE_STYLES, INITIAL_GALLERY } from './initialData';

const STORAGE_KEYS = {
  MEHENDI: 'glow_grace_mehendi_items',
  SAREE: 'glow_grace_saree_items',
  GALLERY: 'glow_grace_gallery_items',
  BOOKINGS: 'glow_grace_bookings_items',
  USER: 'glow_grace_mock_user',
  LAST_SYNC: 'glow_grace_last_sync_timestamp'
};

const isClient = typeof window !== 'undefined';

// Asynchronous push to live serverless sync endpoint
async function pushToServer(payload) {
  if (!isClient) return;
  try {
    const fullPayload = payload || {
      bookings: dataStore.getBookings(),
      mehendi: dataStore.getMehendiDesigns(),
      saree: dataStore.getSareeStyles(),
      gallery: dataStore.getGalleryItems(),
      adminCredentials: dataStore.getAdminCredentials()
    };
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullPayload)
    });
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, String(Date.now()));
  } catch (err) {
    // Fail silently on offline mode
  }
}

export const dataStore = {
  // =================== LIVE SERVER SYNC ===================
  syncWithServer: async () => {
    if (!isClient) return false;
    try {
      const res = await fetch('/api/sync');
      if (!res.ok) return false;
      const data = await res.json();
      if (!data) return false;

      let hasChanges = false;

      if (Array.isArray(data.bookings) && data.bookings.length > 0) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(data.bookings));
        hasChanges = true;
      }
      if (Array.isArray(data.mehendi) && data.mehendi.length > 0) {
        localStorage.setItem(STORAGE_KEYS.MEHENDI, JSON.stringify(data.mehendi));
        hasChanges = true;
      }
      if (Array.isArray(data.saree) && data.saree.length > 0) {
        localStorage.setItem(STORAGE_KEYS.SAREE, JSON.stringify(data.saree));
        hasChanges = true;
      }
      if (Array.isArray(data.gallery) && data.gallery.length > 0) {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(data.gallery));
        hasChanges = true;
      }

      if (data.lastUpdated) {
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, String(data.lastUpdated));
      }

      if (hasChanges) {
        window.dispatchEvent(new CustomEvent('glow_grace_data_synced'));
      }
      return true;
    } catch {
      return false;
    }
  },

  exportBackupString: () => {
    if (!isClient) return '';
    const payload = {
      bookings: dataStore.getBookings(),
      mehendi: dataStore.getMehendiDesigns(),
      saree: dataStore.getSareeStyles(),
      gallery: dataStore.getGalleryItems(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(payload);
  },

  importBackupString: async (backupStr) => {
    if (!isClient || !backupStr) return false;
    try {
      const parsed = JSON.parse(backupStr.trim());
      if (parsed.bookings && Array.isArray(parsed.bookings)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(parsed.bookings));
      }
      if (parsed.mehendi && Array.isArray(parsed.mehendi)) {
        localStorage.setItem(STORAGE_KEYS.MEHENDI, JSON.stringify(parsed.mehendi));
      }
      if (parsed.saree && Array.isArray(parsed.saree)) {
        localStorage.setItem(STORAGE_KEYS.SAREE, JSON.stringify(parsed.saree));
      }
      if (parsed.gallery && Array.isArray(parsed.gallery)) {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(parsed.gallery));
      }
      await pushToServer();
      window.dispatchEvent(new CustomEvent('glow_grace_data_synced'));
      return true;
    } catch (err) {
      console.error('Invalid backup code', err);
      return false;
    }
  },

  // =================== MEHENDI DESIGNS ===================
  getMehendiDesigns: () => {
    if (!isClient) return INITIAL_MEHENDI_DESIGNS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEHENDI);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.MEHENDI, JSON.stringify(INITIAL_MEHENDI_DESIGNS));
      return INITIAL_MEHENDI_DESIGNS;
    } catch {
      return INITIAL_MEHENDI_DESIGNS;
    }
  },

  addMehendiDesign: (design) => {
    if (!isClient) return design;
    const current = dataStore.getMehendiDesigns();
    const newItem = {
      ...design,
      id: design.id || 'm-' + Date.now(),
      created_at: new Date().toISOString(),
      is_active: true
    };
    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_KEYS.MEHENDI, JSON.stringify(updated));
    pushToServer();
    return newItem;
  },

  updateMehendiDesign: (id, fields) => {
    if (!isClient) return null;
    const current = dataStore.getMehendiDesigns();
    const updated = current.map(item => item.id === id ? { ...item, ...fields } : item);
    localStorage.setItem(STORAGE_KEYS.MEHENDI, JSON.stringify(updated));
    pushToServer();
    return updated.find(item => item.id === id);
  },

  deleteMehendiDesign: (id) => {
    if (!isClient) return;
    const current = dataStore.getMehendiDesigns();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEHENDI, JSON.stringify(updated));
    pushToServer();
    return updated;
  },

  // =================== SAREE STYLES ===================
  getSareeStyles: () => {
    if (!isClient) return INITIAL_SAREE_STYLES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAREE);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.SAREE, JSON.stringify(INITIAL_SAREE_STYLES));
      return INITIAL_SAREE_STYLES;
    } catch {
      return INITIAL_SAREE_STYLES;
    }
  },

  addSareeStyle: (style) => {
    if (!isClient) return style;
    const current = dataStore.getSareeStyles();
    const newItem = {
      ...style,
      id: style.id || 's-' + Date.now(),
      created_at: new Date().toISOString(),
      is_active: true
    };
    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_KEYS.SAREE, JSON.stringify(updated));
    pushToServer();
    return newItem;
  },

  updateSareeStyle: (id, fields) => {
    if (!isClient) return null;
    const current = dataStore.getSareeStyles();
    const updated = current.map(item => item.id === id ? { ...item, ...fields } : item);
    localStorage.setItem(STORAGE_KEYS.SAREE, JSON.stringify(updated));
    pushToServer();
    return updated.find(item => item.id === id);
  },

  deleteSareeStyle: (id) => {
    if (!isClient) return;
    const current = dataStore.getSareeStyles();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAREE, JSON.stringify(updated));
    pushToServer();
    return updated;
  },

  // =================== GALLERY & OUR WORK ===================
  getGalleryItems: () => {
    if (!isClient) return INITIAL_GALLERY;
    try {
      let baseGallery = [];
      const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (stored) {
        baseGallery = JSON.parse(stored);
      } else {
        localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
        baseGallery = INITIAL_GALLERY;
      }

      // Read completed bookings that have a completion photo attached
      const bookings = dataStore.getBookings();
      const completedWorks = bookings
        .filter(b => b.completion_photo && b.show_in_gallery !== false)
        .map(b => ({
          id: `booking-work-${b.id}`,
          booking_id: b.id,
          service_type: b.service_type === 'both' ? 'mehendi' : (b.service_type || 'mehendi'),
          customer_name: b.customer_name,
          event_name: b.event_type,
          event_date: b.event_date,
          category: b.mehendi_design_name || b.saree_style_name || b.event_type || 'Completed Client Work',
          title_en: `${b.customer_name} • ${b.event_type}`,
          title_te: `${b.customer_name} గారి • ${b.event_type}`,
          image_url: b.completion_photo,
          is_completed_client_work: true,
          created_at: b.created_at || new Date().toISOString()
        }));

      return [...completedWorks, ...baseGallery];
    } catch {
      return INITIAL_GALLERY;
    }
  },

  addGalleryItem: (item) => {
    if (!isClient) return item;
    let baseGallery = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
      baseGallery = stored ? JSON.parse(stored) : INITIAL_GALLERY;
    } catch {
      baseGallery = INITIAL_GALLERY;
    }
    const newItem = {
      ...item,
      id: item.id || 'g-' + Date.now(),
      created_at: new Date().toISOString()
    };
    const updated = [newItem, ...baseGallery];
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));
    pushToServer();
    return newItem;
  },

  deleteGalleryItem: (id) => {
    if (!isClient) return;
    try {
      if (id.startsWith('booking-work-')) {
        const bookingId = id.replace('booking-work-', '');
        dataStore.updateBookingPhoto(bookingId, null, false);
        return;
      }
      const stored = localStorage.getItem(STORAGE_KEYS.GALLERY);
      const baseGallery = stored ? JSON.parse(stored) : INITIAL_GALLERY;
      const updated = baseGallery.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(updated));
      pushToServer();
      return updated;
    } catch {}
  },

  // =================== BOOKINGS & PAST RECORDS ===================
  getAdminCredentials: () => {
    if (!isClient) return { email: 'supriyaturpati1117@gmail.com', password: '8074541442' };
    try {
      const stored = localStorage.getItem('glow_grace_custom_admin_creds');
      if (stored) return JSON.parse(stored);
    } catch {}
    return { email: 'supriyaturpati1117@gmail.com', password: '8074541442' };
  },

  setAdminCredentials: (email, password) => {
    if (!isClient) return false;
    try {
      const creds = { email, password };
      localStorage.setItem('glow_grace_custom_admin_creds', JSON.stringify(creds));
      pushToServer();
      return true;
    } catch {
      return false;
    }
  },

  getBookings: () => {
    if (!isClient) return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (stored) return JSON.parse(stored);
      return [];
    } catch {
      return [];
    }
  },

  addBooking: (booking) => {
    if (!isClient) return booking;
    const current = dataStore.getBookings();
    const newBooking = {
      ...booking,
      id: booking.id || 'BK-' + Math.floor(100000 + Math.random() * 900000),
      created_at: booking.created_at || new Date().toISOString(),
      status: booking.status || 'pending',
      payment_status: booking.payment_status || 'unpaid',
      completion_photo: booking.completion_photo || null,
      show_in_gallery: booking.show_in_gallery !== undefined ? booking.show_in_gallery : Boolean(booking.completion_photo)
    };
    const updated = [newBooking, ...current];
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    pushToServer();
    return newBooking;
  },

  updateBookingStatus: (id, status, payment_status, extraFields = {}) => {
    if (!isClient) return null;
    const current = dataStore.getBookings();
    const updated = current.map(b => {
      if (b.id === id) {
        return {
          ...b,
          ...(status ? { status } : {}),
          ...(payment_status ? { payment_status } : {}),
          ...extraFields
        };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    pushToServer();
    return updated.find(b => b.id === id);
  },

  updateBookingPhoto: (id, completion_photo, show_in_gallery = true) => {
    if (!isClient) return null;
    const current = dataStore.getBookings();
    const updated = current.map(b => {
      if (b.id === id) {
        return {
          ...b,
          completion_photo: completion_photo,
          show_in_gallery: show_in_gallery
        };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    pushToServer();
    return updated.find(b => b.id === id);
  },

  deleteBooking: (id) => {
    if (!isClient) return;
    const current = dataStore.getBookings();
    const updated = current.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    pushToServer();
    return updated;
  },

  // =================== MOCK USER PROFILE ===================
  getMockUser: () => {
    if (!isClient) return null;
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
    } catch {
      return null;
    }
  },

  setMockUser: (user) => {
    if (!isClient) return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }
};
