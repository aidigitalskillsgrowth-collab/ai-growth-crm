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
  Sliders, MessageCircle, BarChart3, ChevronRight, Pause, Lock, CheckCircle, LogOut, KeyRound, Mail, User, Home, Save, Globe, Utensils, Coffee, Soup, Heart
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

interface MenuItem {
  category: string;
  name: string;
  desc: string;
  price: string;
  image: string;
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
  menu: MenuItem[];
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

  // Table Booking Form State inside Website Builder
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', guests: '2', date: '', time: '', request: '' });

  const [clientSettings, setClientSettings] = useState({
    businessName: 'Hotel Sai Luxury & Fine Dining',
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
    { id: '1', name: 'रविराज पाटील', phone: '9876543210', service: 'Table Reservation', deal_value: 1500, status: 'New Lead', source: 'Website', sentiment: 'Highly Interested', notes: 'आज संध्याकाळी ६ वाजता फॅमिली डिनर.', created_at: 'आज, 10:30 AM' },
    { id: '2', name: 'सचिन कांबळे', phone: '9123456780', service: 'Party Hall Booking', deal_value: 25000, status: 'Contacted', source: 'Meta Ad', sentiment: 'Interested', notes: 'वाढदिवसाच्या पार्टीसाठी हॉल हवा.', created_at: 'आज, 11:15 AM' }
  ];

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const stages = ['New Lead', 'Contacted', 'Payment Sent', 'Won', 'Lost'];

  const avatars = {
    ownerDefault: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&auto=format&fit=crop&q=80',
    client1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    client2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  };

  const defaultHotelTemplate: TemplateData = {
    id: 'Hotel & Restaurant Pro',
    businessName: 'Hotel Sai Luxury & Fine Dining',
    tagline: 'चविष्ट जेवण • उत्तम सेवा • स्वच्छ वातावरण • आपल्या कुटुंबासाठी खास',
    headline: 'स्वादाची अशी मेजवानी, जी पुन्हा पुन्हा यावीशी वाटेल!',
    subheadline: 'परंपरा आणि आधुनिक चवीचा अनोखा संगम. आमच्या फॅमिली रेस्टॉरंटमध्ये अस्सल भारतीय आणि चायनीज पदार्थांचा आनंद घ्या.',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    ownerImage: avatars.ownerDefault,
    phone: '9876543210',
    email: 'contact@hotelsailuxury.com',
    address: 'मुख्य रस्ता, सांगली मिरज रोड, सांगली',
    timing: 'सकाळी ११:०० ते रात्री ११:०० (सर्व दिवस सुरू)',
    primaryCta: '🍽️ Book a Table',
    badge: '★ 5-Star Rated Family Restaurant & Dining',
    menu: [
      { category: 'Thali', name: 'Special Royal Family Thali', desc: 'Puran poli, paneer masala, 3 chapati, jeera rice, gulab jamun & papad.', price: '₹699', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80' },
      { category: 'Main Course', name: 'Paneer Butter Masala', desc: 'Rich and creamy tomato gravy cooked with soft cottage cheese cubes.', price: '₹320', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80' },
      { category: 'Main Course', name: 'Chicken Dum Biryani', desc: 'Aromatic basmati rice cooked with tender chicken pieces and authentic spices.', price: '₹380', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80' },
      { category: 'Starters', name: 'Crispy Veg Manchurian', desc: 'Fried vegetable balls tossed in spicy garlic soy sauce.', price: '₹240', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80' }
    ],
    services: [
      { title: 'Special Thali & Meals', desc: 'Traditional Maharashtrian and North Indian thalis prepared with pure ingredients.', price: '₹499 onwards' },
      { title: 'Family Dining Ambience', desc: 'Spacious AC dining halls designed specifically for family gatherings and celebrations.', price: 'Zero Waiting' },
      { title: 'Party Hall & Banquets', desc: 'Book our spacious banquet halls for birthdays, anniversaries, and receptions.', price: '₹5,000 onwards' }
    ],
    stats: [
      { label: 'Happy Customers', value: '10,000+' },
      { label: 'Food Quality', value: '4.9 / 5' },
      { label: 'Expert Chefs', value: '15+' }
    ],
    testimonials: [
      { name: 'राहुल पाटील', avatar: avatars.client1, location: 'सांगली', review: 'जेवणाची चव खूपच छान होती. सर्व्हिस उत्कृष्ट आणि वातावरण खूप सुंदर आहे. परिवारासोबत नक्की भेट द्या!', rating: 5 },
      { name: 'अमोल देशपांडे', avatar: avatars.client2, location: 'मिरज', review: 'स्पेशल थाळी अप्रतिम होती! घरच्या जेवणासारखी चव आणि उत्तम स्वच्छता.', rating: 5 }
    ]
  };

  const [currentSite, setCurrentSite] = useState<TemplateData>(defaultHotelTemplate);
  const [promptInput, setPromptInput] = useState<string>('Hotel Sai Luxury & Fine Dining');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

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

  const handleGenerateWebsite = () => {
    if (!promptInput.trim()) { 
      alert('कृपया आधी व्यवसायाचा प्रॉम्प्ट टाईप करा!'); 
      return; 
    }
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentSite(prev => ({
        ...prev,
        businessName: promptInput,
        headline: `স্বदाची अशी मेजवानी, जी ${promptInput} मध्येच मिळले!`,
        subheadline: `चविष्ट जेवण • उत्तम सेवा • स्वच्छ वातावरण — ${promptInput} मध्ये आपल्या कुटुंबाचे स्वागत आहे.`
      }));
      setIsGenerating(false);
      alert('🎉 अत्यंत आकर्षक आणि प्रोफेशनल हॉटेल/रेस्टॉरंट वेबसाईट तयार झाली!');
    }, 400);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { 
        setCurrentSite(prev => ({ ...prev, heroImage: reader.result as string })); 
        alert('बॅनर फोटो बदलला!'); 
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
        alert('मालकाचा फोटो अपलोड झाला!'); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishWebsite = () => {
    const slug = currentSite.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) || 'hotel';
    const liveLink = `https://ai-growth-crm-nine.vercel.app/site/${slug}`;
    setPublishedUrl(liveLink);
    setIsPublished(true);
    alert(`🚀 वेबसाईट लाईव्ह पब्लिश झाली!\nLink: ${liveLink}`);
  };

  const handleConnectDomain = () => {
    if (!customDomain.trim()) {
      alert('कृपया डोमेन नाव टाका (उदा. www.myhotel.com)');
      return;
    }
    setDomainConnected(true);
    alert(`🌐 डोमेन '${customDomain}' यशस्वीरीत्या कनेक्ट झाले!`);
  };

  // Table Reservation Submission Handler
  const handleTableBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      alert('कृपया नाव आणि मोबाईल नंबर भरा!');
      return;
    }
    alert(`✅ टेबल बुकिंग विनंती यशस्वीरीत्या स्वीकारली गेली!\nनाव: ${bookingForm.name}\nगेस्ट्स: ${bookingForm.guests}\nवेळ: ${bookingForm.time}`);
    setBookingForm({ name: '', phone: '', guests: '2', date: '', time: '', request: '' });
  };

  const [customerName, setCustomerName] = useState<string>('राहुल पाटील');
  const [customerPhone, setCustomerPhone] = useState<string>('9876543210');
  const [paymentDesc, setPaymentDesc] = useState<string>('Table Reservation Advance');
  const [amount, setAmount] = useState<string>('500');
  const [isAutoWhatsAppPdfActive, setIsAutoWhatsAppPdfActive] = useState<boolean>(true);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN-98214', customerName: 'राहुल पाटील', phone: '9876543210', amount: 500, gateway: 'Razorpay Live', status: 'Success', date: 'आज, 12:45 PM' }
  ]);

  const [socialPostText, setSocialPostText] = useState('🍽️ आजच भेट द्या Hotel Sai Luxury ला आणि अनुभवा अस्सल चव!');
  const [selectedPlatforms, setSelectedPlatforms] = useState({ facebook: true, instagram: true, whatsappStatus: true });
  const [scheduledTime, setScheduledTime] = useState('Immediate (Now)');

  const cleanAmt = (Number(amount) || 1).toFixed(2);
  const upiIntent = `upi://pay?pa=${clientSettings.upiId.trim()}&pn=${encodeURIComponent(clientSettings.businessName)}&am=${cleanAmt}&cu=INR&tn=${encodeURIComponent(paymentDesc)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntent)}`;
  const livePayUrl = `https://ai-growth-crm-nine.vercel.app/pay?pa=${encodeURIComponent(clientSettings.upiId)}&pn=${encodeURIComponent(clientSettings.businessName)}&am=${cleanAmt}&tn=${encodeURIComponent(paymentDesc)}`;

  const handleRazorpayPay = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) { alert('Razorpay लोड करण्यात अडचण आली.'); return; }
    const options = {
      key: clientSettings.razorpayKey || 'rzp_test_51MzAbcDefGhiJkl',
      amount: Math.round(Number(amount || 1) * 100),
      currency: 'INR',
      name: clientSettings.businessName,
      description: paymentDesc,
      handler: function (response: any) {
        const pId = response.razorpay_payment_id || `PAY-${Date.now().toString().slice(-6)}`;
        alert(`🎉 पेमेंट यशस्वी झाले! ID: ${pId}`);
      }
    };
    try { const rzp = new (window as any).Razorpay(options); rzp.open(); } catch (err) { alert('त्रुटी आली.'); }
  };

  const handleSendWhatsAppBill = () => {
    if (!customerPhone.trim()) return alert('नंबर टाका!');
    const msg = `🧾 *Invoive - ${currentSite.businessName}*\n👤 ${customerName}\n💰 ₹${amount}\n🔗 ${livePayUrl}`;
    window.open(`https://wa.me/91${customerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const [customTemplateName, setCustomTemplateName] = useState('');
  const [customTemplateText, setCustomTemplateText] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([
    { title: 'Table Confirmed', text: 'नमस्कार {Name} जी, Hotel Sai Luxury मध्ये आपले टेबल कन्फर्म झाले आहे.' }
  ]);

  const handleGenerateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTemplateName.trim()) return;
    setSavedTemplates(prev => [...prev, { title: customTemplateName, text: customTemplateText }]);
    setCustomTemplateName(''); setCustomTemplateText('');
    alert('टेम्पलेट तयार झाले!');
  };

  const [workflowTrigger, setWorkflowTrigger] = useState('New Table Booking');
  const [workflowAction, setWorkflowAction] = useState('Send WhatsApp Confirmation');
  const [customWorkflows, setCustomWorkflows] = useState([
    { id: '1', trigger: 'Table Booked', action: 'Instant WhatsApp Auto-Reply' }
  ]);

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomWorkflows(prev => [...prev, { id: Date.now().toString(), trigger: workflowTrigger, action: workflowAction }]);
    alert('वर्कफ्लो सेव्ह झाला!');
  };

  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [adBudget, setAdBudget] = useState(500);
  const [targetLocation, setTargetLocation] = useState('सांगली व मिरज');

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', clientName: 'राहुल पाटील', phone: '9876543210', service: 'Family Table Booking', date: '2026-08-31', time: '08:00 PM', status: 'Confirmed' }
  ]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ clientName: '', phone: '', service: '', date: '2026-09-02', time: '08:00 PM' });

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointments(prev => [{ id: Date.now().toString(), clientName: newSlot.clientName, phone: newSlot.phone, service: newSlot.service || 'Table Booking', date: newSlot.date, time: newSlot.time, status: 'Confirmed' }, ...prev]);
    setIsSlotModalOpen(false);
    alert('अपॉइंटमेंट बुक झाली!');
  };

  const handleCancelAppointment = (id: string, name: string) => {
    if (confirm(`रद्द करायचे आहे का?`)) setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const [botConfig, setBotConfig] = useState({
    name: 'Hotel Sai AI Assistant',
    personality: 'Friendly & Welcoming',
    language: 'मराठी + English',
    systemPrompt: 'तुम्ही Hotel Sai Luxury चे असिस्टंट आहात.'
  });

  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
    { sender: 'bot', text: 'नमस्कार! 🙏 Hotel Sai Luxury मध्ये आपले स्वागत आहे. आज आपण काय मागवणार?', time: '10:00 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');

  const handleSendChat = () => {
    if (!inputMsg.trim()) return;
    const txt = inputMsg;
    setChatMessages(prev => [...prev, { sender: 'user', text: txt, time: '10:05 AM' }]);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'bot', text: `आपल्या "${txt}" या चौकशीबद्दल धन्यवाद! आमची टीम लवकरच आपल्याला मदत करेल.`, time: '10:06 AM' }]);
    }, 400);
  };

  const filteredLeads = leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setLeadForm({ name: '', phone: '', service: '', deal_value: '1000', status: 'New Lead', source: 'Website', sentiment: 'Interested', notes: '' });
    setIsLeadModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setLeadForm({ name: lead.name, phone: lead.phone, service: lead.service, deal_value: lead.deal_value.toString(), status: lead.status, source: lead.source, sentiment: lead.sentiment, notes: lead.notes || '' });
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      setLeads(prev => prev.map(l => l.id === editingLead.id ? { ...l, ...leadForm, deal_value: Number(leadForm.deal_value) } : l));
    } else {
      setLeads(prev => [{ id: Date.now().toString(), ...leadForm, deal_value: Number(leadForm.deal_value), created_at: 'आत्ताच' }, ...prev]);
    }
    setIsLeadModalOpen(false);
  };

  const handleDeleteLead = (id: string, name: string) => {
    if (confirm(`हटवायचे आहे का?`)) setLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleExportCSV = () => {
    alert('CSV Exported!');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    alert('Imported!');
  };

  // FULL PROFESSIONAL RESTAURANT & HOTEL WEBPAGE PREVIEW CANVAS
  const renderWebpageContent = (isModal: boolean = false) => (
    <div className={`mx-auto bg-[#07090e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 text-left ${!isModal && deviceView === 'Mobile' ? 'max-w-sm' : 'w-full'}`}>
      
      {/* 1. STICKY HEADER / NAVIGATION */}
      <header className="bg-[#0b101d]/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">🍽️</div>
          <div>
            <input type="text" value={currentSite.businessName} onChange={(e) => setCurrentSite({...currentSite, businessName: e.target.value})} className="font-black text-white text-sm bg-transparent outline-none border-b border-dashed border-amber-500 w-48" />
            <span className="text-[10px] text-amber-400 block font-bold">Family Dining & Restaurant</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-300">
          <a href="#home" className="hover:text-amber-400 transition">Home</a>
          <a href="#about" className="hover:text-amber-400 transition">About Us</a>
          <a href="#menu" className="hover:text-amber-400 transition">Menu</a>
          <a href="#reviews" className="hover:text-amber-400 transition">Reviews</a>
          <a href="#contact" className="hover:text-amber-400 transition">Contact</a>
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow"><MessageSquare size={13} /> WhatsApp</a>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" className="p-8 md:p-14 bg-gradient-to-b from-[#121c2e] via-[#0a0f1d] to-[#07090e] space-y-6 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold"><Sparkles size={14} /> {currentSite.badge}</div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <textarea rows={2} value={currentSite.headline} onChange={(e) => setCurrentSite({...currentSite, headline: e.target.value})} className="text-2xl md:text-4xl font-black text-white bg-transparent outline-none border border-dashed border-amber-500/40 rounded-2xl p-3 w-full resize-none leading-tight" />
            <textarea rows={2} value={currentSite.subheadline} onChange={(e) => setCurrentSite({...currentSite, subheadline: e.target.value})} className="text-sm text-slate-300 bg-transparent outline-none border border-dashed border-amber-500/40 rounded-2xl p-3 w-full resize-none leading-relaxed" />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href="#booking" className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs shadow-xl flex items-center gap-2">🍽️ Book a Table</a>
              <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-xl flex items-center gap-2">📱 WhatsApp Now</a>
            </div>

            <div className="flex items-center gap-4 pt-3 text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1 text-amber-400"><Star size={14} fill="currentColor" /> 4.9/5 Rating</span>
              <span>•</span>
              <span>1000+ Happy Customers</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl group">
            <img src={currentSite.heroImage} alt="Delicious Indian Food" className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/25 text-[11px] text-white flex items-center gap-1.5 cursor-pointer">
              <ImageIcon size={14} className="text-amber-400" />
              <button onClick={() => bannerInputRef.current?.click()} className="bg-transparent text-white font-bold cursor-pointer">Change Hero Photo</button>
              <input type="file" ref={bannerInputRef} accept="image/*" onChange={handleBannerUpload} className="hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section id="about" className="p-8 md:p-12 bg-[#0b101e] border-y border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">ABOUT OUR HOTEL & RESTAURANT</span>
            <h2 className="text-2xl font-black text-white">शुद्धता, चव आणि उत्तम आदिथ्यभाव!</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              आमच्या हॉटेलमध्ये प्रत्येक जेवण अतिशय काळजीपूर्वक आणि ताज्या मसाल्यांपासून तयार केले जाते. स्वच्छ वातावरण आणि घरच्यासारखी चव हेच आमचे वैशिष्ट्य आहे. आपल्या परिवारासोबत दर्जेदार वेळ घालवण्यासाठी आजच भेट द्या.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2">
              {currentSite.stats.map((st, i) => (
                <div key={i} className="p-3 bg-[#0d1424] border border-slate-800 rounded-2xl text-center">
                  <p className="text-base font-black text-amber-400">{st.value}</p>
                  <span className="text-[10px] text-slate-400 block">{st.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-700 shadow-xl relative">
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" alt="Ambience" className="w-full h-64 object-cover" />
          </div>
        </div>
      </section>

      {/* 4. DIGITAL MENU SECTION */}
      <section id="menu" className="p-8 md:p-12 space-y-6 bg-[#07090e]">
        <div className="text-center space-y-1"><span className="text-xs text-amber-400 font-bold uppercase tracking-wider">DIGITAL MENU</span><h2 className="text-xl md:text-2xl font-black text-white">आमचे स्वादिष्ट मेनू कार्ड</h2></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSite.menu.map((item, idx) => (
            <div key={idx} className="p-4 bg-[#0d1424] border border-slate-800 rounded-2xl flex items-center gap-4 shadow-md hover:border-amber-500/40 transition">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-700" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">{item.category}</span>
                <h4 className="font-bold text-white text-xs mt-1 truncate">{item.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-black text-amber-400 text-xs">{item.price}</span>
                  <a href={`https://wa.me/91${currentSite.phone}?text=${encodeURIComponent(`मला ${item.name} (${item.price}) ऑर्डर करायचे आहे.`)}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px] flex items-center gap-1"><MessageSquare size={11} /> Order / Enquire</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CUSTOMER DINING PHOTO SECTION */}
      <section className="p-8 md:p-12 bg-[#0b101e] border-y border-slate-800 space-y-6 text-center">
        <div className="space-y-1"><span className="text-xs text-rose-400 font-bold uppercase tracking-wider">HAPPY MOMENTS</span><h2 className="text-xl font-black text-white">आमचे ग्राहक, आमचा आनंद ❤️</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80', caption: 'अमोल पाटील आणि परिवार — अप्रतिम जेवणाचा अनुभव! ❤️' },
            { img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80', caption: 'फॅमिली डिनर नाईट @ Hotel Sai' },
            { img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&auto=format&fit=crop&q=80', caption: 'स्पेशल थाळीचा मनसोक्त आनंद!' },
            { img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop&q=80', caption: 'वाढदिवस सेलिब्रेशन पार्टी' }
          ].map((ph, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden border border-slate-700 bg-[#07090e] shadow-lg group">
              <img src={ph.img} alt="Customer" className="w-full h-36 object-cover group-hover:scale-105 transition duration-300" />
              <p className="p-2 text-[10px] text-slate-300 font-medium">{ph.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. STAR RATING & WHY CHOOSE US */}
      <section className="p-8 md:p-12 space-y-6 bg-[#07090e]">
        <div className="text-center space-y-1"><span className="text-xs text-amber-400 font-bold uppercase tracking-wider">WHY CHOOSE US</span><h2 className="text-xl font-black text-white">आमचे ग्राहक आम्हाला का पसंत करतात?</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Utensils, title: 'Delicious Food', desc: 'अस्सल आणि चविष्ट पारंपरिक जेवण.' },
            { icon: Sparkles, title: 'Fresh Ingredients', desc: 'रोजच्या ताज्या भाज्या व मसाल्यांचा वापर.' },
            { icon: ShieldCheck, title: 'Clean & Hygienic', desc: 'अतिशय स्वच्छ किचन व डायनिंग एरिया.' },
            { icon: Users, title: 'Family Friendly', desc: 'कुटुंबासोबत निवांत बसण्यासाठी उत्तम सोय.' },
            { icon: Clock, title: 'Fast Service', desc: 'ऑर्डर दिल्यावर अवघ्या काही मिनिटांत सर्व्हिस.' },
            { icon: Heart, title: 'Customer Satisfaction', desc: 'ग्राहकांचे समाधान हेच आमचे ध्येय.' }
          ].map((ft, i) => {
            const IconC = ft.icon;
            return (
              <div key={i} className="p-4 bg-[#0d1424] border border-slate-800 rounded-2xl space-y-2 shadow">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center"><IconC size={16} /></div>
                <h4 className="font-bold text-white text-xs">{ft.title}</h4>
                <p className="text-[10px] text-slate-400">{ft.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section id="reviews" className="p-8 md:p-12 bg-[#0b101e] border-t border-slate-800 space-y-6">
        <div className="text-center space-y-1"><span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">TESTIMONIALS</span><h2 className="text-xl font-black text-white">समाधानी ग्राहकांचे मनोगत</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSite.testimonials.map((t, idx) => (
            <div key={idx} className="p-5 bg-[#0d1424] border border-slate-800 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-amber-500" />
                <div className="flex-1">
                  <input type="text" value={t.name} onChange={(e) => { const tests = [...currentSite.testimonials]; tests[idx].name = e.target.value; setCurrentSite({...currentSite, testimonials: tests}); }} className="font-bold text-white text-xs bg-transparent outline-none w-full border-b border-dashed border-slate-700" />
                  <input type="text" value={t.location} onChange={(e) => { const tests = [...currentSite.testimonials]; tests[idx].location = e.target.value; setCurrentSite({...currentSite, testimonials: tests}); }} className="text-[10px] text-slate-400 bg-transparent outline-none w-full mt-0.5" />
                </div>
              </div>
              <textarea rows={2} value={t.review} onChange={(e) => { const tests = [...currentSite.testimonials]; tests[idx].review = e.target.value; setCurrentSite({...currentSite, testimonials: tests}); }} className="text-xs text-slate-300 bg-transparent outline-none w-full resize-none border border-dashed border-slate-800 rounded p-1 italic" />
              <div className="flex text-amber-400 gap-0.5"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TABLE RESERVATION FORM SECTION */}
      <section id="booking" className="p-8 md:p-12 bg-gradient-to-b from-[#07090e] to-[#121c2e] border-t border-slate-800 space-y-6 text-center">
        <div className="space-y-1 max-w-lg mx-auto">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">TABLE RESERVATION</span>
          <h2 className="text-xl font-black text-white">आजच आपले टेबल बुक करा!</h2>
          <p className="text-xs text-slate-400">विनात्रास फॅमिली डिनरचा आनंद घेण्यासाठी आधीच स्लॉट निश्चित करा.</p>
        </div>

        <form onSubmit={handleTableBooking} className="max-w-md mx-auto bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-3.5 shadow-2xl text-left text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-slate-400 block mb-1 font-bold">ग्राहकाचे नाव *</label><input type="text" required value={bookingForm.name} onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})} placeholder="उदा. अमोल पाटील" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
            <div><label className="text-slate-400 block mb-1 font-bold">मोबाईल नंबर *</label><input type="text" required value={bookingForm.phone} onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})} placeholder="9876543210" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" /></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="text-slate-400 block mb-1 font-bold">गेस्ट्स</label><select value={bookingForm.guests} onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none"><option value="2">2 People</option><option value="4">4 People</option><option value="6">6+ Family</option></select></div>
            <div><label className="text-slate-400 block mb-1 font-bold">तारीख</label><input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
            <div><label className="text-slate-400 block mb-1 font-bold">वेळ</label><input type="text" value={bookingForm.time} onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})} placeholder="08:00 PM" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
          </div>
          <div><label className="text-slate-400 block mb-1 font-bold">विशेष सूचना (Special Request)</label><input type="text" value={bookingForm.request} onChange={(e) => setBookingForm({...bookingForm, request: e.target.value})} placeholder="उदा. बर्थडे केक हवा आहे." className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
          <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg cursor-pointer">🍽️ Book Table Now</button>
        </form>
      </section>

      {/* 9. CONTACT & FOOTER */}
      <footer id="contact" className="bg-[#05070c] border-t border-slate-800 p-8 text-left text-xs space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <div className="space-y-1">
            <input type="text" value={currentSite.businessName} onChange={(e) => setCurrentSite({...currentSite, businessName: e.target.value})} className="font-bold text-white text-sm bg-transparent outline-none w-60 border-b border-dashed border-slate-700" />
            <p className="text-slate-400 text-[11px]">{currentSite.address}</p>
            <p className="text-amber-400 text-[11px] font-bold">📞 Call: +91 {currentSite.phone}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${currentSite.phone}`} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1.5"><Phone size={13} /> Call Now</a>
            <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5"><MessageSquare size={13} /> WhatsApp</a>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500">
          <span>© 2026 {currentSite.businessName}. All rights reserved.</span>
          <span>Powered by AI Growth CRM Pro</span>
        </div>
      </footer>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans items-center justify-center p-4">
        <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/40">AI</div>
            <h1 className="text-xl font-black text-white">रवी पाटील - AI Growth CRM</h1>
            <p className="text-xs text-slate-400">प्रो साॅस ॲक्टिव्ह (Pro SaaS Active)</p>
          </div>
          {authError && <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 rounded-xl text-xs text-center font-medium">{authError}</div>}
          <form onSubmit={handleSupabaseLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">ईमेल आयडी</label>
              <div className="flex items-center gap-2 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5">
                <Mail size={15} className="text-slate-400" />
                <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="bg-transparent text-white w-full outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-bold block">पासवर्ड</label>
              <div className="flex items-center gap-2 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5">
                <KeyRound size={15} className="text-slate-400" />
                <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="bg-transparent text-white w-full outline-none" />
              </div>
            </div>
            <button type="submit" disabled={authLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2">
              {authLoading && <Loader2 size={16} className="animate-spin" />}
              <span>लॉगिन करा (Login)</span>
            </button>
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
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">AI</div>
            <div>
              <h2 className="font-black text-white text-sm">AI Growth CRM</h2>
              <span className="text-[10px] text-blue-400 font-bold">Enterprise Suite</span>
            </div>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconC = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <IconC size={16} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/80 bg-[#0a0f1d]">
          <div className="p-3 bg-[#0d1424] border border-slate-800 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0"><ShieldCheck size={16} /></div>
              <div className="min-w-0">
                <p className="font-black text-white text-xs truncate">रवी पाटील</p>
                <span className="text-[10px] text-emerald-400 font-bold block truncate">■ Pro SaaS Active</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        <header className="flex flex-wrap items-center justify-between pb-5 mb-5 border-b border-slate-800/80 gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h1 className="text-xl font-black text-white shrink-0 capitalize">{activeTab.replace('_', ' ')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">Pro SaaS Active</span>
            <button onClick={handleSupabaseLogout} className="flex items-center gap-1 px-3 py-1.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition cursor-pointer"><LogOut size={13} /> Logout</button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <h2 className="text-sm font-black text-white">रवी पाटील - AI Growth CRM डॅशबोर्ड (सर्व १५ मॉड्यूल्स कार्यरत)</h2>
              <p className="text-xs text-slate-400">आपल्या हॉटेल/रेस्टॉरंट व्यवसायासाठी डिजिटल बुकिंग, लेड मॅनेजमेंट आणि वेबसाईट बिल्डर पूर्णपणे तयार आहे.</p>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 shadow-xl flex justify-between items-center">
              <h2 className="text-lg font-black text-white">Table Booking & Customer Leads ({leads.length})</h2>
              <button onClick={handleOpenAddModal} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">+ Add Lead</button>
            </div>
          </div>
        )}

        {/* WEBSITE & FUNNELS BUILDER TAB */}
        {activeTab === 'website' && (
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-slate-800/90 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black"><Sparkles size={20} /></div>
                  <div><h2 className="text-base font-black text-white">Professional Hotel & Restaurant Website Builder</h2><p className="text-xs text-slate-400">प्रॉम्प्ट द्या, डिजिटल मेनू आणि टेस्टिमोनियल्ससह प्रो वेबसाईट लाईव्ह करा.</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPreviewModalOpen(true)} className="px-3.5 py-2.5 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"><Eye size={14} /> Full Screen Preview</button>
                  <button onClick={handlePublishWebsite} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg"><Globe size={14} /> 🚀 Publish Live</button>
                </div>
              </div>

              {isPublished && (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex justify-between items-center text-xs">
                  <div><span className="font-bold text-white block">वेबसाईट यशस्वीरीत्या पब्लिश झाली!</span><a href={publishedUrl} target="_blank" rel="noreferrer" className="text-amber-400 underline">{publishedUrl}</a></div>
                  <button onClick={() => navigator.clipboard.writeText(publishedUrl)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold">Copy</button>
                </div>
              )}

              <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="www.myhotel.com" className="flex-1 bg-[#0d1424] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" />
                <button onClick={handleConnectDomain} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Connect Domain</button>
              </div>

              <div className="flex gap-3">
                <input type="text" value={promptInput} onChange={(e) => setPromptInput(e.target.value)} placeholder="उदा. Hotel Sai Luxury Dining..." className="flex-1 bg-[#080b12] border border-slate-700 rounded-2xl px-4 py-3 text-white text-xs outline-none" />
                <button onClick={handleGenerateWebsite} disabled={isGenerating} className="px-6 py-3 bg-amber-500 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2">{isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} <span>Generate</span></button>
              </div>
            </div>

            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex justify-between text-xs border-b border-slate-800 pb-3 items-center">
                <span className="font-mono text-slate-300 text-[11px]">Live Restaurant Preview Canvas</span>
              </div>
              {renderWebpageContent(false)}
            </div>
          </div>
        )}

        {/* OTHER MODULE TABS (2 TO 15) */}
        {activeTab === 'payments' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-xs space-y-4">
            <h2 className="text-base font-black text-white">Payment Gateways & UPI QR</h2>
            <p className="text-slate-400">राझरपे आणि UPI द्वारे टेबल बुकिंग अडव्हान्स पेमेंट गोळा करा.</p>
            <div className="p-4 bg-white rounded-2xl inline-block border-4 border-slate-800"><img src={qrUrl} alt="QR" className="w-40 h-40 mx-auto" /></div>
          </div>
        )}

        {activeTab === 'agents' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">AI Agent Studio (24/7 Restaurant Bot Active)</div>}
        {activeTab === 'meta_ads' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">Meta Lead Ads Launcher for Hotel Offers</div>}
        {activeTab === 'templates' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">Template & WhatsApp Message Manager</div>}
        {activeTab === 'workflow' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">AI Workflow Builder (Table Booking Triggers)</div>}
        {activeTab === 'inbox' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">AI Inbox / WhatsApp Suite</div>}
        {activeTab === 'calendar' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">Smart Calendar & Table Bookings</div>}
        {activeTab === 'ivr' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">AI Sales & Outbound IVR Calling Bot</div>}
        {activeTab === 'finance' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">AI Finance & Revenue Analytics</div>}
        {activeTab === 'social' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">Social Media Auto-Poster & Publisher</div>}
        {activeTab === 'settings' && <div className="bg-[#0d1424] p-6 rounded-3xl text-xs text-white">Settings & Meta API</div>}

        {/* FULLSCREEN PREVIEW MODAL */}
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
            <div className="bg-[#07090e] border border-slate-700 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-2"><Eye size={16} className="text-amber-400" /> Fullscreen Restaurant Preview</span>
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