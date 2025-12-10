// components/AboutSection/index.jsx
import React from 'react';
import StorySection from './StorySection';
import StatsSection from './StatsSection';

const AboutSection = () => {
  return (
    <section className="max-w-7xl sm:px-6 mt-10 mx-auto mb-8 px-4">
      <div className="relative sm:mt-12 overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border-white/10 border rounded-[40px] backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>
        </div>
        
        <div className="relative sm:p-8 pt-6 pr-6 pb-6 pl-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <StorySection />
            <StatsSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
