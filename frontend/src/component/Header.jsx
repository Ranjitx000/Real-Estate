// components/Header.jsx
import React, { useState } from 'react';
import { MapPin, ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, token, logout } = useAuth();

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
            
              <Link to="/Agent" className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight font-geist">Agents</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 tracking-tight font-geist">Admin Dashboard</Link>
              )}
            </nav>


            {token ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight font-geist"
                >
                  Logout
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center border border-white/20">
                   <span className="text-xs font-bold text-white uppercase">{user?.name?.charAt(0) || 'U'}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                <Link to="/login" className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight font-geist">Login</Link>
                <Link to="/register" className="inline-flex items-center justify-center text-sm font-medium text-neutral-900 tracking-tight bg-white hover:bg-neutral-200 border border-transparent rounded-full px-4 py-2 transition-colors">
                  Sign up
                </Link>
              </div>
            )}
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
            <Link to="/Agent" className="text-lg font-medium hover:text-white">Agents</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-lg font-medium text-indigo-400 hover:text-indigo-300">Admin Dashboard</Link>
            )}
            
            <div className="w-full h-px bg-white/10 my-2" />

            {token ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-500 flex items-center justify-center border border-white/20">
                      <span className="text-sm font-bold text-white uppercase">{user?.name?.charAt(0) || 'U'}</span>
                   </div>
                   <span className="text-neutral-100 font-medium">{user?.name || 'User'}</span>
                </div>
                <button 
                  onClick={() => { logout(); setOpen(false); }}
                  className="text-lg font-medium text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <Link to="/login" onClick={() => setOpen(false)} className="text-lg font-medium hover:text-white">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="w-full text-center text-lg font-medium text-neutral-900 bg-white rounded-full py-3">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

