
import React from 'react'

const Navbar = () => {
  return (
    <div>
      <header className="max-w-7xl sm:px-6 mx-auto pt-6 px-4 sticky top-4 z-50">
<div className="flex shadow-[0_8px_30px_rgba(0,0,0,0.35)] bg-white/5 border-white/10 border rounded-full pt-2 pr-4 pb-2 pl-4 backdrop-blur-md items-center justify-between">
<div className="flex items-center gap-3">
<div className="flex items-center gap-2">
<svg width="92" height="36" viewBox="0 0 92 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.8834 4.66666C17.4168 4.66666 16.2168 5.86666 16.2168 7.33332V11.56L18.8834 14.2267L21.5501 11.56V7.33332C21.5501 6.59999 21.2568 5.93332 20.7634 5.43999C20.2834 4.95999 19.6168 4.66666 18.8834 4.66666Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />

</svg>
</div>
</div>

<div className="flex items-center gap-6">
<nav className="hidden md:flex items-center gap-6">
<a href="#" className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight">Buy</a>
<a href="#" className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight">Rent</a>
<a href="#" className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight">Sell</a>
<a href="#" className="text-sm font-medium text-neutral-300 hover:text-white tracking-tight">Agents</a>
</nav>


<a href="#" className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-900 tracking-tight bg-white hover:bg-indigo-100 border border-white/10 rounded-full px-4 py-2">
<span>List a Property</span>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
</a>
</div>
</div>
</header>
    </div>
  )
}

export default Navbar
