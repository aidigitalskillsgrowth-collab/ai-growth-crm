'use client';

import React, { useState } from 'react';

export default function PublicLandingPage() {
  // State for editable elements (Plug & Play Customization)
  const [businessName, setBusinessName] = useState('Ishwari Digital CRM');
  const [tagline, setTagline] = useState('Grow Your Business With Next-Gen AI Automation');
  const [ownerName, setOwnerName] = useState('Ravindra Borchate');
  const [phone, setPhone] = useState('+91 9876543210');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1424] text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Floating Control Bar for Quick Editing */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold tracking-wide text-sm text-emerald-400">PRO AI SITE BUILDER</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold px-4 py-1.5 rounded-lg text-xs transition-all shadow-lg"
        >
          {isEditing ? '💾 Save Changes' : '✏️ Quick Edit Mode'}
        </button>
      </div>

      {/* Hero Section - Bold & Professional Agency Style */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
          🚀 Next-Gen Enterprise Solution
        </div>

        {/* Editable Business Name / Title */}
        {isEditing ? (
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="text-4xl md:text-6xl font-black bg-slate-800 border border-emerald-500 text-center w-full p-2 rounded-xl mb-4 focus:outline-none"
          />
        ) : (
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
            {businessName}
          </h1>
        )}

        {/* Editable Tagline */}
        {isEditing ? (
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="text-lg md:text-xl text-slate-300 bg-slate-800 border border-emerald-500 text-center w-full p-2 rounded-xl mb-8 focus:outline-none"
          />
        ) : (
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
            {tagline}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <span>💬 Chat on WhatsApp</span>
          </a>
          <div className="border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold px-8 py-4 rounded-xl text-base transition-all flex items-center justify-center">
            📞 {phone}
          </div>
        </div>
      </section>

      {/* Founder / Owner Info Card */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-3xl font-bold text-emerald-400">
            {ownerName.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Created By</h3>
            {isEditing ? (
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="text-2xl font-bold bg-slate-800 border border-emerald-500 p-1 rounded w-full mb-2"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white mb-2">{ownerName}</h2>
            )}
            <p className="text-slate-400 text-sm">
              Digital Marketing Consultant & Business Coach helping local enterprises scale using automated AI systems.
            </p>
          </div>
          {isEditing && (
            <div className="w-full md:w-auto">
              <label className="text-xs text-slate-400 block mb-1">Phone Number:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-slate-800 border border-emerald-500 p-2 rounded text-sm w-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-20 py-8 text-center text-xs text-slate-500">
        <p>© 2026 {businessName}. Powered by Enterprise AI CRM.</p>
      </footer>
    </div>
  );
}