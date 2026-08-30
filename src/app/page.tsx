'use client';

import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import Sidebar from '../components/Sidebar';
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
  Sliders, MessageCircle, BarChart3, ChevronRight, Pause, Lock, CheckCircle, LogOut, KeyRound, Mail, User
} from 'lucide-react';

// Supabase Real Client Initialization (Your Project Credentials)
const supabaseUrl = 'https://yvaqrcdqehybzznpwaeb.supabase.co';
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

// Razorpay SDK Script Loader
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
  // Authentication States (Supabase Connected)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [deviceView, setDeviceView] = useState<'Desktop' | 'Mobile'>('Desktop');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  // Leads Filter States
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  // Leads Add/Edit Modal State
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

  // Check existing Supabase session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Supabase Secure Login
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
        setAuthError(error.message === 'Invalid login credentials' ? 'चुकीचा ईमेल किंवा पासवर्ड! कृपया Supabase क्रेडेंशियल्स तपासा.' : error.message);
      } else if (data.session) {
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      setAuthError('लॉगिन करताना तांत्रिक अडचण आली.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Supabase Forgot Password
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

  // Handle Supabase Logout
  const handleSupabaseLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  // 15 Complete Leads Database
  const initialLeads: Lead[] = [
    { id: '1', name: 'रविराज पाटील', phone: '9876543210', service: 'Dental Clinic Setup', deal_value: 1500, status: 'New Lead', source: 'Website', sentiment: 'Highly Interested', notes: 'आज संध्याकाळी ६ वाजता बोलणे ठरले आहे.', created_at: 'आज, 10:30 AM' },
    { id: '2', name: 'सचिन कांबळे', phone: '9123456780', service: '5G Smartphone Buy', deal_value: 25000, status: 'Contacted', source: 'Meta Lead Ad', sentiment: 'Interested', notes: 'iPhone 15 च्या EMI स्कीम्सबद्दल विचारले.', created_at: 'आज, 11:15 AM' },
    { id: '3', name: 'अमित देशमुख', phone: '9822334455', service: 'Screen Repair', deal_value: 4500, status: 'Payment Sent', source: 'Instagram Ad', sentiment: 'Follow-up', notes: 'पेमेंट लिंक पाठवली आहे, पेमेंट बाकी.', created_at: 'काल, 04:20 PM' },
    { id: '4', name: 'प्रियांका शिंदे', phone: '9765432109', service: 'Skin Treatment', deal_value: 3200, status: 'Won', source: 'WhatsApp Direct', sentiment: 'Positive', notes: 'पेमेंट जमा झाले, स्लॉट बुक केला.', created_at: 'काल, 06:10 PM' },
    { id: '5', name: 'विकास मोरे', phone: '9988776655', service: 'Orthopedic Visit', deal_value: 800, status: 'New Lead', source: 'Website', sentiment: 'Cold', notes: 'पहिला कॉल उचलला नाही.', created_at: '28 Aug' },
    { id: '6', name: 'स्नेहल पवार', phone: '9834123456', service: 'Bridal Makeup Package', deal_value: 15000, status: 'Contacted', source: 'Facebook Ad', sentiment: 'Highly Interested', notes: 'ऑक्टोबर लग्नासाठी बुकिंग हवी आहे.', created_at: '28 Aug' },
    { id: '7', name: 'राहुल सावंत', phone: '9422001122', service: 'Full Health Checkup', deal_value: 2999, status: 'Payment Sent', source: 'Website', sentiment: 'Interested', notes: 'UPI QR स्कॅन करून भरत आहेत.', created_at: '27 Aug' },
    { id: '8', name: 'महेश जाधव', phone: '9552114477', service: 'Car Full Servicing', deal_value: 1200, status: 'Won', source: 'Referral', sentiment: 'Positive', notes: 'गाडी गॅरेजवर आणली आहे.', created_at: '27 Aug' },
    { id: '9', name: 'पूजा कुलकर्णी', phone: '9890665544', service: 'Digital Marketing Course', deal_value: 6000, status: 'New Lead', source: 'Meta Lead Ad', sentiment: 'Interested', notes: 'अभ्यासक्रमाचा सिलॅबस व्हॉट्सॲपवर पाठवला.', created_at: '26 Aug' },
    { id: '10', name: 'किरण थोरात', phone: '9371889900', service: 'GST Registration', deal_value: 500, status: 'Contacted', source: 'WhatsApp Direct', sentiment: 'Follow-up', notes: 'पॅन कार्ड व आधार कार्ड कागदपत्रे बाकी.', created_at: '26 Aug' },
    { id: '11', name: 'दिनेश गायकवाड', phone: '9860127890', service: 'Gym 3-Month Plan', deal_value: 1000, status: 'Won', source: 'Instagram Ad', sentiment: 'Positive', notes: 'जिम पास कार्ड ॲक्टिव्हेट केले.', created_at: '25 Aug' },
    { id: '12', name: 'सुप्रिया भोसले', phone: '9158334455', service: 'Cosmetic Filling', deal_value: 2500, status: 'Payment Sent', source: 'Website', sentiment: 'Interested', notes: 'उद्या दुपारची वेळ दिली आहे.', created_at: '25 Aug' },
    { id: '13', name: 'रोहन शिंदे', phone: '9730445566', service: '2 BHK Flat Enquiry', deal_value: 4000, status: 'New Lead', source: 'Meta Lead Ad', sentiment: 'Interested', notes: 'रविवारच्या साईट व्हिजिटसाठी नोंद केली.', created_at: '24 Aug' },
    { id: '14', name: 'अनिल काळे', phone: '9823998877', service: 'Family Dining Special', deal_value: 1500, status: 'Contacted', source: 'Facebook Ad', sentiment: 'Positive', notes: '१० जणांच्या टेबलचे आरक्षण.', created_at: '24 Aug' },
    { id: '15', name: 'ज्ञानेश्वर माने', phone: '9673112233', service: 'Dental Implant Pro', deal_value: 35000, status: 'Won', source: 'Website', sentiment: 'Positive', notes: 'शस्त्रक्रियेचे पूर्ण ॲडव्हान्स पेमेंट मिळाले.', created_at: '23 Aug' },
  ];

  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const stages = ['New Lead', 'Contacted', 'Payment Sent', 'Won', 'Lost'];

  // Industry Stock Images & Avatars Library
  const industryImages: Record<string, string> = {
    csc: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80',
    mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    clinic: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
    property: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
    academy: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    garage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&auto=format&fit=crop&q=80',
    beauty: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80',
    agency: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    generic: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80'
  };

  const avatars = {
    male1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    male2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    female1: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    female2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  };

  // 10 Full Templates Database
  const templatesDb: Record<string, TemplateData> = {
    'CSC & Online Services': {
      id: 'CSC & Online Services',
      businessName: 'आपले सरकार & CSC डिजिटल सेवा केंद्र',
      tagline: 'सर्व सरकारी योजना, दाखले, पॅन, आधार व ऑनलाईन फॉर्म्स',
      headline: 'सर्व सरकारी दाखले व ऑनलाईन कामे एकाच छताखाली - जलद आणि खात्रीशीर सेवा!',
      subheadline: 'उत्पन्न, जात, डोमिसाइल दाखले, नवीन पॅन कार्ड, पीएम किसान नोंदणी, ई-श्रम आणि सर्व भरती फॉर्म्स त्वरित भरून मिळतील.',
      heroImage: industryImages.csc,
      phone: '9876543210',
      email: 'csc.services@digitalgov.in',
      address: 'तहसील कार्यालयासमोर, स्टेशन रोड, सांगली',
      timing: 'सकाळी ९:०० ते रात्री ८:०० (सर्व दिवस सुरू)',
      primaryCta: 'दाखल्यासाठी संपर्क करा',
      badge: '★ अधिकृत CSC व आपले सरकार केंद्र',
      services: [
        { title: 'सर्व सरकारी दाखले (Certificates)', desc: 'उत्पन्न दाखला, रहिवासी, जात प्रमाणपत्र, नॉन क्रिमीलेयर व गॅझेट नोंदणी.', price: '₹१०० पासून' },
        { title: 'इन्स्टंट पॅन कार्ड & आधार सेवा', desc: 'नवीन पॅन कार्ड २ तासांत, पॅन-आधार लिंक आणि दुरुस्ती सुविधा.', price: '₹१५०' },
        { title: 'शासकीय योजना & भरती अर्ज', desc: 'लाडकी बहीण, पीएम किसान, आयुष्मान भारत आणि सर्व नोकरी भरती ऑनलाईन अर्ज.', price: '₹५० पासून' }
      ],
      stats: [
        { label: 'काढलेले दाखले', value: '१५,०००+' },
        { label: 'योजना लाभार्थी', value: '५,०००+' },
        { label: 'समाधानी नागरिक', value: '१००%' }
      ],
      testimonials: [
        { name: 'सचिन कांबळे', avatar: avatars.male2, location: 'सांगली', review: 'उत्पन्नाचा दाखला अवघ्या २ दिवसांत काढून मिळाला. कोणतेही हेलपाटे न मारता काम झाले!', rating: 5 },
        { name: 'प्रियांका शिंदे', avatar: avatars.female1, location: 'मिरज', review: 'लाडकी बहीण योजनेचा फॉर्म कोणत्याही त्रुटीशिवाय भरून दिला. खूपच तत्पर सेवा!', rating: 5 }
      ]
    },
    'Mobile & Electronics': {
      id: 'Mobile & Electronics',
      businessName: 'ईश्वरी मोबाईल & ५G स्मार्ट गॅलरी',
      tagline: 'स्मार्टफोन्स, प्रिमियम ॲक्सेसरीज आणि इन्स्टंट रिपेअरिंग',
      headline: 'नवीन 5G स्मार्टफोन्सवर मिळवा थेट २०% सूट आणि शून्य डाऊनपेमेंट EMI!',
      subheadline: 'iPhone, OnePlus, Samsung, Vivo चे सर्व अधिकृत मॉडेल्स सर्वोत्तम किमतीत उपलब्ध. सोबत फ्री गिफ्ट्स आणि २ वर्षांची वॉरंटी.',
      heroImage: industryImages.mobile,
      phone: '9876543210',
      email: 'contact@ishwarimobile.com',
      address: 'कॉलेज रोड, ईश्वरी टॉवर, सांगली',
      timing: 'सकाळी १०:०० ते रात्री १०:०० (सर्व दिवस सुरू)',
      primaryCta: 'धमाका ऑफर क्लेम करा',
      badge: '★ अधिकृत ५G पार्टनर & ब्रँड वॉरंटी',
      services: [
        { title: 'नवीन 5G स्मार्टफोन्स विक्री', desc: 'सर्व नामांकित ब्रँड्सचे ओरिजिनल मोबाईल ०% EMI आणि कॅशबॅकवर उपलब्ध.', price: '₹९,९९९ पासून' },
        { title: '३० मिनिटांत स्क्रीन & बॅटरी रिपेअर', desc: 'ओरिजिनल डिस्प्ले, बॅटरी बदलणे आणि मदरबोर्ड आयसी दुरुस्ती वॉरंटीसह.', price: '₹४९९ पासून' },
        { title: 'मोबाईल एक्सचेंज महामेळावा', desc: 'कोणताही जुना फोन आणा आणि नवीन फोनवर मिळवा सर्वोत्तम एक्सचेंज व्हॅल्यू.', price: 'बेस्ट प्राईस' }
      ],
      stats: [
        { label: 'समाधानी ग्राहक', value: '२५,०००+' },
        { label: 'यशस्वी रिपेअरिंग', value: '८,५००+' },
        { label: 'गुगल रेटिंग', value: '४.९ ★' }
      ],
      testimonials: [
        { name: 'रविराज पाटील', avatar: avatars.male1, location: 'सांगली', review: 'माझ्या iPhone चा डिस्प्ले फक्त ३० मिनिटांत ओरिजिनल बदलून दिला. खूपच प्रामाणिक सेवा!', rating: 5 },
        { name: 'अमित देशमुख', avatar: avatars.male2, location: 'कुपवाड', review: 'इतर दुकानांपेक्षा इथे मोबाईलवर ₹२,००० कमी किंमत मिळाली. शून्य डाऊनपेमेंट EMI सोपी आहे.', rating: 5 }
      ]
    },
    'Doctor & Clinic': {
      id: 'Doctor & Clinic',
      businessName: 'संजीवनी मल्टिस्पेशालिटी & दंत चिकित्सा केंद्र',
      tagline: 'विश्वासार्ह आरोग्य सेवा आणि आधुनिक लेझर उपचार',
      headline: 'तुमच्या आणि संपूर्ण कुटुंबाच्या आरोग्याची संपूर्ण काळजी - तज्ज्ञ डॉक्टरांकडून',
      subheadline: 'आधुनिक तंत्रज्ञान, वेदनाविरहित रूट कॅनल आणि १०+ वर्षांचा प्रदीर्घ वैद्यकीय अनुभव.',
      heroImage: industryImages.clinic,
      phone: '9876543210',
      email: 'care@sanjeevanihospital.com',
      address: 'स्टेशन रोड, मुख्य चौक, सांगली',
      timing: 'सकाळी ९:०० ते रात्री ९:००',
      primaryCta: 'अपॉइंटमेंट बुक करा',
      badge: '★ ISO ९००१ प्रमाणित क्लिनिक',
      services: [
        { title: 'लेझर रूट कॅनल & दंत इम्प्लांट', desc: 'आधुनिक जर्मन उपकरणांद्वारे एकाच सिटिंगमध्ये वेदनाविरहित दातांचे उपचार.', price: '₹१,५०० पासून' },
        { title: 'ऑर्थोपेडिक व सांधेदुखी चिकित्सा', desc: 'गुडघेदुखी, मणक्याचे आजार आणि फ्रॅक्चरवर आधुनिक तज्ज्ञ उपचार.', price: '₹८०० पासून' },
        { title: 'कम्प्लिट फुल बॉडी चेकअप', desc: 'रक्त तपासणी, ECG, लिपिड प्रोफाईल आणि डॉक्टरांचे सविस्तर मार्गदर्शन.', price: '₹२,९९९ पासून' }
      ],
      stats: [
        { label: 'उपचारित रुग्ण', value: '१२,०००+' },
        { label: 'यशस्वी सर्जरी', value: '१,८००+' },
        { label: 'अनुभवी डॉक्टर्स', value: '१०+' }
      ],
      testimonials: [
        { name: 'ज्ञानेश्वर माने', avatar: avatars.male1, location: 'सांगली', review: 'रूट कॅनल करताना अजिबात त्रास झाला नाही. डॉक्टरांचे बोलणे खूप दिलासा देणारे आहे.', rating: 5 },
        { name: 'सुप्रिया भोसले', avatar: avatars.female2, location: 'मिरज', review: 'सांधेदुखीवर इथे खूप चांगला गुण आला. अत्यंत स्वच्छ रुग्णालय.', rating: 5 }
      ]
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string>('CSC & Online Services');
  const [currentSite, setCurrentSite] = useState<TemplateData>(templatesDb['CSC & Online Services']);
  const [promptInput, setPromptInput] = useState<string>('csc center sathi ५-स्टार वेबसाइट बनवा');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Payment Setup States
  const [upiId, setUpiId] = useState<string>('ishwarimobile@ibl');
  const [businessNameUpi, setBusinessNameUpi] = useState<string>('Ishwari Mobile & CSC');
  const [customerName, setCustomerName] = useState<string>('सचिन कांबळे');
  const [customerPhone, setCustomerPhone] = useState<string>('9123456780');
  const [paymentDesc, setPaymentDesc] = useState<string>('5G Smartphone Advance Payment');
  const [amount, setAmount] = useState<string>('2500');
  const [isAutoWhatsAppPdfActive, setIsAutoWhatsAppPdfActive] = useState<boolean>(true);

  // Multi-Gateway API Credentials State
  const [gateways, setGateways] = useState({
    razorpayKey: 'rzp_live_98xK19873219472',
    razorpaySecret: '••••••••••••••••••••••••',
    cashfreeAppId: 'CF_APP_892348923489',
    cashfreeSecret: '••••••••••••••••••••••••',
    stripeKey: 'pk_live_51MzAbcDefGhiJklMnOp',
    paytmMerchantId: 'MID_ISHWARI982347'
  });

  // Recent Transactions History
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN-98214', customerName: 'सचिन कांबळे', phone: '9123456780', amount: 2500, gateway: 'Razorpay Live', status: 'Success', date: 'आज, 12:45 PM' },
    { id: 'TXN-98213', customerName: 'प्रियांका शिंदे', phone: '9765432109', amount: 3200, gateway: 'Dynamic UPI QR', status: 'Success', date: 'आज, 11:10 AM' },
    { id: 'TXN-98212', customerName: 'ज्ञानेश्वर माने', phone: '9673112233', amount: 35000, gateway: 'Cashfree Webhook', status: 'Success', date: 'काल, 05:20 PM' },
    { id: 'TXN-98211', customerName: 'अमित देशमुख', phone: '9822334455', amount: 4500, gateway: 'WhatsApp UPI Link', status: 'Pending', date: 'काल, 03:40 PM' },
  ]);

  // Social Media Auto-Poster States
  const [socialPostText, setSocialPostText] = useState('💥 Ishwari Mobile कडून नवीन 5G स्मार्टफोन्सवर २०% सूट आणि शून्य डाऊनपेमेंट EMI!');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true,
    instagram: true,
    whatsappStatus: true
  });
  const [scheduledTime, setScheduledTime] = useState('Immediate (Now)');

  // Clean UPI Intent & Live Working QR URL
  const cleanAmt = (Number(amount) || 1).toFixed(2);
  const upiIntent = `upi://pay?pa=${upiId.trim()}&pn=${encodeURIComponent(businessNameUpi)}&am=${cleanAmt}&cu=INR&tn=${encodeURIComponent(paymentDesc)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntent)}`;
  const livePayUrl = `https://ai-growth-crm-nine.vercel.app/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(businessNameUpi)}&am=${cleanAmt}&tn=${encodeURIComponent(paymentDesc)}`;

  // Handle Razorpay Checkout Modal with Auto-WhatsApp PDF trigger
  const handleRazorpayPay = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay गेटवे लोड करण्यात अडचण आली. कृपया इंटरनेट कनेक्शन तपासा.');
      return;
    }

    const options = {
      key: gateways.razorpayKey || 'rzp_test_51MzAbcDefGhiJkl',
      amount: Math.round(Number(amount || 1) * 100),
      currency: 'INR',
      name: businessNameUpi,
      description: paymentDesc,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&auto=format&fit=crop&q=80',
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
            `भेट दिल्याबद्दल धन्यवाद! 🙏 - ${businessNameUpi}`;
          
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

  // Handle WhatsApp Bill Send
  const handleSendWhatsAppBill = () => {
    if (!customerPhone.trim()) {
      alert('कृपया ग्राहकाचा व्हॉट्सॲप नंबर टाका!');
      return;
    }
    const msg = `🧾 *पेमेंट इनव्हॉइस - ${businessNameUpi}*\n\n` +
      `👤 *ग्राहक नाव:* ${customerName}\n` +
      `📦 *तपशील / सेवा:* ${paymentDesc}\n` +
      `💰 *एकूण रक्कम:* ₹${amount}\n\n` +
      `📲 *थेट UPI द्वारे भरण्यासाठी खालील लिंकवर क्लिक करा:*\n${livePayUrl}\n\n` +
      `_UPI ID: ${upiId} (GPay/PhonePe/Paytm/BHIM)_ \n\n` +
      `धन्यवाद! 🙏`;
    window.open(`https://wa.me/91${customerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Handle Print Receipt
  const handlePrintReceipt = () => {
    const printWindow = window.open('', '', 'width=600,height=700');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt - ${customerName}</title>
            <style>
              body { font-family: sans-serif; padding: 25px; color: #111; line-height: 1.5; }
              .header { text-align: center; border-bottom: 2px dashed #888; padding-bottom: 12px; margin-bottom: 15px; }
              .title { font-size: 20px; font-weight: bold; }
              .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
              .amount { font-size: 22px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; border: 1px solid #10b981; padding: 10px; border-radius: 8px; }
              .footer { text-align: center; font-size: 11px; color: #666; margin-top: 25px; border-top: 1px solid #eee; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">${businessNameUpi}</div>
              <div>अधिकृत पेमेंट पावती / Invoice</div>
              <div>दिनांक: ${new Date().toLocaleDateString('mr-IN')}</div>
            </div>
            <div class="row"><span>ग्राहक नाव:</span><b>${customerName}</b></div>
            <div class="row"><span>मोबाईल नंबर:</span><b>+91 ${customerPhone}</b></div>
            <div class="row"><span>सेवा / उत्पादन:</span><b>${paymentDesc}</b></div>
            <div class="row"><span>UPI ID:</span><b>${upiId}</b></div>
            <div class="amount">प्राप्त रक्कम: ₹${amount}</div>
            <div class="row"><span>पेमेंट स्टेटस:</span><b style="color:green;">✔ VERIFIED SUCCESSFUL</b></div>
            <div class="footer">
              हे डिजिटल बिल AI Growth CRM द्वारे तयार केले आहे.<br/>
              भेट दिल्याबद्दल धन्यवाद!
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Templates Generator States
  const [customTemplateName, setCustomTemplateName] = useState('');
  const [customTemplateText, setCustomTemplateText] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([
    { title: 'Welcome Inquiry', text: 'नमस्कार {Name} जी, Ishwari Mobile मध्ये आपले स्वागत आहे. आम्ही आपली कशी मदत करू शकतो?' },
    { title: 'Instant UPI Payment Request', text: 'नमस्कार {Name} जी, आपल्या {Service} चे ₹{Amount} चे डिजिटल बिल व UPI QR लिंक खालीलप्रमाणे आहे.' },
    { title: 'Appointment Confirmed', text: 'आपली {Service} ची अपॉइंटमेंट निश्चित झाली आहे. वेळेवर उपस्थित राहावे.' }
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

  // Workflow Builder States
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

  // Meta Ad Account Login State
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [metaAdAccount, setMetaAdAccount] = useState('act_982347892347');
  const [adBudget, setAdBudget] = useState(500);
  const [targetLocation, setTargetLocation] = useState('सांगली व मिरज (१० किमी परिसर)');

  // Smart Calendar States
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', clientName: 'सचिन कांबळे', phone: '9123456780', service: '5G Smartphone Buy', date: '2026-08-31', time: '11:00 AM', status: 'Confirmed' },
    { id: '2', clientName: 'अमित देशमुख', phone: '9822334455', service: 'Screen Repair', date: '2026-08-31', time: '02:00 PM', status: 'Pending' },
    { id: '3', clientName: 'प्रियांका शिंदे', phone: '9765432109', service: 'Skin Treatment', date: '2026-09-01', time: '05:30 PM', status: 'Confirmed' }
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

  // AI Chatbot States
  const [botConfig, setBotConfig] = useState({
    name: 'Ishwari AI Assistant',
    personality: 'Professional & Friendly',
    language: 'मराठी + English (Hinglish)',
    autoDiscount: true,
    discountPercent: 10,
    systemPrompt: 'तुम्ही Ishwari Mobile आणि CSC केंद्राचे अधिकृत AI असिस्टंट आहात. ग्राहकांना मराठीत नम्रतेने उत्तरे द्या.'
  });

  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
    { sender: 'bot', text: 'नमस्कार! 🙏 Ishwari AI मध्ये आपले स्वागत आहे. मी आपल्याला कशी मदत करू?', time: '10:00 AM' }
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
      if (lower.includes('price') || lower.includes('किंमत') || lower.includes('ऑफर')) {
        botReply += `आज आमच्याकडे नवीन 5G स्मार्टफोन्सवर २०% सूट आणि ०% EMI उपलब्ध आहे!`;
      } else {
        botReply += `आमची टीम तुम्हाला अधिक माहितीसाठी लवकरच कॉल करेल!`;
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 400);
  };

  // AI Inbox / WhatsApp States
  const [selectedLead, setSelectedLead] = useState<Lead>(initialLeads[0]);
  const [inboxText, setInboxText] = useState<string>('');
  const [inboxChats, setInboxChats] = useState<Record<string, { from: 'me' | 'them'; text: string; time: string }[]>>({
    '1': [
      { from: 'them', text: 'नमस्कार, मला नवीन क्लिनिकसाठी सेटअपची माहिती हवी होती.', time: '10:25 AM' },
      { from: 'me', text: 'नमस्कार रविराज जी, Ishwari CRM मध्ये आपले स्वागत आहे.', time: '10:30 AM' }
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

  // AI Sales & IVR States
  const [aiVoiceScript, setAiVoiceScript] = useState<string>('नमस्कार, मी Ishwari Mobile कडून AI असिस्टंट बोलत आहे. आपल्या चौकशीबद्दल धन्यवाद.');
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

  const handleGenerateWebsite = () => {
    if (!promptInput.trim()) { alert('कृपया प्रॉम्प्ट टाईप करा!'); return; }
    setIsGenerating(true);
    setTimeout(() => {
      const lower = promptInput.toLowerCase();
      let matchedKey = 'CSC & Online Services';
      if (lower.includes('mobile') || lower.includes('मोबाईल')) matchedKey = 'Mobile & Electronics';
      else if (lower.includes('doctor') || lower.includes('क्लिनिक')) matchedKey = 'Doctor & Clinic';
      else if (lower.includes('gym') || lower.includes('जिम')) matchedKey = 'Gym & Fitness';
      else if (lower.includes('hotel') || lower.includes('रेस्टॉरंट')) matchedKey = 'Restaurant & Cafe';
      
      setSelectedTemplate(matchedKey);
      setCurrentSite(templatesDb[matchedKey] || templatesDb['CSC & Online Services']);
      setIsGenerating(false);
    }, 400);
  };

  const toggleVoiceRecording = () => {
    if (typeof window === 'undefined') return;
    if (isListening) { setIsListening(false); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice Mic सपोर्ट नाही.'); return; }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'mr-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => { setPromptInput(event.results[0][0].transcript); };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) { setIsListening(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setCurrentSite(prev => ({ ...prev, heroImage: reader.result as string })); alert('फोटो सेट झाला!'); };
      reader.readAsDataURL(file);
    }
  };

  const SidebarComp = Sidebar as any;

  const renderWebpageContent = (isModal: boolean = false) => (
    <div className={`mx-auto bg-[#07090e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${!isModal && deviceView === 'Mobile' ? 'max-w-sm' : 'w-full'}`}>
      <header className="bg-[#0b101d] border-b border-slate-800/80 px-5 py-3.5 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h4 className="font-black text-white text-sm tracking-wide leading-tight">{currentSite.businessName}</h4>
          <span className="text-[10px] text-blue-400 font-semibold">{currentSite.tagline}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-md"><MessageSquare size={12} /> WhatsApp</a>
          <a href={`tel:${currentSite.phone}`} className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-md"><Phone size={12} /> कॉल करा</a>
        </div>
      </header>

      <section className="p-6 md:p-8 bg-gradient-to-b from-[#0e1628] via-[#0a0f1d] to-[#07090e] text-left space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-[11px] font-bold"><Sparkles size={12} /> {currentSite.badge}</div>
        <h1 className="text-xl md:text-2xl font-black text-white leading-snug">{currentSite.headline}</h1>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">{currentSite.subheadline}</p>
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
          <img src={currentSite.heroImage} alt="Hero" className="w-full h-52 md:h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"><Zap size={14} /> {currentSite.primaryCta}</a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 px-6 py-4 bg-[#0b101e] border-y border-slate-800 text-center">
        {currentSite.stats.map((st, i) => (
          <div key={i} className="p-2"><p className="text-lg md:text-xl font-black text-blue-400">{st.value}</p><span className="text-[10px] text-slate-400 block">{st.label}</span></div>
        ))}
      </section>

      <section className="p-6 md:p-8 space-y-4 text-left">
        <div className="text-center space-y-1 mb-5"><span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">आमच्या खास सेवा</span><h3 className="text-base md:text-lg font-black text-white">लोकप्रिय उत्पादने आणि सेवा</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {currentSite.services.map((srv, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-2 flex flex-col justify-between shadow-md">
              <div>
                <h4 className="font-bold text-white text-xs">{srv.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{srv.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between"><span className="font-black text-emerald-400 text-xs">{srv.price}</span></div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#05070c] border-t border-slate-800 p-6 text-left text-xs">
        <p className="font-bold text-white text-sm">{currentSite.businessName}</p>
        <p className="text-[11px] text-slate-400 mt-1">{currentSite.address}</p>
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
            <h1 className="text-xl font-black text-white">AI Growth CRM & Suite</h1>
            <p className="text-xs text-slate-400">अधिकृत ग्राहकांसाठी सुरक्षित लॉगिन पोर्टल</p>
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

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans antialiased overflow-hidden">
      <SidebarComp activeTab={activeTab} setActiveTab={setActiveTab} />
      <input type="file" ref={fileInputRef} accept=".csv" onChange={handleImportCSV} className="hidden" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        
        {/* Top Header with Supabase Logout Option */}
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
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search in CRM..." className="bg-transparent text-white outline-none w-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
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
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span><span className="text-xs font-bold text-slate-200">AI Quick Actions (15 Modules Locked):</span></div>
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
            <div className="bg-[#0d1424] border border-slate-800/90 rounded-3xl p-5 space-y-4 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black"><Sparkles size={20} /></div>
                  <div><h2 className="text-base font-black text-white">AI Voice & Prompt 5-Star Website Generator</h2><p className="text-xs text-slate-400">माईकवर बोलून किंवा प्रॉम्प्ट देऊन वेबसाईट बनवा.</p></div>
                </div>
                <button onClick={() => setIsPreviewModalOpen(true)} className="px-3.5 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5"><Eye size={14} /> Full Screen Preview</button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[280px] bg-[#080b12] border border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Sparkles size={18} className="text-blue-400 shrink-0" />
                  <input type="text" value={promptInput} onChange={(e) => setPromptInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerateWebsite()} placeholder="उदा. 'csc center sathi ५-स्टार वेबसाइट बनवा'..." className="bg-transparent text-white text-xs outline-none w-full" />
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
                <h3 className="font-bold text-white uppercase text-[11px]">Live Content Editor</h3>
                <div className="p-3 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-slate-300 font-bold block text-[11px]">बॅनर फोटो अपलोड करा</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-blue-600 file:text-white" />
                </div>
                <div><label className="text-slate-400 block mb-1">Business Name</label><input type="text" value={currentSite.businessName} onChange={(e) => setCurrentSite({ ...currentSite, businessName: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                <div><label className="text-slate-400 block mb-1">Headline</label><textarea rows={2} value={currentSite.headline} onChange={(e) => setCurrentSite({ ...currentSite, headline: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none" /></div>
                <div><label className="text-slate-400 block mb-1">WhatsApp / Phone</label><input type="text" value={currentSite.phone} onChange={(e) => setCurrentSite({ ...currentSite, phone: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white font-mono outline-none" /></div>
              </div>

              <div className="lg:col-span-8 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex justify-between text-xs border-b border-slate-800 pb-3 items-center">
                  <span className="font-mono text-slate-300 text-[11px]">Live Canvas</span>
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
                      <h3 className="font-bold text-white text-sm">DYNAMIC MULTI-UPI & RAZORPAY CHECKOUT</h3>
                      <p className="text-[11px] text-slate-400">पेमेंट झाल्यानंतर ग्राहकाच्या WhatsApp वर स्वयंचलित PDF पावती पाठवली जाईल.</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">
                    Auto-PDF Active
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
                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Business Name on UPI</label>
                    <input type="text" value={businessNameUpi} onChange={(e) => setBusinessNameUpi(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500" />
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
                  <button type="button" onClick={handleSendWhatsAppBill} className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/35 transition text-xs cursor-pointer">
                    <Send size={15} /> Send WhatsApp Bill
                  </button>
                  <button type="button" onClick={handlePrintReceipt} className="py-3 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition text-xs cursor-pointer">
                    <Printer size={15} /> Print PDF Bill
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
                <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full font-bold">Meta Graph API Ready</span>
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

        {/* 15. SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto w-full space-y-6 text-xs">
            <h3 className="font-bold text-white uppercase text-xs flex items-center gap-2"><Settings size={16} className="text-blue-400" /> Meta API Settings</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('सेव्ह झाले!'); }} className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div><label className="text-slate-400 block mb-1">WhatsApp Phone Number ID</label><input type="text" defaultValue="1230282856843762" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
              <button type="submit" className="py-2.5 px-6 bg-blue-600 text-white font-bold rounded-xl">Save Settings</button>
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
                  <input type="text" value={newSlot.service} onChange={(e) => setNewSlot({ ...newSlot, service: e.target.value })} placeholder="उदा. 5G Phone Booking" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
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