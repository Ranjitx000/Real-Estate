// components/HeroSection.jsx
import React, { useState } from 'react';
import { MapPin, Home, Calendar, ShieldCheck, Building2, DollarSign, Bed, Search, Car, Sparkles, Trees, Waves } from 'lucide-react';

const HeroSection = () => {
  const [searchType, setSearchType] = useState('buy');
  const [filters, setFilters] = useState({
    location: '',
    type: 'any',
    price: 'any',
    beds: 'any'
  });

  const handleSearch = () => {
    console.log('Search with filters:', filters);
    // Add search functionality
  };

  return (
    <section className="max-w-7xl sm:px-6 mt-8 mx-auto mb-8 px-4">
      <div className="relative sm:mt-12 overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border-white/10 border rounded-[40px] backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>
        </div>

        <div className="relative sm:p-8 pt-6 pr-6 pb-6 pl-6">
          <div className="flex gap-8 items-start">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-300 bg-blue-500/10 border border-white/10 rounded-full px-3 py-1.5">
                <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
                <span className="font-geist">Nationwide • Verified Listings</span>
              </div>
              
              <h1 className="text-[9.5vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[6vw] leading-[0.95] font-medium text-neutral-100 tracking-tighter font-geist mt-4">
                Find your next home with confidence
              </h1>
              
              <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed text-neutral-400 font-geist">
                Curated properties across top neighborhoods. Powerful search, virtual tours, and expert support from offer to close.
              </p>
            </div>

            {/* Right side features - hidden on mobile */}
            <div className="hidden lg:block w-[22rem] pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Home className="w-4 h-4 stroke-[1.5]" />
                  <span className="font-geist">Single-family • Apartments • Penthouses</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Calendar className="w-4 h-4 stroke-[1.5]" />
                  <span className="font-geist">Same‑day showings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                  <span className="font-geist">Verified sellers & documents</span>
                </div>
                
                <div className="border-white/10 border-t pt-4">
                  <p className="leading-relaxed text-sm text-neutral-400 font-geist">
                    EstateVault combines market expertise with a seamless experience. Save favorites, compare homes, and close with confidence.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mt-6">
                    <div className="rounded-xl bg-neutral-800 border border-white/10 p-3">
                      <div className="text-xl font-semibold tracking-tight text-neutral-100 font-geist">12K+</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 font-geist">Active Listings</p>
                    </div>
                    <div className="rounded-xl bg-neutral-800 border border-white/10 p-3">
                      <div className="text-xl font-semibold tracking-tight text-neutral-100 font-geist">4.9</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 font-geist">Client Rating</p>
                    </div>
                    <div className="rounded-xl bg-neutral-800 border border-white/10 p-3">
                      <div className="text-xl font-semibold tracking-tight text-neutral-100 font-geist">350+</div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 font-geist">Virtual Tours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media panel with search */}
          <div className="mt-8 relative rounded-2xl overflow-hidden border border-white/10">
            <img 
              src="/Hed.jpg"
              alt="Modern home exterior at sunset" 
              className="w-full h-[54vh] sm:h-[60vh] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute inset-x-0 bottom-0 sm:p-8 pt-6 pr-6 pb-6 pl-6">
              <div className="max-w-3xl">
                <h2 className="text-3xl sm:text-4xl lg:text-6xl text-white drop-shadow-md font-geist tracking-tighter font-medium">
                  Explore curated homes near you
                </h2>
                <p className="mt-2 sm:mt-3 text-white/90 text-base sm:text-lg leading-relaxed drop-shadow-sm font-geist">
                  Start with location and lifestyle filters. Switch between buy or rent seamlessly, with real-time results.
                </p>
              </div>

              {/* Search controls */}
              <SearchForm 
                searchType={searchType}
                setSearchType={setSearchType}
                filters={filters}
                setFilters={setFilters}
                handleSearch={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Search Form Component
const SearchForm = ({ searchType, setSearchType, filters, setFilters, handleSearch }) => {
  return (
    <div className="mt-5">
      <div className="w-full sm:p-4 bg-black/10 border-white/10 border rounded-2xl pt-3 pr-3 pb-3 pl-3 backdrop-blur-xl" 
           style={{ backdropFilter: 'blur(20px) saturate(180%)' }}>
        
        {/* Buy/Rent Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setSearchType('buy')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium tracking-tight transition-all font-geist ${
              searchType === 'buy'
                ? 'bg-white text-neutral-900'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSearchType('rent')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium tracking-tight transition-all font-geist ${
              searchType === 'rent'
                ? 'bg-white text-neutral-900'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Rent
          </button>
        </div>

        {/* Search Fields */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[1.5]" />
            <input
              type="text"
              placeholder="City, neighborhood"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full pl-9 pr-3 py-3 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
            />
          </div>

          {/* Type */}
          <div className="relativ">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[3.5]" />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="appearance-none w-full pl-9 pr-10 py-3 rounded-xl text-sm bg-neutral-700 bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md "
            >
              <option>Any type</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Condo</option>
              <option>Penthouse</option>
              <option>Villa</option>
            </select>
          </div>

          {/* Price */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[1.5]" />
            <select
              value={filters.price}
              onChange={(e) => setFilters({ ...filters, price: e.target.value })}
              className="appearance-none w-full pl-9 pr-10 py-3 rounded-xl text-sm bg-neutral-700 bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md "
            >
              <option>500K–$1M</option>
              <option>$1M–$2M</option>
              <option>$2M–$5M</option>
              <option>$5M+</option>
            </select>
          </div>

          {/* Beds */}
          <div className="relative">
            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[1.5]" />
            <select
              value={filters.beds}
              onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
              className="appearance-none w-full pl-9 pr-10 py-3 rounded-xl text-sm bg-neutral-700 bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
            >
              <option>Any beds</option>
              <option>1+ beds</option>
              <option>2+ beds</option>
              <option>3+ beds</option>
              <option>4+ beds</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium tracking-tight text-neutral-900 bg-white hover:bg-white/90 border-0 transition-all"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
            <span className="font-geist">Search</span>
          </button>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2 mt-3 items-center">
          <span className="text-xs text-white/50 font-geist">Quick filters:</span>
          <QuickFilterButton icon={<Car className="w-3.5 h-3.5 stroke-[1.5] text-white/60" />} label="Parking" />
          <QuickFilterButton icon={<Sparkles className="w-3.5 h-3.5 stroke-[1.5] text-white/60" />} label="New builds" />
          <QuickFilterButton icon={<Trees className="w-3.5 h-3.5 stroke-[1.5] text-white/60" />} label="Garden" />
          <QuickFilterButton icon={<Waves className="w-3.5 h-3.5 stroke-[1.5] text-white/60" />} label="Pool" />
        </div>
      </div>
    </div>
  );
};

const QuickFilterButton = ({ icon, label }) => (
  <button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 text-white/80 backdrop-blur-sm transition-all font-geist">
    {icon}
    {label}
  </button>
);

export default HeroSection;
