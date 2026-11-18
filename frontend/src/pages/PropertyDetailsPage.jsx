// pages/PropertyDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  PlayCircle,
  Maximize2,
  Bed,
  Bath,
  Ruler,
  Building2,
  Calendar,
  Car,
  Shield,
  Check,
  School,
  Hospital,
  ShoppingBag,
  Train,
  Map,
  Footprints,
  Bus,
  UtensilsCrossed,
  Trees,
  Phone,
  Mail,
  CalendarClock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import PropertyCard from '../component/PropertyCard';
import { API } from '../config/api.js';

const defaultImage = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lead capture state
  const { user, token } = useAuth();
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [submittingAction, setSubmittingAction] = useState(null);
  const [leadSuccessMsg, setLeadSuccessMsg] = useState(null);
  const [leadErrorMsg, setLeadErrorMsg] = useState(null);

  useEffect(() => {
    if (user) {
      if (!buyerName && user.name) setBuyerName(user.name);
      if (!buyerEmail && user.email) setBuyerEmail(user.email);
      if (!buyerPhone && user.phone) setBuyerPhone(user.phone);
    }
  }, [user]);

  const handleBookTour = async (e) => {
    if (e) e.preventDefault();
    if (!tourDate) {
      setLeadErrorMsg("Please choose a preferred tour date.");
      return;
    }
    if (!buyerPhone && !buyerEmail) {
      setLeadErrorMsg("Please enter your phone number or email so the agent can confirm your tour.");
      return;
    }

    setSubmittingAction('tour');
    setLeadErrorMsg(null);
    setLeadSuccessMsg(null);

    try {
      const fullDate = tourTime ? new Date(`${tourDate}T${tourTime}`) : new Date(tourDate);
      const res = await fetch(API.leads.visit, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          propertyId: id,
          visitDate: fullDate,
          notes: buyerMessage,
          name: buyerName,
          email: buyerEmail,
          phone: buyerPhone,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Failed to schedule tour');

      setLeadSuccessMsg("🎉 Tour Requested Successfully! The agent will call or message to confirm your appointment.");
      setTourDate('');
      setTourTime('');
      setBuyerMessage('');
    } catch (err) {
      setLeadErrorMsg(err.message || 'Failed to schedule tour');
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleContactAgent = async (e) => {
    if (e) e.preventDefault();
    if (!buyerPhone && !buyerEmail) {
      setLeadErrorMsg("Please enter your phone number or email.");
      return;
    }
    const messageToSend = buyerMessage.trim() || `Hi, I am interested in ${property?.title || 'this property'}. Please send more details.`;

    setSubmittingAction('inquiry');
    setLeadErrorMsg(null);
    setLeadSuccessMsg(null);

    try {
      const res = await fetch(API.leads.inquiry, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          propertyId: id,
          message: messageToSend,
          name: buyerName,
          email: buyerEmail,
          phone: buyerPhone,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || 'Failed to submit inquiry');

      setLeadSuccessMsg("✅ Inquiry Sent! The agent has received your message and will reach out shortly.");
      setBuyerMessage('');
    } catch (err) {
      setLeadErrorMsg(err.message || 'Failed to send inquiry');
    } finally {
      setSubmittingAction(null);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(API.properties.detail(id));
        if (!res.ok) throw new Error('Property not found');
        const data = await res.json();
        setProperty(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchSimilarProperties = async () => {
      try {
        const res = await fetch(API.properties.list);
        if (res.ok) {
           const data = await res.json();
           if (data.data) {
             // Filter out the current property and take max 3
             const filtered = data.data.filter(p => p._id !== id).slice(0, 3);
             setSimilarProperties(filtered);
           }
        }
      } catch (err) {
        console.error('Error fetching similar properties', err);
      }
    };

    if (id) {
       fetchProperty();
       fetchSimilarProperties();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-white">Loading property details...</div>;
  }

  if (error || !property) {
    return <div className="text-center py-20 text-red-400">{error || 'Property not found'}</div>;
  }

  let images = [];
  if (property.images && property.images.length > 0) {
    images = property.images.map(img => img.url || img);
  } else if (property.image) {
    images = [property.image];
  } else {
    images = [defaultImage];
  }

  const mapAddress = [
    property.locationStreet,
    property.locationCity || property.location?.city,
    property.locationState || property.location?.state,
    property.locationZip || property.location?.zip,
    property.locationCountry || property.location?.country
  ].filter(Boolean).join(', ') || (typeof property.location === 'string' ? property.location : 'New York');

  return (
    <section className="max-w-7xl sm:px-6 mt-10 mx-auto mb-8 px-4">
      <div className="relative sm:mt-12 overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border border-white/10 rounded-[40px] backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        </div>

        <div className="relative sm:p-8 pt-6 pr-6 pb-6 pl-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 text-[11px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 rounded-full px-3 py-1.5 font-geist">
                <Shield className="w-3.5 h-3.5 stroke-[1.5]" />
                Verified luxury listing
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-neutral-100 font-geist tracking-tight font-medium">
                {property.title || 'Untitled Property'}
              </h1>
              <p className="flex items-center gap-1 text-sm text-neutral-300 font-geist">
                <MapPin className="w-4 h-4 stroke-[1.5] text-neutral-400" />
                <span>
                  {property.locationCity ? `${property.locationCity}, ${property.locationState || ''}` : 
                   (property.location?.city ? `${property.location.city}, ${property.location.state || ''}` : 
                   (typeof property.location === 'string' ? property.location : 'Location unknown'))}
                </span>
              </p>
            </div>

            <div className="space-y-2 text-right">
              <div className="text-3xl sm:text-4xl font-geist tracking-tight font-medium text-neutral-50">
                {typeof property.price === 'number' 
                  ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: property.currency || 'INR', maximumFractionDigits: 0 }).format(property.price)
                  : (property.price || 'Price on request')}
              </div>
              <p className="text-xs text-neutral-400 font-geist">Available for immediate closing</p>
              <div className="inline-flex items-center gap-2 mt-2">
                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-geist uppercase tracking-wide ${
                  property.status === 'for_rent' 
                    ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' 
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                }`}>
                  {property.status === 'for_rent' ? 'For Rent' : 'For Sale'}
                </span>
                <span className="rounded-full bg-white/5 text-neutral-200 border border-white/10 px-2 py-0.5 text-[11px] font-geist uppercase tracking-wide">
                  Verified Listing
                </span>
              </div>
            </div>
          </div>

          {/* Hero gallery */}
          <div className="grid lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-4">
            {/* Big image with subtle hover parallax */}
            <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-black/40">
              <div className="relative h-[260px] sm:h-[380px] lg:h-[420px]">
                <img
                  src={images[activeImage]}
                  alt="Main property"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Top-right floating actions */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 px-3 py-1.5 text-xs text-neutral-100 font-geist backdrop-blur-md">
                  <PlayCircle className="w-3.5 h-3.5 stroke-[1.5]" />
                  Virtual tour
                </button>
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-neutral-100 backdrop-blur-md">
                  <Maximize2 className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>

              {/* Bottom overlay specs */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="inline-flex items-center gap-3 rounded-full bg-black/60 border border-white/15 px-3 py-1.5 text-xs text-neutral-200 backdrop-blur-md font-geist">
                  <span>ID: {property._id ? property._id.slice(-8).toUpperCase() : 'N/A'}</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span>Verified • New Listing</span>
                </div>
              </div>
            </div>

            {/* Side gallery thumbs */}
            <div className="grid grid-rows-3 gap-3">
              {images.slice(0, 3).map((src, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    activeImage === index
                      ? 'border-white/80'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={src}
                    alt={`Gallery ${index + 1}`}
                    className="w-full object-cover h-[80px] sm:h-[110px] lg:h-[135px] transform transition-transform duration-500 hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </button>
              ))}
            </div>
          </div>

          {/* Overview + description + sidebar */}
          <div className="grid lg:grid-cols-[minmax(0,2fr),minmax(0,1.1fr)] gap-8 mt-4">
            {/* Left: overview + description */}
            <div className="space-y-6">
              {/* Key specs grid */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
                <h2 className="text-sm font-geist text-neutral-100 tracking-tight mb-3">
                  Property overview
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
                  <SpecPill icon={<Bed className="w-4 h-4 stroke-[1.5]" />} label="Bedrooms" value={property.bedrooms || property.beds || "0"} />
                  <SpecPill icon={<Bath className="w-4 h-4 stroke-[1.5]" />} label="Bathrooms" value={property.bathrooms || property.baths || "0"} />
                  <SpecPill
                    icon={<Ruler className="w-4 h-4 stroke-[1.5]" />}
                    label="Area"
                    value={property.areaSqft || property.sqft ? `${(property.areaSqft || property.sqft).toLocaleString()} sq.ft` : "N/A"}
                  />
                  <SpecPill
                    icon={<Building2 className="w-4 h-4 stroke-[1.5]" />}
                    label="Property type"
                    value={property.propertyType || "Residential"}
                  />
                  <SpecPill
                    icon={<Calendar className="w-4 h-4 stroke-[1.5]" />}
                    label="Listed"
                    value="Recently"
                  />
                  <SpecPill
                    icon={<Car className="w-4 h-4 stroke-[1.5]" />}
                    label="Parking"
                    value="3-car garage"
                  />
                  <SpecPill
                    icon={<Shield className="w-4 h-4 stroke-[1.5]" />}
                    label="Ownership"
                    value="Freehold"
                  />
                  <SpecPill
                    icon={<Trees className="w-4 h-4 stroke-[1.5]" />}
                    label="Lot size"
                    value="0.35 acres"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-4">
                <h2 className="text-sm font-geist text-neutral-100 tracking-tight">
                  Description
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-neutral-300 font-geist">
                  {property.description || 'Perched above the Pacific with seamless indoor‑outdoor living, this architect‑designed villa features floor‑to‑ceiling glass, warm natural stone, and a horizon‑level infinity pool overlooking Malibu’s coastline.'}
                </p>
                <ul className="list-disc list-inside text-sm text-neutral-300 space-y-1 font-geist">
                  <li>Open‑plan great room with 14ft ceilings and ocean vistas.</li>
                  <li>Chef’s kitchen with integrated Wolf & Sub‑Zero appliances.</li>
                  <li>Primary suite with private terrace, spa bath, and dual closets.</li>
                  <li>Smart home system with zoned climate, security, and lighting.</li>
                </ul>

                {/* Features & amenities */}
                <div className="mt-3">
                  <h3 className="text-xs text-neutral-300 font-geist uppercase tracking-wide mb-2">
                    Features & amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Infinity pool',
                      'Oceanfront deck',
                      'Smart lighting',
                      'Outdoor kitchen',
                      'Fire pit lounge',
                      'Home theater',
                      'Wine wall',
                      'Gated entry',
                    ].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-neutral-100 font-geist"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[1.5] text-emerald-400" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location section */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-geist text-neutral-100 tracking-tight">
                    Location & nearby
                  </h2>
                  <button className="inline-flex items-center gap-1.5 text-[11px] text-neutral-300 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1 border border-white/10 font-geist">
                    <Map className="w-3.5 h-3.5 stroke-[1.5]" />
                    Open full map
                  </button>
                </div>

                <div className="grid lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-4">
                  {/* Map placeholder */}
                  <div className="rounded-xl overflow-hidden border border-white/10 h-52 bg-black/20 flex items-center justify-center">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`}
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Nearby places */}
                  <div className="space-y-3 text-xs sm:text-sm">
                    <NearbyItem
                      icon={<School className="w-4 h-4 stroke-[1.5]" />}
                      label="Top schools"
                      value="Malibu High School (8 min), Point Dume Elementary (5 min)"
                    />
                    <NearbyItem
                      icon={<Hospital className="w-4 h-4 stroke-[1.5]" />}
                      label="Healthcare"
                      value="Malibu Medical Center (10 min), St. John’s (28 min)"
                    />
                    <NearbyItem
                      icon={<ShoppingBag className="w-4 h-4 stroke-[1.5]" />}
                      label="Groceries & essentials"
                      value="Whole Foods, local markets within 12 minutes"
                    />
                    <NearbyItem
                      icon={<Train className="w-4 h-4 stroke-[1.5]" />}
                      label="Commuting"
                      value="PCH access, 35 minutes to Santa Monica, 55 to DTLA"
                    />
                  </div>
                </div>
              </div>

              {/* Neighborhood info */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-geist text-neutral-100 tracking-tight">
                    Neighborhood insights
                  </h2>
                  <span className="text-[11px] text-neutral-400 font-geist">
                    Powered by local & open data
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <ScoreCard label="Safety score" value="9.1/10" tone="emerald" />
                  <ScoreCard label="Walk score" value="74/100" tone="sky" />
                  <ScoreCard label="Transit score" value="62/100" tone="violet" />
                </div>

                <div className="mt-2">
                  <p className="text-xs text-neutral-300 font-geist mb-2">Lifestyle</p>
                  <div className="flex flex-wrap gap-2">
                    <Tag icon={<Trees className="w-3.5 h-3.5 stroke-[1.5]" />} label="Coastal trails" />
                    <Tag
                      icon={<UtensilsCrossed className="w-3.5 h-3.5 stroke-[1.5]" />}
                      label="Oceanfront dining"
                    />
                    <Tag icon={<Footprints className="w-3.5 h-3.5 stroke-[1.5]" />} label="Walkable beach access" />
                    <Tag icon={<Bus className="w-3.5 h-3.5 stroke-[1.5]" />} label="Express commute routes" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: contact / book tour card */}
            <div className="space-y-4">
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-geist text-neutral-100">
                    EV
                  </div>
                  <div>
                    <p className="text-xs text-neutral-300 font-geist">Listed by</p>
                    <p className="text-sm text-neutral-100 font-geist font-medium">
                      EstateVault Premier Team
                    </p>
                    <p className="text-[11px] text-neutral-400 font-geist">
                      Response time • &lt; 10 minutes
                    </p>
                  </div>
                </div>

                <form className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField label="Full name" placeholder="Your name" />
                    <InputField label="Email" placeholder="you@example.com" type="email" />
                  </div>
                  <InputField label="Phone" placeholder="+1 (555) 000‑0000" />

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-geist">
                      Preferred tour date & time
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)] gap-2">
                      <div className="relative">
                        <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                        <input
                          type="date"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                        />
                      </div>
                      <div className="relative">
                        <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                        <input
                          type="time"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-geist">Message</label>
                    <textarea
                      rows={3}
                      placeholder="Share any questions or timing preferences..."
                      className="w-full rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md px-3 py-2.5 placeholder:text-white/40 resize-none"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium tracking-tight text-neutral-900 bg-white hover:bg-white/90 border-0 transition-all font-geist"
                    >
                      <Calendar className="w-4 h-4 stroke-[1.5]" />
                      Book a tour
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium tracking-tight text-neutral-200 bg-white/5 hover:bg-white/10 border border-white/15 transition-all font-geist"
                    >
                      <Phone className="w-4 h-4 stroke-[1.5]" />
                      Contact agent
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs text-neutral-300 hover:text-neutral-100 font-geist"
                    >
                      <Mail className="w-3.5 h-3.5 stroke-[1.5]" />
                      Get financing & pre‑approval options
                    </button>
                  </div>

                  <p className="text-[10px] text-neutral-500 font-geist mt-1">
                    By booking a tour you agree to be contacted by EstateVault and its partners about
                    this property.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Similar properties slider */}
          <div className="mt-2">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-geist text-neutral-100 tracking-tight">
                Similar homes you might like
              </h2>
              <div className="inline-flex items-center gap-2">
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200">
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarProperties.length > 0 ? similarProperties.map((p) => (
                <div key={p._id || p.id} className="group relative">
                  <PropertyCard property={p} />
                  <button className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-geist rounded-full bg-black/70 hover:bg-black/90 border border-white/20 px-3 py-1.5 text-neutral-100 backdrop-blur-md">
                    View details
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>
              )) : (
                <div className="col-span-3 text-center text-sm text-neutral-400 py-8 font-geist">No similar properties found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Small subcomponents */

const SpecPill = ({ icon, label, value }) => (
  <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 flex items-center gap-2">
    <div className="w-8 h-8 rounded-full bg-black/40 border border-white/15 flex items-center justify-center text-neutral-100">
      {icon}
    </div>
    <div>
      <p className="text-[11px] text-neutral-400 font-geist uppercase tracking-wide">{label}</p>
      <p className="text-xs sm:text-sm text-neutral-100 font-geist">{value}</p>
    </div>
  </div>
);

const NearbyItem = ({ icon, label, value }) => (
  <div className="flex gap-2">
    <div className="mt-0.5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-200">
      {icon}
    </div>
    <div>
      <p className="text-[11px] text-neutral-300 font-geist uppercase tracking-wide">{label}</p>
      <p className="text-xs sm:text-sm text-neutral-200 font-geist">{value}</p>
    </div>
  </div>
);

const ScoreCard = ({ label, value, tone }) => {
  const toneClasses =
    tone === 'emerald'
      ? 'from-emerald-500/20 to-emerald-500/0 text-emerald-200'
      : tone === 'sky'
      ? 'from-sky-500/20 to-sky-500/0 text-sky-200'
      : 'from-violet-500/20 to-violet-500/0 text-violet-200';

  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-b ${toneClasses} px-3 py-3`}>
      <p className="text-[11px] text-neutral-200 font-geist uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-lg font-geist font-semibold">{value}</p>
      <p className="text-[11px] text-neutral-300 font-geist mt-0.5">Compared to city average</p>
    </div>
  );
};

const Tag = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-neutral-100 font-geist">
    {icon}
    {label}
  </span>
);

const InputField = ({ label, placeholder, value, onChange, type = 'text', required = false }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-neutral-300 font-geist">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md px-3 py-2.5 placeholder:text-white/40"
    />
  </div>
);

export default PropertyDetailsPage;
