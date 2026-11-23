'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { dataStore } from '@/lib/dataStore';
import { BUSINESS_CONFIG } from '@/lib/config';
import { 
  STUDIO_LOCATION, 
  VIZAG_AREAS, 
  calculateGpsDistanceKm, 
  getDistanceByLocation, 
  calculateMehendiTravelFare, 
  calculateSareeDeliveryFare 
} from '@/lib/travelCalculator';
import { 
  Sparkles, Calendar, Clock, MapPin, User, Phone, 
  CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, 
  Upload, Navigation, Bike, Compass, Home, Map, Info
} from 'lucide-react';

function BookingWizardContent() {
  const { t, isTelugu } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mehendiList, setMehendiList] = useState([]);
  const [sareeList, setSareeList] = useState([]);

  useEffect(() => {
    // Initial load and background sync
    setMehendiList(dataStore.getMehendiDesigns());
    setSareeList(dataStore.getSareeStyles());
    dataStore.syncWithServer().then(() => {
      setMehendiList(dataStore.getMehendiDesigns());
      setSareeList(dataStore.getSareeStyles());
    });
  }, []);

  const initialService = searchParams.get('service') || 'both';
  const initialItem = searchParams.get('item') || '';

  const [serviceType, setServiceType] = useState(
    initialService === 'mehendi' ? 'mehendi' : initialService === 'saree' ? 'saree' : 'both'
  );
  const [selectedMehendiId, setSelectedMehendiId] = useState('');
  const [selectedSareeId, setSelectedSareeId] = useState('');
  const [sareeCount, setSareeCount] = useState(1);

  // Saree delivery mode: 'pickup_drop' (Partner 2-way doorstep) vs 'studio_drop' (Self Drop & Pickup at 32-2-171, Natayyapalem)
  const [sareeDeliveryType, setSareeDeliveryType] = useState('pickup_drop');

  // Custom design photo & notes
  const [customDesignPhoto, setCustomDesignPhoto] = useState('');
  const [customDesignNotes, setCustomDesignNotes] = useState('');

  useEffect(() => {
    if (mehendiList.length > 0 && !selectedMehendiId) {
      const match = mehendiList.find(m => m.id === initialItem);
      setSelectedMehendiId(match ? match.id : mehendiList[0].id);
    }
    if (sareeList.length > 0 && !selectedSareeId) {
      const match = sareeList.find(s => s.id === initialItem);
      setSelectedSareeId(match ? match.id : sareeList[0].id);
    }
  }, [mehendiList, sareeList, initialItem, selectedMehendiId, selectedSareeId]);

  // Customer & Event Info
  const [eventType, setEventType] = useState('Wedding / Pellikuthuru');
  const [eventDate, setEventDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Structured Doorstep Location in Visakhapatnam
  const [houseNo, setHouseNo] = useState('');
  const [streetName, setStreetName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [selectedArea, setSelectedArea] = useState('Natayyapalem (Gajuwaka)');
  const [customArea, setCustomArea] = useState('');
  const [pincode, setPincode] = useState('530012');
  const [city] = useState('Visakhapatnam');

  // GPS / Rapido distance state
  const [distanceKm, setDistanceKm] = useState(1.5);
  const [isGpsLocating, setIsGpsLocating] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Submitting states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentMehendi = mehendiList.find((m) => m.id === selectedMehendiId) || mehendiList[0];
  const currentSaree = sareeList.find((s) => s.id === selectedSareeId) || sareeList[0];

  // When area changes, automatically calculate distance & update PIN
  const handleAreaChange = (areaName) => {
    setSelectedArea(areaName);
    setGpsSuccess(false);
    if (areaName === 'other') {
      const dist = getDistanceByLocation(customArea, pincode);
      setDistanceKm(dist);
      return;
    }
    const match = VIZAG_AREAS.find(a => a.name === areaName);
    if (match) {
      setPincode(match.pincode);
      setDistanceKm(match.distanceKm);
    }
  };

  const handlePincodeChange = (newPin) => {
    setPincode(newPin);
    if (newPin.trim().length === 6) {
      const match = VIZAG_AREAS.find(a => a.pincode === newPin.trim());
      if (match) {
        setSelectedArea(match.name);
        setDistanceKm(match.distanceKm);
      }
    }
  };

  // GPS Geolocation Handler
  const handleUseCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGpsError(isTelugu ? 'మీ బ్రౌజర్‌లో GPS సపోర్ట్ లేదు.' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLocating(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = calculateGpsDistanceKm(latitude, longitude);
        setDistanceKm(dist);
        setIsGpsLocating(false);
        setGpsSuccess(true);

        // Try reverse finding the nearest area
        let closest = VIZAG_AREAS[0];
        let minDiff = 999;
        VIZAG_AREAS.forEach(area => {
          const diff = Math.abs(area.distanceKm - dist);
          if (diff < minDiff) {
            minDiff = diff;
            closest = area;
          }
        });
        if (closest && minDiff <= 3.0) {
          setSelectedArea(closest.name);
          setPincode(closest.pincode);
        }
      },
      (err) => {
        setIsGpsLocating(false);
        setGpsError(
          isTelugu 
            ? 'GPS అనుమతి లభించలేదు. దయచేసి క్రింది లిస్ట్ నుండి మీ ఏరియా ఎంచుకోండి.' 
            : 'GPS permission denied or timed out. Please select your area below.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fare calculations
  const serviceCost = useMemo(() => {
    let total = 0;
    if (serviceType === 'mehendi' || serviceType === 'both') {
      total += currentMehendi ? Number(currentMehendi.price) : 0;
    }
    if (serviceType === 'saree' || serviceType === 'both') {
      total += currentSaree ? Number(currentSaree.price) * sareeCount : 0;
    }
    return total;
  }, [serviceType, currentMehendi, currentSaree, sareeCount]);

  const travelFare = useMemo(() => {
    let fare = 0;
    const isMehendiIncluded = serviceType === 'mehendi' || serviceType === 'both';
    const isSareeIncluded = serviceType === 'saree' || serviceType === 'both';

    if (isMehendiIncluded) {
      // Home Mehendi doorstep travel charge (Rapido 2-wheeler rate from Natayyapalem)
      fare += calculateMehendiTravelFare(distanceKm);
    }

    if (isSareeIncluded) {
      if (sareeDeliveryType === 'pickup_drop') {
        const sareeCharge = calculateSareeDeliveryFare(distanceKm);
        if (isMehendiIncluded) {
          // Discounted combo delivery charge if mehendi artist is already visiting
          fare += Math.round(sareeCharge * 0.6 / 5) * 5;
        } else {
          fare += sareeCharge;
        }
      }
      // If studio_drop -> ₹0
    }

    return fare;
  }, [serviceType, distanceKm, sareeDeliveryType]);

  const grandTotal = serviceCost + travelFare;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !phone.trim() || !eventDate || !houseNo.trim() || !streetName.trim() || !landmark.trim()) {
      setErrorMsg(isTelugu ? 'దయచేసి మీ పేరు, ఫోన్ నంబర్, ఇల్లు నంబర్, స్ట్రీట్ మరియు ప్రముఖ ల్యాండ్‌మార్క్ వివరాలను నమోదు చేయండి.' : 'Please enter your name, phone, house no., street, and famous landmark.');
      return;
    }

    setIsSubmitting(true);

    const effectiveArea = selectedArea === 'other' ? (customArea.trim() || 'Visakhapatnam Area') : selectedArea;
    const fullServiceLocation = `${houseNo.trim()}, ${streetName.trim()}, Near ${landmark.trim()}, ${effectiveArea}, Visakhapatnam - ${pincode}`;

    const bookingPayload = {
      customer_name: customerName,
      customer_phone: phone,
      service_type: serviceType,
      mehendi_design_name: customDesignPhoto && serviceType !== 'saree'
        ? `Custom Design (Client Photo Attached)${currentMehendi ? ` [Ref: ${isTelugu ? currentMehendi.name_te : currentMehendi.name_en}]` : ''}`
        : (serviceType !== 'saree' && currentMehendi ? (isTelugu ? currentMehendi.name_te : currentMehendi.name_en) : null),
      saree_style_name: customDesignPhoto && serviceType === 'saree'
        ? `Custom Saree Style (Client Photo Attached) (${sareeCount} Sarees)`
        : (serviceType !== 'mehendi' && currentSaree ? `${isTelugu ? currentSaree.name_te : currentSaree.name_en} (${sareeCount} Sarees)` : null),
      saree_delivery_type: serviceType !== 'mehendi' ? sareeDeliveryType : null,
      event_type: eventType,
      event_date: eventDate,
      preferred_time: preferredTime,
      house_no: houseNo.trim(),
      street_name: streetName.trim(),
      landmark: landmark.trim(),
      area: effectiveArea,
      pincode: pincode,
      city: 'Visakhapatnam',
      service_location: fullServiceLocation,
      distance_km: distanceKm,
      service_cost: serviceCost,
      travel_charges: travelFare,
      estimated_cost: grandTotal,
      additional_requirements: customDesignNotes 
        ? `${additionalNotes ? additionalNotes + ' | ' : ''}Client Custom Design Notes: ${customDesignNotes}` 
        : additionalNotes,
      custom_design_photo: customDesignPhoto || null,
      is_custom_design: Boolean(customDesignPhoto),
    };

    setTimeout(() => {
      const saved = dataStore.addBooking(bookingPayload);
      setIsSubmitting(false);
      setSubmittedBooking(saved);

      // Construct rich WhatsApp message with Rapido travel details
      const serviceSummary = bookingPayload.service_type === 'both'
        ? 'Mehendi & Saree Pre-Pleating Combo'
        : (bookingPayload.mehendi_design_name || bookingPayload.saree_style_name || 'Mehendi / Saree Service');

      const waMsg = 
        `Hello Glow & Grace! ✨\n\n` +
        `I would like to book an appointment with you:\n` +
        `📋 *Booking ID:* #${saved.id}\n` +
        `👤 *Customer Name:* ${saved.customer_name}\n` +
        `📞 *Customer Phone:* ${saved.customer_phone}\n` +
        `🌸 *Service:* ${serviceSummary}\n` +
        `📅 *Event Date:* ${saved.event_date} at ${saved.preferred_time}\n\n` +
        `📍 *Doorstep Service Address:*\n` +
        `• House/Door No: ${saved.house_no}\n` +
        `• Street/Colony: ${saved.street_name}\n` +
        `• Famous Landmark: ${saved.landmark}\n` +
        `• Area & PIN: ${saved.area} - ${saved.pincode}\n` +
        `• City: Visakhapatnam\n\n` +
        `🛵 *Rapido Travel Details:*\n` +
        `• Studio: 32-2-171, Natayyapalem, Gajuwaka (530012)\n` +
        `• Route Distance: ~${saved.distance_km} km\n` +
        (saved.saree_delivery_type ? `• Saree Delivery: ${saved.saree_delivery_type === 'studio_drop' ? '🏢 Self Studio Drop (FREE)' : '🛵 Doorstep Pickup & Delivery by Partner'}\n` : '') +
        `💰 *Amount Breakdown:*\n` +
        `• Service Charges: ₹${saved.service_cost}\n` +
        `• Travelling Charges: ₹${saved.travel_charges}\n` +
        `• *Total Estimated:* ₹${saved.estimated_cost}\n\n` +
        (saved.custom_design_photo ? `🎨 *Custom Design:* I have attached my custom design photo on the website!\n` : '') +
        (saved.additional_requirements ? `📝 *Special Notes:* ${saved.additional_requirements}\n` : '') +
        `\nPlease review and confirm my appointment. Thank you!`;

      const waUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
      
      try {
        window.open(waUrl, '_blank');
      } catch (e) {
        // Fallback handled in UI
      }
    }, 400);
  };

  if (submittedBooking) {
    const serviceSummary = submittedBooking.service_type === 'both'
      ? 'Mehendi & Saree Pre-Pleating Combo'
      : (submittedBooking.mehendi_design_name || submittedBooking.saree_style_name || 'Mehendi / Saree Service');

    const confirmationWaMsg = 
      `Hello Glow & Grace! ✨\n\n` +
      `I would like to book an appointment with you:\n` +
      `📋 *Booking ID:* #${submittedBooking.id}\n` +
      `👤 *Customer Name:* ${submittedBooking.customer_name}\n` +
      `📞 *Customer Phone:* ${submittedBooking.customer_phone}\n` +
      `🌸 *Service:* ${serviceSummary}\n` +
      `📅 *Event Date:* ${submittedBooking.event_date} at ${submittedBooking.preferred_time}\n\n` +
      `📍 *Doorstep Service Address:*\n` +
      `• House/Door No: ${submittedBooking.house_no}\n` +
      `• Street/Colony: ${submittedBooking.street_name}\n` +
      `• Famous Landmark: ${submittedBooking.landmark}\n` +
      `• Area & PIN: ${submittedBooking.area} - ${submittedBooking.pincode}\n` +
      `• City: Visakhapatnam\n\n` +
      `🛵 *Rapido Travel Details:*\n` +
      `• Studio: 32-2-171, Natayyapalem, Gajuwaka (530012)\n` +
      `• Route Distance: ~${submittedBooking.distance_km} km\n` +
      (submittedBooking.saree_delivery_type ? `• Saree Delivery: ${submittedBooking.saree_delivery_type === 'studio_drop' ? '🏢 Self Studio Drop (FREE)' : '🛵 Doorstep Pickup & Delivery by Partner'}\n` : '') +
      `💰 *Amount Breakdown:*\n` +
      `• Service Charges: ₹${submittedBooking.service_cost}\n` +
      `• Travelling Charges: ₹${submittedBooking.travel_charges}\n` +
      `• *Total Estimated:* ₹${submittedBooking.estimated_cost}\n\n` +
      (submittedBooking.custom_design_photo ? `🎨 *Custom Design:* I have attached my custom design photo on the website!\n` : '') +
      (submittedBooking.additional_requirements ? `📝 *Special Notes:* ${submittedBooking.additional_requirements}\n` : '') +
      `\nPlease review and confirm my appointment. Thank you!`;

    const confirmationWaUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(confirmationWaMsg)}`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          {t('booking.successTitle')}
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          {t('booking.successDesc', { id: submittedBooking.id })}
        </p>

        <div className="p-6 bg-white rounded-2xl border border-stone-200 text-left space-y-3.5 text-sm shadow-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-stone-500">{isTelugu ? 'బుకింగ్ ఐడి' : 'Booking Reference'}:</span>
            <span className="font-bold text-henna-800">#{submittedBooking.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-stone-500">{isTelugu ? 'కస్టమర్ పేరు' : 'Customer Name'}:</span>
            <span className="font-semibold text-stone-800">{submittedBooking.customer_name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-stone-500">{isTelugu ? 'సర్వీస్' : 'Service'}:</span>
            <span className="font-semibold text-stone-800">{serviceSummary}</span>
          </div>
          {submittedBooking.custom_design_photo && (
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-stone-500">{isTelugu ? 'మీ స్వంత డిజైన్ ఫోటో' : 'Your Custom Design Photo'}:</span>
              <img src={submittedBooking.custom_design_photo} alt="Custom design reference" className="w-12 h-12 rounded-lg object-cover border border-amber-300 shadow-sm" />
            </div>
          )}
          <div className="flex justify-between border-b pb-2">
            <span className="text-stone-500">{isTelugu ? 'ఈవెంట్ తేదీ' : 'Event Date'}:</span>
            <span className="font-semibold text-stone-800">{submittedBooking.event_date} ({submittedBooking.preferred_time})</span>
          </div>
          <div className="border-b pb-2 space-y-1">
            <span className="text-stone-500 block">{isTelugu ? 'డోర్‌స్టెప్ చిరునామా' : 'Doorstep Address'}:</span>
            <p className="font-medium text-stone-800 text-xs leading-relaxed bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
              {submittedBooking.service_location}
            </p>
          </div>

          {/* Rapido Route & Travel Charge Details */}
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-xs space-y-1.5 text-amber-950">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-henna-700" />
                <span>{isTelugu ? 'రాపిడో తరహా ప్రయాణ వివరాలు' : 'Doorstep Travel Distance & Route'}</span>
              </span>
              <span className="bg-amber-200/80 px-2 py-0.5 rounded text-[11px] font-bold">
                ~{submittedBooking.distance_km} km
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              {isTelugu 
                ? 'స్టూడియో: 32-2-171, నాటయ్యపాలెం, గాజువాక నుండి మీ లొకేషన్ వరకు లెక్కించబడింది.' 
                : 'Calculated from Studio at 32-2-171, Natayyapalem, Gajuwaka to your doorstep.'}
            </p>
            <div className="flex justify-between pt-1 border-t border-amber-200/60 font-medium">
              <span>{isTelugu ? 'సర్వీస్ ధర:' : 'Service Cost:'}</span>
              <span>₹{submittedBooking.service_cost}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>{isTelugu ? 'ప్రయాణ ఛార్జీలు:' : 'Travelling Charges:'}</span>
              <span>₹{submittedBooking.travel_charges}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-amber-300 font-bold text-sm text-henna-900">
              <span>{isTelugu ? 'మొత్తం చెల్లించవలసినది:' : 'Grand Total:'}</span>
              <span>₹{submittedBooking.estimated_cost}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
          <p className="font-bold flex items-center justify-center gap-1.5 text-sm">
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>{isTelugu ? 'వాట్సాప్ మెసేజ్ సిద్ధంగా ఉంది (7842308509)' : 'WhatsApp Notification to 7842308509'}</span>
          </p>
          <p>
            {isTelugu
              ? 'మీ బుకింగ్ మరియు ప్రయాణ వివరాలు ఆటోమేటిక్‌గా మీ వాట్సాప్ ద్వారా మా నంబర్ 7842308509 కు పంపబడతాయి. క్రింది బటన్ క్లిక్ చేసి నిర్ధారించండి.'
              : 'Your appointment and Rapido travel breakdown are prepared for WhatsApp dispatch to our team at 7842308509. Click below to verify!'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={confirmationWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-white" />
            <span>{isTelugu ? 'వాట్సాప్ మెసేజ్ పంపండి (7842308509)' : 'Send WhatsApp to 7842308509'}</span>
          </a>
          <button
            onClick={() => router.push('/bookings')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-colors"
          >
            {t('booking.viewBookingsBtn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          {t('booking.title')}
        </h1>
        <p className="text-stone-600 text-sm">
          {t('booking.subtitle')}
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-700 font-medium">
          <MapPin className="w-3.5 h-3.5 text-henna-700" />
          <span>{isTelugu ? 'విశాఖపట్నం అంతటా డోర్‌స్టెప్ సేవలు అందుబాటులో ఉన్నాయి' : 'Doorstep service across Visakhapatnam & nearby areas'}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Service Type Selection */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-henna-100 shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-henna-700 text-white text-xs flex items-center justify-center">1</span>
            <span>{t('booking.step1')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setServiceType('mehendi')}
              className={`p-4 rounded-xl border text-left transition-all ${
                serviceType === 'mehendi'
                  ? 'border-henna-700 bg-henna-50/70 shadow-sm ring-1 ring-henna-700'
                  : 'border-stone-200 hover:border-henna-300'
              }`}
            >
              <p className="font-serif font-bold text-sm text-stone-900">{t('booking.mehendiOnly')}</p>
              <p className="text-xs text-stone-500 mt-1">{isTelugu ? 'హెన్నా డిజైన్లు మాత్రమే' : 'Doorstep Henna Art'}</p>
            </button>

            <button
              type="button"
              onClick={() => setServiceType('saree')}
              className={`p-4 rounded-xl border text-left transition-all ${
                serviceType === 'saree'
                  ? 'border-maroon-700 bg-maroon-50/70 shadow-sm ring-1 ring-maroon-700'
                  : 'border-stone-200 hover:border-maroon-300'
              }`}
            >
              <p className="font-serif font-bold text-sm text-stone-900">{t('booking.sareeOnly')}</p>
              <p className="text-xs text-stone-500 mt-1">{isTelugu ? 'శారీ ప్రీ-ప్లీటింగ్ మాత్రమే' : 'Saree Pleating & Box Fold'}</p>
            </button>

            <button
              type="button"
              onClick={() => setServiceType('both')}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                serviceType === 'both'
                  ? 'border-gold-600 bg-amber-50/70 shadow-sm ring-1 ring-gold-600'
                  : 'border-stone-200 hover:border-gold-300'
              }`}
            >
              <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-henna-700 to-maroon-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {isTelugu ? 'పాపులర్' : 'Popular'}
              </span>
              <p className="font-serif font-bold text-sm text-stone-900">{t('booking.bothServices')}</p>
              <p className="text-xs text-stone-500 mt-1">{isTelugu ? 'మెహందీ & శారీ కాంబో' : 'Full Celebration Package'}</p>
            </button>
          </div>

          {/* Conditional Design Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            {/* Mehendi Design Dropdown */}
            {(serviceType === 'mehendi' || serviceType === 'both') && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  {t('booking.selectDesign')}
                </label>
                <select
                  value={selectedMehendiId}
                  onChange={(e) => setSelectedMehendiId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-henna-700"
                >
                  {mehendiList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {isTelugu ? d.name_te : d.name_en} — ₹{d.price}
                    </option>
                  ))}
                </select>
                {currentMehendi && (
                  <p className="text-xs text-stone-500">
                    {isTelugu ? currentMehendi.description_te : currentMehendi.description_en}
                  </p>
                )}
              </div>
            )}

            {/* Saree Style Dropdown */}
            {(serviceType === 'saree' || serviceType === 'both') && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  {t('booking.selectStyle')}
                </label>
                <select
                  value={selectedSareeId}
                  onChange={(e) => setSelectedSareeId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-maroon-700"
                >
                  {sareeList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {isTelugu ? s.name_te : s.name_en} — ₹{s.price}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-stone-600 font-medium">{isTelugu ? 'చీరల సంఖ్య:' : 'No. of Sarees:'}</span>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setSareeCount(Math.max(1, sareeCount - 1))}
                      className="px-3 py-1 text-sm font-bold bg-stone-100 hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold">{sareeCount}</span>
                    <button
                      type="button"
                      onClick={() => setSareeCount(sareeCount + 1)}
                      className="px-3 py-1 text-sm font-bold bg-stone-100 hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Saree Pickup & Delivery Options (When Saree is Selected) */}
          {(serviceType === 'saree' || serviceType === 'both') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-maroon-700" />
                  <span>{isTelugu ? 'శారీ సేకరణ మరియు డెలివరీ ఎంపిక:' : 'Saree Pickup & Delivery Option:'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSareeDeliveryType('pickup_drop')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    sareeDeliveryType === 'pickup_drop'
                      ? 'border-maroon-700 bg-white ring-1 ring-maroon-700 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <p className="font-bold text-xs text-stone-900 flex items-center justify-between">
                    <span>{isTelugu ? '🛵 గ్లో & గ్రేస్ డోర్‌స్టెప్ పికప్ & డెలివరీ' : '🛵 Doorstep Pickup & Delivery by Partner'}</span>
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {isTelugu 
                      ? 'మా పార్టనర్ మీ ఇంటి వద్ద చీర తీసుకుని, ప్రెస్ చేసి బాక్స్ ఫోల్డింగ్ తో మీకే తిరిగి అందిస్తారు.' 
                      : 'Partner collects saree from your home, presses/pleats, and safely returns it ready to wear.'}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-maroon-800 bg-maroon-50 px-2 py-0.5 rounded">
                    {isTelugu ? 'రాపిడో తరహా ప్రయాణ ఛార్జీ వర్తిస్తుంది' : 'Rapido bike charges apply based on distance'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSareeDeliveryType('studio_drop')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    sareeDeliveryType === 'studio_drop'
                      ? 'border-emerald-700 bg-white ring-1 ring-emerald-700 shadow-sm'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <p className="font-bold text-xs text-stone-900 flex items-center justify-between">
                    <span>{isTelugu ? '🏢 స్టూడియో వద్ద స్వంత డ్రాప్ & పికప్' : '🏢 Self Drop & Pickup at Studio'}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">₹0 FREE</span>
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    {isTelugu 
                      ? 'మా స్టూడియో (32-2-171, నాటయ్యపాలెం, గాజువాక) వద్ద మీరు స్వయంగా అందజేసి తీసుకోవచ్చు.' 
                      : 'You hand over & collect at our Studio: 32-2-171, Natayyapalem, Gajuwaka.'}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {isTelugu ? 'ప్రయాణ ఛార్జీలు లేవు (ఉచితం)' : 'Zero Travel Charges (Free)'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Customer's Own Custom Design Upload Section */}
          <div className="pt-2 border-t border-stone-100">
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 to-stone-50 border border-amber-200/80 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isTelugu ? 'స్వంత డిజైన్ ఫోటో జత చేయండి (ఐచ్ఛికం)' : 'Book With Your Own Custom Design (Optional)'}</span>
                  </span>
                  <p className="text-xs text-stone-600 mt-1 font-medium">
                    {isTelugu 
                      ? 'మా కేటలాగ్‌లో లేని మీ స్వంత ప్రత్యేక డిజైన్ లేదా Pinterest / Instagram రిఫరెన్స్ ఫోటో ఉంటే ఇక్కడ అప్‌లోడ్ చేయండి.' 
                      : 'Prefer your own design from Instagram, Pinterest, or camera roll? Upload your reference photo here!'}
                  </p>
                </div>
                {customDesignPhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomDesignPhoto('');
                      setCustomDesignNotes('');
                    }}
                    className="text-xs text-red-600 hover:underline font-semibold shrink-0"
                  >
                    {isTelugu ? 'తొలగించు' : 'Remove Photo'}
                  </button>
                )}
              </div>

              {customDesignPhoto ? (
                <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-amber-300 shadow-sm">
                  <img 
                    src={customDesignPhoto} 
                    alt="Custom design preview" 
                    className="w-20 h-20 rounded-xl object-cover border border-amber-300 shadow-sm shrink-0"
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isTelugu ? 'మీ స్వంత డిజైన్ ఫోటో విజయవంతంగా జతచేయబడింది!' : 'Your Custom Design Photo Attached!'}</span>
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {isTelugu 
                        ? 'ఈ డిజైన్ ఫోటో మీ బుకింగ్ అభ్యర్థనతో పాటు నేరుగా మా నిపుణులకు పంపబడుతుంది.' 
                        : 'Our artist will review your uploaded design reference and cater specifically to this style.'}
                    </p>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-amber-300 rounded-xl bg-white hover:bg-amber-50/50 cursor-pointer transition-colors group">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="w-7 h-7 text-amber-700 group-hover:scale-110 transition-transform mb-1" />
                    <p className="text-xs font-bold text-stone-800">
                      {isTelugu ? 'మీ స్వంత డిజైన్ ఫోటోను అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి' : 'Click to Upload Your Custom Design Photo'}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {isTelugu ? 'మొబైల్ కెమెరా లేదా గ్యాలరీ ఫోటో (JPG, PNG, WEBP)' : 'Directly from Mobile Camera or Device Gallery (JPG, PNG)'}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setCustomDesignPhoto(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </label>
              )}

              {customDesignPhoto && (
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    {isTelugu ? 'డిజైన్ సూచనలు లేదా వివరణ (ఐచ్ఛికం):' : 'Design Instructions or Preferences (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={customDesignNotes}
                    onChange={(e) => setCustomDesignNotes(e.target.value)}
                    placeholder={isTelugu ? 'ఉదా: ముందు చేతికి మాత్రమే, వెనుక భాగం సింపుల్ బెల్స్ డిజైన్' : 'e.g., Back hand only, delicate finger mesh, medium pallu width'}
                    className="w-full p-2.5 rounded-lg border border-stone-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-henna-700"
                  />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Step 2: Doorstep Location & Event Details */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-henna-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-henna-700 text-white text-xs flex items-center justify-center">2</span>
              <span>{t('booking.step2')}</span>
            </h2>
            <span className="text-xs text-stone-500">
              {isTelugu ? 'మీ ఇంటి వద్దకే మా సర్వీస్' : 'Doorstep Service at Your Residence / Venue'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                {t('booking.customerName')} *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sravanthi Reddy"
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                {t('booking.phone')} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 7842308509"
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                {t('booking.eventType')}
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
              >
                <option value="Wedding / Pellikuthuru">{isTelugu ? 'వివాహం / పెళ్లికూతురు' : 'Wedding / Pellikuthuru'}</option>
                <option value="Haldi / Mehendi Function">{isTelugu ? 'హల్దీ / మెహందీ ఫంక్షన్' : 'Haldi / Mehendi Function'}</option>
                <option value="Engagement">{isTelugu ? 'నిశ్చితార్థం' : 'Engagement Ceremony'}</option>
                <option value="Baby Shower / Seemantham">{isTelugu ? 'సీమంతం / బేబీ షవర్' : 'Baby Shower / Seemantham'}</option>
                <option value="Festival / Family Event">{isTelugu ? 'పండుగ / కుటుంబ వేడుక' : 'Festival / Family Gathering'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  {t('booking.eventDate')} *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  {t('booking.preferredTime')}
                </label>
                <input
                  type="text"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                  className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
                />
              </div>
            </div>

          </div>

          {/* Rapido-Style Location Collection for Visakhapatnam */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-stone-50 to-amber-50/30 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-henna-700" />
                  <span>{isTelugu ? 'డోర్‌స్టెప్ సర్వీస్ చిరునామా (విశాఖపట్నం)' : 'Doorstep Service Address (Visakhapatnam)'}</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isTelugu ? 'మా నాటయ్యపాలెం స్టూడియో నుండి ఖచ్చితమైన ప్రయాణ ఛార్జీ లెక్కించడానికి పూర్తి వివరాలు నమోదు చేయండి.' : 'Enter full address details to calculate accurate Rapido-style travel fare from our Natayyapalem studio.'}
                </p>
              </div>

              {/* GPS Button */}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isGpsLocating}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-henna-50 border border-stone-300 hover:border-henna-400 text-stone-800 text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <Navigation className={`w-3.5 h-3.5 text-henna-700 ${isGpsLocating ? 'animate-spin' : ''}`} />
                <span>{isGpsLocating ? (isTelugu ? 'లొకేషన్ శోధిస్తోంది...' : 'Locating GPS...') : (isTelugu ? '📍 నా ప్రస్తుత లొకేషన్ ఉపయోగించు' : '📍 Use My Current Location')}</span>
              </button>
            </div>

            {gpsSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{isTelugu ? `GPS విజయవంతంగా గుర్తించబడింది! స్టూడియో నుండి దూరం: ~${distanceKm} km` : `GPS location detected successfully! Distance from Natayyapalem Studio: ~${distanceKm} km`}</span>
              </div>
            )}

            {gpsError && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{gpsError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  {isTelugu ? 'ఇల్లు / ఫ్లాట్ / డోర్ నంబర్ *' : 'House / Flat / Door Number *'}
                </label>
                <input
                  type="text"
                  required
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="e.g. D.No 32-2-171, Flat 302, Sri Nilayam"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-henna-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  {isTelugu ? 'స్ట్రీట్ / కాలనీ / రోడ్ *' : 'Street / Colony / Road *'}
                </label>
                <input
                  type="text"
                  required
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  placeholder="e.g. Old Transformer Street, Natayyapalem"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-henna-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  {isTelugu ? 'ప్రముఖ ల్యాండ్‌మార్క్ (దగ్గరి ప్రదేశం) *' : 'Famous Landmark / Near Location *'}
                </label>
                <input
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Raghu Kirana Store, Opposite Water Tank"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-henna-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  {isTelugu ? 'విశాఖపట్నం ఏరియా ఎంచుకోండి *' : 'Select Visakhapatnam Area *'}
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-henna-700"
                >
                  {VIZAG_AREAS.map((area) => (
                    <option key={area.name} value={area.name}>
                      {area.name} ({area.pincode}) — ~{area.distanceKm} km
                    </option>
                  ))}
                  <option value="other">{isTelugu ? 'ఇతర ఏరియా / పరిసర గ్రామం' : 'Other Area / Nearby Town'}</option>
                </select>
              </div>

              {selectedArea === 'other' && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    {isTelugu ? 'మీ ఏరియా పేరు నమోదు చేయండి:' : 'Specify Your Area Name:'}
                  </label>
                  <input
                    type="text"
                    value={customArea}
                    onChange={(e) => {
                      setCustomArea(e.target.value);
                      const dist = getDistanceByLocation(e.target.value, pincode);
                      setDistanceKm(dist);
                    }}
                    placeholder="e.g. Pendurthi, Chodavaram, Tagarapuvalasa"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-henna-700"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  {isTelugu ? 'పిన్ కోడ్ (PIN Code) *' : 'PIN Code *'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="530012"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-henna-700"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  {isTelugu ? 'నగరం' : 'City'}
                </label>
                <input
                  type="text"
                  disabled
                  value={city}
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-sm bg-stone-100 text-stone-500 font-medium"
                />
              </div>

            </div>

            {/* Live Rapido Travel Charges Calculator Card */}
            <div className="mt-3 p-4 rounded-xl bg-white border border-amber-300 shadow-sm space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Bike className="w-4 h-4 text-henna-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{isTelugu ? 'రాపిడో తరహా ప్రయాణ ఛార్జీ లెక్కింపు' : 'Rapido-Style Travelling Fare'}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                        {distanceKm} km
                      </span>
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {isTelugu 
                        ? '32-2-171, నాటయ్యపాలెం స్టూడియో నుండి మీ లొకేషన్‌కు' 
                        : 'From 32-2-171, Natayyapalem Studio to your doorstep'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">{isTelugu ? 'ప్రయాణ ఛార్జీ:' : 'Travel Fee:'}</span>
                  <span className="text-base font-bold text-henna-800">
                    {travelFare === 0 ? (
                      <span className="text-emerald-700">₹0 (FREE)</span>
                    ) : (
                      `₹${travelFare}`
                    )}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                {serviceType === 'saree' && sareeDeliveryType === 'studio_drop'
                  ? (isTelugu ? 'మీరు స్టూడియో డ్రాప్ & పికప్ ఎంచుకున్నారు కాబట్టి ప్రయాణ ఛార్జీలు ఉచితం (₹0).' : 'You selected self studio drop & pickup at Natayyapalem. Travel charges are ₹0.')
                  : (isTelugu 
                      ? 'నాటయ్యపాలెం/గాజువాక స్థానిక పరిధి (2.5 km వరకు) కేవలం ₹30-35. ఆ తర్వాత కిలోమీటరుకు ₹12 బైక్ టాక్సీ ఛార్జ్ మాత్రమే వర్తిస్తుంది.' 
                      : 'Local Natayyapalem/Gajuwaka visit (up to 2.5km) is just ₹30-35. Beyond that, bike transit is ₹12/km.')}
              </p>
            </div>

            <div className="space-y-1 pt-2">
              <label className="block text-xs font-semibold text-stone-700">
                {t('booking.specialRequests')}
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder={isTelugu ? 'ఉదా: పెళ్లికూతురు ఫోటోల కోసం డార్క్ కలర్ అవసరం, టైమింగ్ సూచనలు' : 'e.g. Need darker stain for bridal photos, specific time preference'}
                className="w-full p-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-white"
              />
            </div>

          </div>

        </div>

        {/* Step 3: Estimated Cost Summary & Submit */}
        <div className="bg-gradient-to-r from-stone-900 to-henna-950 p-6 sm:p-8 rounded-2xl text-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-stone-700 pb-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                {t('booking.estimatedCost')}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-white">
                  ₹{grandTotal}
                </span>
                <span className="text-xs text-stone-400">
                  (Service ₹{serviceCost} + Travel ₹{travelFare})
                </span>
              </div>
            </div>
            <div className="text-xs text-stone-300 max-w-sm sm:text-right">
              <p className="text-emerald-400 font-semibold mb-1 flex items-center sm:justify-end gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{isTelugu ? 'అడ్వాన్స్ లేకుండా బుకింగ్' : 'Zero Advance Booking'}</span>
              </p>
              <p>{t('booking.paymentNote')}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-gold-400 hover:bg-gold-300 text-stone-950 font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? t('booking.submitting') : t('booking.submitBtn')}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading booking page...</div>}>
      <BookingWizardContent />
    </Suspense>
  );
}
