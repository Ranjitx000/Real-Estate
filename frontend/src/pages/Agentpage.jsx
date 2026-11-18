import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  Calendar,
  Home,
  Bed,
  Bath,
  Ruler,
  Sparkles,
  Shield,
  ArrowRight,
  Check,
  User,
  Star,
} from 'lucide-react';
import PropertyCard from '../component/PropertyCard';
import { API } from '../config/api.js';

const mockAgent = {
  id: 1,
  name: 'Elena Rodriguez',
  role: 'Senior Real Estate Agent',
  agency: 'EstateVault Premier Team',
  city: 'Malibu, CA',
  phone: '+1 (555) 123-4567',
  email: 'elena@estatevault.com',
  bio: 'Elena has helped hundreds of families find their dream homes in Malibu and beyond. With a background in architecture and a passion for coastal living, she brings deep local insight and a meticulous approach to every transaction.',
  yearsExperience: 12,
  languages: ['English', 'Spanish'],
  specialties: ['Luxury Homes', 'Waterfront Properties', 'Investment Portfolios'],
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d83377a1a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
  rating: 4.9,
  totalReviews: 128,
  listingsCount: 23,
};

const AgentPage = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [agentListings, setAgentListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, you would pass the agent ID and only fetch their listings
    // For now, let's fetch the general listings to populate the page
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(API.properties.list);
        const data = await res.json();
        if (data.data) {
          setAgentListings(data.data.slice(0, 6)); // Show a few
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <section className="max-w-7xl sm:px-6 mt-10 mx-auto mb-8 px-4">
      <div className="relative sm:mt-12 overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border border-white/10 rounded-[40px] backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        </div>

        <div className="relative sm:p-8 pt-6 pr-6 pb-6 pl-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex items-center gap-4">
              <img
                src={mockAgent.avatar}
                alt={mockAgent.name}
                className="w-20 h-20 rounded-full border-2 border-white/20"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl text-neutral-100 font-geist tracking-tight font-medium">
                  {mockAgent.name}
                </h1>
                <p className="text-sm text-neutral-300 font-geist">{mockAgent.role}</p>
                <p className="text-xs text-neutral-400 font-geist">{mockAgent.agency}</p>
              </div>
            </div>

            <div className="sm:ml-auto space-y-2 text-right">
              <div className="inline-flex items-center gap-1.5 text-xs text-neutral-200 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 font-geist">
                <Star className="w-3.5 h-3.5 stroke-[1.5] fill-yellow-400 stroke-yellow-400" />
                <span>
                  {mockAgent.rating} ({mockAgent.totalReviews} reviews)
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-neutral-200 bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 font-geist">
                <Shield className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>{mockAgent.listingsCount} active listings</span>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-black/30 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 stroke-[1.5] text-neutral-400" />
                <span className="text-sm text-neutral-200 font-geist">{mockAgent.city}</span>
              </div>
            </div>
            <div className="bg-black/30 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 stroke-[1.5] text-neutral-400" />
                <span className="text-sm text-neutral-200 font-geist">{mockAgent.phone}</span>
              </div>
            </div>
            <div className="bg-black/30 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 stroke-[1.5] text-neutral-400" />
                <span className="text-sm text-neutral-200 font-geist">{mockAgent.email}</span>
              </div>
            </div>
          </div>

          {/* Bio & specialties */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <h2 className="text-sm font-geist text-neutral-100 tracking-tight mb-3">
              About {mockAgent.name}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-300 font-geist">
              {mockAgent.bio}
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs text-neutral-300 font-geist uppercase tracking-wide mb-2">
                  Experience
                </h3>
                <p className="text-sm text-neutral-200 font-geist">
                  {mockAgent.yearsExperience} years in real estate
                </p>
              </div>
              <div>
                <h3 className="text-xs text-neutral-300 font-geist uppercase tracking-wide mb-2">
                  Languages
                </h3>
                <p className="text-sm text-neutral-200 font-geist">{mockAgent.languages.join(', ')}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xs text-neutral-300 font-geist uppercase tracking-wide mb-2">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {mockAgent.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-neutral-100 font-geist"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[1.5] text-emerald-400" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-white/10">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 text-sm font-geist rounded-t-lg transition-all ${
                activeTab === 'listings'
                  ? 'bg-white/10 text-neutral-100 border border-white/10 border-b-transparent'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Listings
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-sm font-geist rounded-t-lg transition-all ${
                activeTab === 'reviews'
                  ? 'bg-white/10 text-neutral-100 border border-white/10 border-b-transparent'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 text-sm font-geist rounded-t-lg transition-all ${
                activeTab === 'contact'
                  ? 'bg-white/10 text-neutral-100 border border-white/10 border-b-transparent'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <h2 className="text-sm font-geist text-neutral-100 tracking-tight">
                Active Listings ({agentListings.length})
              </h2>
              {loading ? (
                <div className="text-neutral-400 py-10 text-center font-geist">Loading listings...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {agentListings.map((listing) => (
                    <PropertyCard key={listing._id || listing.id} property={listing} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h2 className="text-sm font-geist text-neutral-100 tracking-tight">
                Reviews ({mockAgent.totalReviews})
              </h2>
              <div className="space-y-4">
                {[
                  {
                    rating: 5,
                    text: 'Elena was professional, responsive, and helped us close on our dream home in record time.',
                    author: 'Michael T.',
                  },
                  {
                    rating: 5,
                    text: 'Outstanding service from start to finish. Elena knows the Malibu market inside and out.',
                    author: 'Sarah L.',
                  },
                  {
                    rating: 4,
                    text: 'Great agent with deep expertise. Highly recommend for luxury buyers.',
                    author: 'James P.',
                  },
                ].map((review, index) => (
                  <div key={index} className="bg-black/30 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-neutral-300 font-geist">{review.text}</p>
                    <p className="mt-2 text-xs text-neutral-400 font-geist">— {review.author}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <h2 className="text-sm font-geist text-neutral-100 tracking-tight">
                Contact {mockAgent.name}
              </h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InputField label="Full name" placeholder="Your name" />
                  <InputField label="Email" placeholder="you@example.com" type="email" />
                </div>
                <InputField label="Phone" placeholder="+1 (555) 000-0000" />
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-300 font-geist">Message</label>
                  <textarea
                    rows={3}
                    placeholder="Share your interest, questions, or schedule a meeting..."
                    className="w-full rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md px-3 py-2.5 placeholder:text-white/40 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium tracking-tight text-neutral-900 bg-white hover:bg-white/90 border-0 transition-all font-geist"
                >
                  <Mail className="w-4 h-4 stroke-[1.5]" />
                  Send message
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const InputField = ({ label, placeholder, type = 'text' }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-neutral-300 font-geist">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md px-3 py-2.5 placeholder:text-white/40"
    />
  </div>
);

export default AgentPage;
