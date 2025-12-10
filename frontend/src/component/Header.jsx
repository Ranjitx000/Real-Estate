// components/Header.jsx
import React, { useState } from 'react';
import { MapPin, ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
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

      <header className="max-w-7xl sm:px-6 mx-auto pt-6 px-4 sticky top-4 z-50">
        <div className="flex shadow-[0_8px_30px_rgba(0,0,0,0.35)] bg-white/5 border-white/10 border rounded-full pt-2 pr-4 pb-2 pl-4 backdrop-blur-md items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-10 rounded-full" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight font-geist">Buy</a>
              <a className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight font-geist">Rent</a>
              <Link to="/add-property" className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight font-geist">Sell Property</Link>
            
              <a className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight font-geist">Agents</a>
            </nav>

            <Link to="/Listing" className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-900 tracking-tight bg-white hover:bg-indigo-100 border border-white/10 rounded-full px-4 py-2">
              <span className="font-geist">List a Property</span>
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-100"
            onClick={() => setOpen(true)}
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {open && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md md:hidden">
          <div className="absolute top-4 right-4">
            <button onClick={() => setOpen(false)} className="text-white">
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="mt-20 flex flex-col items-center gap-6 text-neutral-200">
            <a className="text-lg font-medium hover:text-white">Buy</a>
            <a className="text-lg font-medium hover:text-white">Rent</a>
            <Link to="/add-property" className="text-lg font-medium hover:text-white">Sell Property</Link>
            <a className="text-lg font-medium hover:text-white">Agents</a>

            <Link to="/Listing" className="mt-6 group inline-flex items-center gap-2 text-base font-medium text-neutral-900 tracking-tight bg-white hover:bg-indigo-100 border border-white/10 rounded-full px-6 py-3">
              <span className="font-geist">List a Property</span>
              <ArrowRight className="w-5 h-5 stroke-[1.5]" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

