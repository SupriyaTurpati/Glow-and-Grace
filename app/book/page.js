'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { dataStore } from '@/lib/dataStore';
import { BUSINESS_CONFIG } from '@/lib/config';
import { 
  Sparkles, Calendar, Clock, MapPin, User, Phone, 
  CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Upload, Image as ImageIcon 
} from 'lucide-react';

function BookingWizardContent() {
  const { t, isTelugu } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mehendiList, setMehendiList] = useState([]);
  const [sareeList, setSareeList] = useState([]);

  useEffect(() => {
    setMehendiList(dataStore.getMehendiDesigns());
    setSareeList(dataStore.getSareeStyles());
  }, []);

  const initialService = searchParams.get('service') || 'both';
  const initialItem = searchParams.get('item') || '';

  const [serviceType, setServiceType] = useState(
    initialService === 'mehendi' ? 'mehendi' : initialService === 'saree' ? 'saree' : 'both'
  );
  const [selectedMehendiId, setSelectedMehendiId] = useState('');
  const [selectedSareeId, setSelectedSareeId] = useState('');
  const [sareeCount, setSareeCount] = useState(1);

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

  const [eventType, setEventType] = useState('Wedding / Pellikuthuru');
  const [eventDate, setEventDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentMehendi = mehendiList.find((m) => m.id === selectedMehendiId) || mehendiList[0];
  const currentSaree = sareeList.find((s) => s.id === selectedSareeId) || sareeList[0];

  const estimatedCost = React.useMemo(() => {
    let total = 0;
    if (serviceType === 'mehendi' || serviceType === 'both') {
      total += currentMehendi ? Number(currentMehendi.price) : 0;
    }
    if (serviceType === 'saree' || serviceType === 'both') {
      total += currentSaree ? Number(currentSaree.price) * sareeCount : 0;
    }
    return total;
  }, [serviceType, currentMehendi, currentSaree, sareeCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !phone.trim() || !eventDate || !address.trim()) {
      setErrorMsg(isTelugu ? 'దయచేసి అన్ని అవసరమైన వివరాలు నమోదు చేయండి.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

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
      event_type: eventType,
      event_date: eventDate,
      preferred_time: preferredTime,
      service_location: `${address}, ${cityArea}`,
      additional_requirements: customDesignNotes 
        ? `${additionalNotes ? additionalNotes + ' | ' : ''}Client Custom Design Notes: ${customDesignNotes}` 
        : additionalNotes,
      estimated_cost: estimatedCost,
      custom_design_photo: customDesignPhoto || null,
      is_custom_design: Boolean(customDesignPhoto),
    };

    setTimeout(() => {
      const saved = dataStore.addBooking(bookingPayload);
      setIsSubmitting(false);
      setSubmittedBooking(saved);
    }, 500);
  };

  if (submittedBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          {t('booking.successTitle')}
        </h1>
        <p className="text-stone-600 text-sm leading-relaxed">
          {t('booking.successDesc', { id: submittedBooking.id })}
        </p>

        <div className="p-6 bg-white rounded-2xl border border-stone-200 text-left space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-stone-500">{isTelugu ? 'బుకింగ్ ఐడి' : 'Booking Reference'}:</span>
            <span className="font-bold text-henna-800">{submittedBooking.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-stone-500">{isTelugu ? 'కస్టమర్ పేరు' : 'Customer Name'}:</span>
            <span className="font-semibold text-stone-800">{submittedBooking.customer_name}</span>
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
          <div className="flex justify-between border-b pb-2">
            <span className="text-stone-500">{isTelugu ? 'అంచనా మొత్తం' : 'Estimated Cost'}:</span>
            <span className="font-bold text-emerald-700">₹{submittedBooking.estimated_cost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">{isTelugu ? 'స్థితి' : 'Current Status'}:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase">
              {t('bookingStatus.pending')}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => router.push('/bookings')}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-henna-700 text-white font-semibold text-sm hover:bg-henna-800 transition-colors"
          >
            {t('booking.viewBookingsBtn')}
          </button>
          <a
            href={`https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${encodeURIComponent(
              `Hello! I just submitted booking request #${submittedBooking.id} on Glow & Grace for ${submittedBooking.event_date}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-stone-300 text-stone-800 font-semibold text-sm hover:bg-stone-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>{t('hero.whatsappUs')}</span>
          </a>
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
              <p className="text-xs text-stone-500 mt-1">{isTelugu ? 'హెన్నా డిజైన్లు మాత్రమే' : 'Only Henna Design'}</p>
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
              <p className="text-xs text-stone-500 mt-1">{isTelugu ? 'శారీ ప్రీ-ప్లీటింగ్ మాత్రమే' : 'Only Saree Pleating'}</p>
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

          {/* Customer's Own Custom Design Upload Section */}
          <div className="pt-4 border-t border-stone-100">
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
                      : 'Prefer your own design from Instagram, Pinterest, or your camera gallery? Upload your reference photo here!'}
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

        {/* Step 2: Event & Doorstep Details */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-henna-100 shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-henna-700 text-white text-xs flex items-center justify-center">2</span>
            <span>{t('booking.step2')}</span>
          </h2>

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

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700">
                {t('booking.address')} *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House No., Landmark, Apartment or Venue name"
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                {t('booking.cityArea')} *
              </label>
              <input
                type="text"
                required
                value={cityArea}
                onChange={(e) => setCityArea(e.target.value)}
                placeholder="e.g. Hyderabad, Madhapur"
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                {t('booking.specialRequests')}
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Need darker stain for bridal photos, specific color preference"
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-henna-700 bg-stone-50/50"
              />
            </div>

          </div>

        </div>

        {/* Step 3: Estimated Cost Summary & Submit */}
        <div className="bg-gradient-to-r from-stone-900 to-henna-950 p-6 sm:p-8 rounded-2xl text-white shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-700 pb-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                {t('booking.estimatedCost')}
              </p>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
                ₹{estimatedCost}
              </p>
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
