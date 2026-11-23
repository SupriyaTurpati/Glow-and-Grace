'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { BUSINESS_CONFIG } from '@/lib/config';
import { Sparkles, Menu, X, Globe, Calendar, Phone, User, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { locale, changeLanguage, t, isTelugu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const toggleLanguage = () => {
    changeLanguage(locale === 'en' ? 'te' : 'en');
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/mehendi', label: t('nav.mehendi') },
    { href: '/saree-pre-pleating', label: t('nav.saree') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/bookings', label: t('nav.bookings') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-henna-100 shadow-sm">
      {/* Top micro-bar */}
      <div className="bg-gradient-to-r from-henna-900 via-maroon-900 to-henna-900 text-amber-100/90 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-medium">
              {isTelugu 
                ? 'వివాహాలు & శుభకార్యాల స్పెషలిస్ట్ డోర్‌స్టెప్ సర్వీస్' 
                : 'Premium Doorstep Bridal Mehendi & Saree Pre-Pleating Specialists'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard" 
              className="hidden sm:inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>{t('nav.admin')}</span>
            </Link>
            <a 
              href={BUSINESS_CONFIG.whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{BUSINESS_CONFIG.formattedPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-henna-700 to-maroon-800 flex items-center justify-center text-gold-300 shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-henna-950 group-hover:text-henna-800 transition-colors">
                Glow &amp; Grace
              </span>
              <p className="text-[10px] uppercase tracking-widest text-henna-600 font-medium">
                {isTelugu ? 'మెహందీ & శారీ సర్వీసెస్' : 'Mehendi & Saree Pleating'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-henna-700 ${
                  isActive(link.href)
                    ? 'text-henna-700 font-semibold border-b-2 border-henna-700 pb-1'
                    : 'text-stone-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-henna-200 text-xs font-semibold text-henna-800 bg-white hover:bg-henna-50 shadow-sm transition-all"
              title="Toggle English / Telugu"
            >
              <Globe className="w-3.5 h-3.5 text-henna-600" />
              <span>{locale === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* Profile / Account */}
            <Link
              href="/profile"
              className="p-2 text-stone-600 hover:text-henna-800 rounded-full hover:bg-henna-50 transition-colors"
              title="Customer Profile"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Book Now Button */}
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-henna-700 to-maroon-700 text-white font-medium text-sm shadow-md hover:from-henna-800 hover:to-maroon-800 hover:shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4 text-gold-300" />
              <span>{t('nav.bookNow')}</span>
            </Link>
          </div>

          {/* Mobile Menu & Language Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full border border-henna-200 text-xs font-semibold text-henna-800 bg-white"
            >
              {locale === 'en' ? 'తెలుగు' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-henna-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-henna-100 bg-[#FAF8F5] px-4 pt-4 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.href)
                  ? 'bg-henna-100 text-henna-900 font-semibold'
                  : 'text-stone-700 hover:bg-henna-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-henna-200 space-y-2">
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-henna-700 to-maroon-700 text-white font-semibold text-sm shadow"
            >
              <Calendar className="w-4 h-4 text-gold-300" />
              <span>{t('nav.bookNow')}</span>
            </Link>
            <div className="flex justify-between items-center px-2 pt-2">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-stone-600 hover:text-henna-800 inline-flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                <span>{t('nav.profile')}</span>
              </Link>
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-henna-700 hover:underline inline-flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>{t('nav.admin')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
