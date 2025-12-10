import React from 'react'

const Hero = () => {
return (
  <section className="max-w-7xl sm:px-6 mt-8 mx-auto mb-8 px-4">
    <div>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path></svg>
        </div>
        <select className="appearance-none w-full pl-9 pr-10 py-3 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md">
          <option>Any type</option>
          <option>House</option>
          <option>Apartment</option>
          <option>Condo</option>
          <option>Penthouse</option>
          <option>Villa</option>
        </select>
      </div>


<div className="relative">
<div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
</div>
<select id="priceSelect" className="appearance-none w-full pl-9 pr-10 py-3 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md">
<option>$500K–$1M</option>
<option>$1M–$2M</option>
<option>$2M–$5M</option>
<option>$5M+</option>
</select>
</div>


<div className="relative">
<div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path></svg>
</div>
<select className="appearance-none w-full pl-9 pr-10 py-3 rounded-xl text-sm bg-black/10 text-white border border-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 backdrop-blur-md">
<option>Any beds</option>
<option>1+ beds</option>
<option>2+ beds</option>
<option>3+ beds</option>
<option>4+ beds</option>
</select>
</div>


<div className="flex items-stretch">
<button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium tracking-tight text-neutral-900 bg-white hover:bg-white/90 border-0 transition-all">
<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
<span>Search</span>
</button>
</div>
</div>


<div className="flex flex-wrap gap-2 mt-3 items-center">
<span className="text-xs text-white/50">Quick filters:</span>
<button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 text-white/80 backdrop-blur-sm transition-all">Parking</button>
<button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 text-white/80 backdrop-blur-sm transition-all">New builds</button>
<button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 text-white/80 backdrop-blur-sm transition-all">Garden</button>
<button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 text-white/80 backdrop-blur-sm transition-all">Pool</button>
        <div className="flex flex-wrap gap-2 mt-3 items-center">
          <span className="text-xs text-white/50">Quick filters:</span>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 text-white/80 backdrop-blur-sm transition-all">Parking</button>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 text-white/80 backdrop-blur-sm transition-all">New builds</button>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 text-white/80 backdrop-blur-sm transition-all">Garden</button>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium tracking-tight bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 border border-white/10 text-white/80 backdrop-blur-sm transition-all">Pool</button>
        </div>
      </div>
    </section>
  )
}
  


export default Hero
