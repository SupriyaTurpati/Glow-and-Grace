'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BUSINESS_CONFIG } from '@/lib/config';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const { isTelugu } = useLanguage();

  const prefilledText = encodeURIComponent(
    isTelugu 
      ? 'నమస్కారం! నేను గ్లో & గ్రేస్ మెహందీ మరియు శారీ ప్రీ-ప్లీటింగ్ సేవల వివరాలు తెలుసుకోవాలనుకుంటున్నాను.'
      : 'Hello Glow & Grace! I would like to inquire about your Mehendi and Saree Pre-Pleating services.'
  );

  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${prefilledText}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
      <span className="hidden group-hover:inline-block bg-white text-stone-800 text-xs font-semibold py-1.5 px-3 rounded-full shadow-lg border border-stone-200 transition-all">
        {isTelugu ? 'వాట్సాప్‌లో మాట్లాడండి' : 'Chat on WhatsApp'}
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 ring-4 ring-emerald-100"
      >
        <MessageCircle className="w-8 h-8 fill-current" />
      </a>
    </div>
  );
}
