'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { dataStore } from '@/lib/dataStore';
import { INITIAL_MEHENDI_DESIGNS, INITIAL_SAREE_STYLES, INITIAL_GALLERY, INITIAL_FAQS } from '@/lib/initialData';
import { BUSINESS_CONFIG } from '@/lib/config';
import ShareToWhatsAppButton from '@/components/ShareToWhatsAppButton';
import { 
  Sparkles, Calendar, ArrowRight, CheckCircle2, Clock, MapPin, 
  ShieldCheck, Phone, ChevronDown, User 
} from 'lucide-react';

export default function HomePage() {
  const { t, isTelugu } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);
  const [mehendiList, setMehendiList] = useState(INITIAL_MEHENDI_DESIGNS);
  const [sareeList, setSareeList] = useState(INITIAL_SAREE_STYLES);
  const [galleryList, setGalleryList] = useState(INITIAL_GALLERY);

  useEffect(() => {
    setMehendiList(dataStore.getMehendiDesigns());
    setSareeList(dataStore.getSareeStyles());
    setGalleryList(dataStore.getGalleryItems());
  }, []);

  const featuredMehendi = mehendiList.slice(0, 3);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F9ECE5]/60 via-[#FAF8F5] to-[#FAF8F5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-henna-100/80 border border-henna-200 text-henna-800 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-henna-600" />
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
                {t('hero.titlePart1')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-henna-700 via-maroon-700 to-henna-800">
                  {t('hero.titleHighlight')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/book"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-henna-700 via-maroon-700 to-henna-800 text-white font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <Calendar className="w-5 h-5 text-gold-300" />
                  <span>{t('nav.bookNow')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={BUSINESS_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white border border-stone-200 text-stone-800 font-semibold text-base shadow-sm hover:bg-stone-50 hover:border-emerald-500 hover:text-emerald-700 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{t('hero.whatsappUs')}</span>
                </a>
              </div>

              {/* Value Props Row */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-henna-100">
                <div className="text-center lg:text-left">
                  <p className="font-serif text-2xl font-bold text-henna-800">100%</p>
                  <p className="text-xs text-stone-500">{isTelugu ? 'సహజసిద్ధ ఆర్గానిక్ హెన్నా' : 'Natural Herbal Henna'}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="font-serif text-2xl font-bold text-henna-800">2 Mins</p>
                  <p className="text-xs text-stone-500">{isTelugu ? 'ఈజీ శారీ డ్రేపింగ్' : 'Ready Saree Wear'}</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="font-serif text-2xl font-bold text-henna-800">Doorstep</p>
                  <p className="text-xs text-stone-500">{isTelugu ? 'ఇంటి వద్దకే సర్వీస్' : 'At Your Venue'}</p>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-henna-300 via-gold-200 to-maroon-300 opacity-60 blur-lg transform -rotate-1"></div>
                
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?auto=format&fit=crop&w=1000&q=80"
                    alt="Bridal Mehendi Art"
                    className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-henna-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-henna-700 uppercase tracking-wider">
                        {isTelugu ? 'ప్రత్యేక ఆఫర్' : 'Special Combo'}
                      </p>
                      <p className="font-serif text-base font-bold text-stone-900">
                        {isTelugu ? 'మెహందీ + శారీ ప్రీ-ప్లీటింగ్' : 'Bridal Henna & Saree Pleating'}
                      </p>
                    </div>
                    <Link
                      href="/book"
                      className="px-4 py-2 rounded-lg bg-henna-700 text-white text-xs font-semibold hover:bg-henna-800 transition-colors"
                    >
                      {t('common.bookNow')}
                    </Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TWO CORE SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            {t('services.title')}
          </h2>
          <p className="text-base text-stone-600">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Mehendi Artistry */}
          <div className="glow-card group bg-white rounded-2xl overflow-hidden border border-henna-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1610030469668-93510cb28665?auto=format&fit=crop&w=800&q=80"
                  alt="Mehendi Designs"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-henna-900/80 backdrop-blur-sm text-gold-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {isTelugu ? 'హెన్నా స్పెషలిస్ట్' : 'Henna Artistry'}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-henna-700 transition-colors">
                  {t('services.mehendiTitle')}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {t('services.mehendiDesc')}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-henna-800">
                  <span className="bg-henna-50 px-2.5 py-1 rounded-md border border-henna-100">Bridal</span>
                  <span className="bg-henna-50 px-2.5 py-1 rounded-md border border-henna-100">Arabic</span>
                  <span className="bg-henna-50 px-2.5 py-1 rounded-md border border-henna-100">Traditional</span>
                  <span className="bg-henna-50 px-2.5 py-1 rounded-md border border-henna-100">Minimalist</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 pt-0 flex items-center justify-between border-t border-stone-100 mt-4">
              <div>
                <span className="text-xs text-stone-500 block">{t('services.fromPrice')}</span>
                <span className="font-serif text-xl font-bold text-henna-800">₹799</span>
              </div>
              <Link
                href="/mehendi"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-henna-700 hover:text-henna-900 group-hover:translate-x-1 transition-all"
              >
                <span>{t('services.viewCatalog')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Saree Pre-Pleating */}
          <div className="glow-card group bg-white rounded-2xl overflow-hidden border border-henna-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
                  alt="Saree Pre-Pleating"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-maroon-900/80 backdrop-blur-sm text-gold-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {isTelugu ? 'శారీ ప్రీ-ప్లీటింగ్' : 'Pre-Pleating & Box Folding'}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-maroon-700 transition-colors">
                  {t('services.sareeTitle')}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {t('services.sareeDesc')}
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-maroon-800">
                  <span className="bg-maroon-50 px-2.5 py-1 rounded-md border border-maroon-100">Kanjeevaram</span>
                  <span className="bg-maroon-50 px-2.5 py-1 rounded-md border border-maroon-100">Box Folding</span>
                  <span className="bg-maroon-50 px-2.5 py-1 rounded-md border border-maroon-100">Organza & Net</span>
                </div>
              </div>
            </div>

            <div className="p-8 pt-0 flex items-center justify-between border-t border-stone-100 mt-4">
              <div>
                <span className="text-xs text-stone-500 block">{t('services.fromPrice')}</span>
                <span className="font-serif text-xl font-bold text-maroon-800">₹399</span>
              </div>
              <Link
                href="/saree-pre-pleating"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-700 hover:text-maroon-900 group-hover:translate-x-1 transition-all"
              >
                <span>{t('services.viewCatalog')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* POPULAR DESIGNS PREVIEW */}
      <section className="bg-henna-50/50 py-20 border-y border-henna-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-henna-700">
                {isTelugu ? 'ట్రెండింగ్ డిజైన్లు' : 'Customer Favorites'}
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                {isTelugu ? 'జనాదరణ పొందిన మెహందీ డిజైన్లు' : 'Popular Mehendi Designs'}
              </h2>
            </div>
            <Link
              href="/mehendi"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-henna-700 hover:text-henna-900"
            >
              <span>{isTelugu ? 'అన్ని డిజైన్లు చూడండి' : 'Browse All Designs'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMehendi.map((item) => {
              const title = isTelugu ? item.name_te : item.name_en;
              const categoryLabel = isTelugu ? (item.category_label_te || item.category) : (item.category_label_en || item.category);

              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl overflow-hidden border border-henna-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-henna-800 shadow">
                        ₹{item.price}
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <span className="text-[11px] font-semibold text-henna-600 uppercase tracking-wider">
                        {categoryLabel}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        {title}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {isTelugu ? item.description_te : item.description_en}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-2">
                    <Link
                      href={`/book?service=mehendi&item=${item.id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-henna-50 border border-henna-200 text-henna-800 font-semibold text-xs hover:bg-henna-700 hover:text-white transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{t('common.bookNow')}</span>
                    </Link>

                    {/* SHARE BUTTON */}
                    <ShareToWhatsAppButton
                      title={title}
                      price={item.price}
                      category={categoryLabel}
                      serviceType="Mehendi"
                      className="w-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* WHY CHOOSE GLOW & GRACE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-serif font-bold text-stone-900">
            {isTelugu ? 'ఎందుకు గ్లో & గ్రేస్ ఎంచుకోవాలి?' : 'Why Choose Glow & Grace'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            {isTelugu 
              ? 'మేము నాణ్యత, సమయపాలన మరియు కస్టమర్ సంతృప్తికి అత్యధిక ప్రాధాన్యత ఇస్తాము.' 
              : 'Dedicated to punctuality, premium materials, and perfection for your cherished occasions.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-henna-100 text-henna-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {isTelugu ? '100% సహజసిద్ధ ఆర్గానిక్ హెన్నా' : '100% Organic Henna'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isTelugu 
                ? 'రసాయనాలు లేని ప్యూర్ హెన్నా పేస్ట్. ముదురు ఎరుపు రంగు మరియు సురక్షితమైన అనుభూతి.'
                : 'Zero chemicals, purely organic leaf henna ensuring a safe application and rich, lasting dark stain.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-maroon-100 text-maroon-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {isTelugu ? 'సమయ ఆదా & వేగవంతమైన డ్రేపింగ్' : 'Saves Hours of Time'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isTelugu 
                ? 'ముందే ఐరన్ చేసి బాక్స్ ఫోల్డ్ చేసిన శారీతో కేవలం 2 నిమిషాల్లో కట్టుకోవచ్చు.'
                : 'Pre-pleated and steam-box folded sarees eliminate morning rush and stress for brides and families.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {isTelugu ? 'డోర్‌స్టెప్ సౌలభ్యం' : 'Doorstep Convenience'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isTelugu 
                ? 'మీ ఇంటి వద్ద లేదా ఫంక్షన్ వేదిక వద్దకే వచ్చి సేవలను అందిస్తాము.'
                : 'Relax at your home or hotel suite while our experts deliver doorstep artistry and styling.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {isTelugu ? 'సర్వీస్ తర్వాతే చెల్లింపు' : 'Pay After Service'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {isTelugu 
                ? 'ఎటువంటి ముందస్తు ఆన్‌లైన్ పేమెంట్ అవసరం లేదు. సర్వీస్ పూర్తయిన తర్వాత సులభంగా చెల్లించండి.'
                : 'No mandatory upfront online advance. Pay comfortably via UPI or Cash once your service is completed.'}
            </p>
          </div>

        </div>
      </section>

      {/* COMPLETED WORK GALLERY TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-henna-700">
              {isTelugu ? 'రియల్ ఫోటోలు' : 'Portfolio Showcase'}
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">
              {t('gallery.title')}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-henna-700 hover:text-henna-900"
          >
            <span>{isTelugu ? 'పూర్తి గ్యాలరీ చూడండి' : 'View Full Gallery'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryList.slice(0, 4).map((img) => (
            <div 
              key={img.id} 
              className="relative rounded-xl overflow-hidden group h-64 shadow-sm bg-stone-100"
            >
              <img 
                src={img.image_url} 
                alt={isTelugu ? (img.title_te || img.title_en) : img.title_en} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <span className="text-[10px] uppercase font-bold text-gold-300 tracking-wider">
                  {img.category}
                </span>
                <p className="text-xs text-white font-bold line-clamp-1 mt-0.5">
                  {img.customer_name ? `Client: ${img.customer_name}` : (isTelugu ? img.title_te : img.title_en)}
                </p>
                {img.event_name && (
                  <p className="text-[11px] text-stone-300 line-clamp-1">
                    {img.event_name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-white py-20 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              {isTelugu ? 'తరచుగా అడిగే ప్రశ్నలు (FAQ)' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-sm text-stone-600">
              {isTelugu ? 'మీ సందేహాలకు స్పష్టమైన సమాధానాలు' : 'Everything you need to know before booking our services'}
            </p>
          </div>

          <div className="space-y-4">
            {INITIAL_FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="border border-stone-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  <span className="font-medium text-stone-900 text-sm sm:text-base">
                    {isTelugu ? faq.q_te : faq.q_en}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-stone-500 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-180 text-henna-700' : ''
                    }`} 
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-sm text-stone-600 bg-stone-50/50 border-t border-stone-100 leading-relaxed">
                    {isTelugu ? faq.a_te : faq.a_en}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA Card */}
          <div className="rounded-2xl bg-gradient-to-r from-henna-900 via-maroon-900 to-henna-950 p-8 sm:p-10 text-center text-white space-y-6 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gold-300">
              {isTelugu ? 'మీ ప్రత్యేక వేడుకకు బుకింగ్ చేసుకోండి' : 'Ready to Make Your Celebration Radiant?'}
            </h3>
            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto">
              {isTelugu 
                ? 'మీకు నచ్చిన డిజైన్ ఎంచుకోండి లేదా నేరుగా వాట్సాప్‌లో మా నిపుణులను సంప్రదించండి.'
                : 'Select your preferred designs and dates today. Doorstep availability is confirmed quickly.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold-400 text-stone-950 font-bold text-sm hover:bg-gold-300 shadow transition-all"
              >
                {t('nav.bookNow')}
              </Link>
              <a
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-stone-400 text-white font-medium text-sm hover:bg-white/10 transition-all"
              >
                {t('hero.whatsappUs')}
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
