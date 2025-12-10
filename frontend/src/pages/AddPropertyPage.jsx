// pages/AddPropertyPage.jsx
import React, { useState, useMemo } from 'react';
import {
  Home,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Ruler,
  Building2,
  Calendar,
  Car,
  Check,
  Upload,
  Link2,
  Info,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Image as ImageIcon,
  Type,
} from 'lucide-react';
import PropertyCard from '../component/PropertyCard.jsx';

const AddPropertyPage = () => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    title: '',
    status: 'For sale',
    type: 'House',
    price: '',
    currency: 'INR',
    featured: false,

    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',

    bedrooms: '',
    bathrooms: '',
    area: '',
    lotSize: '',
    parking: '',
    yearBuilt: '',
    floors: '',

    description: '',
    amenities: {
      pool: false,
      garden: false,
      gym: false,
      security: false,
      elevator: false,
      furnished: false,
      oceanView: false,
    },

    videoUrl: '',
    tourUrl: '',
    images: [], // for UI only
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (key) => {
    setForm((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] },
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...previews] }));
  };

  const previewProperty = useMemo(() => {
    const firstImage =
      form.images[0]?.url ||
      'https://images.pexels.com/photos/259580/pexels-photo-259580.jpeg?auto=compress&cs=tinysrgb&w=1600';
    const beds = form.bedrooms || 4;
    const baths = form.bathrooms || 3;
    const sqft = form.area || 2800;
    const priceText = form.price ? `${form.currency} ${Number(form.price).toLocaleString()}` : '$2,800,000';

    return {
      id: 999,
      title: form.title || 'Oceanview Modern Villa (Preview)',
      location:
        form.city && form.state
          ? `${form.city}, ${form.state}`
          : 'Malibu, CA',
      price: priceText,
      beds,
      baths,
      sqft,
      image: firstImage,
      badge: {
        text: form.status === 'For rent' ? 'For Rent' : 'For Sale',
        color: form.status === 'For rent' ? 'bg-indigo-900/90' : 'bg-emerald-700/90',
      },
      virtualTour: !!form.tourUrl,
    };
  }, [form]);

  const nextStep = () => setStep((s) => Math.min(4, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <section className="max-w-7xl sm:px-6 mt-10 mx-auto mb-8 px-4">
      <div className="relative sm:mt-12 overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border border-white/10 rounded-[40px] backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        </div>

        <div className="relative sm:p-8 pt-6 pr-6 pb-6 pl-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 text-[11px] font-medium text-blue-300 bg-blue-500/10 border border-white/10 rounded-full px-3 py-1.5 font-geist">
                <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Create a new listing</span>
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-neutral-100 font-geist tracking-tight font-medium">
                Add a new property
              </h1>
              <p className="text-sm text-neutral-400 font-geist">
                Fill in the details, upload media, and preview how your listing will appear
                across EstateVault.
              </p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs text-neutral-400 font-geist">Listing status</p>
              <div className="inline-flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-geist uppercase tracking-wide">
                  Draft
                </span>
                <span className="rounded-full bg-white/5 text-neutral-200 border border-white/10 px-2 py-0.5 text-[11px] font-geist uppercase tracking-wide">
                  Step {step} of 4
                </span>
              </div>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
            <div className="flex gap-1 text-[11px] text-neutral-400 font-geist">
              <StepPill active={step === 1} label="Basics" />
              <StepPill active={step === 2} label="Location & Specs" />
              <StepPill active={step === 3} label="Media & Details" />
              <StepPill active={step === 4} label="Preview & Publish" />
            </div>
          </div>

          {/* Main layout */}
          <div className="grid lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-6">
            {/* Left: Form sections */}
            <div className="space-y-4">
              {step === 1 && (
                <CardSection title="Basic details" icon={<Home className="w-4 h-4 stroke-[1.5]" />}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField
                      label="Listing title"
                      placeholder="Oceanview Modern Villa with Infinity Pool"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                    />
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300 font-geist">Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        <ToggleChip
                          active={form.status === 'For sale'}
                          onClick={() => handleChange('status', 'For sale')}
                          label="For sale"
                        />
                        <ToggleChip
                          active={form.status === 'For rent'}
                          onClick={() => handleChange('status', 'For rent')}
                          label="For rent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300 font-geist">Property type</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                        <select
                          value={form.type}
                          onChange={(e) => handleChange('type', e.target.value)}
                          className="appearance-none w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                        >
                          <option>House</option>
                          <option>Apartment</option>
                          <option>Condo</option>
                          <option>Penthouse</option>
                          <option>Villa</option>
                          <option>Townhouse</option>
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">
                          ▼
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300 font-geist"> Price</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                        <input
                          type="number"
                          placeholder="2800000"
                          value={form.price}
                          onChange={(e) => handleChange('price', e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-300 font-geist">Currency</label>
                      <select
                        value={form.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="appearance-none w-full px-3 py-2.5 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                      >
                        <option>INR</option>
                        <option>EUR</option>
                        <option>USD</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleChange('featured', !form.featured)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-geist ${
                        form.featured
                          ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200'
                          : 'bg-white/5 border-white/10 text-neutral-200'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
                      Mark as featured
                    </button>
                    <p className="text-[11px] text-neutral-500 font-geist flex items-center gap-1">
                      <Info className="w-3 h-3 stroke-[1.5]" />
                      Featured homes get more visibility in search.
                    </p>
                  </div>
                </CardSection>
              )}

              {step === 2 && (
                <>
                  <CardSection
                    title="Location"
                    icon={<MapPin className="w-4 h-4 stroke-[1.5]" />}
                  >
                    <div className="space-y-3">
                      <InputField
                        label="Street address"
                        placeholder="1234 Pacific Coast Hwy"
                        value={form.street}
                        onChange={(e) => handleChange('street', e.target.value)}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                          label="City"
                          placeholder="Malibu"
                          value={form.city}
                          onChange={(e) => handleChange('city', e.target.value)}
                        />
                        <InputField
                          label="State"
                          placeholder="California"
                          value={form.state}
                          onChange={(e) => handleChange('state', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField
                          label="ZIP / Postal code"
                          placeholder="90265"
                          value={form.zip}
                          onChange={(e) => handleChange('zip', e.target.value)}
                        />
                        <div className="space-y-1.5">
                          <label className="text-xs text-neutral-300 font-geist">Country</label>
                          <select
                            value={form.country}
                            onChange={(e) => handleChange('country', e.target.value)}
                            className="appearance-none w-full px-3 py-2.5 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>India</option>
                            <option>United Kingdom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardSection>

                  <CardSection
                    title="Property specs"
                    icon={<Shield className="w-4 h-4 stroke-[1.5]" />}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <InputIconField
                        label="Bedrooms"
                        icon={<Bed className="w-4 h-4 stroke-[1.5]" />}
                        placeholder="4"
                        value={form.bedrooms}
                        onChange={(e) => handleChange('bedrooms', e.target.value)}
                      />
                      <InputIconField
                        label="Bathrooms"
                        icon={<Bath className="w-4 h-4 stroke-[1.5]" />}
                        placeholder="3"
                        value={form.bathrooms}
                        onChange={(e) => handleChange('bathrooms', e.target.value)}
                      />
                      <InputIconField
                        label="Area (sq.ft)"
                        icon={<Ruler className="w-4 h-4 stroke-[1.5]" />}
                        placeholder="2800"
                        value={form.area}
                        onChange={(e) => handleChange('area', e.target.value)}
                      />
                      <InputField
                        label="Lot size (acres)"
                        placeholder="0.35"
                        value={form.lotSize}
                        onChange={(e) => handleChange('lotSize', e.target.value)}
                      />
                      <InputIconField
                        label="Parking"
                        icon={<Car className="w-4 h-4 stroke-[1.5]" />}
                        placeholder="3-car garage"
                        value={form.parking}
                        onChange={(e) => handleChange('parking', e.target.value)}
                      />
                      <InputIconField
                        label="Year built"
                        icon={<Calendar className="w-4 h-4 stroke-[1.5]" />}
                        placeholder="2021"
                        value={form.yearBuilt}
                        onChange={(e) => handleChange('yearBuilt', e.target.value)}
                      />
                      <InputField
                        label="Floors"
                        placeholder="2"
                        value={form.floors}
                        onChange={(e) => handleChange('floors', e.target.value)}
                      />
                    </div>
                  </CardSection>
                </>
              )}

              {step === 3 && (
                <>
                  <CardSection
                    title="Media"
                    icon={<ImageIcon className="w-4 h-4 stroke-[1.5]" />}
                  >
                    <p className="text-xs text-neutral-400 font-geist mb-3">
                      Upload at least 4 high‑resolution images. The first image will be used as the
                      featured card image.
                    </p>
                    <label className="block border border-dashed border-white/20 rounded-2xl bg-black/20 hover:bg-black/30 transition-colors cursor-pointer p-4 sm:p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <Upload className="w-7 h-7 mx-auto text-neutral-200 stroke-[1.5]" />
                      <p className="mt-2 text-sm text-neutral-100 font-geist">
                        Drop images here or click to browse
                      </p>
                      <p className="text-[11px] text-neutral-400 font-geist">
                        PNG, JPG up to 10MB each
                      </p>
                    </label>

                    {form.images.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {form.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative h-20 rounded-xl overflow-hidden border border-white/10"
                          >
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardSection>

                  <CardSection
                    title="Description & links"
                    icon={<Type className="w-4 h-4 stroke-[1.5]" />}
                  >
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-300 font-geist">Description</label>
                        <textarea
                          rows={4}
                          placeholder="Describe what makes this property unique, layout details, views, and finishes..."
                          value={form.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          className="w-full rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md px-3 py-2.5 placeholder:text-white/40 resize-vertical"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputIconField
                          label="Video URL"
                          icon={<Link2 className="w-4 h-4 stroke-[1.5]" />}
                          placeholder="https://youtube.com/..."
                          value={form.videoUrl}
                          onChange={(e) => handleChange('videoUrl', e.target.value)}
                        />
                        <InputIconField
                          label="Virtual tour URL"
                          icon={<Link2 className="w-4 h-4 stroke-[1.5]" />}
                          placeholder="https://matterport.com/..."
                          value={form.tourUrl}
                          onChange={(e) => handleChange('tourUrl', e.target.value)}
                        />
                      </div>

                      <div className="mt-2">
                        <p className="text-xs text-neutral-300 font-geist mb-2">
                          Amenities & features
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            ['pool', 'Pool'],
                            ['garden', 'Garden'],
                            ['gym', 'Gym'],
                            ['security', '24/7 Security'],
                            ['elevator', 'Elevator'],
                            ['furnished', 'Furnished'],
                            ['oceanView', 'Ocean view'],
                          ].map(([key, label]) => (
                            <AmenityChip
                              key={key}
                              active={form.amenities[key]}
                              label={label}
                              onClick={() => handleAmenityToggle(key)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardSection>
                </>
              )}

              {step === 4 && (
                <CardSection
                  title="Review & publish"
                  icon={<Shield className="w-4 h-4 stroke-[1.5]" />}
                >
                  <ul className="text-xs text-neutral-300 font-geist space-y-1 mb-3">
                    <li>• Confirm title, price, and location.</li>
                    <li>• Check that the hero image and gallery look correct.</li>
                    <li>• You can save as draft now and publish later.</li>
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] text-neutral-100 font-geist">
                      <Check className="w-3.5 h-3.5 stroke-[1.5] text-emerald-400" />
                      Basic info
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] text-neutral-100 font-geist">
                      <Check className="w-3.5 h-3.5 stroke-[1.5] text-emerald-400" />
                      Location & specs
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] text-neutral-100 font-geist">
                      <Check className="w-3.5 h-3.5 stroke-[1.5] text-emerald-400" />
                      Media & description
                    </span>
                  </div>
                </CardSection>
              )}

              {/* Step nav buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed font-geist"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                  Back
                </button>
                <div className="flex gap-2">
                  {step === 4 && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/10 font-geist"
                    >
                      Save as draft
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={step === 4 ? () => {} : nextStep}
                    className="inline-flex items-center gap-1.5 rounded-full border border-transparent bg-white px-4 py-1.5 text-xs font-geist font-medium tracking-tight text-neutral-900 hover:bg-white/90"
                  >
                    {step === 4 ? 'Publish listing' : 'Continue'}
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Live preview */}
            <div className="space-y-4">
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <p className="text-sm text-neutral-100 font-geist tracking-tight">
                    Listing preview
                  </p>
                  <span className="text-[11px] text-neutral-400 font-geist">
                    Updates as you type
                  </span>
                </div>
                <PropertyCard property={previewProperty} />
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 backdrop-blur-md space-y-2 text-xs text-neutral-300 font-geist">
                <p className="text-[11px] text-neutral-400 uppercase tracking-wide">
                  At a glance
                </p>
                <p>
                  Status:{' '}
                  <span className="text-neutral-100">
                    {form.status} • {form.type}
                  </span>
                </p>
                <p>
                  Address:{' '}
                  <span className="text-neutral-100">
                    {form.street
                      ? `${form.street}, ${form.city || ''} ${form.state || ''} ${form.zip || ''}`
                      : 'Not set yet'}
                  </span>
                </p>
                <p>
                  Specs:{' '}
                  <span className="text-neutral-100">
                    {form.bedrooms || 4} bd • {form.bathrooms || 3} ba •{' '}
                    {form.area || 2800} sq.ft
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Small UI helpers */

const StepPill = ({ active, label }) => (
  <span
    className={`px-2 py-0.5 rounded-full border text-[11px] font-geist ${
      active
        ? 'border-white/70 text-neutral-50 bg-white/10'
        : 'border-white/10 text-neutral-400'
    }`}
  >
    {label}
  </span>
);

const CardSection = ({ title, icon, children }) => (
  <div className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-neutral-100">
        {icon}
      </div>
      <h2 className="text-sm font-geist text-neutral-100 tracking-tight">{title}</h2>
    </div>
    {children}
  </div>
);

const InputField = ({ label, placeholder, value, onChange, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-neutral-300 font-geist">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md px-3 py-2.5 placeholder:text-white/40"
    />
  </div>
);

const InputIconField = ({ label, placeholder, value, onChange, icon, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-neutral-300 font-geist">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-3 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md py-2.5 placeholder:text-white/40"
      />
    </div>
  </div>
);

const ToggleChip = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-geist ${
      active
        ? 'bg-white text-neutral-900'
        : 'bg-black/20 text-neutral-200 border border-white/10 hover:bg-white/5'
    }`}
  >
    {label}
  </button>
);

const AmenityChip = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-geist ${
      active
        ? 'bg-emerald-500/10 border-emerald-400/50 text-emerald-200'
        : 'bg-white/5 border-white/10 text-neutral-100 hover:bg-white/10'
    }`}
  >
    <Check className="w-3.5 h-3.5 stroke-[1.5]" />
    {label}
  </button>
);

export default AddPropertyPage;
