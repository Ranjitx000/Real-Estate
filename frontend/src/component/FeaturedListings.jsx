// components/FeaturedListings.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Eye, Heart, ArrowUpRight, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropertyCard from './PropertyCard';
import { API } from '../config/api.js';

const FeaturedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // Assuming listall returns latest first. In a real app, maybe hitting a ?sort=latest or ?featured=true endpoint
        const res = await fetch(API.properties.list);
        const data = await res.json();
        if (data.data) {
          setProperties(data.data.slice(0, 3)); // Just take the top 3 for the home page
        }
      } catch (err) {
        console.error('Failed to fetch featured listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

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
            <Link to="/Listing" className="inline-flex items-center gap-2 text-sm text-neutral-200 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
              <span className="font-geist">View all</span>
              <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-neutral-400 font-geist">Loading featured properties...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {properties.map((property) => (
                <PropertyCard key={property._id || property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
