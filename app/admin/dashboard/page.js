'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dataStore } from '@/lib/dataStore';
import { BUSINESS_CONFIG } from '@/lib/config';
import { 
  ShieldCheck, Calendar, CheckCircle2, XCircle, Clock, 
  DollarSign, Users, Phone, MapPin, Eye, Edit3, Trash2, 
  Plus, Globe, LogOut, Check, ChevronRight, X, Image as ImageIcon,
  Camera, Upload, Sparkles, User, KeyRound, Lock,
  RefreshCw, Smartphone, Download, UploadCloud, Bike
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Data states
  const [bookings, setBookings] = useState([]);
  const [mehendiList, setMehendiList] = useState([]);
  const [sareeList, setSareeList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);

  // Modal visibility states
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAddMehendiModal, setShowAddMehendiModal] = useState(false);
  const [showAddSareeModal, setShowAddSareeModal] = useState(false);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);

  // Quick photo upload modal for existing booking
  const [editingPhotoBooking, setEditingPhotoBooking] = useState(null);
  const [modalPhoto, setModalPhoto] = useState('');
  const [modalShowInGallery, setModalShowInGallery] = useState(true);

  // Form states - New Booking / Past Record
  const [newBooking, setNewBooking] = useState({
    customer_name: '',
    customer_phone: '',
    service_type: 'mehendi',
    service_item_name: '',
    event_type: 'Wedding / Pellikuthuru',
    event_date: '',
    preferred_time: '10:00 AM',
    service_location: '',
    additional_requirements: '',
    estimated_cost: '',
    status: 'completed',
    payment_status: 'paid',
    completion_photo: '',
    show_in_gallery: true
  });

  // Form states - New Mehendi Design
  const [newMehendi, setNewMehendi] = useState({
    name_en: '',
    name_te: '',
    category: 'bridal',
    description_en: '',
    description_te: '',
    price: '',
    duration: '3 Hours',
    image_url: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=800&q=80',
    popular: false
  });

  // Form states - New Saree Style
  const [newSaree, setNewSaree] = useState({
    name_en: '',
    name_te: '',
    category: 'bridal',
    description_en: '',
    description_te: '',
    price: '',
    duration: '30 Mins',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
  });

  // Form states - New Gallery Item
  const [newGallery, setNewGallery] = useState({
    service_type: 'mehendi',
    title_en: '',
    title_te: '',
    category: 'Bridal Mehendi',
    image_url: 'https://images.unsplash.com/photo-1610030469668-93510cb28665?auto=format&fit=crop&w=800&q=80'
  });

  // Live Multi-Device Cloud Sync States
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced'
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [importCodeInput, setImportCodeInput] = useState('');
  const [syncToast, setSyncToast] = useState('');

  const refreshAllData = () => {
    setBookings(dataStore.getBookings());
    setMehendiList(dataStore.getMehendiDesigns());
    setSareeList(dataStore.getSareeStyles());
    setGalleryList(dataStore.getGalleryItems());
  };

  const handleTriggerSync = async () => {
    setSyncStatus('syncing');
    const ok = await dataStore.syncWithServer();
    if (ok) {
      setSyncStatus('synced');
      refreshAllData();
      setSyncToast('Live server sync complete! Latest data pulled across devices.');
    } else {
      setSyncStatus('idle');
      setSyncToast('Stored locally. Will re-sync when network allows.');
    }
    setTimeout(() => {
      setSyncStatus('idle');
      setSyncToast('');
    }, 4000);
  };

  const handleCopyBackup = () => {
    const code = dataStore.exportBackupString();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      alert('Cloud Sync Backup Code copied to clipboard!\n\nYou can now open this website on your second phone, click "Multi-Device Sync", and paste this code to transfer everything instantly!');
    } else {
      prompt('Copy your sync backup code below:', code);
    }
  };

  const handleImportBackup = async () => {
    if (!importCodeInput.trim()) {
      alert('Please paste the backup code first.');
      return;
    }
    const ok = await dataStore.importBackupString(importCodeInput.trim());
    if (ok) {
      refreshAllData();
      alert('Success! All completed records, designs, and changes from your other phone are now applied and synced.');
      setShowSyncModal(false);
      setImportCodeInput('');
    } else {
      alert('Invalid backup code. Please ensure you copied the complete code and try again.');
    }
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('glow_grace_admin_auth');
    if (!isAuth) {
      router.push('/admin/login');
    }
    refreshAllData();

    // Auto-sync in background from server
    dataStore.syncWithServer().then(() => {
      refreshAllData();
    });

    const onSynced = () => refreshAllData();
    window.addEventListener('glow_grace_data_synced', onSynced);
    return () => window.removeEventListener('glow_grace_data_synced', onSynced);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('glow_grace_admin_auth');
    router.push('/admin/login');
  };

  // Security & Credentials Modal States
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState('');
  const [securityErrorMsg, setSecurityErrorMsg] = useState('');

  const handleOpenSecurityModal = () => {
    const creds = dataStore.getAdminCredentials();
    setNewAdminEmail(creds.email || 'admin@glowandgrace.com');
    setNewAdminPassword('');
    setConfirmAdminPassword('');
    setSecurityErrorMsg('');
    setSecuritySuccessMsg('');
    setShowSecurityModal(true);
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    setSecurityErrorMsg('');
    setSecuritySuccessMsg('');

    if (!newAdminEmail.trim()) {
      setSecurityErrorMsg('Admin email cannot be empty.');
      return;
    }
    if (!newAdminPassword) {
      setSecurityErrorMsg('Please enter a new password.');
      return;
    }
    if (newAdminPassword.length < 4) {
      setSecurityErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (newAdminPassword !== confirmAdminPassword) {
      setSecurityErrorMsg('Passwords do not match.');
      return;
    }

    dataStore.setAdminCredentials(newAdminEmail.trim(), newAdminPassword);
    setSecuritySuccessMsg('Credentials updated! You can now log in with your new email and password.');
    setTimeout(() => {
      setShowSecurityModal(false);
    }, 2200);
  };

  // Helper: Convert File to Base64
  const handleFileChange = (e, callback) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ================= ACTION HANDLERS =================
  // Bookings CRUD
  const handleCreateBooking = (e) => {
    e.preventDefault();
    if (!newBooking.customer_name || !newBooking.customer_phone || !newBooking.event_date) {
      alert('Please fill in Customer Name, Phone, and Event Date');
      return;
    }
    dataStore.addBooking({
      ...newBooking,
      estimated_cost: Number(newBooking.estimated_cost) || 0,
      mehendi_design_name: newBooking.service_type !== 'saree' ? newBooking.service_item_name : null,
      saree_style_name: newBooking.service_type !== 'mehendi' ? newBooking.service_item_name : null,
      completion_photo: newBooking.completion_photo || null,
      show_in_gallery: Boolean(newBooking.completion_photo && newBooking.show_in_gallery)
    });
    // Reset form
    setNewBooking({
      customer_name: '',
      customer_phone: '',
      service_type: 'mehendi',
      service_item_name: '',
      event_type: 'Wedding / Pellikuthuru',
      event_date: '',
      preferred_time: '10:00 AM',
      service_location: '',
      additional_requirements: '',
      estimated_cost: '',
      status: 'completed',
      payment_status: 'paid',
      completion_photo: '',
      show_in_gallery: true
    });
    setShowAddBookingModal(false);
    refreshAllData();
  };

  const handleDeleteBooking = (id) => {
    if (confirm(`Are you sure you want to delete record #${id}?`)) {
      dataStore.deleteBooking(id);
      refreshAllData();
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    dataStore.updateBookingStatus(id, newStatus);
    refreshAllData();
  };

  const handleTogglePayment = (id, currentPayment) => {
    const next = currentPayment === 'paid' ? 'unpaid' : 'paid';
    dataStore.updateBookingStatus(id, null, next);
    refreshAllData();
  };

  // Photo update for existing booking
  const openPhotoModal = (booking) => {
    setEditingPhotoBooking(booking);
    setModalPhoto(booking.completion_photo || '');
    setModalShowInGallery(booking.show_in_gallery !== false);
  };

  const handleSavePhotoModal = (e) => {
    e.preventDefault();
    if (editingPhotoBooking) {
      dataStore.updateBookingPhoto(editingPhotoBooking.id, modalPhoto || null, modalShowInGallery);
      setEditingPhotoBooking(null);
      refreshAllData();
    }
  };

  // Mehendi CRUD
  const handleCreateMehendi = (e) => {
    e.preventDefault();
    if (!newMehendi.name_en || !newMehendi.price) {
      alert('Please provide Design Name and Price');
      return;
    }
    dataStore.addMehendiDesign({
      ...newMehendi,
      name_te: newMehendi.name_te || newMehendi.name_en,
      description_te: newMehendi.description_te || newMehendi.description_en,
      price: Number(newMehendi.price)
    });
    setShowAddMehendiModal(false);
    refreshAllData();
  };

  const handleDeleteMehendi = (id, name) => {
    if (confirm(`Are you sure you want to remove Mehendi design "${name}" from the catalogue?`)) {
      dataStore.deleteMehendiDesign(id);
      refreshAllData();
    }
  };

  // Saree CRUD
  const handleCreateSaree = (e) => {
    e.preventDefault();
    if (!newSaree.name_en || !newSaree.price) {
      alert('Please provide Style Name and Price');
      return;
    }
    dataStore.addSareeStyle({
      ...newSaree,
      name_te: newSaree.name_te || newSaree.name_en,
      description_te: newSaree.description_te || newSaree.description_en,
      price: Number(newSaree.price)
    });
    setShowAddSareeModal(false);
    refreshAllData();
  };

  const handleDeleteSaree = (id, name) => {
    if (confirm(`Are you sure you want to remove Saree style "${name}" from the catalogue?`)) {
      dataStore.deleteSareeStyle(id);
      refreshAllData();
    }
  };

  // Gallery CRUD
  const handleCreateGallery = (e) => {
    e.preventDefault();
    if (!newGallery.title_en || !newGallery.image_url) {
      alert('Please provide Title and Image URL');
      return;
    }
    dataStore.addGalleryItem({
      ...newGallery,
      title_te: newGallery.title_te || newGallery.title_en
    });
    setShowAddGalleryModal(false);
    refreshAllData();
  };

  const handleDeleteGallery = (id, title) => {
    if (confirm(`Are you sure you want to delete gallery photo "${title}"?`)) {
      dataStore.deleteGalleryItem(id);
      refreshAllData();
    }
  };

  // KPI Calculations
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (Number(b.estimated_cost) || 0), 0);

  return (
    <div className="min-h-screen bg-stone-100/70 pb-24">
      
      {/* Top Admin Header Bar */}
      <div className="bg-stone-900 text-white px-4 sm:px-8 py-4 border-b border-stone-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-henna-700 flex items-center justify-center text-gold-300 shadow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold">Glow &amp; Grace Business Control Cockpit</span>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span>Admin Phone: <strong className="text-emerald-400">{BUSINESS_CONFIG.formattedPhone}</strong></span>
              <span>•</span>
              <span className="text-stone-300">Live Owner Dashboard</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Multi-Device Cloud Sync Button */}
          <button
            onClick={() => setShowSyncModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/60 transition-colors shadow-sm"
            title="Sync data between multiple phones"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Multi-Device Sync</span>
            <span className="sm:hidden">Sync</span>
          </button>

          {/* Quick Refresh Sync Button */}
          <button
            onClick={handleTriggerSync}
            disabled={syncStatus === 'syncing'}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-700 transition-colors"
            title="Refresh and pull updates from live server"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold-400 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{syncStatus === 'syncing' ? 'Syncing...' : 'Live Sync'}</span>
          </button>

          <button
            onClick={handleOpenSecurityModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gold-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-700 shadow-sm"
            title="Update admin email and password"
          >
            <KeyRound className="w-4 h-4 text-gold-400" />
            <span className="hidden sm:inline">Change Password</span>
            <span className="sm:hidden">Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {syncToast && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center shadow-inner flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Real-time New Booking Alert Banner */}
        {pendingCount > 0 && (
          <div className="bg-gradient-to-r from-amber-600 via-henna-700 to-maroon-800 text-white p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-300/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-gold-300" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold flex items-center gap-2">
                  <span>🔔 New Customer Booking Request Received!</span>
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  You have {pendingCount} new customer appointment request(s) awaiting your review and confirmation.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('bookings')} 
              className="px-5 py-2.5 bg-white text-henna-950 rounded-xl text-xs font-bold hover:bg-gold-300 transition-colors whitespace-nowrap shadow"
            >
              Review Pending Bookings ({pendingCount})
            </button>
          </div>
        )}

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Records</span>
            <p className="font-serif text-2xl font-bold text-stone-900">{totalBookings}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Pending Review</span>
            <p className="font-serif text-2xl font-bold text-amber-700">{pendingCount}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Confirmed</span>
            <p className="font-serif text-2xl font-bold text-emerald-700">{confirmedCount}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Completed</span>
            <p className="font-serif text-2xl font-bold text-blue-700">{completedCount}</p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Revenue</span>
            <p className="font-serif text-2xl font-bold text-henna-800">₹{totalRevenue}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-henna-700 text-white shadow'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            Past Records &amp; Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('mehendi')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'mehendi'
                ? 'bg-henna-700 text-white shadow'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            Mehendi Designs ({mehendiList.length})
          </button>
          <button
            onClick={() => setActiveTab('saree')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'saree'
                ? 'bg-maroon-700 text-white shadow'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            Saree Pleating Styles ({sareeList.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-amber-700 text-white shadow'
                : 'bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            Completed Work Gallery ({galleryList.length})
          </button>
        </div>

        {/* ================= TAB 1: PAST RECORDS & BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">Past Records &amp; Booking Management</h2>
                <p className="text-xs text-stone-500">
                  Add completed customer records with photos. Attached photos automatically show on the <strong>"Our Work"</strong> page displaying only Customer Name &amp; Event Name (keeping personal contact info private).
                </p>
              </div>
              <button
                onClick={() => setShowAddBookingModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-henna-700 text-white text-xs font-semibold hover:bg-henna-800 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Past Booking Record</span>
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-stone-500 border border-dashed border-stone-300">
                No customer booking records yet. Click the button above to add past orders with completion photos!
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4 hover:border-henna-200 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                      <div className="flex items-start gap-4">
                        {/* Completion Photo thumbnail if uploaded */}
                        {booking.completion_photo ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-henna-200 shrink-0 group">
                            <img src={booking.completion_photo} alt="Work photo" className="w-full h-full object-cover" />
                            <button
                              onClick={() => openPhotoModal(booking)}
                              className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-semibold transition-opacity"
                            >
                              Edit
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openPhotoModal(booking)}
                            className="w-16 h-16 rounded-xl border border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 hover:text-henna-700 hover:border-henna-400 bg-stone-50 shrink-0 transition-colors"
                            title="Add Completion Photo"
                          >
                            <Camera className="w-5 h-5" />
                            <span className="text-[9px] mt-0.5 font-medium">+ Photo</span>
                          </button>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-henna-700">#{booking.id}</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-xs text-stone-500">
                              {booking.event_date ? `Event: ${booking.event_date}` : new Date(booking.created_at).toLocaleDateString()}
                            </span>
                            {booking.completion_photo && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <Sparkles className="w-3 h-3" />
                                <span>{booking.show_in_gallery !== false ? 'Live on Our Work' : 'Photo Stored'}</span>
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">
                            {booking.customer_name} — {booking.event_type}
                          </h3>
                        </div>
                      </div>

                      {/* Status Tags & Payment */}
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {booking.status}
                        </span>

                        <button
                          onClick={() => handleTogglePayment(booking.id, booking.payment_status)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            booking.payment_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-stone-50 text-stone-600 border-stone-300'
                          }`}
                        >
                          Payment: {booking.payment_status === 'paid' ? 'Paid ✓' : 'Unpaid'}
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          title="Delete Record"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
                      <div>
                        <p className="font-semibold text-stone-800">Customer &amp; Doorstep Address:</p>
                        <p>Phone: <strong>{booking.customer_phone}</strong></p>
                        <p className="mt-0.5 leading-relaxed">Address: {booking.service_location}</p>
                        {booking.landmark && <p className="text-amber-800 font-medium">Near: {booking.landmark}</p>}
                        {booking.distance_km && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-900">
                            <Bike className="w-3.5 h-3.5 text-henna-700" />
                            <span>Rapido: ~{booking.distance_km} km {booking.travel_charges !== undefined ? `(Travel: ₹${booking.travel_charges})` : ''}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">Schedule &amp; Time:</p>
                        <p>Date: {booking.event_date}</p>
                        <p>Time: {booking.preferred_time}</p>
                        {booking.saree_delivery_type && (
                          <p className="mt-1 text-[11px] font-semibold text-maroon-700">
                            {booking.saree_delivery_type === 'studio_drop' ? '🏢 Self Studio Drop (Natayyapalem)' : '🛵 Partner Doorstep Pickup & Return'}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">Service &amp; Amount Breakdown:</p>
                        <p>{booking.mehendi_design_name || ''}</p>
                        <p>{booking.saree_style_name || ''}</p>
                        <div className="mt-1 pt-1 border-t border-stone-100">
                          {booking.service_cost && (
                            <p className="text-[11px] text-stone-500">Service: ₹{booking.service_cost} | Travel: ₹{booking.travel_charges || 0}</p>
                          )}
                          <p className="font-bold text-henna-800 text-sm">Total: ₹{booking.estimated_cost}</p>
                        </div>
                      </div>
                    </div>

                    {booking.additional_requirements && (
                      <p className="text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-stone-600 italic">
                        Notes: "{booking.additional_requirements}"
                      </p>
                    )}

                    {/* Customer Custom Design Photo */}
                    {booking.custom_design_photo && (
                      <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={booking.custom_design_photo} 
                            alt="Customer custom design" 
                            className="w-14 h-14 rounded-lg object-cover border border-amber-300 shadow-sm cursor-pointer hover:opacity-90 shrink-0"
                            onClick={() => window.open(booking.custom_design_photo, '_blank')}
                          />
                          <div>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                              <Sparkles className="w-3 h-3 text-amber-700" />
                              <span>Customer Custom Design Uploaded</span>
                            </span>
                            <p className="text-xs text-stone-600 mt-1">Customer provided their own design reference image. Click photo to open full size.</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.open(booking.custom_design_photo, '_blank')}
                          className="px-3 py-1.5 rounded-lg bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto"
                        >
                          View Design Photo
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-3">
                        <a
                          href={`https://wa.me/${(booking.customer_phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hello ${booking.customer_name}! This is Glow & Grace (${BUSINESS_CONFIG.phone}) regarding your service record #${booking.id}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp Customer ({booking.customer_phone})</span>
                        </a>

                        <button
                          onClick={() => openPhotoModal(booking)}
                          className="inline-flex items-center gap-1 text-xs text-henna-700 font-medium hover:underline"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{booking.completion_photo ? 'Update Completed Photo' : '+ Attach Completion Photo'}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              Accept &amp; Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                              className="px-3.5 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'completed')}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: MEHENDI DESIGNS MANAGEMENT ================= */}
        {activeTab === 'mehendi' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">Manage Mehendi Designs Catalogue</h2>
                <p className="text-xs text-stone-500">Manually add new designs, set prices, and remove unwanted items.</p>
              </div>
              <button
                onClick={() => setShowAddMehendiModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-henna-700 text-white text-xs font-semibold hover:bg-henna-800 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Mehendi Design</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mehendiList.map((item) => (
                <div key={item.id} className="border border-stone-200 rounded-2xl overflow-hidden p-4 space-y-3 relative group hover:border-henna-300 transition-colors">
                  <div className="relative h-44 rounded-xl overflow-hidden">
                    <img src={item.image_url} alt={item.name_en} className="h-full w-full object-cover" />
                    <button
                      onClick={() => handleDeleteMehendi(item.id, item.name_en)}
                      title="Remove Design"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-henna-700 tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-base">{item.name_en}</h3>
                    <p className="text-xs text-stone-500 font-medium">{item.name_te}</p>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">{item.description_en}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <span className="font-bold text-henna-800 text-base">₹{item.price}</span>
                    <span className="text-stone-500">{item.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: SAREE STYLES MANAGEMENT ================= */}
        {activeTab === 'saree' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">Manage Saree Pre-Pleating Styles</h2>
                <p className="text-xs text-stone-500">Add new saree folding styles, update per-saree rates, and remove styles.</p>
              </div>
              <button
                onClick={() => setShowAddSareeModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-maroon-700 text-white text-xs font-semibold hover:bg-maroon-800 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Saree Style</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sareeList.map((item) => (
                <div key={item.id} className="border border-stone-200 rounded-2xl overflow-hidden p-4 space-y-3 relative group hover:border-maroon-300 transition-colors">
                  <div className="relative h-44 rounded-xl overflow-hidden">
                    <img src={item.image_url} alt={item.name_en} className="h-full w-full object-cover" />
                    <button
                      onClick={() => handleDeleteSaree(item.id, item.name_en)}
                      title="Remove Style"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-maroon-700 tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-base">{item.name_en}</h3>
                    <p className="text-xs text-stone-500 font-medium">{item.name_te}</p>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">{item.description_en}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <span className="font-bold text-maroon-800 text-base">₹{item.price}</span>
                    <span className="text-stone-500">{item.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: COMPLETED WORK GALLERY ================= */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-900">Completed Work &amp; Portfolio Gallery</h2>
                <p className="text-xs text-stone-500">
                  Upload stand-alone showcase photos, or view photos linked from completed customer service bookings.
                </p>
              </div>
              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Standalone Gallery Image</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryList.map((item) => (
                <div key={item.id} className="border border-stone-200 rounded-2xl overflow-hidden p-4 space-y-3 relative group">
                  <div className="relative h-48 rounded-xl overflow-hidden bg-stone-100">
                    <img src={item.image_url} alt={item.title_en} className="h-full w-full object-cover" />
                    <button
                      onClick={() => handleDeleteGallery(item.id, item.title_en)}
                      title="Remove Photo"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {item.is_completed_client_work && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-henna-900/80 backdrop-blur-sm text-gold-300 text-[10px] font-bold">
                        Client Completed Work
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                      {item.service_type === 'saree' ? 'Saree Pleating' : 'Mehendi'} • {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-sm mt-0.5">{item.title_en}</h3>
                    {item.customer_name && (
                      <p className="text-xs text-stone-600 flex items-center gap-1 mt-1">
                        <User className="w-3.5 h-3.5 text-henna-700" />
                        <span>Client: <strong>{item.customer_name}</strong></span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: ADD PAST BOOKING RECORD WITH COMPLETION PHOTO ================= */}
      {showAddBookingModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">Add Past Booking Record</h3>
                <p className="text-[11px] text-stone-500">Record past completed services and attach completion photos.</p>
              </div>
              <button onClick={() => setShowAddBookingModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              
              {/* Photo Upload Area */}
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-henna-700" />
                    <span>Completion Photo (Manually Taken Photo)</span>
                  </label>
                  {newBooking.completion_photo && (
                    <button
                      type="button"
                      onClick={() => setNewBooking({ ...newBooking, completion_photo: '' })}
                      className="text-red-600 hover:underline text-[11px]"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {newBooking.completion_photo ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={newBooking.completion_photo}
                      alt="Uploaded preview"
                      className="w-20 h-20 rounded-xl object-cover border border-amber-300 shadow-sm"
                    />
                    <div className="text-[11px] text-stone-600 space-y-1">
                      <p className="font-semibold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Photo attached successfully!</span>
                      </p>
                      <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
                        <input
                          type="checkbox"
                          checked={newBooking.show_in_gallery}
                          onChange={(e) => setNewBooking({ ...newBooking, show_in_gallery: e.target.checked })}
                          className="rounded text-henna-700"
                        />
                        <span className="font-medium">Show in "Our Work" gallery</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-300 rounded-xl bg-white hover:bg-amber-50/50 cursor-pointer transition-colors text-center">
                      <Upload className="w-6 h-6 text-henna-600 mb-1" />
                      <span className="font-semibold text-stone-700">Choose photo from your device</span>
                      <span className="text-[10px] text-stone-400">Upload completed mehendi or pleated saree photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, (dataUrl) => setNewBooking({ ...newBooking, completion_photo: dataUrl }))}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 text-[10px]">Or enter image URL:</span>
                      <input
                        type="text"
                        value={newBooking.completion_photo}
                        onChange={(e) => setNewBooking({ ...newBooking, completion_photo: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 p-2 rounded-lg border text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="p-2 rounded-lg bg-white/70 border border-amber-200 text-[11px] text-stone-500">
                  🔒 <strong>Privacy Note:</strong> On the "Our Work" page, clients will see only <strong>Customer Name</strong>, <strong>Event Name</strong>, and your <strong>Design Photo</strong>. Phone numbers and addresses are strictly hidden.
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newBooking.customer_name}
                    onChange={(e) => setNewBooking({ ...newBooking, customer_name: e.target.value })}
                    placeholder="e.g. Sravani"
                    className="w-full p-2.5 rounded-xl border text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Customer Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newBooking.customer_phone}
                    onChange={(e) => setNewBooking({ ...newBooking, customer_phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full p-2.5 rounded-xl border text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Service Type</label>
                  <select
                    value={newBooking.service_type}
                    onChange={(e) => setNewBooking({ ...newBooking, service_type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-sm"
                  >
                    <option value="mehendi">Mehendi Only</option>
                    <option value="saree">Saree Pre-Pleating Only</option>
                    <option value="both">Mehendi &amp; Saree Combo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Design / Style Details</label>
                  <input
                    type="text"
                    value={newBooking.service_item_name}
                    onChange={(e) => setNewBooking({ ...newBooking, service_item_name: e.target.value })}
                    placeholder="e.g. Bridal Mehendi / Kanjeevaram Pleating"
                    className="w-full p-2.5 rounded-xl border text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Event Type</label>
                  <input
                    type="text"
                    value={newBooking.event_type}
                    onChange={(e) => setNewBooking({ ...newBooking, event_type: e.target.value })}
                    placeholder="e.g. Wedding / Pellikuthuru"
                    className="w-full p-2.5 rounded-xl border text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={newBooking.event_date}
                    onChange={(e) => setNewBooking({ ...newBooking, event_date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Total Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newBooking.estimated_cost}
                    onChange={(e) => setNewBooking({ ...newBooking, estimated_cost: e.target.value })}
                    placeholder="e.g. 3500"
                    className="w-full p-2.5 rounded-xl border text-sm font-bold text-henna-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Service Location</label>
                  <input
                    type="text"
                    value={newBooking.service_location}
                    onChange={(e) => setNewBooking({ ...newBooking, service_location: e.target.value })}
                    placeholder="e.g. Madhapur, Hyderabad"
                    className="w-full p-2.5 rounded-xl border text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Booking Status</label>
                  <select
                    value={newBooking.status}
                    onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-sm"
                  >
                    <option value="completed">Completed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Payment Status</label>
                  <select
                    value={newBooking.payment_status}
                    onChange={(e) => setNewBooking({ ...newBooking, payment_status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-sm"
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddBookingModal(false)}
                  className="px-4 py-2 rounded-xl border text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-henna-700 text-white font-semibold hover:bg-henna-800 shadow"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUICK ATTACH / UPDATE COMPLETION PHOTO ================= */}
      {editingPhotoBooking && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">Completion Photo</h3>
                <p className="text-xs text-stone-500">
                  {editingPhotoBooking.customer_name} — {editingPhotoBooking.event_type}
                </p>
              </div>
              <button onClick={() => setEditingPhotoBooking(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhotoModal} className="space-y-4 text-xs">
              {modalPhoto ? (
                <div className="space-y-3 text-center">
                  <img src={modalPhoto} alt="Completion" className="h-44 w-full object-cover rounded-xl border" />
                  <button
                    type="button"
                    onClick={() => setModalPhoto('')}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-henna-300 rounded-xl bg-henna-50/30 hover:bg-henna-50 cursor-pointer transition-colors text-center">
                  <Camera className="w-8 h-8 text-henna-700 mb-1" />
                  <span className="font-bold text-stone-800 text-sm">Upload Photo from Device</span>
                  <span className="text-[11px] text-stone-500">Tap to choose image file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, (dataUrl) => setModalPhoto(dataUrl))}
                    className="hidden"
                  />
                </label>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Or Image URL</label>
                <input
                  type="text"
                  value={modalPhoto}
                  onChange={(e) => setModalPhoto(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border text-xs"
                />
              </div>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border cursor-pointer">
                <input
                  type="checkbox"
                  checked={modalShowInGallery}
                  onChange={(e) => setModalShowInGallery(e.target.checked)}
                  className="rounded text-henna-700"
                />
                <div>
                  <span className="font-semibold text-stone-800 block">Show on "Our Work" Gallery</span>
                  <span className="text-[10px] text-stone-500">
                    Displays Customer Name, Event Name &amp; Photo only. Hides phone &amp; address.
                  </span>
                </div>
              </label>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingPhotoBooking(null)}
                  className="px-4 py-2 rounded-xl border text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-henna-700 text-white font-semibold hover:bg-henna-800"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD MEHENDI DESIGN ================= */}
      {showAddMehendiModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">Add New Mehendi Design</h3>
              <button onClick={() => setShowAddMehendiModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMehendi} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Design Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newMehendi.name_en}
                  onChange={(e) => setNewMehendi({ ...newMehendi, name_en: e.target.value })}
                  placeholder="e.g. Royal South Indian Bridal"
                  className="w-full p-2.5 rounded-xl border text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Design Name (Telugu)</label>
                <input
                  type="text"
                  value={newMehendi.name_te}
                  onChange={(e) => setNewMehendi({ ...newMehendi, name_te: e.target.value })}
                  placeholder="ఉదా: రాయల్ బ్రైడల్ డిజైన్"
                  className="w-full p-2.5 rounded-xl border text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Category</label>
                  <select
                    value={newMehendi.category}
                    onChange={(e) => setNewMehendi({ ...newMehendi, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-sm"
                  >
                    <option value="bridal">Bridal</option>
                    <option value="arabic">Arabic</option>
                    <option value="traditional">Traditional</option>
                    <option value="simple">Simple / Minimal</option>
                    <option value="engagement">Engagement</option>
                    <option value="festival">Festive &amp; Haldi</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newMehendi.price}
                    onChange={(e) => setNewMehendi({ ...newMehendi, price: e.target.value })}
                    placeholder="e.g. 2999"
                    className="w-full p-2.5 rounded-xl border text-sm font-bold text-henna-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Photo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, (dataUrl) => setNewMehendi({ ...newMehendi, image_url: dataUrl }))}
                  className="w-full p-2 rounded-xl border text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Image URL</label>
                <input
                  type="text"
                  value={newMehendi.image_url}
                  onChange={(e) => setNewMehendi({ ...newMehendi, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMehendiModal(false)}
                  className="px-4 py-2 rounded-xl border text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-henna-700 text-white font-semibold hover:bg-henna-800"
                >
                  Add to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SAREE STYLE ================= */}
      {showAddSareeModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">Add Saree Pre-Pleating Style</h3>
              <button onClick={() => setShowAddSareeModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSaree} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Style Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newSaree.name_en}
                  onChange={(e) => setNewSaree({ ...newSaree, name_en: e.target.value })}
                  placeholder="e.g. Heavy Pattu Saree Box Fold"
                  className="w-full p-2.5 rounded-xl border text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Category</label>
                  <select
                    value={newSaree.category}
                    onChange={(e) => setNewSaree({ ...newSaree, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-sm"
                  >
                    <option value="bridal">Bridal</option>
                    <option value="basic">Basic Pre-Pleating</option>
                    <option value="designer">Designer / Organza</option>
                    <option value="traditional">Traditional</option>
                    <option value="custom">Custom / Venue Assist</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Price per Saree (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newSaree.price}
                    onChange={(e) => setNewSaree({ ...newSaree, price: e.target.value })}
                    placeholder="e.g. 599"
                    className="w-full p-2.5 rounded-xl border text-sm font-bold text-maroon-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Photo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, (dataUrl) => setNewSaree({ ...newSaree, image_url: dataUrl }))}
                  className="w-full p-2 rounded-xl border text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Image URL</label>
                <input
                  type="text"
                  value={newSaree.image_url}
                  onChange={(e) => setNewSaree({ ...newSaree, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSareeModal(false)}
                  className="px-4 py-2 rounded-xl border text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-maroon-700 text-white font-semibold hover:bg-maroon-800"
                >
                  Add Saree Style
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD GALLERY PHOTO ================= */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">Add Completed Work Photo</h3>
              <button onClick={() => setShowAddGalleryModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGallery} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Service Category</label>
                <select
                  value={newGallery.service_type}
                  onChange={(e) => setNewGallery({ ...newGallery, service_type: e.target.value })}
                  className="w-full p-2.5 rounded-xl border text-sm"
                >
                  <option value="mehendi">Mehendi Work</option>
                  <option value="saree">Saree Pre-Pleating</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Photo Title (English) *</label>
                <input
                  type="text"
                  required
                  value={newGallery.title_en}
                  onChange={(e) => setNewGallery({ ...newGallery, title_en: e.target.value })}
                  placeholder="e.g. Bridal Lotus Palms Henna"
                  className="w-full p-2.5 rounded-xl border text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Photo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, (dataUrl) => setNewGallery({ ...newGallery, image_url: dataUrl }))}
                  className="w-full p-2 rounded-xl border text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Image URL</label>
                <input
                  type="text"
                  value={newGallery.image_url}
                  onChange={(e) => setNewGallery({ ...newGallery, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border text-sm"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 rounded-xl border text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-700 text-white font-semibold hover:bg-amber-800"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SECURITY & CREDENTIALS MODAL ================= */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-henna-700 to-maroon-800 text-gold-300 flex items-center justify-center shadow">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Administrator Security</h3>
                  <p className="text-xs text-stone-500">Change your login email and password</p>
                </div>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {securityErrorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {securityErrorMsg}
              </div>
            )}

            {securitySuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                ✓ {securitySuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Admin Email Address *</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">New Password *</label>
                <input
                  type="password"
                  required
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmAdminPassword}
                  onChange={(e) => setConfirmAdminPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSecurityModal(false)}
                  className="px-4 py-2 rounded-xl border text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-henna-700 to-maroon-800 text-white font-semibold hover:from-henna-800 hover:to-maroon-900 shadow-sm"
                >
                  Save New Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MULTI-DEVICE CLOUD SYNC MODAL ================= */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm">
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">Multi-Device Live Sync</h3>
                  <p className="text-xs text-stone-500">Sync completed records &amp; edits across your phones</p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Live Server Sync */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                    <span>Auto Server Sync</span>
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Pushes current records to live server and pulls updates from other devices.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerSync}
                  disabled={syncStatus === 'syncing'}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Live Server Now'}
                </button>
              </div>
            </div>

            {/* Method 2: One-Click Sync Code Transfer (100% Guaranteed Across Phones) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-amber-800" />
                <span>Instant 1-Tap Transfer Between 2 Phones</span>
              </p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                If you made edits on your first phone, copy your sync code and paste it on your second phone to load all records instantly:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCopyBackup}
                  className="w-full py-2.5 px-4 bg-white border border-amber-300 hover:bg-amber-100/50 rounded-xl text-xs font-bold text-amber-950 flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>📋 1. Click to Copy Sync Code from this Phone</span>
                </button>

                <div className="pt-2 border-t border-amber-200/70 space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-700">
                    2. Paste Sync Code on your Other Phone:
                  </label>
                  <textarea
                    rows={2}
                    value={importCodeInput}
                    onChange={(e) => setImportCodeInput(e.target.value)}
                    placeholder="Paste copied sync code here on second phone..."
                    className="w-full p-2.5 text-xs font-mono rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleImportBackup}
                    className="w-full py-2.5 bg-gradient-to-r from-henna-700 to-maroon-800 hover:from-henna-800 hover:to-maroon-900 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    📥 Apply &amp; Sync to this Phone
                  </button>
                </div>
              </div>
            </div>

            {/* Supabase Note */}
            <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
              <p className="font-semibold text-stone-700">☁️ Optional Vercel Supabase Postgres Integration:</p>
              <p>
                On your Vercel Dashboard under "Integrations", clicking <strong>Add Supabase</strong> automatically links a cloud PostgreSQL database without writing any code.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="px-6 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
