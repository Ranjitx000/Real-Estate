import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email.trim().toLowerCase(), password);
      setTimeout(() => navigate('/'), 100);
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-7xl sm:px-6 mt-10 mx-auto mb-8 px-4 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md relative overflow-hidden shadow-[0px_0px_0px_1px_rgba(255,255,255,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.3),0px_12px_24px_-12px_rgba(0,0,0,0.5)] bg-black/80 border border-white/10 rounded-[30px] backdrop-blur p-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
        </div>

        <div className="relative">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
              <LogIn className="w-5 h-5 text-neutral-100 stroke-[1.5]" />
            </div>
            <h1 className="text-2xl text-neutral-100 font-geist tracking-tight font-medium">
              Welcome back
            </h1>
            <p className="text-sm text-neutral-400 font-geist mt-1">
              Sign in to manage your properties and preferences
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-geist">
                <AlertCircle className="w-4 h-4 stroke-[1.5] shrink-0" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 font-geist">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-neutral-300 font-geist">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 font-geist transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 stroke-[1.5]" />
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-black/10 text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-transparent bg-white px-4 py-2.5 text-sm font-geist font-medium tracking-tight text-neutral-900 hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
              {!isLoading && <ArrowRight className="w-4 h-4 stroke-[1.5]" />}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-400 font-geist">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
