'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { localStore } from '@/lib/supabaseClient';
import { User, Phone, MapPin, Globe, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { locale, changeLanguage, t, isTelugu } = useLanguage();

  const [fullName, setFullName] = useState('Sravanthi Reddy');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [emailAddress, setEmailAddress] = useState('sravanthi@example.com');
  const [address, setAddress] = useState('Flat 402, Lotus Towers, MVP Colony');
  const [city, setCity] = useState('Visakhapatnam');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const user = localStore.getMockUser();
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
      if (user.emailAddress) setEmailAddress(user.emailAddress);
      if (user.address) setAddress(user.address);
      if (user.city) setCity(user.city);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStore.setMockUser({
      fullName,
      phoneNumber,
      emailAddress,
      address,
      city,
      locale
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          {t('nav.profile')}
        </h1>
        <p className="text-stone-600 text-sm mt-1">
          {isTelugu ? 'మీ వ్యక్తిగత వివరాలు మరియు భాషా ప్రాధాన్యతను నిర్వహించండి' : 'Manage your contact information, doorstep address, and language preference.'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{isTelugu ? 'ప్రొఫైల్ వివరాలు విజయవంతంగా సేవ్ చేయబడ్డాయి!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {/* Language Preference Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-henna-700" />
          <span>{isTelugu ? 'భాషా ఎంపిక (Language Preference)' : 'Preferred Language'}</span>
        </h2>
        <p className="text-xs text-stone-500">
          {isTelugu ? 'మీరు వెబ్‌సైట్‌ను చూడాలనుకుంటున్న భాషను ఎంచుకోండి:' : 'Select your primary browsing and booking language:'}
        </p>
        
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <button
            type="button"
            onClick={() => changeLanguage('en')}
            className={`p-3 rounded-xl border text-center font-medium text-sm transition-all ${
              locale === 'en'
                ? 'border-henna-700 bg-henna-50 text-henna-900 font-bold ring-1 ring-henna-700'
                : 'border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => changeLanguage('te')}
            className={`p-3 rounded-xl border text-center font-medium text-sm transition-all ${
              locale === 'te'
                ? 'border-henna-700 bg-henna-50 text-henna-900 font-bold ring-1 ring-henna-700'
                : 'border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            తెలుగు (Telugu)
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
          <User className="w-5 h-5 text-henna-700" />
          <span>{isTelugu ? 'వ్యక్తిగత వివరాలు' : 'Personal & Contact Information'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              {t('booking.customerName')}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              {t('booking.phone')}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700">
              {t('booking.address')}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              {t('booking.cityArea')}
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-stone-100">
          <Link
            href="/bookings"
            className="text-xs font-medium text-henna-700 hover:underline inline-flex items-center gap-1"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('booking.viewBookingsBtn')}</span>
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-henna-700 text-white font-semibold text-xs hover:bg-henna-800 transition-colors shadow"
          >
            {t('common.save')}
          </button>
        </div>
      </form>

    </div>
  );
}
