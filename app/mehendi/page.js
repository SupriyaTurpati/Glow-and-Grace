'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { dataStore } from '@/lib/dataStore';
import { INITIAL_MEHENDI_DESIGNS } from '@/lib/initialData';
import ShareToWhatsAppButton from '@/components/ShareToWhatsAppButton';
import { Sparkles, Calendar, Search, Filter, Clock } from 'lucide-react';

export default function MehendiPage() {
  const { t, isTelugu } = useLanguage();
  const [designs, setDesigns] = useState(INITIAL_MEHENDI_DESIGNS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    setDesigns(dataStore.getMehendiDesigns());
  }, []);

  const categories = [
    { id: 'all', label_en: 'All Designs', label_te: 'అన్ని డిజైన్లు' },
    { id: 'bridal', label_en: 'Bridal Grand', label_te: 'బ్రైడల్' },
    { id: 'arabic', label_en: 'Arabic Fusion', label_te: 'అరబిక్' },
    { id: 'traditional', label_en: 'Traditional', label_te: 'సాంప్రదాయ' },
    { id: 'simple', label_en: 'Simple / Minimal', label_te: 'సింపుల్' },
    { id: 'engagement', label_en: 'Engagement', label_te: 'ఎంగేజ్మెంట్' },
    { id: 'festival', label_en: 'Festive & Haldi', label_te: 'పండుగలు' },
  ];

  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      const matchesCategory = selectedCategory === 'all' || design.category === selectedCategory;
      const title = isTelugu ? design.name_te : design.name_en;
      const desc = isTelugu ? design.description_te : design.description_en;
      const query = searchQuery.toLowerCase();
      const matchesSearch = (title || '').toLowerCase().includes(query) || (desc || '').toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
  }, [designs, selectedCategory, searchQuery, sortBy, isTelugu]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-henna-100 text-henna-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-henna-600" />
          <span>{isTelugu ? 'హెన్నా ఆర్ట్ కలెక్షన్' : 'Henna Artistry Collection'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900">
          {isTelugu ? 'మెహందీ డిజైన్లు & ధరల వివరాలు' : 'Mehendi Designs & Pricing Catalogue'}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          {isTelugu 
            ? 'ప్రతి వేడుకకు నప్పే విభిన్న సాంప్రదాయ మరియు ఆధునిక మెహందీ డిజైన్లు. నచ్చిన డిజైన్ ఎంచుకొని వెంటనే బుక్ చేసుకోండి లేదా వాట్సాప్‌లో షేర్ చేయండి.'
            : 'Explore handcrafted bridal, Arabic, traditional, and festive henna designs. Transparent pricing with doorstep service and 1-click WhatsApp sharing.'}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-henna-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTelugu ? 'డిజైన్ పేరు లేదా శైలి కోసం వెతకండి...' : 'Search designs (e.g. Bridal, Arabic)...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-600 focus:border-transparent bg-stone-50/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
              {isTelugu ? 'క్రమపద్ధతి:' : 'Sort by:'}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-henna-600"
            >
              <option value="popular">{isTelugu ? 'జనాదరణ (Popular)' : 'Most Popular'}</option>
              <option value="price_asc">{isTelugu ? 'ధర: తక్కువ నుండి ఎక్కువ' : 'Price: Low to High'}</option>
              <option value="price_desc">{isTelugu ? 'ధర: ఎక్కువ నుండి తక్కువ' : 'Price: High to Low'}</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-henna-600 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-henna-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-henna-50 hover:text-henna-800'
              }`}
            >
              {isTelugu ? cat.label_te : cat.label_en}
            </button>
          ))}
        </div>
      </div>

      {/* Design Cards Grid */}
      {filteredDesigns.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300 p-8">
          <p className="text-stone-500 text-sm">
            {isTelugu ? 'ఎటువంటి డిజైన్లు లభ్యం కాలేదు.' : 'No designs found matching your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDesigns.map((design) => {
            const title = isTelugu ? design.name_te : design.name_en;
            const categoryLabel = isTelugu ? (design.category_label_te || design.category) : (design.category_label_en || design.category);
            
            return (
              <div
                key={design.id}
                className="glow-card group bg-white rounded-2xl overflow-hidden border border-henna-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={design.image_url}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-henna-800 shadow">
                      ₹{design.price}
                    </div>
                    {design.popular && (
                      <div className="absolute top-3 left-3 bg-henna-900/80 text-gold-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {isTelugu ? 'పాపులర్' : 'Popular'}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-henna-600 uppercase tracking-wider">
                        {categoryLabel}
                      </span>
                      {design.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {design.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-henna-700 transition-colors">
                      {title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isTelugu ? design.description_te : design.description_en}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-stone-100 mt-4 space-y-3">
                  <div className="flex items-center justify-between pt-3">
                    <div>
                      <span className="text-[11px] text-stone-400 block">{isTelugu ? 'ధర' : 'Fixed Cost'}</span>
                      <span className="font-serif text-2xl font-bold text-henna-800">₹{design.price}</span>
                    </div>

                    <Link
                      href={`/book?service=mehendi&item=${design.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-henna-700 to-maroon-700 text-white font-medium text-xs shadow hover:from-henna-800 hover:to-maroon-800 transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5 text-gold-300" />
                      <span>{t('common.bookNow')}</span>
                    </Link>
                  </div>

                  {/* SHARE TO WHATSAPP BUTTON */}
                  <ShareToWhatsAppButton
                    title={title}
                    price={design.price}
                    category={categoryLabel}
                    serviceType="Mehendi Design"
                    className="w-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
