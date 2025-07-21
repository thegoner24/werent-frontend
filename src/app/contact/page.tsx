'use client';
import React from "react";

const LOCATIONS = [
  {
    name: 'San Francisco',
    email: 'sanfrancisco@flowbase.co',
    phone: '(415) 931-1616',
    bg: 'bg-pink-100',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto">
        <rect x="12" y="24" width="40" height="28" rx="4" fill="#fff" stroke="#22223B" strokeWidth="2"/>
        <rect x="18" y="38" width="8" height="14" rx="2" fill="#FECACA" stroke="#22223B" strokeWidth="2"/>
        <rect x="38" y="38" width="8" height="14" rx="2" fill="#FECACA" stroke="#22223B" strokeWidth="2"/>
        <rect x="28" y="32" width="8" height="20" rx="2" fill="#fff" stroke="#22223B" strokeWidth="2"/>
        <rect x="16" y="16" width="8" height="8" rx="2" fill="#fff" stroke="#22223B" strokeWidth="2"/>
        <rect x="40" y="16" width="8" height="8" rx="2" fill="#fff" stroke="#22223B" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Paris',
    email: 'paris@flowbase.co',
    phone: '(415) 931-1616',
    bg: 'bg-pink-200',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto">
        <polygon points="32,12 44,52 20,52" fill="#fff" stroke="#22223B" strokeWidth="2"/>
        <rect x="28" y="38" width="8" height="14" rx="2" fill="#FBCFE8" stroke="#22223B" strokeWidth="2"/>
        <circle cx="32" cy="28" r="4" fill="#fff" stroke="#22223B" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Egypt',
    email: 'egypt@flowbase.co',
    phone: '(415) 931-1616',
    bg: 'bg-blue-100',
    icon: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mx-auto">
        <polygon points="32,14 54,50 10,50" fill="#fff" stroke="#22223B" strokeWidth="2"/>
        <circle cx="32" cy="38" r="8" fill="#DBEAFE" stroke="#22223B" strokeWidth="2"/>
        <rect x="28" y="42" width="8" height="8" rx="2" fill="#fff" stroke="#22223B" strokeWidth="2"/>
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8fafd] flex flex-col items-center px-2 pb-24">
      <div className="w-full max-w-6xl mx-auto text-center pt-20">
        <div className="inline-block border border-[#22223B] px-6 py-2 rounded mb-6 text-base font-semibold tracking-wide">* CONTACT PAGE</div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#22223B] mb-6 leading-tight">Get in touch with us for<br />more information</h1>
        <p className="text-[#4a4e69] mb-14 text-lg md:text-2xl">If you need help or have a question, we're here for you</p>
      </div>
      <section className="w-full max-w-7xl flex flex-col md:flex-row gap-12 justify-center">
        {LOCATIONS.map((loc) => (
          <div
            key={loc.name}
            className="flex-1 bg-white rounded-3xl shadow-md border border-[#e0e0e0] p-10 flex flex-col items-center min-w-[320px] max-w-md mx-auto scale-105"
          >
            <div className={`w-full rounded-2xl h-44 flex items-center justify-center mb-8 ${loc.bg}`}>
              {React.cloneElement(loc.icon, { width: 96, height: 96 })}
            </div>
            <div className="w-full text-left">
              <h2 className="text-2xl font-bold mb-2 text-[#22223B]">{loc.name}</h2>
              <p className="text-[#4a4e69] text-base mb-2">{loc.email}</p>
              <p className="text-[#4a4e69] text-base mb-6">{loc.phone}</p>
            </div>
            <button
              className="w-full border-2 border-[#22223B] text-[#22223B] py-3 rounded-xl text-lg font-semibold hover:bg-[#22223B] hover:text-white transition-colors"
            >
              View Location
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}

