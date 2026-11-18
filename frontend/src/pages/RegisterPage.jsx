import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Shield, AlertCircle, ArrowRight, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user', // default per plan
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register(formData);
      // Optional: automatically login after register, or just redirect to login
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const RoleOption = ({ value, label, description, icon }) => (
    <div 
      onClick={() => handleChange({ target: { name: 'role', value } })}
      className={`relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
        formData.role === value 
          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200' 
          : 'bg-black/20 border-white/10 text-neutral-300 hover:bg-white/5'
      }`}
    >
      <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
        formData.role === value ? 'border-emerald-400' : 'border-white/30'
      }`}>
        {formData.role === value && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
      </div>
      <div>
        <p className="text-sm font-medium font-geist flex items-center gap-1.5">
          {icon} {label}
        </p>
        <p className="text-[11px] font-geist opacity-70 mt-0.5">{description}</p>
      </div>
    </div>
  );

  return (
    <section className="max-w-7xl sm:px-6 mt-10 mx-auto mb-8 px-4 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-lg relative overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border border-white/10 rounded-[30px] backdrop-blur p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        </div>

        <div className="relative">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-5 h-5 text-neutral-100 stroke-[1.5]" />
            </div>
            <h1 className="text-2xl text-neutral-100 font-geist tracking-tight font-medium">
              Create an account
            </h1>
            <p className="text-sm text-neutral-400 font-geist mt-1">
              Join EstateVault to find or list your dream property
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-geist">
                <AlertCircle className="w-4 h-4 stroke-[1.5]" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-geist">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-geist">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-geist">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-000"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-300 font-geist">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs text-neutral-300 font-geist">I am a...</label>
              <div className="grid sm:grid-cols-2 gap-3">
                <RoleOption 
                  value="user" 
                  label="Buyer / Renter" 
                  description="Looking for properties to buy or rent"
                  icon={<User className="w-3.5 h-3.5 stroke-[1.5]" />}
                />
                <RoleOption 
                  value="agent" 
                  label="Agent / Broker" 
                  description="Listing and managing properties"
                  icon={<Shield className="w-3.5 h-3.5 stroke-[1.5]" />}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-transparent bg-white px-4 py-2.5 text-sm font-geist font-medium tracking-tight text-neutral-900 hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
              {!isLoading && <ArrowRight className="w-4 h-4 stroke-[1.5]" />}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-400 font-geist">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
