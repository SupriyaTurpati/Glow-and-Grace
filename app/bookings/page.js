'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { dataStore } from '@/lib/dataStore';
import { BUSINESS_CONFIG } from '@/lib/config';
import { 
  Calendar, Clock, MapPin, AlertCircle, Phone, 
  CheckCircle2, XCircle, ArrowRight, RotateCcw 
} from 'lucide-react';

export default function BookingsHistoryPage() {
  const { t, isTelugu } = useLanguage();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookings(dataStore.getBookings());
    setLoading(false);
  }, []);

  const handleRequestCancellation = (id) => {
    if (confirm(isTelugu ? 'మీరు ఖచ్చితంగా ఈ బుకింగ్‌ను రద్దు చేయాలనుకుంటున్నారా?' : 'Are you sure you want to request cancellation for this booking?')) {
      dataStore.updateBookingStatus(id, 'cancellation_requested');
      setBookings(dataStore.getBookings());
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('bookingStatus.confirmed')}</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>{t('bookingStatus.rejected')}</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('bookingStatus.completed')}</span>
          </span>
        );
      case 'cancellation_requested':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('bookingStatus.cancellation_requested')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>{t('bookingStatus.pending')}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            {t('nav.bookings')}
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            {isTelugu ? 'మీ మునుపటి మరియు ప్రస్తుత సర్వీస్ బుకింగ్‌ల వివరాలు' : 'Track current appointment status, service dates, and past orders.'}
          </p>
        </div>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-henna-700 text-white text-xs font-semibold hover:bg-henna-800 transition-colors shadow"
        >
          <Calendar className="w-4 h-4 text-gold-300" />
          <span>{t('nav.bookNow')}</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm text-stone-500">{t('common.loading')}</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="font-serif text-lg font-bold text-stone-700">
            {isTelugu ? 'ఇంకా ఎటువంటి బుకింగ్స్ లేవు' : 'No Bookings Found'}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
            {isTelugu 
              ? 'మీరు ఇంకా ఎటువంటి సర్వీస్ బుక్ చేయలేదు. మీకు కావలసిన మెహందీ లేదా శారీ ప్రీ-ప్లీటింగ్ సేవను ఇప్పుడు బుక్ చేసుకోండి.'
              : "You haven't submitted any service booking requests yet. Explore our designs and submit your first appointment!"}
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-henna-700 text-white font-semibold text-xs shadow hover:bg-henna-800 transition-colors"
          >
            <span>{t('nav.bookNow')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-henna-700 block">
                    #{booking.id}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                    {booking.event_type}
                  </h3>
                </div>
                <div>{getStatusBadge(booking.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-henna-600 shrink-0" />
                  <span>
                    <strong className="text-stone-800">{isTelugu ? 'తేదీ:' : 'Date:'}</strong> {booking.event_date} ({booking.preferred_time})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-henna-600 shrink-0" />
                  <span className="truncate">
                    <strong className="text-stone-800">{isTelugu ? 'చిరునామా:' : 'Location:'}</strong> {booking.service_location}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <span className="text-stone-500">{isTelugu ? 'మొత్తం ధర:' : 'Est. Cost:'}</span>
                  <span className="font-serif text-base font-bold text-henna-800">
                    ₹{booking.estimated_cost}
                  </span>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-3 text-xs space-y-1 text-stone-700">
                {booking.mehendi_design_name && (
                  <p>• <strong>{isTelugu ? 'మెహందీ డిజైన్:' : 'Mehendi Design:'}</strong> {booking.mehendi_design_name}</p>
                )}
                {booking.saree_style_name && (
                  <p>• <strong>{isTelugu ? 'శారీ స్టైల్:' : 'Saree Style:'}</strong> {booking.saree_style_name}</p>
                )}
                {booking.additional_requirements && (
                  <p className="text-stone-500 italic">Notes: "{booking.additional_requirements}"</p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                <div className="text-stone-400">
                  {isTelugu ? 'పేమెంట్:' : 'Payment:'}{' '}
                  <span className="font-semibold text-stone-600">
                    {booking.payment_status === 'paid' ? t('paymentStatus.paid') : t('paymentStatus.unpaid')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleRequestCancellation(booking.id)}
                      className="text-stone-500 hover:text-red-600 transition-colors"
                    >
                      {isTelugu ? 'రద్దు అభ్యర్థన' : 'Request Cancellation'}
                    </button>
                  )}
                  <a
                    href={`https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                      `Hello Glow & Grace! Checking status for booking #${booking.id} (${booking.event_date}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
