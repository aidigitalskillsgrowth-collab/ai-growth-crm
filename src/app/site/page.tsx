'use client';

import React, { useState } from 'react';

export default function PublicLandingPage() {
  const [promptText, setPromptText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [generatedSites, setGeneratedSites] = useState<any[]>([]);
  const [businessName, setBusinessName] = useState('Ishwari Digital CRM');
  const [tagline, setTagline] = useState('Grow Your Business With Next-Gen AI Automation');
  const [ownerName, setOwnerName] = useState('Ravindra Borchate');
  const [phone, setPhone] = useState('+91 9876543210');
  const [isEditing, setIsEditing] = useState(false);

  // Fixed Robust Voice Input Handler
  const startListening = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech recognition is not supported in this browser. Please type directly.');
        return;
      }

      if (isListening) {
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setPromptText(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning/error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Speech error:', error);
      setIsListening(false);
      alert('Microphone activation failed. Please check browser permissions.');
    }
  };

  // Fixed Direct Generation Handler
  const handleGenerateWebsite = () => {
    if (!promptText.trim()) {
      alert('कृपया आधी काहीतरी प्रॉम्प्ट टाईप करा किंवा बोला!');
      return;
    }

    setBusinessName(promptText);
    alert('🎉 Website generated successfully with your prompt!');
  };

  return (
    <div className="min-h-screen bg-[#0d1424] text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Floating Control Bar */}
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

      {/* AI Prompt & Voice Input Section */}
      <section className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl md:text-3xl font-black mb-4 text-emerald-400">Build Your Professional AI Website</h2>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center shadow-xl">
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Type your business description or click mic to speak..."
            className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-white focus:outline-none focus:border-emerald-500 w-full text-sm"
          />
          <button
            onClick={startListening}
            className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
            }`}
          >
            {isListening ? '🔴 Listening...' : '🎤 Speak'}
          </button>
          <button
            onClick={handleGenerateWebsite}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow-lg w-full md:w-auto cursor-pointer"
          >
            🚀 Generate Website
          </button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
          🚀 Next-Gen Enterprise Solution
        </div>

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

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span>💬 Chat on WhatsApp</span>
          </a>
          <div className="border border-slate-700 text-slate-300 font-semibold px-8 py-4 rounded-xl text-base flex items-center justify-center">
            📞 {phone}
          </div>
        </div>
      </section>

      {/* Founder Info Card */}
      <section className="max-w-4xl mx-auto px-6 py-8">
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