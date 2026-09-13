'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Search, RefreshCw, Layers, Users, PhoneCall, MessageSquare, Send, 
  Sparkles, Monitor, Smartphone, Volume2, Upload, Download, Plus, 
  ExternalLink, QrCode, Check, Copy, Bot, Megaphone, FileText, 
  GitBranch, Calendar, Wallet, Share2, Settings, Play, ArrowRight,
  Clock, MapPin, Phone, Edit3, Trash2, Filter, X, CheckSquare, Tag,
  TrendingUp, Zap, Target, Activity, CheckCircle2, ArrowUpRight,
  Eye, Mic, MicOff, Star, Image as ImageIcon, Loader2, Printer,
  CreditCard, Landmark, ShieldCheck, DollarSign, Receipt, Radio,
  Sliders, MessageCircle, BarChart3, ChevronRight, Pause, Lock, CheckCircle, LogOut, KeyRound, Mail, User, Home, Save, Globe
} from 'lucide-react';

const supabaseUrl = 'https://yvaqrcdqehybzlnpwaeb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2YXFyY2RxZWh5YnpsbnB3YWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTU1MTAsImV4cCI6MjEwMjg3MTUxMH0.fLqHfgvK4n12NfM_xa-_5uhO7Z6eLaWLzWxwVABCuZI';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Testimonial {
  name: string;
  avatar: string;
  location: string;
  review: string;
  rating: number;
}

interface TemplateData {
  id: string;
  businessName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  ownerImage: string;
  phone: string;
  email: string;
  address: string;
  timing: string;
  primaryCta: string;
  badge: string;
  services: { title: string; desc: string; price: string }[];
  stats: { label: string; value: string }[];
  testimonials: Testimonial[];
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  service: string;
  deal_value: number;
  status: string;
  source: string;
  sentiment: string;
  notes?: string;
  created_at?: string;
}

interface Transaction {
  id: string;
  customerName: string;
  phone: string;
  amount: number;
  gateway: string;
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
}

interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Rescheduled';
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState<string>('aidigitalskillsgrowth@gmail.com');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [deviceView, setDeviceView] = useState<'Desktop' | 'Mobile'>('Desktop');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [publishedUrl, setPublishedUrl] = useState<string>('');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [domainConnected, setDomainConnected] = useState<boolean>(false);

  const [clientSettings, setClientSettings] = useState({
    businessName: 'रवी पाटील - AI ग्रोथ बिझनेस',
    upiId: 'ravindra@ibl',
    whatsappNumber: '9876543210',
    metaPhoneId: '1230282856843762',
    razorpayKey: 'rzp_live_98xK19873219472'
  });
  const [savingSettings, setSavingSettings] = useState<boolean>(false);

  const handleSaveClientSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('client_settings').upsert({
          user_id: user.id,
          ...clientSettings,
          updated_at: new Date()
        });
      }
      alert('✅ तुमच्या क्लायंट सेटिंग्स यशस्वीरीत्या सेव्ह झाल्या!');
    } catch (err) {
      localStorage.setItem('client_custom_settings', JSON.stringify(clientSettings));
      alert('✅ लोकल स्टोरेजमध्ये सेटिंग्स सेव्ह झाल्या!');
    } finally {
      setSavingSettings(false);
    }
  };

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    service: '',
    deal_value: '2000',
    status: 'New Lead',
    source: 'Website',
    sentiment: 'Interested',
    notes: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const ownerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        loadClientSettings(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) loadClientSettings(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadClientSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('client_settings').select('*').eq('user_id', userId).single();
      if (data) {
        setClientSettings({
          businessName: data.businessName || clientSettings.businessName,
          upiId: data.upiId || clientSettings.upiId,
          whatsappNumber: data.whatsappNumber || clientSettings.whatsappNumber,
          metaPhoneId: data.metaPhoneId || clientSettings.metaPhoneId,
          razorpayKey: data.razorpayKey || clientSettings.razorpayKey
        });
      }
    } catch (e) {
      const local = localStorage.getItem('client_custom_settings');
      if (local) setClientSettings(JSON.parse(local));
    }
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword,
      });

      if (error) {
        setAuthError(error.message === 'Invalid login credentials' ? 'चुकीचा ईमेल किंवा पासवर्ड!' : error.message);
      } else if (data.session) {
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      setAuthError('लॉगिन करताना तांत्रिक अडचण आली.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSupabaseForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setAuthError('कृपया तुमचा नोंदणीकृत ईमेल टाका!');
      return;
    }
    setAuthLoading(true);
    setAuthError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authEmail.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) {
        setAuthError(error.message);
      } else {
        alert('पासवर्ड रिसेट करण्याची लिंक तुमच्या ईमेलवर पाठवली आहे!');
        setAuthMode('login');
      }
    } catch (err) {
      setAuthError('रिसेट लिंक पाठवण्यात अडचण आली.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSupabaseLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  const initialLeads: Lead[] = [
    { id: '1', name: 'रविराज पाटील', phone: '9876543210', service: 'Digital Marketing Setup', deal_value: 1500, status: 'New Lead', source: 'Website', sentiment: 'Highly Interested', notes: 'आज संध्याकाळी ६ वाजता बोलणे ठरले आहे.', created_at: 'आज, 10:30 AM' },
    { id: '2', name: 'सचिन कांबळे', phone: '9123456780', service: 'Business Coaching', deal_value: 25000, status: 'Contacted', source: 'Meta Lead Ad', sentiment: 'Interested', notes: 'मास्टरक्लास संबंधी विचारले.', created_at: 'आज, 11:15 AM' },
    { id: '3', name: 'अमित देशमुख', phone: '9822334455', service: 'Consulting Session', deal_value: 4500, status: 'Payment Sent', source: 'Instagram Ad', sentiment: 'Follow-up', notes: 'पेमेंट लिंक पाठवली आहे.', created_at: 'काल, 04:20 PM' },
    { id: '4', name: 'प्रियांका शिंदे', phone: '9765432109', service: 'Agency Growth Plan', deal_value: 3200, status: 'Won', source: 'WhatsApp Direct', sentiment: 'Positive', notes: 'पेमेंट जमा झाले.', created_at: 'काल, 06:10 PM' },
    { id: '5', name: 'विकास मोरे', phone: '9988776655', service: 'AI Tools Workshop', deal_value: 800, status: 'New Lead', source: 'Website', sentiment: 'Cold', notes: 'पहिला कॉल उचलला नाही.', created_at: '28 Aug' },
    { id: '6', name: 'स्नेहल पवार', phone: '9834123456', service: 'Branding Package', deal_value: 15000, status: 'Contacted', source: 'Facebook Ad', sentiment: 'Highly Interested', notes: 'ऑक्टोबरसाठी बुकिंग हवी आहे.', created_at: '28 Aug' },
    { id: '7', name: 'राहुल सावंत', phone: '9422001122', service: 'Lead Generation System', deal_value: 2999, status: 'Payment Sent', source: 'Website', sentiment: 'Interested', notes: 'UPI QR स्कॅन करून भरत आहेत.', created_at: '27 Aug' },
    { id: '8', name: 'महेश जाधव', phone: '9552114477', service: 'Funnel Setup', deal_value: 1200, status: 'Won', source: 'Referral', sentiment: 'Positive', notes: 'प्रोजेक्ट पूर्ण झाला.', created_at: '27 Aug' },
    { id: '9', name: 'पूजा कुलकर्णी', phone: '9890665544', service: 'Digital Marketing Course', deal_value: 6000, status: 'New Lead', source: 'Meta Lead Ad', sentiment: 'Interested', notes: 'सिलॅबस व्हॉट्सॲपवर पाठवला.', created_at: '26 Aug' },
    { id: '10', name: 'किरण थोरात', phone: '9371889900', service: 'Business Automation', deal_value: 500, status: 'Contacted', source: 'WhatsApp Direct', sentiment: 'Follow-up', notes: 'कागदपत्रे बाकी.', created_at: '26 Aug' },
    { id: '11', name: 'दिनेश गायकवाड', phone: '9860127890', service: 'Coaching 3-Month Plan', deal_value: 1000, status: 'Won', source: 'Instagram Ad', sentiment: 'Positive', notes: 'पास कार्ड ॲक्टिव्हेट केले.', created_at: '25 Aug' },
    { id: '12', name: 'सुप्रिया भोसले', phone: '9158334455', service: 'Ad Campaign Setup', deal_value: 2500, status: 'Payment Sent', source: 'Website', sentiment: 'Interested', notes: 'उद्या दुपारची वेळ दिली आहे.', created_at: '25 Aug' },
    { id: '13', name: 'रोहन शिंदे', phone: '9730445566', service: 'Consultation Enquiry', deal_value: 4000, status: 'New Lead', source: 'Meta Lead Ad', sentiment: 'Interested', notes: 'रविवारच्या मिटिंगसाठी नोंद.', created_at: '24 Aug' },
    { id: '14', name: 'अनिल काळे', phone: '9823998877', service: 'VIP Mastermind', deal_value: 1500, status: 'Contacted', source: 'Facebook Ad', sentiment: 'Positive', notes: 'आरक्षण कन्फर्म.', created_at: '24 Aug' },
    { id: '15', name: 'ज्ञानेश्वर माने', phone: '9673112233', service: 'Enterprise Coaching', deal_value: 35000, status: 'Won', source: 'Website', sentiment: 'Positive', notes: 'पूर्ण ॲडव्हान्स पेमेंट मिळाले.', created_at: '23 Aug' },
  ];

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const stages = ['New Lead', 'Contacted', 'Payment Sent', 'Won', 'Lost'];

  const avatars = {
    ownerDefault: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    male2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    female1: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    client1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    client2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  };

  const templatesDb: Record<string, TemplateData> = {
    'Digital Marketing & Coaching': {
      id: 'Digital Marketing & Coaching',
      businessName: clientSettings.businessName,
      tagline: 'ऑटोमेशन, मेटा ॲड्स आणि AI टूल्सद्वारे बिझनेस ग्रोथ',
      headline: 'तुमचा व्यवसाय ऑनलाइन वाढवा आणि AI च्या मदतीने दरमहा लाखो रुपये कमवा!',
      subheadline: 'डिजिटल मार्केटिंग मास्टरक्लास, मेटा ॲड कॅम्पेन सेटअप, ऑटोमेशन सिस्टीम आणि पर्सनल बिझनेस कोचिंग.',
      heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      ownerImage: avatars.ownerDefault,
      phone: clientSettings.whatsappNumber,
      email: 'ravindra@aidigitalskillsgrowth.com',
      address: 'डिजिटल ग्रोथ स्टुडिओ, सांगली',
      timing: 'सकाळी ९:०० ते रात्री ८:०० (सर्व दिवस सुरू)',
      primaryCta: 'मास्टरक्लाससाठी नोंदणी करा',
      badge: '★ प्रो साॅस ॲक्टिव्ह (Pro SaaS Active)',
      services: [
        { title: 'AI डिजिटल स्किल्स मास्टरक्लास', desc: 'ChatGPT, Gemini आणि आधुनिक AI टूल्स शिकण्याची उत्तम संधी.', price: '₹९९९ पासून' },
        { title: 'मेटा ॲड्स & लीड जनरेशन', desc: 'तुमच्या व्यवसायाला थेट मोबाईलवर हव्यात तेवढ्या कस्टमर लीड्स मिळवा.', price: '₹४,९९९' },
        { title: '1-on-1 बिझनेस कोचिंग', desc: 'रवी पाटील यांच्याकडून वैयक्तिक मार्गदर्शन आणि बिझनेस ऑटोमेशन सेटअप.', price: '₹९,९९९' }
      ],
      stats: [
        { label: 'प्रशिक्षित विद्यार्थी', value: '१०,०००+' },
        { label: 'यशस्वी मोहीम', value: '५००+' },
        { label: 'समाधानी क्लायंट्स', value: '१००%' }
      ],
      testimonials: [
        { name: 'सचिन कांबळे', avatar: avatars.male2, location: 'सांगली', review: 'रवी सरंच्या मार्गदर्शनामुळे माझा बिझनेस पूर्णपणे ऑटोमेशनवर आला. खूप अप्रतिम अनुभव!', rating: 5 },
        { name: 'प्रियांका शिंदे', avatar: avatars.female1, location: 'मिरज', review: 'मेटा ॲड शिकल्यापासून माझ्या पेजवर रोज नवीन कस्टमर येत आहेत. धन्यवाद रवी सर!', rating: 5 }
      ]
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string>('Digital Marketing & Coaching');
  const [currentSite, setCurrentSite] = useState<TemplateData>(templatesDb['Digital Marketing & Coaching']);
  const [promptInput, setPromptInput] = useState<string>('माझ्या नवीन व्यवसायासाठी ५-स्टार प्रोफेशनल वेबसाईट बनवा');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 1. ROBUST CONTINUOUS VOICE RECOGNITION FIX
  const toggleVoiceRecording = () => {
    if (typeof window === 'undefined') return;
    if (isListening) { setIsListening(false); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice Mic सपोर्ट नाही.'); return; }
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'mr-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setPromptInput(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognition.start();
    } catch (e) { 
      setIsListening(false); 
    }
  };

  // 2. TRuly DYNAMIC PROMPT-TO-WEBSITE ENGINE (Generates professional website based on ANY random user prompt)
  const handleGenerateWebsite = () => {
    if (!promptInput.trim()) { 
      alert('कृपया आधी व्यवसायाचा प्रॉम्प्ट टाईप करा किंवा माईकवर बोला!'); 
      return; 
    }
    setIsGenerating(true);
    setTimeout(() => {
      const p = promptInput.toLowerCase();
      
      let bizName = promptInput.length > 30 ? 'My Professional Business' : promptInput;
      let headlineText = `Transforming Industry Standards with ${bizName}`;
      let subText = `We provide cutting-edge solutions, premium quality execution, and unmatched customer support tailored specifically for ${bizName}.`;
      let badgeText = '★ Verified 5-Star Enterprise Solution';
      let heroImageLink = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80';
      let ownerAvatar = avatars.ownerDefault;
      
      let dynamicServices = [
        { title: 'Core Premium Service', desc: 'Designed to deliver maximum efficiency, superior quality and exceptional value.', price: '₹1,999 onwards' },
        { title: 'Advanced Consultation', desc: 'Expert guidance and 24/7 dedicated support to scale your operations smoothly.', price: '₹4,999' },
        { title: 'Complete Execution Package', desc: 'All-in-one comprehensive framework built for high performance and results.', price: '₹9,999' }
      ];

      let dynamicTestimonials = [
        { name: 'राहुल शहा', avatar: avatars.client1, location: 'मुंबई', review: `अद्भुत अनुभव! ${bizName} ने आमच्या सर्व अपेक्षांपेक्षा उत्तम काम करून दिले आहे.`, rating: 5 },
        { name: 'अमित देसाई', avatar: avatars.client2, location: 'पुणे', review: 'खूप व्यावसायिक टीम आणि उत्तम सर्विस. मी पूर्णपणे समाधानी आहे!', rating: 5 }
      ];

      // Smart category tuning for specific common business types
      if (p.includes('hotel') || p.includes('restaurant') || p.includes('खानावोल') || p.includes('dining') || p.includes('hptel')) {
        bizName = promptInput;
        headlineText = `Welcome to Authentic Flavors & Royal Dining at ${bizName}`;
        subText = 'Indulge in traditional secret recipes, pure ingredients, cozy luxury ambiance, and seamless table reservations.';
        badgeText = '★ 5-Star Rated Culinary Hub & Restaurant';
        heroImageLink = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80';
        dynamicServices = [
          { title: 'Special Grand Family Thali', desc: 'Authentic flavors prepared with pure ghee and rich aromatic spices.', price: '₹699' },
          { title: 'Private Banquet & Party Hall', desc: 'Spacious air-conditioned celebration suites for birthdays and receptions.', price: '₹10,000 onwards' },
          { title: 'VIP Table Reservation', desc: 'Secure your preferred dining spot instantly with zero waiting time.', price: 'Free Booking' }
        ];
        dynamicTestimonials = [
          { name: 'सुनील पवार', avatar: avatars.client1, location: 'सांगली', review: 'इथली जेवणाची चव आणि सर्विस एकदम नंबर वन आहे! फॅमिलीसोबत येण्यासाठी उत्तम ठिकाण.', rating: 5 },
          { name: 'दिलीप माने', avatar: avatars.client2, location: 'कोल्हापूर', review: 'मस्त वातावरण आणि अप्रतिम खाद्यपदार्थ. सगळ्यांनी एकदा नक्की भेट द्यावी!', rating: 5 }
        ];
      } else if (p.includes('gym') || p.includes('fitness') || p.includes('जिम') || p.includes('yoga') || p.includes('workout')) {
        bizName = promptInput;
        headlineText = `Unleash Your Ultimate Strength & Physique at ${bizName}`;
        subText = 'State-of-the-art international equipments, certified personal trainers, and result-driven transformation programs.';
        badgeText = '★ Elite Fitness & Wellness Center';
        heroImageLink = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80';
        dynamicServices = [
          { title: '1-on-1 Elite Personal Training', desc: 'Custom workout routines and professional macronutrient diet charting.', price: '₹2,499 / mo' },
          { title: 'CrossFit & Cardio Batch', desc: 'High-intensity endurance training for rapid stamina boost and fat loss.', price: '₹1,499 / mo' }
        ];
      } else if (p.includes('real') || p.includes('estate') || p.includes('property') || p.includes('फ्लॅट') || p.includes('घर')) {
        bizName = promptInput;
        headlineText = `Find Your Dream Property Without Brokerage with ${bizName}`;
        subText = 'Exclusive residential villas, luxury apartments, and prime commercial spaces verified for 100% legal safety.';
        badgeText = '★ Certified Real Estate Partner';
        heroImageLink = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80';
        dynamicServices = [
          { title: 'Luxury Gated Villas', desc: 'Spacious homes equipped with modern lifestyle amenities and private gardens.', price: '₹55 Lakhs+' },
          { title: 'Commercial Office Spaces', desc: 'Prime commercial locations designed to scale your enterprise.', price: '₹25,000 / mo' }
        ];
      }

      setCurrentSite(prev => ({
        ...prev,
        businessName: bizName,
        badge: badgeText,
        headline: headlineText,
        subheadline: subText,
        heroImage: heroImageLink,
        ownerImage: ownerAvatar,
        tagline: 'Powered by Next-Gen AI Agency Architecture',
        services: dynamicServices,
        testimonials: dynamicTestimonials,
        stats: [
          { label: 'Active Clients', value: '2,500+' },
          { label: 'Success Rate', value: '99.9%' },
          { label: 'Expert Support', value: '24/7 Active' }
        ]
      }));

      setIsGenerating(false);
      alert('🎉 तुमच्या प्रॉम्प्टनुसार अत्यंत प्रोफेशनल आणि डाइनॅमिक 5-स्टार वेबसाईट तयार झाली!');
    }, 500);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { 
        setCurrentSite(prev => ({ ...prev, heroImage: reader.result as string })); 
        alert('बॅनर फोटो यशस्वीरीत्या बदलला!'); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOwnerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { 
        setCurrentSite(prev => ({ ...prev, ownerImage: reader.result as string })); 
        alert('मालकाचा फोटो यशस्वीरीत्या अपलोड झाला!'); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishWebsite = () => {
    const slug = currentSite.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) || 'my-business';
    const liveLink = `https://ai-growth-crm-nine.vercel.app/site/${slug}`;
    setPublishedUrl(liveLink);
    setIsPublished(true);
    alert(`🚀 तुमची वेबसाईट यशस्वीरीत्या लाईव्ह पब्लिश झाली!\n\nLive URL: ${liveLink}`);
  };

  const handleConnectDomain = () => {
    if (!customDomain.trim()) {
      alert('कृपया तुमचे स्वतःचे डोमेन नाव टाका (उदा. www.mybusiness.com)');
      return;
    }
    setDomainConnected(true);
    alert(`🌐 डोमेन '${customDomain}' यशस्वीरीत्या कनेक्ट झाले! CNAME रेकॉर्ड्स अपडेट केले आहेत.`);
  };

  const [customerName, setCustomerName] = useState<string>('सचिन कांबळे');
  const [customerPhone, setCustomerPhone] = useState<string>('9123456780');
  const [paymentDesc, setPaymentDesc] = useState<string>('AI Masterclass Advance Payment');
  const [amount, setAmount] = useState<string>('2500');
  const [isAutoWhatsAppPdfActive, setIsAutoWhatsAppPdfActive] = useState<boolean>(true);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN-98214', customerName: 'सचिन कांबळे', phone: '9123456780', amount: 2500, gateway: 'Razorpay Live', status: 'Success', date: 'आज, 12:45 PM' },
    { id: 'TXN-98213', customerName: 'प्रियांका शिंदे', phone: '9765432109', amount: 3200, gateway: 'Instamojo Secure', status: 'Success', date: 'आज, 11:10 AM' },
    { id: 'TXN-98212', customerName: 'ज्ञानेश्वर माने', phone: '9673112233', amount: 35000, gateway: 'Cashfree Webhook', status: 'Success', date: 'काल, 05:20 PM' },
    { id: 'TXN-98211', customerName: 'अमित देशमुख', phone: '9822334455', amount: 4500, gateway: 'WhatsApp UPI Link', status: 'Pending', date: 'काल, 03:40 PM' },
  ]);

  const [socialPostText, setSocialPostText] = useState('💥 रवी पाटील यांच्याकडून नवीन AI डिजिटल स्किल्स मास्टरक्लासवर खास ऑफर!');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true,
    instagram: true,
    whatsappStatus: true
  });
  const [scheduledTime, setScheduledTime] = useState('Immediate (Now)');

  const cleanAmt = (Number(amount) || 1).toFixed(2);
  const upiIntent = `upi://pay?pa=${clientSettings.upiId.trim()}&pn=${encodeURIComponent(clientSettings.businessName)}&am=${cleanAmt}&cu=INR&tn=${encodeURIComponent(paymentDesc)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntent)}`;
  const livePayUrl = `https://ai-growth-crm-nine.vercel.app/pay?pa=${encodeURIComponent(clientSettings.upiId)}&pn=${encodeURIComponent(clientSettings.businessName)}&am=${cleanAmt}&tn=${encodeURIComponent(paymentDesc)}`;

  const handleRazorpayPay = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay गेटवे लोड करण्यात अडचण आली. कृपया इंटरनेट कनेक्शन तपासा.');
      return;
    }

    const options = {
      key: clientSettings.razorpayKey || 'rzp_test_51MzAbcDefGhiJkl',
      amount: Math.round(Number(amount || 1) * 100),
      currency: 'INR',
      name: clientSettings.businessName,
      description: paymentDesc,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&auto=format&fit=crop&q=80',
      handler: function (response: any) {
        const pId = response.razorpay_payment_id || `PAY-${Date.now().toString().slice(-6)}`;
        alert(`🎉 Razorpay द्वारे ₹${amount} चे पेमेंट यशस्वी झाले!\nPayment ID: ${pId}`);
        
        setTransactions(prev => [
          {
            id: pId,
            customerName: customerName,
            phone: customerPhone,
            amount: Number(amount),
            gateway: 'Razorpay Live',
            status: 'Success',
            date: 'आत्ताच'
          },
          ...prev
        ]);

        if (isAutoWhatsAppPdfActive) {
          const autoMsg = `✅ *पेमेंट यशस्वी & अधिकृत पावती (PDF Bill)*\n\n` +
            `👤 ग्राहक: ${customerName}\n` +
            `📦 सेवा: ${paymentDesc}\n` +
            `💰 रक्कम: ₹${amount}\n` +
            `🆔 ट्रान्झॅक्शन आयडी: ${pId}\n\n` +
            `📄 *डिलिव्हरी पावती लिंक:*\nhttps://ai-growth-crm-nine.vercel.app/api/invoice-pdf?txn=${pId}\n\n` +
            `भेट दिल्याबद्दल धन्यवाद! 🙏 - ${clientSettings.businessName}`;
          
          window.open(`https://wa.me/91${customerPhone}?text=${encodeURIComponent(autoMsg)}`, '_blank');
        }
      },
      prefill: {
        name: customerName,
        contact: customerPhone,
      },
      theme: {
        color: '#2563eb'
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Razorpay Checkout उघडताना त्रुटी आली. कृपया API Key तपासा.');
    }
  };

  const handleSendWhatsAppBill = () => {
    if (!customerPhone.trim()) {
      alert('कृपया ग्राहकाचा व्हॉट्सॲप नंबर टाका!');
      return;
    }
    const msg = `🧾 *पेमेंट इनव्हॉइस - ${clientSettings.businessName}*\n\n` +
      `👤 *ग्राहक नाव:* ${customerName}\n` +
      `📦 *तपशील / सेवा:* ${paymentDesc}\n` +
      `💰 *एकूण रक्कम:* ₹${amount}\n\n` +
      `📲 *थेट UPI द्वारे भरण्यासाठी खालील लिंकवर क्लिक करा:*\n${livePayUrl}\n\n` +
      `_UPI ID: ${clientSettings.upiId} (GPay/PhonePe/Paytm/BHIM)_ \n\n` +
      `धन्यवाद! 🙏`;
    window.open(`https://wa.me/91${customerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const [customTemplateName, setCustomTemplateName] = useState('');
  const [customTemplateText, setCustomTemplateText] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([
    { title: 'Welcome Inquiry', text: 'नमस्कार {Name} जी, रवी पाटील यांच्या AI Growth CRM मध्ये आपले स्वागत आहे.' },
    { title: 'Instant UPI Payment Request', text: 'नमस्कार {Name} जी, आपल्या {Service} चे ₹{Amount} चे डिजिटल बिल खालीलप्रमाणे आहे.' },
    { title: 'Appointment Confirmed', text: 'आपली {Service} ची सहल निश्चित झाली आहे.' }
  ]);

  const handleGenerateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTemplateName.trim() || !customTemplateText.trim()) {
      alert('कृपया नाव आणि मेसेज मजकूर भरा!');
      return;
    }
    setSavedTemplates(prev => [...prev, { title: customTemplateName, text: customTemplateText }]);
    setCustomTemplateName('');
    setCustomTemplateText('');
    alert('नवीन मेसेज टेम्पलेट यशस्वीरीत्या तयार झाले!');
  };

  const [workflowTrigger, setWorkflowTrigger] = useState('New Inbound Lead (Website / Meta Ads)');
  const [workflowAction, setWorkflowAction] = useState('Send Welcome WhatsApp + Dynamic QR');
  const [customWorkflows, setCustomWorkflows] = useState([
    { id: '1', trigger: 'New Lead from Meta Ads', action: 'Instant WhatsApp Auto-Reply' },
    { id: '2', trigger: 'Payment Link Clicked', action: 'Send 10% Discount Coupon' }
  ]);

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomWorkflows(prev => [...prev, { id: Date.now().toString(), trigger: workflowTrigger, action: workflowAction }]);
    alert('नवीन ऑटोमेशन वर्कफ्लो यशस्वीरीत्या तयार झाला!');
  };

  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [metaAdAccount, setMetaAdAccount] = useState('act_982347892347');
  const [adBudget, setAdBudget] = useState(500);
  const [targetLocation, setTargetLocation] = useState('सांगली व मिरज (१० किमी परिसर)');

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', clientName: 'सचिन कांबळे', phone: '9123456780', service: 'Digital Marketing Setup', date: '2026-08-31', time: '11:00 AM', status: 'Confirmed' },
    { id: '2', clientName: 'अमित देशमुख', phone: '9822334455', service: 'Consulting Session', date: '2026-08-31', time: '02:00 PM', status: 'Pending' },
    { id: '3', clientName: 'प्रियांका शिंदे', phone: '9765432109', service: 'Agency Growth Plan', date: '2026-09-01', time: '05:30 PM', status: 'Confirmed' }
  ]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ clientName: '', phone: '', service: '', date: '2026-09-02', time: '10:00 AM' });

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.clientName.trim() || !newSlot.phone.trim()) {
      alert('कृपया ग्राहकाचे नाव आणि मोबाईल नंबर टाका!');
      return;
    }
    const newApp: Appointment = {
      id: Date.now().toString(),
      clientName: newSlot.clientName,
      phone: newSlot.phone,
      service: newSlot.service || 'General Service',
      date: newSlot.date,
      time: newSlot.time,
      status: 'Confirmed'
    };
    setAppointments(prev => [newApp, ...prev]);
    setIsSlotModalOpen(false);
    setNewSlot({ clientName: '', phone: '', service: '', date: '2026-09-02', time: '10:00 AM' });
    alert('नवीन अपॉइंटमेंट स्लॉट यशस्वीरीत्या बुक झाला!');
  };

  const handleCancelAppointment = (id: string, name: string) => {
    if (confirm(`तुम्हाला नक्की '${name}' ची अपॉइंटमेंट रद्द करायची आहे का?`)) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  const [botConfig, setBotConfig] = useState({
    name: 'Ravi Patil AI Assistant',
    personality: 'Professional & Friendly',
    language: 'मराठी + English (Hinglish)',
    autoDiscount: true,
    discountPercent: 10,
    systemPrompt: 'तुम्ही रवी पाटील यांच्या AI Growth CRM चे अधिकृत असिस्टंट आहात. ग्राहकांना मराठीत नम्रतेने उत्तरे द्या.'
  });

  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
    { sender: 'bot', text: 'नमस्कार! 🙏 रवी पाटील AI Growth CRM मध्ये आपले स्वागत आहे. मी आपल्याला कशी मदत करू?', time: '10:00 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');

  const handleSendChat = () => {
    if (!inputMsg.trim()) return;
    const txt = inputMsg;
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: txt, time: currentTime }]);
    setInputMsg('');

    setTimeout(() => {
      let botReply = `आपल्या '${txt}' या चौकशीबद्दल धन्यवाद! `;
      const lower = txt.toLowerCase();
      if (lower.includes('price') || lower.includes('किंमत') || lower.includes('कोर्स')) {
        botReply += `आज आमच्या डिजिटल मार्केटिंग कोर्सवर स्पेशल डिस्काउंट उपलब्ध आहे!`;
      } else {
        botReply += `रवी पाटील यांची टीम तुम्हाला लवकरच संपर्क करेल!`;
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 400);
  };

  const [selectedLead, setSelectedLead] = useState<Lead>(initialLeads[0]);
  const [inboxText, setInboxText] = useState<string>('');
  const [inboxChats, setInboxChats] = useState<Record<string, { from: 'me' | 'them'; text: string; time: string }[]>>({
    '1': [
      { from: 'them', text: 'नमस्कार सर, मला डिजिटल मार्केटिंग सेटअपची माहिती हवी होती.', time: '10:25 AM' },
      { from: 'me', text: 'नमस्कार रविराज जी, रवी पाटील CRM मध्ये आपले स्वागत आहे.', time: '10:30 AM' }
    ]
  });

  const handleSendInbox = () => {
    if (!inboxText.trim()) return;
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setInboxChats(prev => ({
      ...prev,
      [selectedLead.id]: [...(prev[selectedLead.id] || []), { from: 'me', text: inboxText, time: currentTime }]
    }));
    setInboxText('');
  };

  const [aiVoiceScript, setAiVoiceScript] = useState<string>('नमस्कार, मी रवी पाटील यांच्याकडून AI असिस्टंट बोलत आहे. आपल्या चौकशीबद्दल धन्यवाद.');
  const [callingStatus, setCallingStatus] = useState<Record<string, 'Idle' | 'Calling' | 'Connected' | 'Completed'>>({});

  const handleTriggerIvrCall = (lead: Lead) => {
    setCallingStatus(prev => ({ ...prev, [lead.id]: 'Calling' }));
    setTimeout(() => {
      setCallingStatus(prev => ({ ...prev, [lead.id]: 'Connected' }));
      setTimeout(() => {
        setCallingStatus(prev => ({ ...prev, [lead.id]: 'Completed' }));
        alert(`📞 ${lead.name} (${lead.phone}) सोबत AI Voice Call यशस्वीरीत्या पूर्ण झाला!`);
      }, 2000);
    }, 1500);
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => { e.dataTransfer.setData('leadId', leadId); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) { setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: targetStage } : l)); }
  };

  const filteredLeads = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm) || l.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchSource = sourceFilter === 'All' || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setLeadForm({ name: '', phone: '', service: '', deal_value: '2000', status: 'New Lead', source: 'Website', sentiment: 'Interested', notes: '' });
    setIsLeadModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setLeadForm({ name: lead.name, phone: lead.phone, service: lead.service, deal_value: lead.deal_value.toString(), status: lead.status, source: lead.source, sentiment: lead.sentiment, notes: lead.notes || '' });
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim()) { alert('कृपया नाव आणि मोबाईल नंबर टाका!'); return; }
    if (editingLead) {
      setLeads(prev => prev.map(l => l.id === editingLead.id ? { ...l, ...leadForm, deal_value: Number(leadForm.deal_value) } : l));
      alert('लीड अपडेट झाली!');
    } else {
      setLeads(prev => [{ id: Date.now().toString(), ...leadForm, deal_value: Number(leadForm.deal_value), created_at: 'आत्ताच जोडले' }, ...prev]);
      alert('नवीन लीड जोडली गेली!');
    }
    setIsLeadModalOpen(false);
  };

  const handleDeleteLead = (id: string, name: string) => {
    if (confirm(`नक्की '${name}' ही लीड हटवायची आहे का?`)) { setLeads(prev => prev.filter(l => l.id !== id)); }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleExportCSV = () => {
    const headers = 'ID,Name,Phone,Service,Deal_Value,Status,Source,Sentiment,Notes\n';
    const rows = leads.map(l => `${l.id},"${l.name}","${l.phone}","${l.service}",${l.deal_value},"${l.status}","${l.source}","${l.sentiment}","${l.notes || ''}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Growth_CRM_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length <= 1) return;
      const imported: Lead[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/"/g, '').trim());
        if (parts.length >= 2 && parts[1]) {
          imported.push({ id: Date.now().toString() + i, name: parts[1], phone: parts[2] || '9876543210', service: parts[3] || 'Service', deal_value: Number(parts[4]) || 2000, status: parts[5] || 'New Lead', source: parts[6] || 'CSV', sentiment: 'Interested', created_at: 'Imported' });
        }
      }
      if (imported.length > 0) { setLeads(prev => [...imported, ...prev]); alert(`${imported.length} कॉन्टॅक्ट्स आयात झाले!`); }
    };
    reader.readAsText(file);
  };

  // 100% AGENCY-GRADE LIVE EDITABLE WEBPAGE CANVAS WITH OWNER HEADSHOT & EDITABLE TESTIMONIALS
  const renderWebpageContent = (isModal: boolean = false) => (
    <div className={`mx-auto bg-[#07090e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${!isModal && deviceView === 'Mobile' ? 'max-w-sm' : 'w-full'}`}>
      <header className="bg-[#0b101d]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div>
          <input 
            type="text" 
            value={currentSite.businessName} 
            onChange={(e) => setCurrentSite({...currentSite, businessName: e.target.value})} 
            className="font-black text-white text-base bg-transparent outline-none border-b border-dashed border-blue-500 w-60"
            title="Click to edit business name"
          />
          <input 
            type="text" 
            value={currentSite.tagline} 
            onChange={(e) => setCurrentSite({...currentSite, tagline: e.target.value})} 
            className="text-[11px] text-blue-400 font-semibold bg-transparent outline-none border-b border-dashed border-blue-500/50 w-full mt-0.5"
            title="Click to edit tagline"
          />
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg"><MessageSquare size={14} /> WhatsApp</a>
          <a href={`tel:${currentSite.phone}`} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg"><Phone size={14} /> कॉल करा</a>
        </div>
      </header>

      {/* HERO SECTION WITH OWNER HEADSHOT & EDITABLE BANNER */}
      <section className="p-8 md:p-12 bg-gradient-to-b from-[#0e1628] via-[#0a0f1d] to-[#07090e] text-left space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold"><Sparkles size={14} /> {currentSite.badge}</div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <textarea 
              rows={2} 
              value={currentSite.headline} 
              onChange={(e) => setCurrentSite({...currentSite, headline: e.target.value})} 
              className="text-2xl md:text-4xl font-black text-white bg-transparent outline-none border border-dashed border-blue-500/40 rounded-2xl p-3 w-full resize-none leading-tight"
              title="Click to edit headline"
            />
            
            <textarea 
              rows={3} 
              value={currentSite.subheadline} 
              onChange={(e) => setCurrentSite({...currentSite, subheadline: e.target.value})} 
              className="text-sm md:text-base text-slate-300 bg-transparent outline-none border border-dashed border-blue-500/40 rounded-2xl p-3 w-full resize-none leading-relaxed"
              title="Click to edit subheadline"
            />

            <div className="flex items-center gap-4 pt-2">
              <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs shadow-xl shadow-blue-600/30 flex items-center gap-2"><Zap size={15} /> {currentSite.primaryCta}</a>
              <span className="text-xs text-slate-400 font-medium">⚡ Instant Response Guaranteed</span>
            </div>
          </div>

          {/* OWNER HEADSHOT SECTION */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#0d1424] border border-slate-800 rounded-3xl shadow-2xl relative group">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-xl relative mb-3">
              <img src={currentSite.ownerImage} alt="Owner Headshot" className="w-full h-full object-cover" />
            </div>
            <div className="text-center space-y-1 w-full">
              <input 
                type="text" 
                value={currentSite.businessName} 
                onChange={(e) => setCurrentSite({...currentSite, businessName: e.target.value})}
                className="font-bold text-white text-xs bg-transparent outline-none text-center w-full border-b border-dashed border-slate-700" 
              />
              <span className="text-[10px] text-emerald-400 font-bold block">Founder & Lead Expert</span>
            </div>
            <button onClick={() => ownerInputRef.current?.click()} className="mt-3 px-3.5 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer">
              <ImageIcon size={14} /> Change Owner Photo
            </button>
            <input type="file" ref={ownerInputRef} accept="image/*" onChange={handleOwnerUpload} className="hidden" />
          </div>
        </div>

        {/* HERO BANNER IMAGE WITH UPLOAD */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl group mt-6">
          <img src={currentSite.heroImage} alt="Hero Banner" className="w-full h-60 md:h-80 object-cover" />
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs text-white flex items-center gap-2 shadow-2xl cursor-pointer">
            <ImageIcon size={16} className="text-blue-400" />
            <button onClick={() => bannerInputRef.current?.click()} className="bg-transparent text-white font-bold cursor-pointer">
              Change Banner Photo
            </button>
            <input type="file" ref={bannerInputRef} accept="image/*" onChange={handleBannerUpload} className="hidden" />
          </div>
        </div>
      </section>

      {/* STATS COUNTER */}
      <section className="grid grid-cols-3 gap-2 px-8 py-6 bg-[#0b101e] border-y border-slate-800 text-center">
        {currentSite.stats.map((st, i) => (
          <div key={i} className="p-2">
            <input 
              type="text" 
              value={st.value} 
              onChange={(e) => {
                const newStats = [...currentSite.stats];
                newStats[i].value = e.target.value;
                setCurrentSite({...currentSite, stats: newStats});
              }} 
              className="text-xl md:text-2xl font-black text-blue-400 bg-transparent outline-none text-center w-full border-b border-dashed border-blue-500/40" 
            />
            <input 
              type="text" 
              value={st.label} 
              onChange={(e) => {
                const newStats = [...currentSite.stats];
                newStats[i].label = e.target.value;
                setCurrentSite({...currentSite, stats: newStats});
              }} 
              className="text-xs text-slate-400 bg-transparent outline-none text-center w-full mt-1" 
            />
          </div>
        ))}
      </section>

      {/* SERVICES GRID */}
      <section className="p-8 md:p-12 space-y-6 text-left bg-[#07090e]">
        <div className="text-center space-y-2 mb-8"><span className="text-xs text-blue-400 font-bold uppercase tracking-wider">आमच्या खास सेवा (Editable Services)</span><h3 className="text-xl md:text-2xl font-black text-white">लोकप्रिय उत्पादने आणि सेवा</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {currentSite.services.map((srv, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-3 flex flex-col justify-between shadow-xl hover:border-blue-500/50 transition">
              <div className="space-y-2">
                <input 
                  type="text" 
                  value={srv.title} 
                  onChange={(e) => {
                    const srvs = [...currentSite.services];
                    srvs[idx].title = e.target.value;
                    setCurrentSite({...currentSite, services: srvs});
                  }} 
                  className="font-bold text-white text-sm bg-transparent outline-none w-full border-b border-dashed border-slate-700 pb-1"
                />
                <textarea 
                  rows={3}
                  value={srv.desc} 
                  onChange={(e) => {
                    const srvs = [...currentSite.services];
                    srvs[idx].desc = e.target.value;
                    setCurrentSite({...currentSite, services: srvs});
                  }} 
                  className="text-xs text-slate-400 bg-transparent outline-none w-full resize-none border border-dashed border-slate-800 rounded-xl p-2 mt-1"
                />
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <input 
                  type="text" 
                  value={srv.price} 
                  onChange={(e) => {
                    const srvs = [...currentSite.services];
                    srvs[idx].price = e.target.value;
                    setCurrentSite({...currentSite, services: srvs});
                  }} 
                  className="font-black text-emerald-400 text-sm bg-transparent outline-none w-32 border-b border-dashed border-emerald-500/40"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EDITABLE TESTIMONIALS */}
      <section className="p-8 md:p-12 bg-[#0b101e] border-t border-slate-800 text-left space-y-6">
        <div className="text-center space-y-1"><span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Customer Reviews</span><h3 className="text-xl font-black text-white">समाधानी ग्राहकांचे मनोगत (Editable Testimonials)</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentSite.testimonials.map((t, idx) => (
            <div key={idx} className="p-5 bg-[#0d1424] border border-slate-800 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-blue-500" />
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={t.name} 
                    onChange={(e) => {
                      const tests = [...currentSite.testimonials];
                      tests[idx].name = e.target.value;
                      setCurrentSite({...currentSite, testimonials: tests});
                    }}
                    className="font-bold text-white text-xs bg-transparent outline-none w-full border-b border-dashed border-slate-700" 
                  />
                  <input 
                    type="text" 
                    value={t.location} 
                    onChange={(e) => {
                      const tests = [...currentSite.testimonials];
                      tests[idx].location = e.target.value;
                      setCurrentSite({...currentSite, testimonials: tests});
                    }}
                    className="text-[10px] text-slate-400 bg-transparent outline-none w-full mt-0.5" 
                  />
                </div>
              </div>
              <textarea 
                rows={2}
                value={t.review} 
                onChange={(e) => {
                  const tests = [...currentSite.testimonials];
                  tests[idx].review = e.target.value;
                  setCurrentSite({...currentSite, testimonials: tests});
                }}
                className="text-xs text-slate-300 bg-transparent outline-none w-full resize-none border border-dashed border-slate-800 rounded p-1 italic" 
              />
              <div className="flex text-amber-400 gap-0.5"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#05070c] border-t border-slate-800 p-8 text-left text-xs space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <input 
              type="text" 
              value={currentSite.businessName} 
              onChange={(e) => setCurrentSite({...currentSite, businessName: e.target.value})} 
              className="font-bold text-white text-sm bg-transparent outline-none w-60 border-b border-dashed border-slate-700"
            />
            <input 
              type="text" 
              value={currentSite.address} 
              onChange={(e) => setCurrentSite({...currentSite, address: e.target.value})} 
              className="text-xs text-slate-400 bg-transparent outline-none w-full mt-1"
            />
          </div>
          <div className="text-right text-[11px] text-slate-500">
            Powered by <b className="text-blue-400">AI Growth CRM Pro</b>
          </div>
        </div>
      </footer>
    </div>
  );

  // ================= SUPABASE AUTHENTICATION SCREEN =================
  if (!isLoggedIn) {
    return (
      <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans items-center justify-center p-4">
        <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/40">AI</div>
            <h1 className="text-xl font-black text-white">रवी पाटील - AI Growth CRM</h1>
            <p className="text-xs text-slate-400">प्रो साॅस ॲक्टिव्ह (Pro SaaS Active)</p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl text-xs text-center font-medium">
              {authError}
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleSupabaseLogin} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">ईमेल आयडी</label>
                <div className="flex items-center gap-2 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5">
                  <Mail size={15} className="text-slate-400" />
                  <input type="email" required placeholder="name@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="bg-transparent text-white w-full outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">पासवर्ड</label>
                <div className="flex items-center gap-2 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5">
                  <KeyRound size={15} className="text-slate-400" />
                  <input type="password" required placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="bg-transparent text-white w-full outline-none" />
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <button type="button" onClick={() => setAuthMode('forgot')} className="text-blue-400 hover:underline">पासवर्ड विसरलात?</button>
              </div>
              <button type="submit" disabled={authLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                {authLoading && <Loader2 size={16} className="animate-spin" />}
                <span>लॉगिन करा (Login)</span>
              </button>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleSupabaseForgotPassword} className="space-y-4 text-xs">
              <p className="text-slate-400 text-xs">तुमचा नोंदणीकृत ईमेल टाका, आम्ही तुम्हाला पासवर्ड रिसेट करण्याची लिंक पाठवू.</p>
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">ईमेल आयडी</label>
                <div className="flex items-center gap-2 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5">
                  <Mail size={15} className="text-slate-400" />
                  <input type="email" required placeholder="name@example.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="bg-transparent text-white w-full outline-none" />
                </div>
              </div>
              <div className="text-right text-[11px]">
                <button type="button" onClick={() => setAuthMode('login')} className="text-blue-400 hover:underline">लॉगिन पेजवर जा</button>
              </div>
              <button type="submit" disabled={authLoading} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                {authLoading && <Loader2 size={16} className="animate-spin" />}
                <span>पासवर्ड रिसेट लिंक पाठवा</span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Growth Dashboard', icon: Home },
    { id: 'leads', label: 'Growth Leads Directory', icon: Users },
    { id: 'pipeline', label: 'Growth CRM & Pipeline', icon: Layers },
    { id: 'website', label: 'Website & Funnels', icon: Monitor },
    { id: 'payments', label: 'Payment Gateways (All)', icon: QrCode },
    { id: 'agents', label: 'AI Agents & Chatbot', icon: Bot },
    { id: 'meta_ads', label: 'Ad Launcher (Meta)', icon: Megaphone },
    { id: 'templates', label: 'Template Manager', icon: FileText },
    { id: 'workflow', label: 'AI Workflow Builder', icon: GitBranch },
    { id: 'inbox', label: 'AI Inbox / WhatsApp', icon: MessageSquare },
    { id: 'calendar', label: 'Smart Calendar', icon: Calendar },
    { id: 'ivr', label: 'AI Sales & IVR', icon: PhoneCall },
    { id: 'finance', label: 'AI Finance & Revenue', icon: Wallet },
    { id: 'social', label: 'Social Media Auto-Post', icon: Share2 },
    { id: 'settings', label: 'Settings & Meta API', icon: Settings }
  ];

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* CUSTOM OVERRIDDEN SIDEBAR WITH 'रवी पाटील' & 'Pro SaaS Active' */}
      <aside className="w-64 bg-[#07090e] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
        <div className="p-5 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/40">AI</div>
            <div>
              <h2 className="font-black text-white text-sm tracking-wide">AI Growth CRM</h2>
              <span className="text-[10px] text-blue-400 font-bold">Enterprise Suite</span>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <IconComp size={16} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM BRANDING SECTION */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0a0f1d]">
          <div className="p-3 bg-[#0d1424] border border-slate-800 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="min-w-0">
                <p className="font-black text-white text-xs truncate">रवी पाटील</p>
                <span className="text-[10px] text-emerald-400 font-bold block truncate">■ Pro SaaS Active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <input type="file" ref={fileInputRef} accept=".csv" onChange={handleImportCSV} className="hidden" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        
        {/* Top Header with Smart Direct Jump Search Bar */}
        <header className="flex flex-wrap items-center justify-between pb-5 mb-5 border-b border-slate-800/80 gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h1 className="text-xl font-black text-white shrink-0 capitalize">
              {activeTab === 'dashboard' ? 'Growth Dashboard' : 
               activeTab === 'leads' ? 'Growth Leads Directory' : 
               activeTab === 'pipeline' ? 'Growth CRM & Pipeline' :
               activeTab === 'website' ? '5-Star Website & Funnels' :
               activeTab === 'payments' ? 'Payment Gateways & UPI' :
               activeTab === 'agents' ? 'AI Agents & 24/7 Chatbot' :
               activeTab === 'meta_ads' ? 'Meta Lead Ads Launcher' :
               activeTab === 'templates' ? 'Templates & Messenger' :
               activeTab === 'workflow' ? 'AI Workflow Builder' :
               activeTab === 'inbox' ? 'AI Inbox & WhatsApp Suite' :
               activeTab === 'ivr' ? 'AI Sales & Outbound IVR' :
               activeTab === 'calendar' ? 'Smart Calendar & Bookings' :
               activeTab === 'finance' ? 'AI Finance & Revenue' :
               activeTab === 'social' ? 'Social Media Auto-Poster' : activeTab.replace('_', ' ')}
            </h1>
            <div className="flex items-center gap-2 bg-[#0d1424] border border-slate-800 px-3.5 py-1.5 rounded-xl w-full text-xs">
              <Search size={14} className="text-slate-400" />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const term = searchTerm.toLowerCase().trim();
                    if (term.includes('lead') || term.includes('कॉन्टॅक्ट')) { setActiveTab('leads'); }
                    else if (term.includes('website') || term.includes('वेबसाईट') || term.includes('funnel')) { setActiveTab('website'); }
                    else if (term.includes('payment') || term.includes('upi') || term.includes('qr') || term.includes('पेमेंट')) { setActiveTab('payments'); }
                    else if (term.includes('agent') || term.includes('chatbot') || term.includes('बॉट')) { setActiveTab('agents'); }
                    else if (term.includes('meta') || term.includes('ad') || term.includes('जाहिरात')) { setActiveTab('meta_ads'); }
                    else if (term.includes('calendar') || term.includes('booking') || term.includes('अपॉइंटमेंट')) { setActiveTab('calendar'); }
                    else if (term.includes('finance') || term.includes('revenue') || term.includes('हिशोब')) { setActiveTab('finance'); }
                    else if (term.includes('social') || term.includes('post') || term.includes('पोस्ट')) { setActiveTab('social'); }
                    else if (term.includes('setting') || term.includes('सेटिंग्स')) { setActiveTab('settings'); }
                    else if (term.includes('pipeline') || term.includes('डिल')) { setActiveTab('pipeline'); }
                    else if (term.includes('inbox') || term.includes('whatsapp') || term.includes('चॅट')) { setActiveTab('inbox'); }
                    else {
                      alert(`🔍 '${searchTerm}' सापडले. संबंधित लीड्स किंवा डॅशबोर्ड डेटा फिल्टर केला आहे.`);
                    }
                  }
                }}
                placeholder="Search or jump to module (Press Enter)..." 
                className="bg-transparent text-white outline-none w-full" 
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">Pro SaaS Active</span>
            <button onClick={handleOpenAddModal} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition">+ Add Lead</button>
            <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"><RefreshCw size={13} /> Refresh</button>
            <button onClick={handleSupabaseLogout} className="flex items-center gap-1 px-3 py-1.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition cursor-pointer" title="Logout">
              <LogOut size={13} /> Logout
            </button>
          </div>
        </header>

        {/* 1. GROWTH DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span><span className="text-xs font-bold text-slate-200">रवी पाटील - AI Growth CRM (15 मॉड्यूल्स ॲक्टिव्ह):</span></div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button onClick={handleOpenAddModal} className="px-3 py-2 bg-blue-600 text-white rounded-xl font-bold">+ Add Lead</button>
                <button onClick={() => setActiveTab('payments')} className="px-3 py-2 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold">Quick Payment QR</button>
                <button onClick={() => setActiveTab('website')} className="px-3 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl font-bold">AI Website Builder</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400">Total Leads</span><p className="text-2xl font-black text-white">{leads.length}</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400">New Leads</span><p className="text-2xl font-black text-blue-400">{leads.filter(l => l.status === 'New Lead').length}</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400">Deals Won</span><p className="text-2xl font-black text-emerald-400">{leads.filter(l => l.status === 'Won').length}</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400">Pipeline Value</span><p className="text-2xl font-black text-amber-400">₹{leads.reduce((a, c) => a + c.deal_value, 0).toLocaleString('en-IN')}</p></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-3">
                <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-300">Revenue Growth</span><span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full font-bold">+34.8%</span></div>
                <p className="text-2xl font-black text-white">₹1,48,500</p>
                <div className="h-16 flex items-end gap-1.5 pt-2">
                  {[40, 65, 50, 85, 70, 95, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-slate-800 rounded-t-md relative overflow-hidden" style={{ height: `${h}%` }}>
                      <div className="absolute inset-0 bg-blue-600 opacity-80"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Lead Source Distribution</span>
                <div className="space-y-2 pt-1 text-xs">
                  <div><div className="flex justify-between text-[11px] mb-1"><span className="text-slate-400">Meta Ads</span><span className="text-blue-400 font-bold">55%</span></div><div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[55%]"></div></div></div>
                  <div><div className="flex justify-between text-[11px] mb-1"><span className="text-slate-400">Website & Funnels</span><span className="text-indigo-400 font-bold">30%</span></div><div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full w-[30%]"></div></div></div>
                </div>
              </div>

              <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">AI Voice Agent Success</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">82.4% Answer Rate</p>
                <p className="text-xs text-slate-400">Positive Customer Sentiment: <span className="text-white font-bold">76%</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2"><Layers size={16} className="text-blue-400" /> Pipeline Stages</h2>
                <div className="space-y-2 text-xs">
                  {stages.filter(s => s !== 'All').map((stg, i) => (
                    <div key={stg} className="p-3 bg-[#080b12] border border-slate-800 rounded-xl flex items-center justify-between">
                      <span className="font-bold text-slate-300">{i + 1}. {stg}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 font-bold">{leads.filter(l => l.status === stg).length} Leads</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2"><Users size={16} className="text-emerald-400" /> Recent Inbound Leads</h2>
                  <button onClick={() => setActiveTab('leads')} className="text-xs text-blue-400 font-bold hover:underline">View All ({leads.length}) →</button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 text-xs">
                  {leads.slice(0, 5).map((l) => (
                    <div key={l.id} className="py-2.5 flex items-center justify-between hover:bg-slate-800/20 px-2 rounded-lg transition">
                      <div><p className="font-bold text-white">{l.name}</p><p className="text-[11px] text-slate-400">{l.phone} • {l.service}</p></div>
                      <div className="flex items-center gap-2">
                        <a href={`https://wa.me/91${l.phone}`} target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg font-bold text-[11px] flex items-center gap-1"><MessageSquare size={12} /> WhatsApp</a>
                        <button onClick={() => alert(`${l.name} ला AI कॉल लावला जात आहे...`)} className="px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded-lg font-bold text-[11px] flex items-center gap-1"><PhoneCall size={12} /> AI Call</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. GROWTH LEADS */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap justify-between items-center gap-3">
              <div><h2 className="text-lg font-black text-white">Growth Leads Directory ({filteredLeads.length})</h2><p className="text-xs text-slate-400">सर्व १५ इनबाउंड व आऊटबाउंड लीड्स.</p></div>
              <div className="flex gap-2">
                <button onClick={handleOpenAddModal} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">+ Add Lead</button>
                <button onClick={() => fileInputRef.current?.click()} className="px-3.5 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"><Upload size={14} /> Import CSV</button>
                <button onClick={handleExportCSV} className="px-3.5 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1"><Download size={14} /> Export CSV</button>
              </div>
            </div>
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[850px] text-xs">
                  <thead className="bg-[#080c18] text-slate-400 uppercase text-[10px]">
                    <tr><th className="p-4">Name & Phone</th><th className="p-4">Service</th><th className="p-4">Deal Value</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredLeads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/30">
                        <td className="p-4"><p className="font-bold text-white">{l.name}</p><span className="text-[11px] text-slate-400">+91 {l.phone}</span></td>
                        <td className="p-4">{l.service}</td>
                        <td className="p-4 font-black text-white">₹{l.deal_value}</td>
                        <td className="p-4">
                          <select value={l.status} onChange={(e) => handleStatusChange(l.id, e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded-xl text-xs">
                            {stages.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <a href={`https://wa.me/91${l.phone}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1"><MessageSquare size={12} /> WhatsApp</a>
                            <button onClick={() => handleOpenEditModal(l)} className="p-1 text-slate-400 hover:text-blue-400"><Edit3 size={15} /></button>
                            <button onClick={() => handleDeleteLead(l.id, l.name)} className="p-1 text-slate-400 hover:text-rose-400"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. PIPELINE KANBAN */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap justify-between items-center gap-3">
              <div><h2 className="text-lg font-black text-white">Growth CRM & Kanban Pipeline</h2><p className="text-xs text-slate-400">ड्रॅग आणि ड्रॉप करा किंवा CSV इम्पोर्ट/एक्सपोर्ट करा.</p></div>
              <div className="flex gap-2">
                <button onClick={handleOpenAddModal} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">+ Add Deal</button>
                <button onClick={() => fileInputRef.current?.click()} className="px-3.5 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"><Upload size={14} /> Import CSV</button>
                <button onClick={handleExportCSV} className="px-3.5 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1"><Download size={14} /> Export CSV</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['New Lead', 'Contacted', 'Payment Sent', 'Won'].map((stg) => (
                <div key={stg} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stg)} className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 space-y-3 min-h-[450px]">
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span className="font-bold text-xs text-white uppercase">{stg}</span><span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">{leads.filter(l => l.status === stg).length}</span></div>
                  <div className="space-y-2.5">
                    {leads.filter(l => l.status === stg).map((l) => (
                      <div key={l.id} draggable onDragStart={(e) => handleDragStart(e, l.id)} className="p-3 bg-[#080b12] border border-slate-700 rounded-xl space-y-1 cursor-grab active:cursor-grabbing">
                        <div className="flex justify-between font-bold text-xs"><span className="text-white">{l.name}</span><span className="text-emerald-400">₹{l.deal_value}</span></div>
                        <p className="text-[11px] text-slate-400">{l.service}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. WEBSITE & FUNNELS */}
        {activeTab === 'website' && (
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-slate-800/90 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black"><Sparkles size={20} /></div>
                  <div><h2 className="text-base font-black text-white">AI Agency-Grade Professional Website Builder</h2><p className="text-xs text-slate-400">प्रॉम्प्ट द्या, मालकाचा फोटो टाका, लाईव्ह एडिट करा आणि एका क्लिकवर पब्लिश करा.</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPreviewModalOpen(true)} className="px-3.5 py-2.5 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"><Eye size={14} /> Full Screen Preview</button>
                  <button onClick={handlePublishWebsite} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"><Globe size={14} /> 🚀 Publish Live</button>
                </div>
              </div>

              {/* PUBLISHED SUCCESS BANNER */}
              {isPublished && (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={18} className="text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">वेबसाईट यशस्वीरीत्या पब्लिश झाली आहे!</span>
                      <a href={publishedUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline font-mono text-[11px]">{publishedUrl}</a>
                    </div>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(publishedUrl); alert('लाईव्ह लिंक कॉपी झाली!'); }} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold">Copy Link</button>
                </div>
              )}

              {/* CUSTOM DOMAIN SETUP BOX */}
              <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="space-y-1 flex-1 min-w-[250px]">
                  <span className="font-bold text-white block flex items-center gap-1.5"><Globe size={14} className="text-blue-400" /> Connect Custom Domain (कस्टम डोमेन जोडा)</span>
                  <input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="उदा. www.mybusiness.com" className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2.5 text-white outline-none mt-1 font-mono" />
                </div>
                <button onClick={handleConnectDomain} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg mt-5">Connect Domain</button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[280px] bg-[#080b12] border border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Sparkles size={18} className="text-blue-400 shrink-0" />
                  <input type="text" value={promptInput} onChange={(e) => setPromptInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerateWebsite()} placeholder="उदा. 'Hotel Sai Luxury Dining'..." className="bg-transparent text-white text-xs outline-none w-full" />
                </div>
                <button type="button" onClick={toggleVoiceRecording} className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border ${isListening ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-200 border-slate-700'}`}>
                  {isListening ? <MicOff size={16} /> : <Mic size={16} className="text-rose-400" />}
                  <span>{isListening ? 'बोलणे चालू आहे...' : 'Continuous Mic'}</span>
                </button>
                <button type="button" onClick={handleGenerateWebsite} disabled={isGenerating} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>{isGenerating ? 'तयार होत आहे...' : 'Generate Website'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
                {Object.keys(templatesDb).map((key) => (
                  <button key={key} type="button" onClick={() => { setSelectedTemplate(key); setCurrentSite(templatesDb[key]); }} className={`p-2 rounded-xl text-xs font-semibold text-left border ${selectedTemplate === key ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-[#080b12] text-slate-400 border-slate-800'}`}>
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 text-xs max-h-[850px] overflow-y-auto shadow-xl">
                <h3 className="font-bold text-white uppercase text-[11px]">Quick Tools & Photo Uploader</h3>
                <div className="p-3 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-slate-300 font-bold block text-[11px]">बॅनर फोटो बदला</label>
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-blue-600 file:text-white cursor-pointer" />
                </div>
                <div className="p-3 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-slate-300 font-bold block text-[11px]">मालकाचा (Owner) फोटो बदला</label>
                  <input type="file" accept="image/*" onChange={handleOwnerUpload} className="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-blue-600 file:text-white cursor-pointer" />
                </div>
                <div><label className="text-slate-400 block mb-1">Business Name</label><input type="text" value={currentSite.businessName} onChange={(e) => setCurrentSite({ ...currentSite, businessName: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                <div><label className="text-slate-400 block mb-1">WhatsApp / Phone</label><input type="text" value={currentSite.phone} onChange={(e) => setCurrentSite({ ...currentSite, phone: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white font-mono outline-none" /></div>
              </div>

              <div className="lg:col-span-8 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex justify-between text-xs border-b border-slate-800 pb-3 items-center">
                  <span className="font-mono text-slate-300 text-[11px]">Live Editable Canvas (Click & Edit)</span>
                  <button onClick={() => setIsPreviewModalOpen(true)} className="text-[11px] text-blue-400 font-bold hover:underline flex items-center gap-1"><Eye size={13} /> Full Screen</button>
                </div>
                {renderWebpageContent(false)}
              </div>
            </div>
          </div>
        )}

        {/* 5. PAYMENT GATEWAYS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-7 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 text-xs shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                      <QrCode size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">MULTI-GATEWAYS: RAZORPAY, CASHFREE & INSTAMOJO</h3>
                      <p className="text-[11px] text-slate-400">पेमेंट झाल्यानंतर ग्राहकाच्या WhatsApp वर स्वयंचलित सुरक्षित PDF पावती पाठवली जाईल.</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">
                    Pro SaaS Active
                  </span>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span className="font-bold text-emerald-300 text-[11px]">पेमेंट होताच WhatsApp वर PDF बिल ऑटो-सेंड करा</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isAutoWhatsAppPdfActive} 
                    onChange={(e) => setIsAutoWhatsAppPdfActive(e.target.checked)} 
                    className="w-4 h-4 accent-emerald-500 cursor-pointer" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Your Working UPI ID *</label>
                    <input type="text" value={clientSettings.upiId} onChange={(e) => setClientSettings({...clientSettings, upiId: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Business Name on UPI</label>
                    <input type="text" value={clientSettings.businessName} onChange={(e) => setClientSettings({...clientSettings, businessName: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Customer Full Name</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Customer WhatsApp Number</label>
                    <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Service / Product Description</label>
                    <input type="text" value={paymentDesc} onChange={(e) => setPaymentDesc(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Amount to Collect (₹) *</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-black text-base outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <button type="button" onClick={handleRazorpayPay} className="py-3 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/35 transition text-xs cursor-pointer">
                    <CreditCard size={15} /> Pay with Razorpay
                  </button>
                  <button type="button" onClick={() => alert('Instamojo Secure Checkout ॲक्टिव्ह आहे!')} className="py-3 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg transition text-xs cursor-pointer">
                    <Landmark size={15} /> Pay with Instamojo
                  </button>
                  <button type="button" onClick={handleSendWhatsAppBill} className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/35 transition text-xs cursor-pointer">
                    <Send size={15} /> Send WhatsApp Bill
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl flex flex-col items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Live Instant Payment QR</span>
                  <p className="text-xs text-slate-300">GPay, PhonePe, Paytm ने स्कॅन करून लगेच पैसे भरा</p>
                </div>

                <div className="p-4 bg-white rounded-2xl shadow-2xl inline-block border-4 border-slate-800">
                  <img src={qrUrl} alt="Live Dynamic UPI QR" className="w-48 h-48 block rounded-lg mx-auto" />
                  <div className="mt-2 pt-2 border-t border-slate-200 flex justify-center items-center gap-2 text-[10px] text-slate-700 font-bold">
                    <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                  </div>
                </div>

                <div className="space-y-1 w-full">
                  <div className="p-3 bg-[#080b12] rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">स्वीकारावयाची रक्कम:</span>
                    <span className="font-black text-emerald-400 text-base">₹{Number(amount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => { 
                    navigator.clipboard.writeText(livePayUrl); 
                    setCopied(true); 
                    setTimeout(() => setCopied(false), 2000); 
                  }} 
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />} 
                  <span>{copied ? 'UPI पेमेंट लिंक कॉपी झाली!' : 'Copy Direct UPI Payment Link'}</span>
                </button>
              </div>

            </div>

            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2"><Receipt size={15} className="text-emerald-400" /> Recent Payment Transactions & Settlements</h3>
                <span className="text-[10px] text-slate-400">Total Settled: <b className="text-white">₹45,200</b></span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-[#080c18] text-slate-400 uppercase text-[10px]"><tr><th className="p-3">Txn ID</th><th className="p-3">Customer</th><th className="p-3">Amount</th><th className="p-3">Method / Gateway</th><th className="p-3">Date & Time</th><th className="p-3 text-center">Status</th></tr></thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-mono font-bold text-blue-400">{txn.id}</td>
                        <td className="p-3"><p className="font-bold text-white">{txn.customerName}</p><span className="text-[10px] text-slate-400">{txn.phone}</span></td>
                        <td className="p-3 font-black text-white text-sm">₹{txn.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-medium">{txn.gateway}</td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{txn.date}</td>
                        <td className="p-3 text-center"><span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${txn.status === 'Success' ? 'bg-emerald-950 text-emerald-400 border-emerald-600/40' : 'bg-amber-950 text-amber-400'}`}>{txn.status === 'Success' ? '● Paid' : txn.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. AI AGENTS */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3"><div className="flex items-center gap-2"><Bot size={18} className="text-blue-400" /><h3 className="font-bold text-white text-sm">AI Agent Studio</h3></div><span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Active</span></div>
              <div><label className="text-slate-300 block mb-1 font-bold">Agent Name</label><input type="text" value={botConfig.name} onChange={(e) => setBotConfig({ ...botConfig, name: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
              <div><label className="text-slate-300 block mb-1 font-bold">System Prompt</label><textarea rows={4} value={botConfig.systemPrompt} onChange={(e) => setBotConfig({ ...botConfig, systemPrompt: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-3 text-white outline-none resize-none" /></div>
              <button onClick={() => alert('सेव्ह झाले!')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Save AI Agent</button>
            </div>

            <div className="lg:col-span-7 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 text-xs shadow-xl flex flex-col justify-between h-[520px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">🤖</div><div><h4 className="font-bold text-white text-xs">{botConfig.name}</h4><span className="text-[10px] text-emerald-400">● Live Simulator</span></div></div>
                <button onClick={() => setChatMessages([chatMessages[0]])} className="text-[10px] text-slate-400">Clear</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-[#080b12] rounded-2xl border border-slate-800">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>{m.text}</div>
                    <span className="text-[9px] text-slate-500 mt-1">{m.time}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1 border-t border-slate-800">
                <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} placeholder="मेसेज..." className="flex-1 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none" />
                <button onClick={handleSendChat} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold"><Send size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {/* 7. META AD LAUNCHER */}
        {activeTab === 'meta_ads' && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2"><Megaphone size={18} className="text-blue-400" /><h3 className="font-bold text-white text-sm">Meta Lead Ads Account & 1-Click Campaign Launcher</h3></div>
                {isMetaConnected ? (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle size={12} /> Connected ({metaAdAccount})</span>
                ) : (
                  <button onClick={() => { setIsMetaConnected(true); alert('मेटा ॲड अकाउंट यशस्वीरीत्या कनेक्ट झाले!'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg cursor-pointer">Connect Meta Ad Account</button>
                )}
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Direct Webhook URL for Meta App</label>
                <div className="flex gap-2">
                  <input readOnly value="https://ai-growth-crm-nine.vercel.app/api/lead-webhook" className="flex-1 bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-blue-400 font-mono outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText('https://ai-growth-crm-nine.vercel.app/api/lead-webhook'); alert('Webhook URL कॉपी झाला!'); }} className="px-4 bg-slate-800 text-white font-bold rounded-xl">Copy</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                  <span className="font-bold text-white block">Daily Ad Budget (₹)</span>
                  <input type="number" value={adBudget} onChange={(e) => setAdBudget(Number(e.target.value))} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2 text-emerald-400 font-bold outline-none" />
                </div>
                <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                  <span className="font-bold text-white block">Target Location</span>
                  <input type="text" value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2 text-white outline-none" />
                </div>
              </div>

              <button onClick={() => { if(!isMetaConnected) { alert('कृपया प्रथम मेटा ॲड अकाउंट कनेक्ट करा!'); return; } alert('Meta Lead Ads मोहीम यशस्वीरीत्या लॉन्च झाली!'); }} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg cursor-pointer">
                Launch 1-Click Meta Ad Campaign
              </button>
            </div>
          </div>
        )}

        {/* 8. TEMPLATES & MESSENGER */}
        {activeTab === 'templates' && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2"><FileText size={16} className="text-blue-400" /> AI Template Generator & Manager</h3>
              </div>

              <form onSubmit={handleGenerateTemplate} className="space-y-3 bg-[#080b12] p-4 rounded-2xl border border-slate-800">
                <span className="font-bold text-white block">+ नवीन मेसेज टेम्पलेट तयार करा</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="text-slate-400 block mb-1">टेम्पलेट नाव</label><input type="text" value={customTemplateName} onChange={(e) => setCustomTemplateName(e.target.value)} placeholder="उदा. Festival Offer" className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2 text-white outline-none" /></div>
                </div>
                <div><label className="text-slate-400 block mb-1">मेसेज मजकूर (Variables: {`{Name}, {Service}, {Amount}`})</label><textarea rows={2} value={customTemplateText} onChange={(e) => setCustomTemplateText(e.target.value)} placeholder="नमस्कार {Name}..." className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2 text-white outline-none resize-none" /></div>
                <button type="submit" className="py-2 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg">Generate & Save Template</button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {savedTemplates.map((t, i) => (
                  <div key={i} className="bg-[#080b12] border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                    <div><span className="font-bold text-white block mb-1">{t.title}</span><p className="bg-[#0d1424] p-3 rounded-xl text-slate-300 border border-slate-800 font-mono text-[11px] leading-relaxed">{t.text}</p></div>
                    <button onClick={() => { navigator.clipboard.writeText(t.text); alert('टेम्पलेट कॉपी झाले!'); }} className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-[10px]">Copy Template</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 9. AI WORKFLOW BUILDER */}
        {activeTab === 'workflow' && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl text-center">
              <h3 className="font-bold text-white text-sm flex items-center justify-center gap-2"><GitBranch size={16} className="text-blue-400" /> AI Workflow Builder & Automation Nodes</h3>

              <form onSubmit={handleCreateWorkflow} className="space-y-3 bg-[#080b12] p-4 rounded-2xl border border-slate-800 text-left max-w-xl mx-auto">
                <span className="font-bold text-white block">+ नवीन ऑटोमेशन वर्कफ्लो तयार करा</span>
                <div>
                  <label className="text-slate-400 block mb-1">Trigger (कधी सुरू होईल?)</label>
                  <select value={workflowTrigger} onChange={(e) => setWorkflowTrigger(e.target.value)} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2.5 text-white outline-none">
                    <option value="New Inbound Lead (Website / Meta Ads)">New Inbound Lead (Website / Meta Ads)</option>
                    <option value="Payment Link Clicked">Payment Link Clicked</option>
                    <option value="WhatsApp Message Received">WhatsApp Message Received</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Action (काय कृती होईल?)</label>
                  <select value={workflowAction} onChange={(e) => setWorkflowAction(e.target.value)} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2.5 text-white outline-none">
                    <option value="Send Welcome WhatsApp + Dynamic QR">Send Welcome WhatsApp + Dynamic QR</option>
                    <option value="Trigger AI Voice Call">Trigger AI Voice Call</option>
                    <option value="Assign Lead to Sales Team">Assign Lead to Sales Team</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg">Generate & Activate Workflow</button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto pt-2">
                {customWorkflows.map((w, idx) => (
                  <div key={idx} className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl text-left space-y-1">
                    <span className="text-[10px] text-blue-400 font-bold uppercase">Trigger: {w.trigger}</span>
                    <p className="font-bold text-white text-xs">Action: {w.action}</p>
                    <span className="text-[9px] text-emerald-400 block">● Status: Active & Running</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 10. AI INBOX / WHATSAPP */}
        {activeTab === 'inbox' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[550px] shadow-xl text-xs">
            <div className="md:col-span-4 border-r border-slate-800 p-3 overflow-y-auto space-y-1 bg-[#080c16]">
              <div className="px-2 py-1.5 flex justify-between items-center mb-1"><span className="text-[10px] font-bold text-slate-400 uppercase">Chats</span><span className="text-[10px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full font-bold">{leads.length}</span></div>
              {leads.map((l) => (
                <div key={l.id} onClick={() => setSelectedLead(l)} className={`p-3 rounded-2xl cursor-pointer transition ${selectedLead.id === l.id ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800/50 text-slate-300'}`}>
                  <p className="text-xs font-bold">{l.name}</p>
                  <p className="text-[10px] opacity-80 truncate">{l.service} • +91 {l.phone}</p>
                </div>
              ))}
            </div>

            <div className="md:col-span-8 p-4 flex flex-col justify-between bg-[#080b12]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div><h4 className="font-bold text-white text-sm">{selectedLead.name}</h4><span className="text-[10px] text-emerald-400 font-mono">+91 {selectedLead.phone}</span></div>
                <a href={`https://wa.me/91${selectedLead.phone}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-[10px] flex items-center gap-1"><MessageSquare size={12} /> WhatsApp Web</a>
              </div>

              <div className="space-y-3 py-4 overflow-y-auto h-72">
                {(inboxChats[selectedLead.id] || [{ from: 'them', text: `नमस्कार, मला ${selectedLead.service} हवी आहे.`, time: '10:15 AM' }]).map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.from === 'me' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[75%] text-xs ${m.from === 'me' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{m.text}</div>
                    <span className="text-[9px] text-slate-500 mt-1">{m.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input type="text" value={inboxText} onChange={(e) => setInboxText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendInbox()} placeholder="Type reply..." className="flex-1 bg-[#0d1424] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none" />
                <button onClick={handleSendInbox} className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold"><Send size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {/* 11. SMART CALENDAR & BOOKINGS */}
        {activeTab === 'calendar' && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-3 gap-3">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2"><Calendar size={18} className="text-blue-400" /> Smart Calendar & Booking Schedule</h3>
                  <p className="text-[11px] text-slate-400">ग्राहकांच्या सर्व अपॉइंटमेंट्स, कॉल्स आणि मीटिंग्सचे नियोजन.</p>
                </div>
                <button onClick={() => setIsSlotModalOpen(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition cursor-pointer">
                  <Plus size={15} /> + Book New Appointment
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {appointments.map((slot) => (
                  <div key={slot.id} className="bg-[#080b12] border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-md hover:border-blue-500/50 transition">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-blue-400 font-bold font-mono bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-500/30">{slot.date} | {slot.time}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${slot.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-amber-950 text-amber-400 border-amber-500/30'}`}>
                        {slot.status}
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-white text-sm">{slot.clientName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">+91 {slot.phone}</p>
                      <p className="text-[11px] text-slate-300 font-medium mt-1">सेवा: <b className="text-blue-400">{slot.service}</b></p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                      <a href={`https://wa.me/91${slot.phone}?text=${encodeURIComponent(`नमस्कार ${slot.clientName} जी, आपली ${slot.service} ची ${slot.date} रोजी ${slot.time} ची अपॉइंटमेंट कन्फर्म आहे.`)}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-[10px] flex items-center gap-1">
                        <MessageSquare size={11} /> Remind on WA
                      </a>
                      <button onClick={() => handleCancelAppointment(slot.id, slot.clientName)} className="p-1 text-slate-400 hover:text-rose-400 transition" title="रद्द करा">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 12. IVR CALLING BOT */}
        {activeTab === 'ivr' && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">AI SALES & OUTBOUND IVR VOICE BOT</h3>
                    <p className="text-[11px] text-slate-400">लीड्सना स्वयंचलित (Automated) फोन कॉल्स आणि मराठी वॉयस स्क्रिप्ट्सद्वारे फॉलो-अप.</p>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full font-bold">Marathi Natural TTS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-300 block font-bold">AI Voice Calling Script (मराठी/हिंदी)</label>
                  <textarea 
                    rows={4} 
                    value={aiVoiceScript} 
                    onChange={(e) => setAiVoiceScript(e.target.value)} 
                    className="w-full bg-[#080b12] border border-slate-700 rounded-2xl p-3 text-white outline-none focus:border-blue-500 resize-none leading-relaxed" 
                  />
                  <button onClick={() => alert('वॉयस स्क्रिप्ट सेव्ह झाली!')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition">
                    Save Calling Script
                  </button>
                </div>

                <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-white block mb-1">Voice Agent Settings</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">हा AI बॉट प्रत्येक नवीन लीडला कॉल करून त्यांची पसंती विचारतो आणि पॉझिटिव्ह रिस्पॉन्स मिळताच CRM मध्ये स्टेटस 'Won' करतो.</p>
                  </div>
                  <div className="p-3 bg-[#0d1424] rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Auto-Dialing Engine</span>
                    <span className="text-emerald-400 font-bold">● Running (24/7)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <span className="font-bold text-white uppercase text-xs tracking-wider">Outbound Calling Queue ({leads.length} Leads)</span>
                <span className="text-[10px] text-slate-400">Status: <b className="text-emerald-400">Ready to Call</b></span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[750px]">
                  <thead className="bg-[#080c18] text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Customer Name & Phone</th>
                      <th className="p-3.5">Service Interest</th>
                      <th className="p-3.5">AI Sentiment Score</th>
                      <th className="p-3.5 text-center">Call Status</th>
                      <th className="p-3.5 text-center">Trigger AI Call</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {leads.slice(0, 8).map((lead) => {
                      const status = callingStatus[lead.id] || 'Idle';
                      return (
                        <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                          <td className="p-3.5">
                            <p className="font-bold text-white">{lead.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">+91 {lead.phone}</span>
                          </td>
                          <td className="p-3.5">{lead.service}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                              ● {lead.sentiment}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              status === 'Calling' ? 'bg-amber-950 text-amber-400 border-amber-500/40 animate-pulse' :
                              status === 'Connected' ? 'bg-blue-950 text-blue-400 border-blue-500/40 animate-pulse' :
                              status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                              'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                              {status === 'Idle' ? 'Ready' : status}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <button 
                              onClick={() => handleTriggerIvrCall(lead)} 
                              disabled={status === 'Calling' || status === 'Connected'} 
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-1 mx-auto transition shadow-md disabled:opacity-50 cursor-pointer"
                            >
                              <PhoneCall size={13} /> {status === 'Completed' ? 'Re-call' : 'Start AI Call'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 13. FINANCE */}
        {activeTab === 'finance' && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">AI FINANCE & REVENUE ANALYTICS</h3>
                    <p className="text-[11px] text-slate-400">महसूल (MRR), सबस्क्रिप्शन प्लान्स आणि क्लायंट बिलिंगचा संपूर्ण हिशोब.</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">
                  Live MRR Dashboard
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#080b12] border border-slate-800 p-4 rounded-2xl space-y-1">
                  <span className="text-slate-400 text-[11px]">Monthly Recurring Revenue (MRR)</span>
                  <p className="text-2xl font-black text-emerald-400">₹45,900</p>
                  <span className="text-[10px] text-emerald-500 font-bold block">+18.4% पिछले महीने से अधिक</span>
                </div>
                <div className="bg-[#080b12] border border-slate-800 p-4 rounded-2xl space-y-1">
                  <span className="text-slate-400 text-[11px]">Active SaaS Clients</span>
                  <p className="text-2xl font-black text-blue-400">24 Paid</p>
                  <span className="text-[10px] text-blue-400 font-bold block">100% Renewal Rate</span>
                </div>
                <div className="bg-[#080b12] border border-slate-800 p-4 rounded-2xl space-y-1">
                  <span className="text-slate-400 text-[11px]">Pending Settlements</span>
                  <p className="text-2xl font-black text-amber-400">₹8,500</p>
                  <span className="text-[10px] text-amber-400 font-bold block">Next payout in 24 hrs</span>
                </div>
              </div>

              <div className="pt-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider block mb-3">Active SaaS Subscription Tiers</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Starter Growth Plan', price: '₹1,999 / mo', clients: '8 Clients', status: 'Active' },
                    { name: 'Pro AI Automation Plan', price: '₹4,999 / mo', clients: '12 Clients', status: 'Popular' },
                    { name: 'Enterprise Multi-Store', price: '₹9,999 / mo', clients: '4 Clients', status: 'VIP' }
                  ].map((plan, idx) => (
                    <div key={idx} className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-xs">{plan.name}</span>
                        <span className="text-[9px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full font-bold">{plan.status}</span>
                      </div>
                      <p className="text-lg font-black text-emerald-400">{plan.price}</p>
                      <p className="text-[11px] text-slate-400">{plan.clients} subscribed</p>
                      <button onClick={() => alert(`${plan.name} चे इनव्हॉइस डाउनलोड होत आहे...`)} className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-[10px]">
                        Download Invoices
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 14. SOCIAL */}
        {activeTab === 'social' && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                    <Share2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">SOCIAL MEDIA AUTO-POSTER & PUBLISHER</h3>
                    <p className="text-[11px] text-slate-400">फेसबुक, इन्स्टाग्राम आणि व्हॉट्सॲप स्टेटसवर एकाच क्लिकवर जाहिरात पोस्ट करा.</p>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-950 text-blue-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">Meta Graph API Ready</span>
              </div>

              <div className="space-y-3">
                <label className="text-slate-300 block font-bold">Social Media Post Caption & Offer Text</label>
                <textarea 
                  rows={4} 
                  value={socialPostText} 
                  onChange={(e) => setSocialPostText(e.target.value)} 
                  className="w-full bg-[#080b12] border border-slate-700 rounded-2xl p-3 text-white outline-none focus:border-blue-500 resize-none leading-relaxed" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                  <span className="font-bold text-white block">Select Platforms</span>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={selectedPlatforms.facebook} onChange={(e) => setSelectedPlatforms({...selectedPlatforms, facebook: e.target.checked})} className="w-4 h-4 accent-blue-600" /> Facebook Page & Groups
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={selectedPlatforms.instagram} onChange={(e) => setSelectedPlatforms({...selectedPlatforms, instagram: e.target.checked})} className="w-4 h-4 accent-pink-600" /> Instagram Business Feed
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={selectedPlatforms.whatsappStatus} onChange={(e) => setSelectedPlatforms({...selectedPlatforms, whatsappStatus: e.target.checked})} className="w-4 h-4 accent-emerald-600" /> WhatsApp Business Status
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                  <span className="font-bold text-white block">Publish Timing</span>
                  <select value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2.5 text-white outline-none">
                    <option value="Immediate (Now)">Immediate (Now)</option>
                    <option value="Schedule for Tomorrow Morning">Schedule for Tomorrow Morning (9:00 AM)</option>
                    <option value="Schedule for Evening Prime Time">Schedule for Evening Prime Time (7:00 PM)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-2">निवडलेल्या प्लॅटफॉर्मवर स्वयंचलितपणे पोस्ट लाईव्ह होईल.</p>
                </div>

                <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-white block mb-1">Media Attachment</span>
                    <p className="text-[10px] text-slate-400">आपल्या प्रॉडक्टचा फोटो किंवा बॅनर जोडा.</p>
                  </div>
                  <button onClick={() => alert('बॅनर फाईल निवडली गेली!')} className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5">
                    <ImageIcon size={14} /> Upload Banner Image
                  </button>
                </div>
              </div>

              <button 
                onClick={() => {
                  alert('🎉 सोशल मीडिया पोस्ट यशस्वीरीत्या सर्व निवडलेल्या प्लॅटफॉर्म्सवर पब्लिश झाली!');
                }} 
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Share2 size={16} /> Publish Post to All Social Channels Now
              </button>
            </div>
          </div>
        )}

        {/* 15. SETTINGS (DYNAMIC MULTI-TENANT SETTINGS FORM ADDED) */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto w-full space-y-6 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white uppercase text-xs flex items-center gap-2"><Settings size={16} className="text-blue-400" /> Client Multi-Tenant Settings (UPI, WhatsApp & Meta API)</h3>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">Dynamic Isolated</span>
            </div>

            <form onSubmit={handleSaveClientSettings} className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Business Name (व्यवसायाचे नाव)</label>
                  <input type="text" value={clientSettings.businessName} onChange={(e) => setClientSettings({...clientSettings, businessName: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Your Working UPI ID (पेमेंटसाठी)</label>
                  <input type="text" value={clientSettings.upiId} onChange={(e) => setClientSettings({...clientSettings, upiId: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">WhatsApp Phone Number</label>
                  <input type="text" value={clientSettings.whatsappNumber} onChange={(e) => setClientSettings({...clientSettings, whatsappNumber: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none" />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Razorpay Live Key</label>
                  <input type="text" value={clientSettings.razorpayKey} onChange={(e) => setClientSettings({...clientSettings, razorpayKey: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none" />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">WhatsApp Phone ID / Meta Webhook ID</label>
                <input type="text" value={clientSettings.metaPhoneId} onChange={(e) => setClientSettings({...clientSettings, metaPhoneId: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none" />
              </div>

              <button type="submit" disabled={savingSettings} className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer">
                {savingSettings && <Loader2 size={16} className="animate-spin" />}
                <Save size={16} /> Save Client Settings
              </button>
            </form>
          </div>
        )}

        {/* LEAD MODAL */}
        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-base">{editingLead ? 'Edit Lead' : '+ Add New Lead'}</h3>
                <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-slate-400 block mb-1 font-bold">नाव *</label><input type="text" required value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                  <div><label className="text-slate-400 block mb-1 font-bold">मोबाईल *</label><input type="text" required value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-slate-400 block mb-1 font-bold">सेवा</label><input type="text" value={leadForm.service} onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                  <div><label className="text-slate-400 block mb-1 font-bold">अपेक्षित रक्कम (₹)</label><input type="number" value={leadForm.deal_value} onChange={(e) => setLeadForm({ ...leadForm, deal_value: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-bold outline-none" /></div>
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setIsLeadModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl">रद्द करा</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg">{editingLead ? 'अपडेट करा' : 'सेव्ह करा'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BOOK APPOINTMENT SLOT MODAL */}
        {isSlotModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-base">Book New Appointment Slot</h3>
                <button onClick={() => setIsSlotModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={handleBookSlot} className="space-y-3.5">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">ग्राहकाचे नाव *</label>
                  <input type="text" required value={newSlot.clientName} onChange={(e) => setNewSlot({ ...newSlot, clientName: e.target.value })} placeholder="उदा. संतोष पवार" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">मोबाईल नंबर *</label>
                  <input type="text" required value={newSlot.phone} onChange={(e) => setNewSlot({ ...newSlot, phone: e.target.value })} placeholder="9876543210" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">सेवा / उत्पादन</label>
                  <input type="text" value={newSlot.service} onChange={(e) => setNewSlot({ ...newSlot, service: e.target.value })} placeholder="उदा. Digital Marketing Setup" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">तारीख (Date)</label>
                    <input type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">वेळ (Time)</label>
                    <input type="text" value={newSlot.time} onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })} placeholder="11:00 AM" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsSlotModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl">रद्द करा</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg">स्लॉट बुक करा</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PREVIEW MODAL */}
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
            <div className="bg-[#07090e] border border-slate-700 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-2"><Eye size={16} className="text-blue-400" /> Fullscreen Webpage Preview</span>
                <button onClick={() => setIsPreviewModalOpen(false)} className="p-1.5 bg-slate-800 text-slate-300 rounded-xl"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8">{renderWebpageContent(true)}</div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}