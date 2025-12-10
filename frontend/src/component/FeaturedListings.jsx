// components/FeaturedListings.jsx
import React from 'react';
import { MapPin, Eye, Heart, ArrowUpRight, Route } from 'lucide-react';
import PropertyCard from './PropertyCard';

const FeaturedListings = () => {
  const properties = [
    {
      id: 1,
      title: 'Oceanview Modern Villa',
      location: 'Malibu, CA',
      price: '$2.8M',
      beds: 4,
      baths: 3,
      sqft: 2800,
      image: 'https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/26b3f294-2885-4440-ae74-eda7506cca9e_800w.jpg',
      badge: { text: 'New', color: 'bg-cyan-600/90' },
      virtualTour: true
    },
    {
      id: 2,
      title: 'Skyline Penthouse Suite',
      location: 'Manhattan, NY',
      price: '$5.2M',
      beds: 5,
      baths: 4,
      sqft: 4500,
      image: 'https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/50eb2e09-7421-4468-b850-e7d07311523d_800w.jpg',
      badge: { text: 'Premium', color: 'bg-indigo-900/90' },
      virtualTour: true
    },
    {
      id: 3,
      title: 'Contemporary Townhouse',
      location: 'Austin, TX',
      price: '$1.15M',
      beds: 3,
      baths: 3,
      sqft: 1900,
      image: 'https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/c493dcb7-d70e-440e-92e9-4b752945750e_800w.jpg',
      badge: { text: 'Open House', color: 'bg-white/90', textColor: 'text-indigo-900' },
      directions: true
    }
  ];

  return (
    <section className="max-w-7xl sm:px-6 mt-10 mx-auto mb-8 px-4">
      <div className="relative sm:mt-12 overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border-white/10 border rounded-[40px] backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>
        </div>
        
        <div className="relative sm:p-8 pt-6 pr-6 pb-6 pl-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl text-neutral-100 font-geist tracking-tighter font-medium">
              Featured Listings
            </h2>
            <a href="#" className="inline-flex items-center gap-2 text-sm text-neutral-200 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
              <span className="font-geist">View all</span>
              <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
