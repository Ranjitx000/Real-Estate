// components/AboutSection/StatsSection.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { value: '12,000+', label: 'Active Listings' },
    { value: '28', label: 'Markets Served' },
    { value: '350+', label: 'Virtual Tours' },
    { value: '4.9', label: 'Client Rating' }
  ];

  return (
    <div className="lg:col-span-1">
      <ul className="space-y-6 sm:space-y-8">
        {stats.map((stat, index) => (
          <li key={index}>
            <div className="text-4xl sm:text-5xl text-neutral-100 font-geist tracking-tight font-medium">
              {stat.value}
            </div>
            <p className="text-[11px] tracking-wider uppercase text-neutral-400 mt-1 font-geist">
              {stat.label}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-8 border-t border-white/10">
        <h3 className="text-xl text-neutral-100 font-geist tracking-tight font-medium">
          Concierge by EstateVault
        </h3>
        
        <p className="mt-2 text-sm leading-relaxed text-neutral-400 font-geist">
          From private showings to vetted contractors and movers, our team orchestrates every step for a seamless move‑in.
        </p>
        
        <a 
          href="#" 
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium tracking-tight text-neutral-200 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10"
        >
          <span className="font-geist">Explore more</span>
          <ArrowRight className="w-4 h-4 stroke-[1.5]" />
        </a>
      </div>
    </div>
  );
};

export default StatsSection;
