// components/PropertyCard.jsx
import React, { useState } from 'react';
import { MapPin, Eye, Heart, Route } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!property) return null;

  // ── Data Mapping (Backend vs Mock) ──────────────────────────────────────────
  const id = property._id || property.id;
  const title = property.title || 'Untitled Property';
  
  // Use first image from array if available, or try single 'image' field
  const mainImage = (property.images && property.images.length > 0) 
    ? (property.images[0]?.url || property.images[0]) 
    : (property.image || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg');
    
  const location = property.locationCity 
    ? `${property.locationCity}, ${property.locationState || ''}` 
    : (property.location && typeof property.location === 'object' 
        ? `${property.location.city || ''}, ${property.location.state || ''}`.trim() || 'Location unknown'
        : (property.location || 'Location unknown'));
    
  // Format price if it's a number
  const price = typeof property.price === 'number' 
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: property.currency || 'INR', maximumFractionDigits: 0 }).format(property.price)
    : (property.price || 'Price on request');

  const beds = property.bedrooms || property.beds || 0;
  const baths = property.bathrooms || property.baths || 0;
  const sqft = property.areaSqft || property.sqft || 0;
  
  // Defensive check for badge
  const badgeText = property.badge?.text || (property.status === 'for_sale' ? 'For Sale' : (property.status === 'for_rent' ? 'For Rent' : property.status));
  const badgeColor = property.badge?.color || 'bg-blue-500/80';
  const badgeTextColor = property.badge?.textColor || 'text-white';

  return (
    <Link to={`/property/${id}`}>
      <article className="group overflow-hidden bg-neutral-900/90 border border-white/10 rounded-xl h-full shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={mainImage}  
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {badgeText && (
            <div className={`absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold ${badgeTextColor} ${badgeColor} backdrop-blur-md rounded-full px-3 py-1 border border-white/20 font-geist`}>
              {badgeText}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="min-h-[64px]">
            <h3 className="text-base font-semibold tracking-tight text-neutral-100 font-geist line-clamp-1">
              {title}
            </h3>
            <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1.5 font-geist line-clamp-1">
              <MapPin className="w-3.5 h-3.5 stroke-[1.5] text-blue-400" />
              {location}
            </p>
          </div>
          
          <div className="mt-3 flex items-end justify-between border-t border-white/5 pt-3">
            <div>
              <div className="text-lg font-bold text-neutral-100 font-geist">{price}</div>
              <div className="text-[11px] text-neutral-500 font-geist mt-0.5">
                {beds} bd • {baths} ba • {sqft.toLocaleString()} sqft
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-neutral-200 hover:bg-white/10 transition-colors"
            >
              <Heart className={`w-4 h-4 stroke-[1.5] ${isFavorite ? 'fill-red-500 stroke-red-500' : ''}`} />
            </button>
          </div>
          
          {/* Action Button */}
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-tight text-white/90 bg-white/10 group-hover:bg-white group-hover:text-black rounded-xl px-4 py-2 w-full justify-center transition-all duration-300 border border-white/5">
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

// Simple ArrowRight icon helper since we don't have it in the card imports yet
const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default PropertyCard;
