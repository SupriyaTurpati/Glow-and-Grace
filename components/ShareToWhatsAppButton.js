'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BUSINESS_CONFIG } from '@/lib/config';
import { MessageCircle, Share2 } from 'lucide-react';

export default function ShareToWhatsAppButton({
  title,
  price,
  category,
  serviceType = 'Mehendi',
  url,
  variant = 'button', // 'button' | 'icon' | 'badge'
  className = ''
}) {
  const { isTelugu } = useLanguage();

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const currentUrl = typeof window !== 'undefined' 
      ? (url || window.location.href) 
      : 'http://localhost:3000';

    let message = '';
    if (isTelugu) {
      message = `🌸 *${title}* - గ్లో & గ్రేస్ (Glow & Grace)\n` +
        `✨ రకం: ${category || serviceType}\n` +
        (price ? `💰 ధర: ₹${price}\n` : '') +
        `📱 డోర్‌స్టెప్ బుకింగ్ ఫోన్: ${BUSINESS_CONFIG.formattedPhone}\n` +
        `🌐 ఇక్కడ చూడండి: ${currentUrl}`;
    } else {
      message = `🌸 *${title}* - Glow & Grace\n` +
        `✨ Service / Style: ${category || serviceType}\n` +
        (price ? `💰 Price: ₹${price}\n` : '') +
        `📱 Doorstep Booking: ${BUSINESS_CONFIG.formattedPhone}\n` +
        `🌐 Explore design here: ${currentUrl}`;
    }

    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappShareUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        type="button"
        title={isTelugu ? 'వాట్సాప్‌లో షేర్ చేయండి' : 'Share to WhatsApp'}
        aria-label="Share to WhatsApp"
        className={`w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 transition-all flex items-center justify-center shadow-sm hover:scale-105 ${className}`}
      >
        <MessageCircle className="w-4 h-4 fill-current" />
      </button>
    );
  }

  if (variant === 'chip') {
    return (
      <button
        onClick={handleShare}
        type="button"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all shadow-sm ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-600" />
        <span>{isTelugu ? 'వాట్సాప్‌లో షేర్' : 'Share to WhatsApp'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold transition-all shadow-sm hover:scale-[1.02] ${className}`}
      title={isTelugu ? 'స్నేహితులు & కుటుంబ సభ్యులతో వాట్సాప్‌లో షేర్ చేయండి' : 'Share this design with friends and family on WhatsApp'}
    >
      <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-600 shrink-0" />
      <span>{isTelugu ? 'వాట్సాప్ షేర్' : 'Share to WhatsApp'}</span>
    </button>
  );
}
