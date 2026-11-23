// Rapido-style Distance & Travel Charge Calculator for Visakhapatnam
// Base Studio / Origin Location:
// 32-2-171, Raghu Kirana Store, Old Transformer Street, Natayyapalem, Gajuwaka, Visakhapatnam - 530012

export const STUDIO_LOCATION = {
  address: '32-2-171, Raghu Kirana Store, Old Transformer Street, Natayyapalem, Gajuwaka',
  city: 'Visakhapatnam',
  pincode: '530012',
  lat: 17.6975,
  lng: 83.1895,
  landmark: 'Raghu Kirana Store, Old Transformer Street'
};

// Known Visakhapatnam Area & PIN Code distance mapping from Natayyapalem, Gajuwaka
export const VIZAG_AREAS = [
  { name: 'Natayyapalem (Gajuwaka)', pincode: '530012', distanceKm: 1.5 },
  { name: 'Gajuwaka Central / Old Gajuwaka', pincode: '530026', distanceKm: 3.5 },
  { name: 'Auto Nagar / Industrial Estate', pincode: '530012', distanceKm: 4.0 },
  { name: 'Kurmannapalem / Steel Plant Township', pincode: '530044', distanceKm: 6.0 },
  { name: 'Vadlapudi / Duvvada Railway Station', pincode: '530046', distanceKm: 7.0 },
  { name: 'Sheela Nagar / BHPV', pincode: '530012', distanceKm: 5.5 },
  { name: 'Tungalam / Mindi', pincode: '530026', distanceKm: 4.5 },
  { name: 'Scindia / Malkapuram / Naval Dockyard', pincode: '530011', distanceKm: 9.0 },
  { name: 'Visakhapatnam Airport / NAD Junction', pincode: '530009', distanceKm: 10.5 },
  { name: 'Pendurthi / Sujatha Nagar', pincode: '530027', distanceKm: 13.5 },
  { name: 'Kancharapalem / Urvasi / 104 Area', pincode: '530008', distanceKm: 13.0 },
  { name: 'Murali Nagar / Madhavadhara', pincode: '530007', distanceKm: 12.0 },
  { name: 'Akkayyapalem / Santhipuram', pincode: '530016', distanceKm: 15.5 },
  { name: 'Dwaraka Nagar / RTC Complex / Gurudwara', pincode: '530016', distanceKm: 16.5 },
  { name: 'Jagadamba Junction / Poorna Market', pincode: '530002', distanceKm: 17.5 },
  { name: 'One Town / Old Post Office / Harbour', pincode: '530001', distanceKm: 18.5 },
  { name: 'Siripuram / Waltair Uplands / AU', pincode: '530003', distanceKm: 19.5 },
  { name: 'Maddilapalem / Venkojipalem', pincode: '530013', distanceKm: 20.0 },
  { name: 'MVP Colony / Sector 1 to 12', pincode: '530017', distanceKm: 22.0 },
  { name: 'Isukathota / Seethammadhara', pincode: '530022', distanceKm: 19.0 },
  { name: 'Yendada / Gitam / Sagar Nagar', pincode: '530045', distanceKm: 25.0 },
  { name: 'PM Palem / Cricket Stadium', pincode: '530041', distanceKm: 27.0 },
  { name: 'Rushikonda IT SEZ / Beach', pincode: '530045', distanceKm: 28.0 },
  { name: 'Madhurawada / Car Shed Junction', pincode: '530048', distanceKm: 29.5 },
  { name: 'Kommadi / Marikavalasa', pincode: '530048', distanceKm: 32.0 },
  { name: 'Anakapalle / Parawada Pharma City', pincode: '531001', distanceKm: 23.0 },
  { name: 'Simhachalam / Gopalapatnam', pincode: '530028', distanceKm: 12.5 },
  { name: 'Bheemunipatnam (Bheemili)', pincode: '531163', distanceKm: 42.0 }
];

// Haversine GPS formula with road multiplier
export function calculateGpsDistanceKm(lat1, lon1, lat2 = STUDIO_LOCATION.lat, lon2 = STUDIO_LOCATION.lng) {
  if (!lat1 || !lon1) return 0;
  const R = 6371; // Earth radius in km
  const dLat = (lat1 - lat2) * Math.PI / 180;
  const dLon = (lon1 - lon2) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat2 * Math.PI / 180) * Math.cos(lat1 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const roadMultiplier = 1.25; // 25% road curve factor in city traffic
  return Math.round(R * c * roadMultiplier * 10) / 10;
}

// Find distance by Area Name or PIN code
export function getDistanceByLocation(areaName = '', pincode = '') {
  if (pincode) {
    const cleanPin = pincode.trim();
    const pinMatch = VIZAG_AREAS.find(a => a.pincode === cleanPin);
    if (pinMatch) return pinMatch.distanceKm;
  }

  if (areaName) {
    const cleanArea = areaName.toLowerCase();
    const areaMatch = VIZAG_AREAS.find(a => cleanArea.includes(a.name.toLowerCase().split(' ')[0]));
    if (areaMatch) return areaMatch.distanceKm;
  }

  // Default within Vizag city if unspecified
  return 10.0;
}

// Calculate Rapido 2-Wheeler Travel Fare
// For Home Mehendi (one-way doorstep visit)
export function calculateMehendiTravelFare(distanceKm) {
  if (!distanceKm || distanceKm <= 0) return 0;
  if (distanceKm <= 2.5) {
    return 30; // Local Natayyapalem nominal visit charge
  }
  // Base fare ₹35 up to 3km, then ₹12 per km
  const extraKm = Math.max(0, distanceKm - 2.5);
  const fare = 35 + (extraKm * 12);
  return Math.round(fare / 5) * 5; // Round to nearest ₹5
}

// For Saree Pre-Pleating Pickup & Delivery
// Involves 2-way partner visit (Pickup from home + Delivery back after box folding)
export function calculateSareeDeliveryFare(distanceKm) {
  if (!distanceKm || distanceKm <= 0) return 0;
  if (distanceKm <= 2.5) {
    return 50; // Local 2-way pickup & drop
  }
  // Base ₹60 + ₹15 per km for 2-way round trip
  const extraKm = Math.max(0, distanceKm - 2.5);
  const fare = 60 + (extraKm * 15);
  return Math.round(fare / 5) * 5; // Round to nearest ₹5
}
