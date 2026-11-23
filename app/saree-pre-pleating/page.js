'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { dataStore } from '@/lib/dataStore';
import { INITIAL_SAREE_STYLES } from '@/lib/initialData';
import ShareToWhatsAppButton from '@/components/ShareToWhatsAppButton';
import { Sparkles, Calendar, Clock } from 'lucide-react';

export default function SareePleatingPage() {
  const { t, isTelugu } = useLanguage();
  const [styles, setStyles] = useState(INITIAL_SAREE_STYLES);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setStyles(dataStore.getSareeStyles());
  }, []);

  const categories = [
    { id: 'all', label_en: 'All Styles', label_te: 'అన్ని స్టైల్స్' },
    { id: 'bridal', label_en: 'Bridal Kanjeevaram', label_te: 'బ్రైడల్ పట్టు' },
    { id: 'basic', label_en: 'Basic Pre-Pleating', label_te: 'బేసిక్' },
    { id: 'designer', label_en: 'Designer / Organza', label_te: 'డిజైనర్' },
    { id: 'traditional', label_en: 'Traditional Madisar', label_te: 'సాంప్రదాయ' },
    { id: 'custom', label_en: 'Venue Draping Assist', label_te: 'కస్టమ్ డ్రేపింగ్' },
  ];

  const filteredStyles = styles.filter((style) => {
    return selectedCategory === 'all' || style.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-maroon-100 text-maroon-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-maroon-600" />
          <span>{isTelugu ? 'పరిపూర్ణ శారీ డ్రేపింగ్' : 'Effortless 2-Minute Saree Draping'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
          {isTelugu ? 'శారీ ప్రీ-ప్లీటింగ్ & బాక్స్ ఫోల్డింగ్' : 'Saree Pre-Pleating & Box Folding Styles'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          {isTelugu 
            ? 'మీ పట్టు, ఆర్గాంజా లేదా డిజైనర్ చీరలను ఖచ్చితమైన కొలతలతో ఐరన్ ప్రెస్ చేసి బాక్స్ ఫోల్డ్ చేస్తాము. ఫంక్షన్ రోజున నిమిషాల్లో కట్టుకోవచ్చు.'
            : 'Pre-pleated, pin-perfect, and steam-pressed into an ultra-convenient box fold. Wear your heavy silk saree in just 2 minutes!'}
        </p>
      </div>

      {/* How it works 4-step banner */}
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-center font-serif text-2xl font-bold text-stone-900">
          {isTelugu ? 'శారీ ప్రీ-ప్లీటింగ్ ఎలా పనిచేస్తుంది?' : 'How Saree Pre-Pleating Works'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-maroon-100 text-maroon-800 font-bold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h3 className="font-semibold text-sm text-stone-900">
              {isTelugu ? 'శారీ అందించడం' : 'Handover Saree'}
            </h3>
            <p className="text-xs text-stone-500">
              {isTelugu ? 'ఫంక్షన్‌కు 1-2 రోజుల ముందు మీ శారీ మరియు బ్లౌజ్ వివరాలు ఇవ్వండి.' : 'Provide your saree 1-2 days before the celebration.'}
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-maroon-100 text-maroon-800 font-bold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h3 className="font-semibold text-sm text-stone-900">
              {isTelugu ? 'ప్లీటింగ్ & ప్రెస్సింగ్' : 'Pin-Perfect Pleating'}
            </h3>
            <p className="text-xs text-stone-500">
              {isTelugu ? 'ఖచ్చితమైన భుజం పల్లు మరియు స్కర్ట్ ప్లీట్స్ సెట్ చేసి స్టీమ్ ఐరన్ చేస్తాము.' : 'Customized height pleats tailored with steam-iron press.'}
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-maroon-100 text-maroon-800 font-bold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h3 className="font-semibold text-sm text-stone-900">
              {isTelugu ? 'సురక్షిత బాక్స్ ఫోల్డింగ్' : 'Compact Box Fold'}
            </h3>
            <p className="text-xs text-stone-500">
              {isTelugu ? 'నలగకుండా ఉండేలా హ్యాంగర్ లేదా బాక్స్ ప్యాకింగ్‌లో భద్రపరుస్తాము.' : 'Packed neatly into a crease-resistant protective box fold.'}
            </p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-maroon-100 text-maroon-800 font-bold flex items-center justify-center mx-auto text-sm">
              4
            </div>
            <h3 className="font-semibold text-sm text-stone-900">
              {isTelugu ? '2 నిమిషాల్లో ధరించండి' : '2-Min Draping'}
            </h3>
            <p className="text-xs text-stone-500">
              {isTelugu ? 'ఈవెంట్ రోజున ఎలాంటి కంగారు లేకుండా సులభంగా కట్టుకోవచ్చు.' : 'Step in, wrap, and look flawless with zero morning stress!'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-maroon-700 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-maroon-50 hover:text-maroon-800'
            }`}
          >
            {isTelugu ? cat.label_te : cat.label_en}
          </button>
        ))}
      </div>

      {/* Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStyles.map((style) => {
          const title = isTelugu ? style.name_te : style.name_en;
          const categoryLabel = isTelugu ? (style.category_label_te || style.category) : (style.category_label_en || style.category);

          return (
            <div
              key={style.id}
              className="glow-card group bg-white rounded-2xl overflow-hidden border border-maroon-100 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={style.image_url}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-maroon-900 shadow">
                    ₹{style.price}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold text-maroon-700 uppercase tracking-wider">
                      {categoryLabel}
                    </span>
                    {style.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {style.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-maroon-700 transition-colors">
                    {title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isTelugu ? style.description_te : style.description_en}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 mt-4 space-y-3">
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <span className="text-[11px] text-stone-400 block">{isTelugu ? 'ధర' : 'Price per Saree'}</span>
                    <span className="font-serif text-2xl font-bold text-maroon-800">₹{style.price}</span>
                  </div>
                  <Link
                    href={`/book?service=saree&item=${style.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-maroon-700 to-henna-700 text-white font-medium text-xs shadow hover:from-maroon-800 hover:to-henna-800 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-gold-300" />
                    <span>{t('common.bookNow')}</span>
                  </Link>
                </div>

                {/* SHARE TO WHATSAPP BUTTON */}
                <ShareToWhatsAppButton
                  title={title}
                  price={style.price}
                  category={categoryLabel}
                  serviceType="Saree Pre-Pleating"
                  className="w-full"
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
