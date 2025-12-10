// components/AboutSection/StorySection.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const StorySection = () => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="relative rounded-2xl overflow-hidden border border-white/10">
        <img 
          src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/da666542-bfa8-493a-af68-db5a713dc548_1600w.jpg" 
          alt="Clients touring a modern property" 
          className="w-full h-[260px] sm:h-[360px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-white/20"></span>
          <span className="text-sm text-neutral-300 font-geist">About EstateVault</span>
        </div>
        
        <h2 className="mt-2 text-2xl sm:text-3xl text-neutral-100 font-geist tracking-tight font-medium">
          Our Story
        </h2>
        
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-400 font-geist">
          EstateVault began with a simple idea: make finding an extraordinary home feel effortless. What started as a small collective of agents and designers has grown into a nationwide network known for precision, transparency, and taste. 
          From beachfront villas to skyline penthouses, we curate every listing, verify every document, and guide you from first tour to final signature.
        </p>
        
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-400 font-geist">
          Today, our platform blends expert local insight with real‑time data, immersive media, and concierge‑level service—so you can move with confidence.
        </p>

        <a 
          href="#" 
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium tracking-tight text-neutral-200 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10"
        >
          <span className="font-geist">See details</span>
          <ArrowRight className="w-4 h-4 stroke-[1.5]" />
        </a>
      </div>
    </div>
  );
};

export default StorySection;
