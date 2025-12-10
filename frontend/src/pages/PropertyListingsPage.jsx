// pages/PropertyListingsPage.jsx
import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  DollarSign,
  Bed,
  Bath,
  Car,
  Sparkles,
  Trees,
  Waves,
  Search,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  Rows3,
} from 'lucide-react';
 import PropertyCard from '../component/PropertyCard';

const mockProperties = [
  {
    id: 1,
    title: 'Oceanview Modern Villa',
    location: 'Malibu, CA',
    price: '$2.8M',
    beds: 4,
    baths: 3,
    sqft: 2800,
    image:
      'https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/26b3f294-2885-4440-ae74-eda7506cca9e_800w.jpg',
    badge: { text: 'New', color: 'bg-cyan-600/90' },
    virtualTour: true,
  },
  {
    id: 2,
    title: 'Skyline Penthouse Suite',
    location: 'Manhattan, NY',
    price: '$5.2M',
    beds: 5,
    baths: 4,
    sqft: 4500,
    image:
      'https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/50eb2e09-7421-4468-b850-e7d07311523d_800w.jpg',
    badge: { text: 'Premium', color: 'bg-indigo-900/90' },
    virtualTour: true,
  },
  {
    id: 3,
    title: 'Contemporary Townhouse',
    location: 'Austin, TX',
    price: '$1.15M',
    beds: 3,
    baths: 3,
    sqft: 1900,
    image:
      'https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/c493dcb7-d70e-440e-92e9-4b752945750e_800w.jpg',
    badge: { text: 'Open House', color: 'bg-white/90', textColor: 'text-indigo-900' },
    virtualTour: false,
  },
  // Duplicate a few more for pagination demo
  {
    id: 4,
    title: 'Lakefront Glass Residence',
    location: 'Seattle, WA',
    price: '$2.1M',
    beds: 4,
    baths: 4,
    sqft: 3200,
    image:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: { text: 'Verified', color: 'bg-emerald-700/90' },
    virtualTour: true,
  },
  {
    id: 5,
    title: 'Minimalist City Loft',
    location: 'San Francisco, CA',
    price: '$1.9M',
    beds: 2,
    baths: 2,
    sqft: 1500,
    image:
      'https://images.pexels.com/photos/3637729/pexels-photo-3637729.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: { text: 'Price Drop', color: 'bg-amber-600/90' },
    virtualTour: false,
  },
  {
    id: 6,
    title: 'Garden Courtyard Home',
    location: 'Portland, OR',
    price: '$980K',
    beds: 3,
    baths: 2,
    sqft: 1800,
    image:
      'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: { text: 'Hot', color: 'bg-rose-600/90' },
    virtualTour: false,
  },
];

const PropertyListingsPage = () => {
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [filters, setFilters] = useState({
    location: '',
    type: 'Any type',
    minPrice: '',
    maxPrice: '',
    beds: 'Any beds',
    baths: 'Any baths',
    amenities: {
      parking: false,
      pool: false,
      garden: false,
      newBuilds: false,
    },
    sort: 'Newest',
  });

  const totalPages = 3; // fake for UI

  const handlePageChange = (dir) => {
    setPage((prev) => {
      if (dir === 'prev') return Math.max(1, prev - 1);
      return Math.min(totalPages, prev + 1);
    });
  };

  const toggleAmenity = (key) => {
    setFilters((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] },
    }));
  };

  const handleSearch = () => {
    // later connect to backend
    console.log('Apply filters:', filters, 'page:', page);
  };

  return (
    
    <section className="max-w-7xl sm:px-6 mt-10 mx-auto mb-8 px-4">
        <div
        className="antialiased text-neutral-100 bg-neutral-950"
        style={{
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        }}
      >
        <div
          data-us-project="XKOypOfa1PB1AP8SFWUj"
          className="fixed w-full h-full left-0 top-0 -z-10"
        ></div>

        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>
      </div>
      <div className="relative sm:mt-12 overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border border-white/10 rounded-[40px] backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        </div>

        <div className="relative sm:p-8 pt-6 pr-6 pb-6 pl-6">
          {/* Header + total count */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <p className="text-xs font-medium text-blue-300 bg-blue-500/10 border border-white/10 rounded-full inline-flex px-3 py-1.5 items-center gap-2 font-geist">
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Search results</span>
              </p>
              <h1 className="mt-3 text-2xl sm:text-3xl text-neutral-100 font-geist tracking-tight font-medium">
                Homes matching your criteria
              </h1>
              <p className="mt-1 text-sm text-neutral-400 font-geist">
                Refine filters to narrow down from <span className="text-neutral-200">12,000+</span> curated listings.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setView('grid')}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-full border ${
                  view === 'grid'
                    ? 'border-white/80 bg-white text-neutral-900'
                    : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="w-4 h-4 stroke-[1.5]" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-full border ${
                  view === 'list'
                    ? 'border-white/80 bg-white text-neutral-900'
                    : 'border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
                }`}
              >
                <Rows3 className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[320px,minmax(0,1fr)] gap-6">
            {/* Filters panel */}
            <aside className="space-y-4">
              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h2 className="text-sm font-medium text-neutral-100 font-geist tracking-tight">
                    Filters
                  </h2>
                  <button
                    className="text-[11px] text-neutral-400 hover:text-neutral-200 font-geist"
                    onClick={() =>
                      setFilters({
                        location: '',
                        type: 'Any type',
                        minPrice: '',
                        maxPrice: '',
                        beds: 'Any beds',
                        baths: 'Any baths',
                        amenities: {
                          parking: false,
                          pool: false,
                          garden: false,
                          newBuilds: false,
                        },
                        sort: 'Newest',
                      })
                    }
                  >
                    Reset
                  </button>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-300 font-geist">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[1.5]" />
                    <input
                      type="text"
                      placeholder="City, neighborhood"
                      value={filters.location}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, location: e.target.value }))
                      }
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                    />
                  </div>
                </div>

                {/* Property type */}
                <div className="space-y-1.5 mt-3">
                  <label className="text-xs text-neutral-300 font-geist">Property type</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[1.5]" />
                    <select
                      value={filters.type}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, type: e.target.value }))
                      }
                      className="appearance-none w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                    >
                      <option>Any type</option>
                      <option>House</option>
                      <option>Apartment</option>
                      <option>Condo</option>
                      <option>Penthouse</option>
                      <option>Villa</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Price range */}
                <div className="space-y-1.5 mt-3">
                  <label className="text-xs text-neutral-300 font-geist">Price range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[1.5]" />
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
                        }
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                      />
                    </div>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[1.5]" />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
                        }
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Beds & baths */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-geist">Beds</label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[1.5]" />
                      <select
                        value={filters.beds}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, beds: e.target.value }))
                        }
                        className="appearance-none w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                      >
                        <option>Any beds</option>
                        <option>1+ beds</option>
                        <option>2+ beds</option>
                        <option>3+ beds</option>
                        <option>4+ beds</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-300 font-geist">Baths</label>
                    <div className="relative">
                      <Bath className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 stroke-[1.5]" />
                      <select
                        value={filters.baths}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, baths: e.target.value }))
                        }
                        className="appearance-none w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                      >
                        <option>Any baths</option>
                        <option>1+ baths</option>
                        <option>2+ baths</option>
                        <option>3+ baths</option>
                        <option>4+ baths</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-xs">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mt-4">
                  <p className="text-xs text-neutral-300 font-geist mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    <AmenityChip
                      active={filters.amenities.parking}
                      onClick={() => toggleAmenity('parking')}
                      icon={<Car className="w-3.5 h-3.5 stroke-[1.5] text-white/60" />}
                      label="Parking"
                    />
                    <AmenityChip
                      active={filters.amenities.newBuilds}
                      onClick={() => toggleAmenity('newBuilds')}
                      icon={<Sparkles className="w-3.5 h-3.5 stroke-[1.5] text-white/60" />}
                      label="New builds"
                    />
                    <AmenityChip
                      active={filters.amenities.garden}
                      onClick={() => toggleAmenity('garden')}
                      icon={<Trees className="w-3.5 h-3.5 stroke-[1.5] text-white/60" />}
                      label="Garden"
                    />
                    <AmenityChip
                      active={filters.amenities.pool}
                      onClick={() => toggleAmenity('pool')}
                      icon={<Waves className="w-3.5 h-3.5 stroke-[1.5] text-white/60" />}
                      label="Pool"
                    />
                  </div>
                </div>

                {/* Apply button */}
                <button
                  onClick={handleSearch}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium tracking-tight text-neutral-900 bg-white hover:bg-white/90 border-0 transition-all font-geist"
                >
                  <Search className="w-4 h-4 stroke-[1.5]" />
                  Apply filters
                </button>
              </div>

              {/* Map preview placeholder */}
              <div className="hidden lg:block bg-black/30 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                <div className="rounded-xl overflow-hidden border border-white/10 h-44 bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 flex items-center justify-center text-xs text-neutral-300 font-geist">
                  Map view (integrate Google Maps here)
                </div>
              </div>
            </aside>

            {/* Results + sort + pagination */}
            <div className="space-y-4">
              {/* Sort + result meta */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-neutral-400 font-geist">
                  Showing <span className="text-neutral-100">1–{pageSize}</span> of{' '}
                  <span className="text-neutral-100">120</span> homes
                </p>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-neutral-300 font-geist">Sort by</label>
                  <select
                    value={filters.sort}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, sort: e.target.value }))
                    }
                    className="appearance-none bg-black/20 text-xs text-neutral-100 border border-white/10 rounded-full px-3 py-1.5 pr-7 font-geist focus:outline-none focus:ring-1 focus:ring-white/20"
                  >
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Most viewed</option>
                  </select>
                  <span className="pointer-events-none -ml-6 text-white/50 text-[10px]">▼</span>
                </div>
              </div>

              {/* Grid/List of cards */}
              <div 
                className={
                  view === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                    : 'space-y-4'
                }
              >
                {mockProperties.map((property) => (
                    
               

                  <div
                    key={property.id}
                    className={view === 'list' ? 'md:grid md:grid-cols-[260px,minmax(0,1fr)] gap-4' : ''}
                  >
                   
                <PropertyCard property={property} listLayout={view === 'list'} />   
                  </div>
                  
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[11px] text-neutral-400 font-geist">
                  Page <span className="text-neutral-200">{page}</span> of{' '}
                  <span className="text-neutral-200">{totalPages}</span>
                </p>
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange('prev')}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed font-geist"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                    Prev
                  </button>
                  <button
                    onClick={() => handlePageChange('next')}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed font-geist"
                  >
                    Next
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </section>
  );
};

const AmenityChip = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 text-xs font-medium tracking-tight rounded-full px-3 py-1.5 border backdrop-blur-sm transition-all font-geist ${
      active
        ? 'bg-white text-neutral-900 border-white'
        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/80'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default PropertyListingsPage;
