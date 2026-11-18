import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Home,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Share2,
  Copy,
  ArrowRight,
  PartyPopper
} from 'lucide-react';

const ConfettiCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate confetti particles
    const colors = ['#10B981', '#34D399', '#6EE7B7', '#F59E0B', '#FBBF24', '#60A5FA', '#818CF8', '#EC4899', '#F43F5E'];
    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.45 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 16 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        opacity: 1,
        drag: 0.985,
        gravity: 0.35,
      });
    }

    let startTime = Date.now();
    const duration = 4000; // run for 4 seconds

    const render = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        p.vx *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (elapsed > 2000) {
          p.opacity = Math.max(0, 1 - (elapsed - 2000) / 2000);
        }

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      });

      if (alive && elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
};

export const PublishSuccessModal = ({
  isOpen,
  onClose,
  property,
  onAddAnother,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [autoRedirectPaused, setAutoRedirectPaused] = useState(false);

  // Auto redirect countdown
  useEffect(() => {
    if (!isOpen || autoRedirectPaused) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const propId = property?._id || property?.id;
          if (propId) {
            navigate(`/property/${propId}`);
          } else {
            navigate('/Listing');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, autoRedirectPaused, property, navigate]);

  if (!isOpen) return null;

  const propId = property?._id || property?.id;
  const mainImage =
    property?.images?.[0]?.url ||
    (typeof property?.images?.[0] === 'string' ? property.images[0] : null) ||
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';

  const formattedPrice =
    typeof property?.price === 'number'
      ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: property?.currency || 'INR',
          maximumFractionDigits: 0,
        }).format(property.price)
      : property?.price || '₹0';

  const locationText =
    property?.location?.city || property?.locationCity
      ? `${property?.location?.city || property?.locationCity}, ${
          property?.location?.state || property?.locationState || 'India'
        }`
      : 'India';

  const handleCopyLink = () => {
    if (!propId) return;
    const url = `${window.location.origin}/property/${propId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setAutoRedirectPaused(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleViewListing = () => {
    if (propId) {
      navigate(`/property/${propId}`);
    } else {
      navigate('/Listing');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Confetti Animation Effect */}
      <ConfettiCanvas />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setAutoRedirectPaused(true)}
      />

      {/* Modal Dialog */}
      <div className="relative z-50 w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/95 shadow-2xl backdrop-blur-xl animate-circle-pop transition-all">
        {/* Glow ambient background accents */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="p-6 sm:p-8">
          {/* Header Celebration Badge */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5 flex items-center justify-center">
              {/* Outer pulsing glow rings */}
              <div className="absolute h-20 w-20 rounded-full bg-emerald-500/30 animate-pulse-glow" />
              <div className="absolute h-24 w-24 rounded-full bg-emerald-500/15 animate-ping opacity-60" />

              {/* Main Circular Checkmark Icon */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/40">
                <svg
                  className="h-9 w-9"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    className="animate-checkmark"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                {/* Floating sparkles */}
                <Sparkles className="absolute -top-1 -right-2 h-5 w-5 text-amber-300 animate-bounce" />
                <PartyPopper className="absolute -bottom-1 -left-2 h-5 w-5 text-emerald-300 animate-pulse" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Listing Published & Live
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white font-geist">
              Property Successfully Published!
            </h2>
            <p className="mt-2 text-sm text-neutral-400 max-w-sm font-geist">
              Congratulations! Your listing is now active on EstateVault and visible to verified buyers and investors.
            </p>
          </div>

          {/* Quick Property Card Preview */}
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-neutral-900/80 p-3 sm:p-4 backdrop-blur-md">
            <div className="flex gap-4 items-center">
              <div className="relative h-20 w-24 sm:h-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                <img
                  src={mainImage}
                  alt={property?.title || 'Property'}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';
                  }}
                />
                <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300 backdrop-blur-sm">
                  Active
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-base font-semibold text-white font-geist">
                  {property?.title || 'Untitled Property'}
                </h4>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                  <span className="truncate">{locationText}</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-bold text-emerald-400 font-geist">
                    {formattedPrice}
                  </span>
                  <span className="text-[11px] text-neutral-400 capitalize">
                    • {property?.propertyType || property?.type || 'Property'}
                  </span>
                </div>

                {/* Specs */}
                <div className="mt-2 flex items-center gap-3 text-xs text-neutral-300">
                  {property?.bedrooms && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5 text-neutral-400" />
                      {property.bedrooms} Beds
                    </span>
                  )}
                  {property?.bathrooms && (
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5 text-neutral-400" />
                      {property.bathrooms} Baths
                    </span>
                  )}
                  {property?.areaSqft && (
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5 text-neutral-400" />
                      {property.areaSqft} sqft
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={handleViewListing}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 active:scale-[0.98] font-geist shadow-lg shadow-white/10"
            >
              <ExternalLink className="h-4 w-4" />
              View Live Listing
              <ArrowRight className="h-4 w-4 ml-auto" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs sm:text-sm font-medium text-neutral-200 transition hover:bg-white/10 active:scale-[0.98] font-geist"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-neutral-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                onClick={onAddAnother}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs sm:text-sm font-medium text-neutral-200 transition hover:bg-white/10 active:scale-[0.98] font-geist"
              >
                <PlusCircle className="h-4 w-4 text-neutral-400" />
                <span>Add Another</span>
              </button>
            </div>
          </div>

          {/* Auto-redirect status footer */}
          <div className="mt-5 flex items-center justify-between text-xs text-neutral-500 font-geist">
            {autoRedirectPaused ? (
              <span>Auto-redirect paused. Explore at your own pace.</span>
            ) : (
              <span>
                Redirecting to listing in <strong className="text-neutral-300 font-semibold">{countdown}s</strong>...
              </span>
            )}
            <button
              onClick={() => {
                if (autoRedirectPaused) {
                  setAutoRedirectPaused(false);
                  setCountdown(10);
                } else {
                  setAutoRedirectPaused(true);
                }
              }}
              className="hover:underline text-neutral-400 hover:text-white"
            >
              {autoRedirectPaused ? 'Resume timer' : 'Pause'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishSuccessModal;
