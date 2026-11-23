'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { BUSINESS_CONFIG } from '@/lib/config';
import { Sparkles, Phone, Mail, MapPin, Instagram, Facebook, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t, isTelugu } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-henna-700 flex items-center justify-center text-gold-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                Glow &amp; Grace
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {t('brand.description')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={BUSINESS_CONFIG.instagramUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-800 text-stone-300 hover:bg-henna-700 hover:text-white transition-colors text-xs font-medium"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>{BUSINESS_CONFIG.instagram}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase mb-4 text-gold-400">
              {isTelugu ? 'శీఘ్ర లింకులు' : 'Quick Navigation'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-gold-300 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/mehendi" className="hover:text-gold-300 transition-colors">
                  {t('nav.mehendi')}
                </Link>
              </li>
              <li>
                <Link href="/saree-pre-pleating" className="hover:text-gold-300 transition-colors">
                  {t('nav.saree')}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold-300 transition-colors">
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-gold-300 transition-colors">
                  {t('nav.bookNow')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Areas & Occasions */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase mb-4 text-gold-400">
              {isTelugu ? 'ప్రత్యేక వేడుకలు' : 'Occasions We Serve'}
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>{isTelugu ? '• వివాహాలు & పెళ్లికూతురు' : '• Grand Weddings & Pellikuthuru'}</li>
              <li>{isTelugu ? '• హల్దీ & మెహందీ సంగీత్' : '• Haldi & Mehendi Sangeet'}</li>
              <li>{isTelugu ? '• నిశ్చితార్థం & రిసెప్షన్' : '• Engagements & Receptions'}</li>
              <li>{isTelugu ? '• సీమంతం & బేబీ షవర్' : '• Seemantham & Baby Showers'}</li>
              <li>{isTelugu ? '• పండుగలు & కుటుంబ వేడుకలు' : '• Festivals & Family Gatherings'}</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase mb-4 text-gold-400">
              {t('common.contactUs')}
            </h3>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-henna-400 mt-1 shrink-0" />
                <span>{isTelugu ? 'డోర్‌స్టెప్ సేవలు అందుబాటులో ఉన్నాయి, విశాఖపట్నం & పరిసర ప్రాంతాలు' : 'Doorstep Services Available in ' + BUSINESS_CONFIG.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:+91${BUSINESS_CONFIG.phone}`} className="hover:text-white transition-colors font-medium">
                  {BUSINESS_CONFIG.formattedPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${BUSINESS_CONFIG.email}`} className="hover:text-white transition-colors">
                  {BUSINESS_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <a href={BUSINESS_CONFIG.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  {BUSINESS_CONFIG.instagram}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-gold-300 border border-stone-800 rounded px-2.5 py-1 bg-stone-950 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                  <span>{isTelugu ? 'అడ్మినిస్ట్రేటర్ పోర్టల్' : 'Business Owner Admin Login'}</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Glow &amp; Grace. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>{isTelugu ? 'ప్రేమతో రూపొందించబడింది' : 'Crafted for beauty, tradition, and perfection'}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
