'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, MessageSquare, Star, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const presetTemplates: Record<string, any> = {
  mobile: {
    businessName: 'ईश्वरी मोबाईल & ५G स्मार्ट गॅलरी',
    tagline: 'स्मार्टफोन्स, ॲक्सेसरीज आणि इन्स्टंट रिपेअरिंग',
    headline: 'नवीन 5G स्मार्टफोन्सवर मिळवा थेट २०% सूट आणि ०% EMI!',
    subheadline: 'iPhone, OnePlus, Samsung चे सर्व मॉडेल्स सर्वोत्तम किमतीत उपलब्ध. सोबत फ्री गिफ्ट्स आणि १ वर्षाची वॉरंटी.',
    heroImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    primaryCta: 'ऑफर क्लेम करा',
    phone: '9876543210',
    address: 'कॉलेज रोड, ईश्वरी टॉवर, सांगली',
    timing: 'सकाळी १०:०० ते रात्री १०:००',
    services: [
      { title: 'नवीन 5G स्मार्टफोन्स विक्री', desc: 'सर्व ब्रँड्सचे ओरिजिनल मोबाईल 0% EMI वर उपलब्ध.', price: '₹९,९९९ पासून' },
      { title: '३० मिनिटांत स्क्रीन रिपेअर', desc: 'ओरिजिनल डिस्प्ले, बॅटरी बदलणे आणि मदरबोर्ड दुरुस्ती.', price: '₹४९९ पासून' },
      { title: 'मोबाईल एक्सचेंज महामेळावा', desc: 'जुना फोन आणा आणि नवीन फोनवर सर्वोत्तम किंमत मिळवा.', price: 'सर्वोत्तम एक्सचेंज प्राईस' }
    ],
    stats: [{ label: 'हॅपी ग्राहक', value: '२५,०००+' }, { label: 'फोन रिपेअर झाले', value: '८,०००+' }, { label: 'विश्वासार्हता', value: '१००%' }],
    testimonials: [
      { name: 'सचिन कांबळे', review: 'माझ्या iPhone चा डिस्प्ले ३० मिनिटांत ओरिजिनल बदलून दिला. खूपच प्रामाणिक सेवा!', rating: 5 },
      { name: 'अमित देशमुख', review: 'दुसऱ्या दुकानांपेक्षा इथे मोबाईलवर ₹२,००० कमी भाव मिळाला. थँक्स ईश्वरी मोबाईल!', rating: 5 }
    ]
  },
  doctor: {
    businessName: 'संजीवनी मल्टिस्पेशालिटी क्लिनिक',
    tagline: 'विश्वासार्ह दंत व आरोग्य चिकित्सा केंद्र',
    headline: 'तुमच्या आणि कुटुंबाच्या आरोग्याची संपूर्ण काळजी - तज्ज्ञ डॉक्टरांकडून',
    subheadline: 'आधुनिक लेझर तंत्रज्ञान, वेदनाविरहित उपचार आणि १०+ वर्षांचा प्रदीर्घ अनुभव. आजच तुमची अपॉइंटमेंट बुक करा.',
    heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
    primaryCta: 'बुक करा अपॉइंटमेंट',
    phone: '9876543210',
    address: 'स्टेशन रोड, मुख्य चौक, सांगली',
    timing: 'सकाळी ९:०० ते रात्री ९:००',
    services: [
      { title: 'रूट कॅनल आणि दातांचे उपचार', desc: 'लेझर तंत्रज्ञानाने वेदनाविरहित दातांचे उपचार व इम्प्लांट.', price: '₹१,५०० पासून' },
      { title: 'ऑर्थोपेडिक व हाडांची काळजी', desc: 'सांधेदुखी, फ्रॅक्चर आणि मणक्याच्या आजारांवर तज्ज्ञ उपचार.', price: '₹८०० पासून' },
      { title: 'पूर्ण बॉडी चेकअप पॅकेजेस', desc: 'रक्त तपासणी, ईसीजी आणि संपूर्ण शरीराची आरोग्य तपासणी.', price: '₹२,९९९ पासून' }
    ],
    stats: [{ label: 'समाधानी रुग्ण', value: '१०,०००+' }, { label: 'यशस्वी शस्त्रक्रिया', value: '१,५००+' }, { label: 'गुगल रेटिंग', value: '४.९ ★' }],
    testimonials: [
      { name: 'रविराज पाटील', review: 'दातांचे रूट कॅनल अजिबात दुखले नाही. डॉक्टरांचे बोलणे आणि सेवा खूपच नम्र आहे.', rating: 5 },
      { name: 'प्रियांका शिंदे', review: 'माझ्या आईच्या गुडघेदुखीवर इथे खूप चांगला फरक पडला. १००% विश्वासार्ह क्लिनिक!', rating: 5 }
    ]
  }
};

function SiteComponent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams ? searchParams.get('type') || 'mobile' : 'mobile';

  const [site, setSite] = useState<any>(presetTemplates[typeParam] || presetTemplates.mobile);

  useEffect(() => {
    if (presetTemplates[typeParam]) {
      setSite(presetTemplates[typeParam]);
    }
  }, [typeParam]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans antialiased">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#0c1222]/95 backdrop-blur-md border-b border-slate-800 px-5 lg:px-12 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/25">
            {site.businessName?.charAt(0) || 'E'}
          </div>
          <div>
            <h1 className="font-black text-white text-sm lg:text-base leading-tight">{site.businessName}</h1>
            <span className="text-[10px] text-blue-400 font-semibold">{site.tagline}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href={`tel:${site.phone}`} className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs transition">
            <Phone size={13} className="text-blue-400" /> +91 {site.phone}
          </a>
          <a href={`https://wa.me/91${site.phone}?text=${encodeURIComponent(`नमस्कार ${site.businessName}, मला अधिक माहिती हवी आहे.`)}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition">
            <MessageSquare size={13} /> WhatsApp
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-5 lg:px-12 py-12 lg:py-20 bg-gradient-to-b from-[#0c1324] via-[#080d1a] to-[#07090e] border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block px-3.5 py-1 bg-blue-950/80 border border-blue-500/40 rounded-full text-blue-400 text-xs font-bold shadow-sm">
              ★ अधिकृत & प्रमाणित केंद्र
            </span>
            <h2 className="text-2xl lg:text-4xl font-black text-white leading-tight">
              {site.headline}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              {site.subheadline}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={`https://wa.me/91${site.phone}?text=${encodeURIComponent(`नमस्कार, मला ${site.primaryCta} करायचे आहे.`)}`} target="_blank" rel="noreferrer" className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold rounded-2xl text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition">
                <span>{site.primaryCta}</span>
                <ArrowRight size={16} />
              </a>
              <a href={`tel:${site.phone}`} className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-2xl text-sm flex items-center gap-2 transition">
                <Phone size={15} className="text-emerald-400" />
                <span>थेट कॉल करा</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl group">
              <img src={site.heroImage} alt={site.businessName} className="w-full h-72 lg:h-80 object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/60 text-center">
                <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={14} /> १००% गुणवत्ता व समाधान
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      {site.services && (
        <section className="px-5 lg:px-12 py-16 max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">आमच्या प्रमुख सेवा</span>
            <h3 className="text-2xl font-black text-white">आम्ही देतो सर्वोत्तम सुविधा</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {site.services.map((srv: any, idx: number) => (
              <div key={idx} className="p-6 bg-[#0d1424] border border-slate-800 rounded-3xl space-y-3 shadow-xl hover:border-blue-500/50 transition">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-white text-base">{srv.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{srv.desc}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-sm font-black text-emerald-400">{srv.price}</span>
                  <a href={`https://wa.me/91${site.phone}?text=${encodeURIComponent(`मला ${srv.title} बद्दल माहिती हवी आहे.`)}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                    चौकशी करा <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-[#03050a] border-t border-slate-800/80 px-5 lg:px-12 py-10 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-2">
            <h4 className="font-black text-white text-base">{site.businessName}</h4>
            <p className="text-xs text-slate-400">{site.tagline}</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[11px]">पत्ता आणि वेळ</h5>
            <p className="flex items-center gap-2"><MapPin size={13} className="text-rose-400 shrink-0" /> {site.address}</p>
            <p className="flex items-center gap-2"><Clock size={13} className="text-blue-400 shrink-0" /> {site.timing}</p>
          </div>
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase text-[11px]">थेट संपर्क</h5>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-2"><Phone size={13} /> +91 {site.phone}</p>
            <p className="text-[11px] text-slate-500 pt-2">© 2026 {site.businessName}. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PublicLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center font-bold">लोड होत आहे...</div>}>
      <SiteComponent />
    </Suspense>
  );
}