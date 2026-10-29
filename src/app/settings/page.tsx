'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { CreditCard, CheckCircle, ShieldCheck, MessageSquare, Zap, Lock } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SettingsAndBillingPage() {
  const [orgName, setOrgName] = useState('माझा बिझनेस');
  const [phoneId, setPhoneId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [subscribing, setSubscribing] = useState(false);

  const handlePayment = async () => {
    setSubscribing(true);
    try {
      const res = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: plan,
        }),
      });

      const data = await res.json();
      
      if (!data.success || !data.order) {
        alert('ऑर्डर त्रुटी: ' + (data.error || 'अवैध API Keys'));
        setSubscribing(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: 'INR',
        name: 'AI Growth CRM',
        description: `${plan === 'yearly' ? 'Yearly' : 'Monthly'} Subscription Plan`,
        order_id: data.order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planType: plan,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert('अभिनंदन! तुमचे सबस्क्रिप्शन यशस्वीरीत्या सक्रिय झाले आहे.');
          } else {
            alert('पेमेंट पडताळणी त्रुटी: ' + verifyData.error);
          }
        },
        modal: {
          ondismiss: function () {
            setSubscribing(false);
          },
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert('Network Error: ' + err.message);
    } finally {
      setSubscribing(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setStatusMsg('सेटिंग्ज यशस्वीरीत्या सेव्ह झाल्या आहेत!');
      setTimeout(() => setStatusMsg(''), 4000);
    }, 1000);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="min-h-screen bg-[#0a0d14] text-white p-6 md:p-12 font-sans">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">खाते आणि सबस्क्रिप्शन सेटिंग्ज</h1>
            <p className="text-sm text-gray-400 mt-1">तुमचा SaaS प्लॅन, बिलिंग आणि WhatsApp ऑटोमेशन नियंत्रित करा.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* WhatsApp API Setup */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">WhatsApp API इंटिग्रेशन</h2>
                  <p className="text-xs text-gray-400">क्लायंटचे Meta क्रेडेन्शियल्स कनेक्ट करा</p>
                </div>
              </div>

              {statusMsg && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle size={14} /> {statusMsg}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-left text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">बिझनेस / ब्रँडचे नाव</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">WhatsApp Phone Number ID</label>
                  <input
                    type="text"
                    value={phoneId}
                    onChange={(e) => setPhoneId(e.target.value)}
                    placeholder="उदा. 1230282856843762"
                    className="w-full bg-black/60 border border-gray-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Meta Access Token</label>
                  <textarea
                    rows={3}
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="तुमचा Meta Access Token इथे टाका..."
                    className="w-full bg-black/60 border border-gray-800 rounded-xl p-3 text-white focus:border-emerald-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <ShieldCheck size={16} />
                  <span>{saving ? 'सेव्ह होत आहे...' : 'WhatsApp खात्याशी जोडा'}</span>
                </button>
              </form>
            </div>

            {/* Razorpay Subscription */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">CRM सबस्क्रिप्शन प्लॅन</h2>
                    <p className="text-xs text-gray-400">तुमचा ॲक्टिव्ह प्लॅन निवडा व रिन्यू करा</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPlan('monthly')}
                    className={`p-4 rounded-2xl border text-left transition ${
                      plan === 'monthly'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <span className="text-xs font-semibold block">मंथली प्लॅन</span>
                    <span className="text-lg font-black text-white">₹१,९९९</span>
                    <span className="text-[10px] text-gray-400 block">/ दर महिना</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlan('yearly')}
                    className={`p-4 rounded-2xl border text-left transition ${
                      plan === 'yearly'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <span className="text-xs font-semibold block text-emerald-400">इयरली (२ महिने मोफत)</span>
                    <span className="text-lg font-black text-white">₹१९,९९९</span>
                    <span className="text-[10px] text-gray-400 block">/ वर्ष</span>
                  </button>
                </div>

                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" /> अमर्यादित Meta & Website Leads
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" /> रिअल-टाईम WhatsApp ऑटो-रिस्पॉन्स
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" /> रिअल-टाईम ऑडिओ CRM अलर्ट्स
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={subscribing}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs rounded-xl transition shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <Lock size={14} />
                <span>{subscribing ? 'लोड होत आहे...' : 'सबस्क्रिप्शन सुरू करा'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}