// components/PropertyCard.jsx
import React, { useState } from 'react';
import { MapPin, Eye, Heart, Route } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Link to={`/property/${property.id}`}>
      <article className="group overflow-hidden bg-neutral-900/90 border border-white/10 rounded-xl">
        <div className="relative aspect-[16/10]">
          <img
            src={property.image}  
            alt={property.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          <div className={`absolute top-3 left-3 text-[11px] font-medium ${property.badge.textColor || 'text-white'} ${property.badge.color} backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/20 font-geist`}>
            {property.badge.text}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight text-neutral-100 font-geist">
                {property.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1 font-geist">
                <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />
                {property.location}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-neutral-100 font-geist">{property.price}</div>
              <div className="text-[11px] text-neutral-400 font-geist">
                {property.beds} bd • {property.baths} ba • {property.sqft.toLocaleString()} sqft
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            {property.virtualTour ? (
              <button className="inline-flex items-center gap-2 text-xs font-medium tracking-tight text-neutral-200 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 font-geist">
                <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                Virtual tour
              </button>
            ) : (
              <button className="inline-flex items-center gap-2 text-xs font-medium tracking-tight text-neutral-200 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 font-geist">
                <Route className="w-3.5 h-3.5 stroke-[1.5]" />
                Directions
              </button>
            )}
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-neutral-200 hover:bg-white/10"
            >
              <Heart className={`w-4 h-4 stroke-[1.5] ${isFavorite ? 'fill-red-500 stroke-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PropertyCard;
