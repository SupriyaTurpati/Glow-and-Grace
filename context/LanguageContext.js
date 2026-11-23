'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/locales/en';
import { te } from '@/locales/te';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    // Check localStorage preference
    const saved = localStorage.getItem('glow_grace_locale');
    if (saved === 'te' || saved === 'en') {
      setLocale(saved);
    }
  }, []);

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('glow_grace_locale', newLocale);
  };

  const currentDict = locale === 'te' ? te : en;

  // Helper function to resolve dot-notated translation keys (e.g., 'nav.home')
  const t = (path, params = {}) => {
    if (!path) return '';
    const keys = path.split('.');
    let current = currentDict;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English dictionary if key not found
        let fallback = en;
        for (const k of keys) {
          if (fallback && typeof fallback === 'object' && k in fallback) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }

    if (typeof current === 'string') {
      let result = current;
      Object.keys(params).forEach((p) => {
        result = result.replace(new RegExp(`{{${p}}}`, 'g'), params[p]);
      });
      return result;
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t, isTelugu: locale === 'te' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
