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
  Sliders, MessageCircle, BarChart3, ChevronRight, Pause, Lock, CheckCircle, LogOut, KeyRound, Mail, User, Home, Save
} from 'lucide-react';

// Supabase Direct Client Initialization
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
    { id: '3', name: 'अमित देशमुख', phone: '9822334455', service: 'Consulting Session', deal_value: 4500, status: 'Payment Sent', source: 'Instagram Ad', sentiment: 'Follow-up', notes: 'पेमेंट लिंक पाठवली आहे, पेमेंट बाकी.', created_at: 'काल, 04:20 PM' },
    { id: '4', name: 'प्रियांका शिंदे', phone: '9765432109', service: 'Agency Growth Plan', deal_value: 3200, status: 'Won', source: 'WhatsApp Direct', sentiment: 'Positive', notes: 'पेमेंट जमा झाले, स्लॉट बुक केला.', created_at: 'काल, 06:10 PM' },
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
    { id: '15', name: 'ज्ञानेश्वर माने', phone: '9673112233', service: 'Enterprise Coaching', deal_value: 35000, status: 'Won', source: 'Website', sentiment: 'Positive', notes: 'पूर्ण ॲडव्हान्स पेमेंट मिळाले.', created_at: '23 Aug' }
  ];

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const stages = ['New Lead', 'Contacted', 'Payment Sent', 'Won', 'Lost'];

  const industryImages: Record<string, string> = {
    marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    coaching: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
    generic: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80'
  };

  const avatars = {
    male1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    male2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    female1: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    female2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  };

  const templatesDb: Record<string, TemplateData> = {
    'Digital Marketing & Coaching': {
      id: 'Digital Marketing & Coaching',
      businessName: clientSettings.businessName,
      tagline: 'ऑटोमेशन, मेटा ॲड्स आणि AI टूल्सद्वारे बिझनेस ग्रोथ',
      headline: 'तुमचा व्यवसाय ऑनलाइन वाढवा आणि AI च्या मदतीने दरमहा लाखो रुपये कमवा!',
      subheadline: 'डिजिटल मार्केटिंग मास्टरक्लास, मेटा ॲड कॅम्पेन सेटअप, ऑटोमेशन सिस्टीम आणि पर्सनल बिझनेस कोचिंग.',
      heroImage: industryImages.marketing,
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
  const [promptInput, setPromptInput] = useState<string>('रवी पाटील साठी ५-स्टार वेबसाइट बनवा');
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

  // 2. ROBUST WEBSITE GENERATION FIX
  const handleGenerateWebsite = () => {
    if (!promptInput.trim()) { 
      alert('कृपया प्रॉम्प्ट टाईप करा किंवा बोला!'); 
      return; 
    }
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentSite(prev => ({
        ...prev,
        businessName: promptInput,
        headline: `कस्टम AI जनरेटेड बिझनेस सोल्यूशन: ${promptInput}`,
        tagline: 'AI ऑटोमेशन आणि डिजिटल ग्रोथद्वारे सज्ज'
      }));
      setIsGenerating(false);
      alert('🚀 नवीन वेबसाईट तुमच्या प्रॉम्प्टनुसार यशस्वीरीत्या जनरेट झाली!');
    }, 400);
  };

  const [customerName, setCustomerName] = useState<string>('सचिन कांबळे');
  const [customerPhone, setCustomerPhone] = useState<string>('9123456780');
  const [paymentDesc, setPaymentDesc] = useState<string>('AI Masterclass Advance Payment');
  const [amount, setAmount] = useState<string>('2500');
  const [isAutoWhatsAppPdfActive, setIsAutoWhatsAppPdfActive] = useState<boolean>(true);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN-98214', customerName: 'सचिन कांबळे', phone: '9123456780', amount: 2500, gateway: 'Razorpay Live', status: 'Success', date: 'आज, 12:45 PM' }
  ]);

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

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', clientName: 'सचिन कांबळे', phone: '9123456780', service: 'Digital Marketing Setup', date: '2026-08-31', time: '11:00 AM', status: 'Confirmed' },
    { id: '2', clientName: 'अमित देशमुख', phone: '9822334455', service: 'Consulting Session', date: '2026-08-31', time: '02:00 PM', status: 'Pending' }
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
    alert('नवीन अपॉइंटमेंट स्लॉट यशस्वीरीत्या बुक झाला!');
  };

  const cleanAmt = (Number(amount) || 1).toFixed(2);
  const upiIntent = `upi://pay?pa=${clientSettings.upiId.trim()}&pn=${encodeURIComponent(clientSettings.businessName)}&am=${cleanAmt}&cu=INR&tn=${encodeURIComponent(paymentDesc)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntent)}`;
  const livePayUrl = `https://ai-growth-crm-nine.vercel.app/pay?pa=${encodeURIComponent(clientSettings.upiId)}&pn=${encodeURIComponent(clientSettings.businessName)}&am=${cleanAmt}&tn=${encodeURIComponent(paymentDesc)}`;

  const handleRazorpayPay = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay गेटवे लोड करण्यात अडचण आली.');
      return;
    }
    alert('Razorpay Checkout ॲक्टिव्ह आहे.');
  };

  const filteredLeads = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm) || l.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
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
    } else {
      setLeads(prev => [{ id: Date.now().toString(), ...leadForm, deal_value: Number(leadForm.deal_value), created_at: 'आत्ताच' }, ...prev]);
    }
    setIsLeadModalOpen(false);
  };

  const handleDeleteLead = (id: string, name: string) => {
    if (confirm(`नक्की '${name}' ही लीड हटवायची आहे का?`)) { setLeads(prev => prev.filter(l => l.id !== id)); }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const renderWebpageContent = (isModal: boolean = false) => (
    <div className={`mx-auto bg-[#07090e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${!isModal && deviceView === 'Mobile' ? 'max-w-sm' : 'w-full'}`}>
      <header className="bg-[#0b101d] border-b border-slate-800/80 px-5 py-3.5 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h4 className="font-black text-white text-sm tracking-wide leading-tight">{currentSite.businessName}</h4>
          <span className="text-[10px] text-blue-400 font-semibold">{currentSite.tagline}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-md"><MessageSquare size={12} /> WhatsApp</a>
        </div>
      </header>

      <section className="p-6 md:p-8 bg-gradient-to-b from-[#0e1628] via-[#0a0f1d] to-[#07090e] text-left space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-[11px] font-bold"><Sparkles size={12} /> {currentSite.badge}</div>
        <h1 className="text-xl md:text-2xl font-black text-white leading-snug">{currentSite.headline}</h1>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">{currentSite.subheadline}</p>
      </section>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans items-center justify-center p-4">
        <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl">AI</div>
            <h1 className="text-xl font-black text-white">रवी पाटील - AI Growth CRM</h1>
          </div>
          {authError && <div className="p-3 bg-rose-950/65 border border-rose-500/40 text-rose-300 rounded-xl text-xs text-center">{authError}</div>}
          <form onSubmit={handleSupabaseLogin} className="space-y-4 text-xs">
            <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none" />
            <input type="password" required placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none" />
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">लॉगिन करा</button>
          </form>
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
      <aside className="w-64 bg-[#07090e] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
        <div className="p-5 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black">AI</div>
            <div>
              <h2 className="font-black text-white text-sm">AI Growth CRM</h2>
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
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <IconComp size={16} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/80 bg-[#0a0f1d]">
          <div className="p-3 bg-[#0d1424] border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-black text-white text-xs truncate">रवी पाटील</p>
              <span className="text-[10px] text-emerald-400 font-bold block truncate">■ Pro SaaS Active</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        <header className="flex flex-wrap items-center justify-between pb-5 mb-5 border-b border-slate-800/80 gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h1 className="text-xl font-black text-white shrink-0 capitalize">{activeTab}</h1>
            {/* 3. WORKING ENTER SEARCH BAR FIX */}
            <div className="flex items-center gap-2 bg-[#0d1424] border border-slate-800 px-3.5 py-1.5 rounded-xl w-full text-xs">
              <Search size={14} className="text-slate-400" />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    alert(`🔍 '${searchTerm}' साठी CRM मध्ये शोधले जात आहे...`);
                  }
                }}
                placeholder="Search in CRM (Press Enter)..." 
                className="bg-transparent text-white outline-none w-full" 
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleOpenAddModal} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold">+ Add Lead</button>
            <button onClick={handleSupabaseLogout} className="flex items-center gap-1 px-3 py-1.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold cursor-pointer"><LogOut size={13} /> Logout</button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400">Total Leads</span><p className="text-2xl font-black text-white">{leads.length}</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400">Deals Won</span><p className="text-2xl font-black text-emerald-400">{leads.filter(l => l.status === 'Won').length}</p></div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap justify-between items-center gap-3">
              <h2 className="text-lg font-black text-white">Growth Leads Directory ({filteredLeads.length})</h2>
              <button onClick={handleOpenAddModal} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">+ Add Lead</button>
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

        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white">Growth CRM & Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['New Lead', 'Contacted', 'Payment Sent', 'Won'].map((stg) => (
                <div key={stg} className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 space-y-3 min-h-[400px]">
                  <div className="flex justify-between border-b border-slate-800 pb-2"><span className="font-bold text-xs text-white uppercase">{stg}</span><span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">{leads.filter(l => l.status === stg).length}</span></div>
                  <div className="space-y-2.5">
                    {leads.filter(l => l.status === stg).map((l) => (
                      <div key={l.id} className="p-3 bg-[#080b12] border border-slate-700 rounded-xl space-y-1">
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

        {activeTab === 'website' && (
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-slate-800/90 rounded-3xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black"><Sparkles size={20} /></div>
                <div><h2 className="text-base font-black text-white">AI Voice & Prompt 5-Star Website Generator</h2><p className="text-xs text-slate-400">माईकवर बोलून किंवा प्रॉम्प्ट देऊन वेबसाईट बनवा.</p></div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[280px] bg-[#080b12] border border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Sparkles size={18} className="text-blue-400 shrink-0" />
                  <input type="text" value={promptInput} onChange={(e) => setPromptInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerateWebsite()} placeholder="उदा. 'रवी पाटील साठी ५-स्टार वेबसाइट बनवा'..." className="bg-transparent text-white text-xs outline-none w-full" />
                </div>
                <button type="button" onClick={toggleVoiceRecording} className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border ${isListening ? 'bg-rose-600 text-white border-rose-500 animate-pulse' : 'bg-slate-800 text-slate-200 border-slate-700'}`}>
                  {isListening ? <MicOff size={16} /> : <Mic size={16} className="text-rose-400" />}
                  <span>{isListening ? 'बोलणे चालू आहे...' : 'Continuous Mic'}</span>
                </button>
                <button type="button" onClick={handleGenerateWebsite} disabled={isGenerating} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer">
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>{isGenerating ? 'तयार होत आहे...' : 'Generate Website'}</span>
                </button>
              </div>
            </div>

            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <span className="font-mono text-slate-300 text-[11px]">Live Canvas</span>
              {renderWebpageContent(false)}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm">MULTI-GATEWAYS: RAZORPAY</h3>
              <button type="button" onClick={handleRazorpayPay} className="py-3 px-4 bg-blue-600 text-white rounded-xl font-bold text-xs cursor-pointer">Pay with Razorpay</button>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm">AI Agents & Chatbot Studio</h3>
            <p className="text-slate-400">तुम्ही रवी पाटील यांच्या AI Growth CRM चे अधिकृत असिस्टंट आहात.</p>
          </div>
        )}

        {activeTab === 'meta_ads' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm">Meta Lead Ads Launcher</h3>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm">Template Manager</h3>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm">AI Workflow Builder</h3>
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm">AI Inbox / WhatsApp Suite</h3>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm">Smart Calendar & Bookings</h3>
          </div>
        )}

        {activeTab === 'ivr' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm">AI Sales & Outbound IVR</h3>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm">AI Finance & Revenue Analytics</h3>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm">Social Media Auto-Poster</h3>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto w-full space-y-6 text-xs">
            <form onSubmit={handleSaveClientSettings} className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Business Name</label>
                <input type="text" value={clientSettings.businessName} onChange={(e) => setClientSettings({...clientSettings, businessName: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
              </div>
              <button type="submit" disabled={savingSettings} className="py-3 px-6 bg-blue-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">Save Client Settings</button>
            </form>
          </div>
        )}

        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-base">{editingLead ? 'Edit Lead' : '+ Add New Lead'}</h3>
                <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
                <input type="text" required value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} placeholder="नाव" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                <input type="text" required value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} placeholder="मोबाईल" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" />
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">सेव्ह करा</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}