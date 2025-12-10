// pages/PropertyDetailsPage.jsx
import React, { useState } from 'react';
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

const galleryImages = [
  'https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
  'https://images.pexels.com/photos/3637729/pexels-photo-3637729.jpeg?auto=compress&cs=tinysrgb&w=1600',
];

const similarProperties = [
  {
    id: 11,
    title: 'Hillside Glass Retreat',
    location: 'Malibu, CA',
    price: '$3.1M',
    beds: 4,
    baths: 4,
    sqft: 3100,
    image:
      'https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/26b3f294-2885-4440-ae74-eda7506cca9e_800w.jpg',
    badge: { text: 'Nearby', color: 'bg-cyan-600/90' },
    virtualTour: true,
  },
  {
    id: 12,
    title: 'Clifftop Infinity Villa',
    location: 'Malibu, CA',
    price: '$4.6M',
    beds: 5,
    baths: 5,
    sqft: 4200,
    image:
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: { text: 'Sea view', color: 'bg-indigo-900/90' },
    virtualTour: true,
  },
  {
    id: 13,
    title: 'Minimalist Coastal Home',
    location: 'Santa Monica, CA',
    price: '$2.4M',
    beds: 3,
    baths: 3,
    sqft: 2100,
    image:
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: { text: 'Open House', color: 'bg-white/90', textColor: 'text-indigo-900' },
    virtualTour: false,
  },
];

const PropertyDetailsPage = () => {
  const [activeImage, setActiveImage] = useState(0);

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
                Oceanview Modern Villa with Infinity Pool
              </h1>
              <p className="flex items-center gap-1 text-sm text-neutral-300 font-geist">
                <MapPin className="w-4 h-4 stroke-[1.5] text-neutral-400" />
                <span>Malibu, California 90265 • Pacific Coast Highway</span>
              </p>
            </div>

            <div className="space-y-2 text-right">
              <div className="text-3xl sm:text-4xl font-geist tracking-tight font-medium text-neutral-50">
                $2,800,000
              </div>
              <p className="text-xs text-neutral-400 font-geist">Estimated mortgage: $15,900/mo</p>
              <div className="inline-flex items-center gap-2 mt-2">
                <span className="rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-geist uppercase tracking-wide">
                  For Sale
                </span>
                <span className="rounded-full bg-white/5 text-neutral-200 border border-white/10 px-2 py-0.5 text-[11px] font-geist uppercase tracking-wide">
                  Listed 3 days ago
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
                  src={galleryImages[activeImage]}
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
                  <span>MLS #EV-2048</span>
                  <span className="w-px h-3 bg-white/20" />
                  <span>Exclusive • Off-market ready</span>
                </div>
              </div>
            </div>

            {/* Side gallery thumbs */}
            <div className="grid grid-rows-3 gap-3">
              {galleryImages.map((src, index) => (
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
                    className="w-full object-cover h-[95px] sm:h-[110px] lg:h-[120px] transform transition-transform duration-500 hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 text-[11px] font-geist px-2 py-1 rounded-full bg-emerald-500/90 text-white border border-emerald-200/40">
                      Featured
                    </span>
                  )}
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
                  <SpecPill icon={<Bed className="w-4 h-4 stroke-[1.5]" />} label="Bedrooms" value="4" />
                  <SpecPill icon={<Bath className="w-4 h-4 stroke-[1.5]" />} label="Bathrooms" value="3" />
                  <SpecPill
                    icon={<Ruler className="w-4 h-4 stroke-[1.5]" />}
                    label="Area"
                    value="2,800 sq.ft"
                  />
                  <SpecPill
                    icon={<Building2 className="w-4 h-4 stroke-[1.5]" />}
                    label="Property type"
                    value="Villa"
                  />
                  <SpecPill
                    icon={<Calendar className="w-4 h-4 stroke-[1.5]" />}
                    label="Year built"
                    value="2021"
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
                  Perched above the Pacific with seamless indoor‑outdoor living, this
                  architect‑designed villa features floor‑to‑ceiling glass, warm natural stone,
                  and a horizon‑level infinity pool overlooking Malibu’s coastline.
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
                  <div className="rounded-xl overflow-hidden border border-white/10 h-52 bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 flex items-center justify-center text-xs text-neutral-300 font-geist">
                    Interactive map (embed Google Maps here)
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
              {similarProperties.map((p) => (
                <div key={p.id} className="group relative">
                  <PropertyCard property={p} />
                  <button className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-geist rounded-full bg-black/70 hover:bg-black/90 border border-white/20 px-3 py-1.5 text-neutral-100 backdrop-blur-md">
                    View details
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>
              ))}
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

const InputField = ({ label, placeholder, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-neutral-300 font-geist">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md px-3 py-2.5 placeholder:text-white/40"
    />
  </div>
);

export default PropertyDetailsPage;
