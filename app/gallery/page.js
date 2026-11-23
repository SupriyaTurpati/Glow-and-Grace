'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { dataStore } from '@/lib/dataStore';
import { INITIAL_GALLERY } from '@/lib/initialData';
import ShareToWhatsAppButton from '@/components/ShareToWhatsAppButton';
import { Sparkles, Calendar, X, Eye, User, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function GalleryPage() {
  const { t, isTelugu } = useLanguage();
  const [items, setItems] = useState(INITIAL_GALLERY);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setItems(dataStore.getGalleryItems());
  }, []);

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.service_type === activeFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-henna-100 text-henna-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-henna-600" />
          <span>{isTelugu ? 'రియల్ వర్క్ గ్యాలరీ' : 'Our Work & Client Showcase'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
          {t('gallery.title')}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          {isTelugu 
            ? 'మా సంతృప్తికరమైన కస్టమర్ల వేడుకల్లో అందించిన అసలైన మెహందీ డిజైన్లు మరియు శారీ ప్రీ-ప్లీటింగ్ పూర్తి చేసిన ఫోటోలు.'
            : 'Real photographs of completed Mehendi artistry and pin-perfect Saree Pre-Pleating from recent client weddings and family occasions.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-henna-700 text-white shadow'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          {t('gallery.filterAll')}
        </button>
        <button
          onClick={() => setActiveFilter('mehendi')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'mehendi'
              ? 'bg-henna-700 text-white shadow'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          {t('gallery.filterMehendi')}
        </button>
        <button
          onClick={() => setActiveFilter('saree')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
            activeFilter === 'saree'
              ? 'bg-maroon-700 text-white shadow'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          {t('gallery.filterSaree')}
        </button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => {
          const displayTitle = item.customer_name 
            ? `${isTelugu ? 'కస్టమర్:' : 'Client:'} ${item.customer_name}` 
            : (isTelugu ? (item.title_te || item.title_en) : item.title_en);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-stone-200 flex flex-col justify-between"
            >
              {/* Design Photo After Completion */}
              <div className="relative h-72 overflow-hidden bg-stone-100">
                <img
                  src={item.image_url}
                  alt={displayTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-sm text-gold-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                  {item.service_type === 'saree' ? (isTelugu ? 'శారీ ప్రీ-ప్లీటింగ్' : 'Saree Pleating') : (isTelugu ? 'మెహందీ' : 'Mehendi')}
                </div>
                <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]">
                  <Eye className="w-4 h-4" />
                  <span>{isTelugu ? 'పెద్దదిగా చూడండి' : 'Click to view photo'}</span>
                </div>
              </div>

              {/* Client Showcase Card Details */}
              <div className="p-5 space-y-3 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-henna-700 bg-henna-50 px-2 py-0.5 rounded-md border border-henna-100">
                    {item.category}
                  </span>
                  {item.event_date && (
                    <span className="text-[11px] text-stone-400 font-medium">
                      {item.event_date}
                    </span>
                  )}
                </div>

                {/* Customer Name */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <User className="w-4 h-4 text-henna-700 shrink-0" />
                  <span className="font-serif text-base font-bold text-stone-900">
                    {displayTitle}
                  </span>
                </div>

                {/* Event Name */}
                {item.event_name && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>{isTelugu ? 'వేడుక:' : 'Occasion:'} <strong>{item.event_name}</strong></span>
                  </div>
                )}

                {/* SHARE TO WHATSAPP BUTTON */}
                <div className="pt-2 border-t border-stone-100">
                  <ShareToWhatsAppButton
                    title={item.title_en || displayTitle}
                    category={item.category}
                    serviceType={item.service_type === 'saree' ? 'Saree Pleating' : 'Mehendi'}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-stone-900/70 text-white flex items-center justify-center hover:bg-stone-900 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Large Photo Preview */}
            <div className="max-h-[70vh] overflow-hidden bg-stone-950 flex items-center justify-center">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title_en}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {/* Showcase Info Footer */}
            <div className="p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-henna-700 uppercase tracking-wider bg-henna-50 px-2.5 py-0.5 rounded-full border border-henna-200">
                    {selectedImage.category}
                  </span>
                  {selectedImage.event_date && (
                    <span className="text-xs text-stone-400">
                      • {selectedImage.event_date}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-stone-900 pt-1 flex items-center gap-2">
                  <User className="w-5 h-5 text-henna-700" />
                  <span>{selectedImage.customer_name ? `${isTelugu ? 'కస్టమర్:' : 'Client:'} ${selectedImage.customer_name}` : (isTelugu ? selectedImage.title_te : selectedImage.title_en)}</span>
                </h3>

                {selectedImage.event_name && (
                  <p className="text-sm text-stone-600 font-medium flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <span>{isTelugu ? 'వేడుక / ఈవెంట్:' : 'Occasion:'} <strong>{selectedImage.event_name}</strong></span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                {/* SHARE IN MODAL */}
                <ShareToWhatsAppButton
                  title={selectedImage.title_en || selectedImage.customer_name}
                  category={selectedImage.category}
                  serviceType={selectedImage.service_type === 'saree' ? 'Saree Pleating' : 'Mehendi'}
                  className="flex-1 sm:flex-initial"
                />

                <Link
                  href={`/book?service=${selectedImage.service_type === 'saree' ? 'saree' : 'mehendi'}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-henna-700 to-maroon-700 text-white text-xs font-bold hover:from-henna-800 hover:to-maroon-800 transition-all shadow-md flex-1 sm:flex-initial"
                >
                  <Calendar className="w-4 h-4 text-gold-300" />
                  <span>{t('common.bookNow')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
