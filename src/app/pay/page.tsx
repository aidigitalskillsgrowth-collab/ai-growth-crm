'use client';

import React, { useEffect, useState } from 'react';

export default function PayClientPage() {
  const [pa, setPa] = useState('ishwarimobile@ibl');
  const [pn, setPn] = useState('Ishwari Mobile');
  const [am, setAm] = useState('999');
  const [tn, setTn] = useState('CRM Payment');
  const [cname, setCname] = useState('Customer');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('pa')) setPa(params.get('pa')!);
      if (params.get('pn')) setPn(params.get('pn')!);
      if (params.get('am')) setAm(params.get('am')!);
      if (params.get('tn')) setTn(params.get('tn')!);
      if (params.get('cname')) setCname(params.get('cname')!);
    }
  }, []);

  const upiIntent = `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}&mode=02&purpose=00`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(upiIntent)}`;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#0d1424] border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-6">
        
        <div className="space-y-1 border-b border-slate-800/80 pb-4">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">सुरक्षित UPI पेमेंट</span>
          <h1 className="text-xl font-black text-white">{pn}</h1>
          <p className="text-xs text-slate-400">ग्राहक: <span className="text-slate-200 font-semibold">{cname}</span></p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-400">भरण्याची एकूण रक्कम</span>
          <div className="text-4xl font-black text-emerald-400">₹{am}</div>
          <p className="text-xs text-slate-400 italic">कारण: {tn}</p>
        </div>

        {/* Big Mobile 1-Click Pay Buttons */}
        <div className="space-y-2 pt-2">
          <a
            href={upiIntent}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 text-sm transition"
          >
            <span>📱 एका क्लिकवर ॲपमध्ये उघडा (PhonePe / GPay / Paytm)</span>
          </a>
        </div>

        {/* QR Code fallback for Desktop / Other Phone */}
        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          <p className="text-xs text-slate-400">किंवा कोणत्याही UPI ॲपने हा QR कोड स्कॅन करा:</p>
          <div className="inline-block p-3 bg-white rounded-2xl shadow-xl">
            <img src={qrUrl} alt="UPI QR" className="w-44 h-44 block rounded-lg mx-auto" />
          </div>
          <p className="text-[11px] text-slate-500 font-mono">UPI ID: {pa}</p>
        </div>

        <div className="text-[11px] text-slate-500">
          🔒 100% सुरक्षित NPCI UPI पेमेंट
        </div>

      </div>
    </div>
  );
}
