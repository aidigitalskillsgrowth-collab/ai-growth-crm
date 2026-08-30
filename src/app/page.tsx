'use client';

import React, { useState, useRef } from 'react';
// @ts-ignore
import Sidebar from '../components/Sidebar';
import { 
  Search, RefreshCw, Layers, Users, PhoneCall, MessageSquare, Send, 
  Sparkles, Monitor, Smartphone, Volume2, Upload, Download, Plus, 
  ExternalLink, QrCode, Check, Copy, Bot, Megaphone, FileText, 
  GitBranch, Calendar, Wallet, Share2, Settings, Play, ArrowRight,
  Clock, MapPin, Phone, Edit3, Trash2, Filter, X, CheckSquare, Tag,
  TrendingUp, Zap, Target, Activity, CheckCircle2, ArrowUpRight,
  Eye, Mic, MicOff, Star, Image as ImageIcon, Loader2, FileSpreadsheet,
  CreditCard, ShieldCheck, Printer, ArrowDownLeft, AlertCircle
} from 'lucide-react';

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
  service: string;
  amount: number;
  method: string;
  status: 'Success' | 'Pending' | 'Failed';
  time: string;
  utr?: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('payments');
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

  // Industry Stock Images & Avatars
  const industryImages = {
    csc: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop&q=80',
    mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    clinic: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
    generic: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80'
  };

  const avatars = {
    male1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    male2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    female1: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    female2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  };

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
      badge: '★ अधिकृत CSC व आपले सरकार मान्यताप्राप्त केंद्र',
      services: [
        { title: 'सर्व सरकारी दाखले (Certificates)', desc: 'उत्पन्न दाखला, रहिवासी, जात प्रमाणपत्र, नॉन क्रिमीलेयर व गॅझेट नोंदणी.', price: '₹१०० पासून' },
        { title: 'इन्स्टंट पॅन कार्ड & आधार सेवा', desc: 'नवीन पॅन कार्ड २ तासांत, पॅन-आधार लिंक आणि दुरुस्ती सुविधा.', price: '₹१५०' },
        { title: 'शासकीय योजना & भरती अर्ज', desc: 'लाडकी बहीण, पीएम किसान, आयुष्मान भारत आणि सर्व नोकरी भरती ऑनलाईन अर्ज.', price: '₹५० पासून' }
      ],
      stats: [
        { label: 'काढलेले दाखले', value: '१५,०००+' },
        { label: 'शासकीय योजना लाभार्थी', value: '५,०००+' },
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
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string>('CSC & Online Services');
  const [currentSite, setCurrentSite] = useState<TemplateData>(templatesDb['CSC & Online Services']);
  const [promptInput, setPromptInput] = useState<string>('csc center sathi ५-स्टार वेबसाइट बनवा');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // ================= PAYMENT GATEWAYS COMPLETE STATE =================
  const [upiId, setUpiId] = useState<string>('ishwarimobile@ibl');
  const [payeeName, setPayeeName] = useState<string>('Ishwari Mobile & CSC');
  const [customerName, setCustomerName] = useState<string>('सचिन कांबळे');
  const [customerPhone, setCustomerPhone] = useState<string>('9123456780');
  const [serviceDesc, setServiceDesc] = useState<string>('5G Smartphone Advance Payment');
  const [amount, setAmount] = useState<string>('2500');

  // Gateways API Config State
  const [gateways, setGateways] = useState({
    razorpayKey: 'rzp_live_981247098234',
    razorpaySecret: '••••••••••••••••',
    cashfreeAppId: 'CF_APP_92817234',
    stripePublishable: 'pk_live_51OzX...',
    webhookSecret: 'whsec_981723948'
  });

  // Recent Transactions Database
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN-90812', customerName: 'ज्ञानेश्वर माने', phone: '9673112233', service: 'Dental Implant Advance', amount: 35000, method: 'PhonePe UPI', status: 'Success', time: 'आज, 11:45 AM', utr: '423987123901' },
    { id: 'TXN-90811', customerName: 'प्रियांका शिंदे', phone: '9765432109', service: 'Skin Treatment Full', amount: 3200, method: 'Google Pay', status: 'Success', time: 'आज, 10:20 AM', utr: '423987123855' },
    { id: 'TXN-90810', customerName: 'अमित देशमुख', phone: '9822334455', service: 'Screen Repair Booking', amount: 4500, method: 'UPI Intent Link', status: 'Pending', time: 'काल, 04:30 PM' },
    { id: 'TXN-90809', customerName: 'दिनेश गायकवाड', phone: '9860127890', service: 'Gym 3-Month Plan', amount: 1000, method: 'Paytm UPI', status: 'Success', time: 'काल, 02:15 PM', utr: '423987123712' },
    { id: 'TXN-90808', customerName: 'विकास मोरे', phone: '9988776655', service: 'Orthopedic Visit Fee', amount: 800, method: 'Razorpay Card', status: 'Failed', time: '28 Aug' },
  ]);

  // Dynamic UPI Intent Calculation
  const cleanAmt = (Number(amount) || 1).toFixed(2);
  const upiIntent = `upi://pay?pa=${upiId.trim()}&pn=${encodeURIComponent(payeeName)}&am=${cleanAmt}&cu=INR&tn=${encodeURIComponent(serviceDesc)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntent)}`;
  const livePayUrl = `https://ai-growth-crm-nine.vercel.app/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${cleanAmt}&tn=${encodeURIComponent(serviceDesc)}`;

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([
    { sender: 'bot', text: 'नमस्कार! Ishwari AI मध्ये आपले स्वागत आहे. मी आपली काय मदत करू शकतो?' }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const handleSendChat = () => {
    if (!inputMsg.trim()) return;
    const txt = inputMsg;
    setChatMessages(prev => [...prev, { sender: 'user', text: txt }]);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'bot', text: `आपल्या '${txt}' या चौकशीबद्दल धन्यवाद! आमची टीम लवकरच संपर्क करेल.` }]);
    }, 500);
  };

  // WhatsApp Inbox State
  const [selectedLead, setSelectedLead] = useState<Lead>(initialLeads[0]);
  const [inboxText, setInboxText] = useState<string>('');
  const [inboxChats, setInboxChats] = useState<Record<string, { from: string; text: string }[]>>({
    '1': [
      { from: 'me', text: 'नमस्कार रविराज जी, Ishwari CRM मध्ये आपले स्वागत आहे.' },
      { from: 'them', text: 'हो, मला सर्व्हिसची माहिती हवी होती.' }
    ]
  });
  const handleSendInbox = () => {
    if (!inboxText.trim()) return;
    setInboxChats(prev => ({
      ...prev,
      [selectedLead.id]: [...(prev[selectedLead.id] || []), { from: 'me', text: inboxText }]
    }));
    setInboxText('');
  };

  // Drag and Drop Kanban
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: targetStage } : l));
    }
  };

  // Leads Filter Logic
  const filteredLeads = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        l.phone.includes(searchTerm) || 
                        l.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchSource = sourceFilter === 'All' || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  const handleOpenAddModal = () => {
    setEditingLead(null);
    setLeadForm({
      name: '', phone: '', service: '', deal_value: '2000',
      status: 'New Lead', source: 'Website', sentiment: 'Interested', notes: ''
    });
    setIsLeadModalOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setLeadForm({
      name: lead.name, phone: lead.phone, service: lead.service,
      deal_value: lead.deal_value.toString(), status: lead.status,
      source: lead.source, sentiment: lead.sentiment, notes: lead.notes || ''
    });
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim()) {
      alert('कृपया नाव आणि मोबाईल नंबर टाका!');
      return;
    }
    if (editingLead) {
      setLeads(prev => prev.map(l => l.id === editingLead.id ? {
        ...l,
        name: leadForm.name,
        phone: leadForm.phone,
        service: leadForm.service || 'General Service',
        deal_value: Number(leadForm.deal_value) || 0,
        status: leadForm.status,
        source: leadForm.source,
        sentiment: leadForm.sentiment,
        notes: leadForm.notes
      } : l));
      alert('लीड यशस्वीरीत्या अपडेट झाली!');
    } else {
      const newEntry: Lead = {
        id: Date.now().toString(),
        name: leadForm.name,
        phone: leadForm.phone,
        service: leadForm.service || 'General Inquiry',
        deal_value: Number(leadForm.deal_value) || 0,
        status: leadForm.status,
        source: leadForm.source,
        sentiment: leadForm.sentiment,
        notes: leadForm.notes,
        created_at: 'आत्ताच जोडले'
      };
      setLeads(prev => [newEntry, ...prev]);
      alert('नवीन लीड यशस्वीरीत्या जोडली गेली!');
    }
    setIsLeadModalOpen(false);
  };

  const handleDeleteLead = (id: string, name: string) => {
    if (confirm(`तुम्हाला नक्की '${name}' ही लीड हटवायची आहे का?`)) {
      setLeads(prev => prev.filter(l => l.id !== id));
    }
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
      if (lines.length <= 1) {
        alert('CSV फाईल रिकामी आहे किंवा फॉरमॅट चुकीचा आहे.');
        return;
      }
      const imported: Lead[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/"/g, '').trim());
        if (parts.length >= 2 && parts[1]) {
          imported.push({
            id: Date.now().toString() + i,
            name: parts[1] || 'New Contact',
            phone: parts[2] || '9876543210',
            service: parts[3] || 'Imported Service',
            deal_value: Number(parts[4]) || 2000,
            status: parts[5] || 'New Lead',
            source: parts[6] || 'CSV Import',
            sentiment: parts[7] || 'Interested',
            notes: parts[8] || 'CSV द्वारे आयात केले',
            created_at: 'CSV Import'
          });
        }
      }
      if (imported.length > 0) {
        setLeads(prev => [...imported, ...prev]);
        alert(`${imported.length} नवीन कॉन्टॅक्ट्स यशस्वीरीत्या सिस्टीममध्ये अपलोड झाले!`);
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateWebsite = () => {
    if (!promptInput.trim()) {
      alert('कृपया माईकवर बोला किंवा प्रॉम्प्ट टाईप करा!');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const lower = promptInput.toLowerCase();
      let matchedKey = '';

      if (lower.includes('csc') || lower.includes('सेतू') || lower.includes('दाखले') || lower.includes('online') || lower.includes('ऑनलाईन') || lower.includes('पॅन') || lower.includes('आधार') || lower.includes('सरकारी')) {
        matchedKey = 'CSC & Online Services';
      } else if (lower.includes('mobile') || lower.includes('मोबाईल') || lower.includes('फोन') || lower.includes('smartphone')) {
        matchedKey = 'Mobile & Electronics';
      } else if (lower.includes('doctor') || lower.includes('clinic') || lower.includes('दवाखाना')) {
        matchedKey = 'Doctor & Clinic';
      }

      if (matchedKey && templatesDb[matchedKey]) {
        setSelectedTemplate(matchedKey);
        setCurrentSite(templatesDb[matchedKey]);
      }
      setIsGenerating(false);
    }, 400);
  };

  const toggleVoiceRecording = () => {
    if (typeof window === 'undefined') return;
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('तुमच्या ब्राऊझरमध्ये Voice Mic सपोर्ट नाही. कृपया Google Chrome वापरा.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'mr-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.results.length - 1; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) setPromptInput(currentTranscript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentSite(prev => ({ ...prev, heroImage: reader.result as string }));
        alert('स्वतःचा फोटो यशस्वीरीत्या वेबसाईटवर सेट झाला!');
      };
      reader.readAsDataURL(file);
    }
  };

  const SidebarComp = Sidebar as any;

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans antialiased overflow-hidden">
      <SidebarComp activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hidden File Input for CSV Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept=".csv" 
        onChange={handleImportCSV} 
        className="hidden" 
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        
        {/* Top Header */}
        <header className="flex flex-wrap items-center justify-between pb-5 mb-5 border-b border-slate-800/80 gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h1 className="text-xl font-black text-white shrink-0 capitalize">
              {activeTab === 'dashboard' ? 'Growth Dashboard' : 
               activeTab === 'leads' ? 'Growth Leads' : 
               activeTab === 'pipeline' ? 'Growth CRM & Pipeline' :
               activeTab === 'payments' ? 'Payment Gateways & UPI Suite' :
               activeTab.replace('_', ' ')}
            </h1>
            <div className="flex items-center gap-2 bg-[#0d1424] border border-slate-800 px-3.5 py-1.5 rounded-xl w-full text-xs">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search payments, transactions, leads..."
                className="bg-transparent text-white outline-none w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('payments')}
              className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-600 hover:text-white transition"
            >
              <QrCode size={13} /> Quick Pay QR
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </header>

        {/* ================= 1. GROWTH DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-200">AI Quick Actions:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <button onClick={handleOpenAddModal} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition">
                  <Plus size={14} /> + Add New Lead
                </button>
                <button onClick={() => alert(`सर्व ${leads.length} ग्राहकांना WhatsApp ब्रॉडकास्ट मेसेज पाठवला जात आहे...`)} className="px-3.5 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center gap-1.5 transition">
                  <Send size={14} /> WhatsApp Broadcast ({leads.length})
                </button>
                <button onClick={() => setActiveTab('payments')} className="px-3.5 py-2 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold flex items-center gap-1.5 transition">
                  <QrCode size={14} /> Quick Payment QR
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400 block">Total Inbound Leads</span><p className="text-2xl font-black text-white mt-0.5">{leads.length}</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400 block">New Leads</span><p className="text-2xl font-black text-blue-400 mt-0.5">{leads.filter(l => l.status === 'New Lead').length}</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400 block">Deals Won (Paid)</span><p className="text-2xl font-black text-emerald-400 mt-0.5">{leads.filter(l => l.status === 'Won').length}</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-[11px] text-slate-400 block">Pipeline Value</span><p className="text-2xl font-black text-amber-400 mt-0.5">₹{leads.reduce((acc, c) => acc + c.deal_value, 0).toLocaleString('en-IN')}</p></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-3">
                <span className="text-xs font-bold text-slate-300">Revenue Growth</span>
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
                  <div>
                    <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-400">Meta Ads</span><span className="text-blue-400 font-bold">55%</span></div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[55%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-400">Website & Funnels</span><span className="text-indigo-400 font-bold">30%</span></div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full w-[30%]"></div></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">AI Voice Agent Success</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">82.4% Answer Rate</p>
                <p className="text-xs text-slate-400">Positive Sentiment Score: <span className="text-white font-bold">76%</span></p>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. GROWTH LEADS ================= */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2"><Users size={20} className="text-blue-400" /> Growth Leads Directory ({filteredLeads.length} Leads)</h2>
                  <p className="text-xs text-slate-400">सर्व १५ इनबाउंड व आऊटबाउंड लीड्सचे व्यवस्थापन, CSV आयात/निर्यात आणि थेट संवाद.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button onClick={handleOpenAddModal} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"><Plus size={15} /> + Add New Lead</button>
                  <button onClick={() => fileInputRef.current?.click()} className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"><Upload size={14} /> Import CSV</button>
                  <button onClick={handleExportCSV} className="px-3.5 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"><Download size={14} /> Export CSV</button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 font-bold flex items-center gap-1"><Filter size={13} /> Status:</span>
                  {['All', 'New Lead', 'Contacted', 'Payment Sent', 'Won', 'Lost'].map((stg) => (
                    <button key={stg} onClick={() => setStatusFilter(stg)} className={`px-3 py-1.5 rounded-xl font-medium transition ${statusFilter === stg ? 'bg-blue-600 text-white font-bold' : 'bg-[#080b12] text-slate-400 border border-slate-800'}`}>
                      {stg} {stg === 'All' ? `(${leads.length})` : `(${leads.filter(l => l.status === stg).length})`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[850px] text-xs">
                  <thead className="bg-[#080c18] text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Service Required</th>
                      <th className="p-4">Deal Value</th>
                      <th className="p-4">Pipeline Status</th>
                      <th className="p-4">Source & Notes</th>
                      <th className="p-4 text-center">Instant 1-Click Actions</th>
                      <th className="p-4 text-center">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-4"><p className="font-bold text-white text-sm">{lead.name}</p><p className="text-[11px] text-slate-400 font-mono">+91 {lead.phone}</p></td>
                        <td className="p-4">{lead.service}</td>
                        <td className="p-4 font-black text-white text-sm">₹{lead.deal_value.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <select value={lead.status} onChange={(e) => handleStatusChange(lead.id, e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-xl text-xs outline-none">
                            {stages.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="p-4 max-w-[180px]"><span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold">{lead.source}</span></td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1 shadow-md"><MessageSquare size={13} /> WhatsApp</a>
                            <button onClick={() => alert(`${lead.name} ला AI कॉल लावला जात आहे...`)} className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1 shadow-md"><PhoneCall size={13} /> AI Call</button>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-400">
                            <button onClick={() => handleOpenEditModal(lead)} className="p-1.5 hover:text-blue-400"><Edit3 size={15} /></button>
                            <button onClick={() => handleDeleteLead(lead.id, lead.name)} className="p-1.5 hover:text-rose-400"><Trash2 size={15} /></button>
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

        {/* ================= 3. GROWTH CRM & PIPELINE ================= */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2"><Layers size={20} className="text-blue-400" /> Growth CRM & Interactive Pipeline</h2>
                  <p className="text-xs text-slate-400">कार्ड ओढून (Drag) पुढच्या टप्प्यात (Drop) टाका.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button onClick={handleOpenAddModal} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"><Plus size={15} /> + Add Deal</button>
                  <button onClick={() => fileInputRef.current?.click()} className="px-3.5 py-2.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5"><Upload size={14} /> Import CSV</button>
                  <button onClick={handleExportCSV} className="px-3.5 py-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5"><Download size={14} /> Export CSV</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['New Lead', 'Contacted', 'Payment Sent', 'Won'].map((stg) => (
                <div key={stg} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stg)} className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 space-y-3 min-h-[450px]">
                  <div className="flex justify-between border-b border-slate-800 pb-2 items-center">
                    <span className="font-bold text-xs text-white uppercase">{stg}</span>
                    <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">{leads.filter(l => l.status === stg).length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {leads.filter(l => l.status === stg).map((l) => (
                      <div key={l.id} draggable onDragStart={(e) => handleDragStart(e, l.id)} className="p-3 bg-[#080b12] border border-slate-700 rounded-xl space-y-2 cursor-grab active:cursor-grabbing hover:border-blue-500 transition shadow-md">
                        <div className="flex justify-between font-bold text-xs"><span className="text-white">{l.name}</span><span className="text-emerald-400">₹{l.deal_value}</span></div>
                        <p className="text-[11px] text-slate-400">{l.service}</p>
                        <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800"><span>{l.phone}</span><span className="text-blue-400">{l.source}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. WEBSITE & FUNNELS ================= */}
        {activeTab === 'website' && (
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-slate-800/90 rounded-3xl p-5 lg:p-6 space-y-4 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black"><Sparkles size={20} /></div>
                  <div><h2 className="text-base font-black text-white">AI Voice & Prompt 5-Star Website Generator</h2><p className="text-xs text-slate-400">माईकवर बोलून किंवा प्रॉम्प्ट देऊन १ सेकंदात पूर्ण वेबसाईट बनवा.</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPreviewModalOpen(true)} className="px-3.5 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5"><Eye size={14} /> Full Screen Live Preview</button>
                  <div className="flex items-center gap-1.5 bg-[#080b12] p-1.5 rounded-2xl border border-slate-800 text-xs">
                    <button onClick={() => setDeviceView('Desktop')} className={`px-3 py-1 rounded-xl font-bold ${deviceView === 'Desktop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>Desktop</button>
                    <button onClick={() => setDeviceView('Mobile')} className={`px-3 py-1 rounded-xl font-bold ${deviceView === 'Mobile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>Mobile</button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[280px] bg-[#080b12] border border-slate-700/90 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Sparkles size={18} className="text-blue-400 shrink-0 animate-pulse" />
                  <input type="text" value={promptInput} onChange={(e) => setPromptInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerateWebsite()} placeholder="उदा. 'csc center sathi ५-स्टार वेबसाइट बनवा'..." className="bg-transparent text-white text-xs outline-none w-full" />
                </div>
                <button type="button" onClick={toggleVoiceRecording} className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border ${isListening ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{isListening ? <MicOff size={16} /> : <Mic size={16} className="text-rose-400" />}<span>{isListening ? 'बोलणे चालू...' : 'Continuous Marathi Mic'}</span></button>
                <button type="button" onClick={handleGenerateWebsite} disabled={isGenerating} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">{isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}<span>Generate Website</span></button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 text-xs max-h-[850px] overflow-y-auto">
                <h3 className="font-bold text-white uppercase text-[11px]">Live Content Editor</h3>
                <div className="p-3 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                  <label className="text-slate-300 font-bold block text-[11px]">स्वतःचा बॅनर फोटो अपलोड करा</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white" />
                </div>
                <div><label className="text-slate-400 block mb-1">Business Name</label><input type="text" value={currentSite.businessName} onChange={(e) => setCurrentSite({ ...currentSite, businessName: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                <div><label className="text-slate-400 block mb-1">Headline</label><textarea rows={2} value={currentSite.headline} onChange={(e) => setCurrentSite({ ...currentSite, headline: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none" /></div>
                <div><label className="text-slate-400 block mb-1">Subheadline</label><textarea rows={3} value={currentSite.subheadline} onChange={(e) => setCurrentSite({ ...currentSite, subheadline: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none" /></div>
                <div><label className="text-slate-400 block mb-1">WhatsApp / Phone</label><input type="text" value={currentSite.phone} onChange={(e) => setCurrentSite({ ...currentSite, phone: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white font-mono outline-none" /></div>
              </div>
              <div className="lg:col-span-8 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className="flex justify-between text-xs border-b border-slate-800 pb-3 items-center">
                  <span className="font-mono text-slate-300 text-[11px]">Live Preview Screen</span>
                  <button onClick={() => setIsPreviewModalOpen(true)} className="text-[11px] text-blue-400 font-bold hover:underline flex items-center gap-1"><Eye size={13} /> Full Screen View</button>
                </div>
                <div className="p-4 bg-[#07090e] rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-xl font-black text-white">{currentSite.businessName}</h3>
                  <p className="text-xs text-slate-300">{currentSite.headline}</p>
                  <img src={currentSite.heroImage} alt="Hero" className="w-full h-48 object-cover rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. COMPLETE PAYMENT GATEWAYS (ALL) ================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            
            {/* Payment Metrics & Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] text-slate-400 block">Total Payments Received</span>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">₹39,200</p>
              </div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] text-slate-400 block">Successful Settlements</span>
                <p className="text-2xl font-black text-white mt-0.5">3 Transactions</p>
              </div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] text-slate-400 block">Pending Invoices</span>
                <p className="text-2xl font-black text-amber-400 mt-0.5">₹4,500</p>
              </div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] text-slate-400 block">UPI Auto-Confirm Status</span>
                <p className="text-xs font-black text-emerald-400 mt-1.5 flex items-center gap-1"><ShieldCheck size={14} /> 100% Active</p>
              </div>
            </div>

            {/* Split Screen: Instant Dynamic UPI Generator & WhatsApp Billing */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Generator Form & Gateway API Keys */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Dynamic Payment Invoice Form */}
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2">
                      <QrCode size={16} className="text-emerald-400" /> Dynamic Multi-UPI & Payment Request Generator
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">Live 0% Commission</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Your Working UPI ID *</label>
                      <input 
                        type="text" 
                        value={upiId} 
                        onChange={(e) => setUpiId(e.target.value)} 
                        className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Business Name on UPI</label>
                      <input 
                        type="text" 
                        value={payeeName} 
                        onChange={(e) => setPayeeName(e.target.value)} 
                        className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Customer Full Name</label>
                      <input 
                        type="text" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                        className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Customer WhatsApp Number</label>
                      <input 
                        type="text" 
                        value={customerPhone} 
                        onChange={(e) => setCustomerPhone(e.target.value)} 
                        className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-emerald-500" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Service / Product Description</label>
                      <input 
                        type="text" 
                        value={serviceDesc} 
                        onChange={(e) => setServiceDesc(e.target.value)} 
                        className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-bold">Amount to Collect (₹) *</label>
                      <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        className="w-full bg-[#080b12] border border-emerald-500/50 rounded-xl p-2.5 text-emerald-400 font-black text-base outline-none" 
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <a
                      href={`https://wa.me/91${customerPhone}?text=${encodeURIComponent(`नमस्कार ${customerName} जी, ${payeeName} कडून आपल्या ${serviceDesc} साठी ₹${amount} चे पेमेंट बिल तयार केले आहे. खालील लिंकवर क्लिक करून Google Pay, PhonePe किंवा Paytm ने सुरक्षित पेमेंट करा:\n\n👉 पेमेंट लिंक: ${livePayUrl}\n\nधन्यवाद!`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 min-w-[200px] py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-center"
                    >
                      <Send size={15} /> Send Bill on WhatsApp
                    </a>

                    <button 
                      type="button" 
                      onClick={() => alert(`ग्राहक ${customerName} साठी ₹${amount} ची इनव्हॉइस पावती तयार झाली आहे.`)}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Printer size={15} /> Print Receipt
                    </button>
                  </div>
                </div>

                {/* Gateway Integration Configurations (Razorpay, Cashfree, Stripe) */}
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs shadow-xl">
                  <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2">
                    <CreditCard size={16} className="text-blue-400" /> Multiple Gateway API Credentials & Webhook
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3 bg-[#080b12] border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-white block">Razorpay Live Gateway</span>
                        <span className="text-[10px] text-slate-400">Credit Card, NetBanking & EMI Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="password" 
                          value={gateways.razorpayKey} 
                          onChange={(e) => setGateways({ ...gateways, razorpayKey: e.target.value })}
                          className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono outline-none" 
                        />
                        <button onClick={() => alert('Razorpay की सेव्ह झाली!')} className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg">Save</button>
                      </div>
                    </div>

                    <div className="p-3 bg-[#080b12] border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-white block">Cashfree Auto-Payouts</span>
                        <span className="text-[10px] text-slate-400">Instant Merchant Settlement Webhook</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="password" 
                          value={gateways.cashfreeAppId} 
                          onChange={(e) => setGateways({ ...gateways, cashfreeAppId: e.target.value })}
                          className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-mono outline-none" 
                        />
                        <button onClick={() => alert('Cashfree की सेव्ह झाली!')} className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg">Save</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Dynamic QR Canvas & Direct Apps */}
              <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                  <span className="font-bold text-white">Live Scanner Canvas</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Auto-Amount Locked</span>
                </div>

                <div className="p-4 bg-white rounded-3xl shadow-2xl inline-block border-4 border-slate-800">
                  <img src={qrUrl} alt="Instant QR Code" className="w-56 h-56 block rounded-xl" />
                </div>

                <div>
                  <span className="text-xs text-slate-400 block">स्कॅन करून भरावयाची रक्कम:</span>
                  <p className="text-3xl font-black text-emerald-400 mt-0.5">₹{amount}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{upiId}</p>
                </div>

                {/* Direct App Launch Intent Links */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                  <a href={upiIntent} className="p-2.5 bg-[#080b12] border border-slate-800 hover:border-emerald-500 rounded-xl font-bold text-slate-200 transition">
                    PhonePe
                  </a>
                  <a href={upiIntent} className="p-2.5 bg-[#080b12] border border-slate-800 hover:border-blue-500 rounded-xl font-bold text-slate-200 transition">
                    GPay
                  </a>
                  <a href={upiIntent} className="p-2.5 bg-[#080b12] border border-slate-800 hover:border-cyan-500 rounded-xl font-bold text-slate-200 transition">
                    Paytm
                  </a>
                </div>

                <button 
                  type="button" 
                  onClick={() => { 
                    navigator.clipboard.writeText(livePayUrl); 
                    setCopied(true); 
                    setTimeout(() => setCopied(false), 2000); 
                  }} 
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition text-xs"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copied ? 'पेमेंट लिंक कॉपी झाली!' : 'Copy Direct Payment Link'}</span>
                </button>
              </div>

            </div>

            {/* Live Transaction Settlement History Log */}
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400" /> Recent Transactions & Live Settlement History
                </h3>
                <span className="text-xs text-slate-400">एकूण {transactions.length} व्यवहार</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px] text-xs">
                  <thead className="bg-[#080c18] text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Txn ID / Customer</th>
                      <th className="p-3.5">Service Details</th>
                      <th className="p-3.5">Amount (₹)</th>
                      <th className="p-3.5">Payment Method</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">UTR / Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3.5">
                          <p className="font-bold text-white">{tx.customerName}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{tx.id} • {tx.time}</span>
                        </td>
                        <td className="p-3.5 text-slate-300">{tx.service}</td>
                        <td className="p-3.5 font-black text-white text-sm">₹{tx.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3.5 font-medium">{tx.method}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            tx.status === 'Success' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' :
                            tx.status === 'Pending' ? 'bg-amber-950/80 text-amber-400 border-amber-500/30' :
                            'bg-rose-950/80 text-rose-400 border-rose-500/30'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-400">{tx.utr || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= 6. AI AGENTS & CHATBOT ================= */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
              <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Bot size={16} className="text-blue-400" /> Chatbot Configuration</h3>
              <div><label className="text-slate-400 block mb-1">Bot Name</label><input type="text" defaultValue="Ishwari AI Assistant" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
              <div><label className="text-slate-400 block mb-1">System Prompt</label><textarea rows={4} defaultValue="तुम्ही Ishwari Mobile चे स्मार्ट असिस्टंट आहात. ग्राहकांना मराठीत नम्रतेने उत्तरे द्या." className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none" /></div>
              <button onClick={() => alert('सेटिंग्स सेव्ह झाल्या!')} className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl">Save Prompts</button>
            </div>

            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs flex flex-col justify-between h-[420px]">
              <h3 className="font-bold text-white uppercase text-[11px]">Live Simulator</h3>
              <div className="bg-[#080b12] p-4 rounded-2xl border border-slate-800 space-y-2 h-60 overflow-y-auto">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`p-2.5 rounded-xl max-w-[80%] text-xs ${m.sender === 'user' ? 'bg-blue-600 ml-auto text-white' : 'bg-slate-800 text-slate-200'}`}>{m.text}</div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} placeholder="मेसेज..." className="flex-1 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none" />
                <button onClick={handleSendChat} className="px-4 bg-blue-600 text-white rounded-xl font-bold"><Send size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. AD LAUNCHER ================= */}
        {activeTab === 'meta_ads' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Megaphone size={16} className="text-blue-400" /> Meta Lead Ads Auto-Webhook</h3>
            <div><label className="text-slate-400 block mb-1">Webhook URL</label><input readOnly value="https://ai-growth-crm-nine.vercel.app/api/lead-webhook" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-blue-400 font-mono" /></div>
          </div>
        )}

        {/* ================= 8. TEMPLATES ================= */}
        {activeTab === 'templates' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><FileText size={16} className="text-blue-400" /> Message Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Welcome Inquiry', 'Payment Request', 'Appointment Confirmed'].map((t, i) => (
                <div key={i} className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 space-y-2">
                  <span className="font-bold text-white block">{t}</span>
                  <p className="bg-[#080b12] p-3 rounded-xl text-slate-300 border border-slate-800 font-mono text-[11px]">नमस्कार, आपली चौकशी मिळाली आहे.</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 9. WORKFLOW ================= */}
        {activeTab === 'workflow' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-center">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center justify-center gap-2"><GitBranch size={16} className="text-blue-400" /> Automation Nodes</h3>
            <div className="p-3 bg-blue-950/60 border border-blue-600/50 rounded-xl font-bold text-blue-300 max-w-md mx-auto">1. Trigger: New Lead Inbound from Meta Ads / Website</div>
            <div className="text-slate-500 font-bold">↓ (Instant)</div>
            <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl font-bold text-emerald-300 max-w-md mx-auto">2. Action: Send Welcome WhatsApp Message</div>
          </div>
        )}

        {/* ================= 10. INBOX ================= */}
        {activeTab === 'inbox' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[500px]">
            <div className="md:col-span-4 border-r border-slate-800 p-3 overflow-y-auto space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block px-2 uppercase mb-2">Leads</span>
              {leads.map((l) => (
                <div key={l.id} onClick={() => setSelectedLead(l)} className={`p-2.5 rounded-xl cursor-pointer ${selectedLead.id === l.id ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800/50 text-slate-300'}`}>
                  <p className="text-xs font-bold">{l.name}</p>
                  <p className="text-[10px] opacity-80">{l.phone}</p>
                </div>
              ))}
            </div>
            <div className="md:col-span-8 p-4 flex flex-col justify-between bg-[#080b12]">
              <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2">{selectedLead.name}</h4>
              <div className="space-y-2 py-4 overflow-y-auto text-xs h-60">
                {(inboxChats[selectedLead.id] || [{ from: 'them', text: 'नमस्कार, मला माहिती हवी आहे.' }]).map((m, i) => (
                  <div key={i} className={`p-2.5 rounded-xl max-w-[75%] ${m.from === 'me' ? 'bg-blue-600 ml-auto text-white' : 'bg-slate-800 text-slate-200'}`}>{m.text}</div>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input type="text" value={inboxText} onChange={(e) => setInboxText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendInbox()} placeholder="Type reply..." className="flex-1 bg-[#0d1424] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                <button onClick={handleSendInbox} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold"><Send size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 11. CALENDAR ================= */}
        {activeTab === 'calendar' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Calendar size={16} className="text-blue-400" /> Smart Calendar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['11:00 AM - सचिन कांबळे', '02:00 PM - अमित देशमुख', '05:30 PM - प्रियांका शिंदे'].map((s, i) => (
                <div key={i} className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl font-bold text-blue-400">{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 12. AI SALES & IVR ================= */}
        {activeTab === 'ivr' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><PhoneCall size={16} className="text-blue-400" /> Outbound Calling Bot</h3>
            <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800/60">
              {leads.slice(0, 4).map((l) => (
                <div key={l.id} className="py-2.5 flex justify-between items-center">
                  <div><p className="font-bold text-white">{l.name} ({l.phone})</p><span className="text-[10px] text-emerald-400 font-bold">● {l.sentiment}</span></div>
                  <button onClick={() => alert('ऑडिओ रेकॉर्डिंग प्ले होत आहे...')} className="px-3 py-1 bg-slate-800 text-blue-400 rounded-lg flex items-center gap-1"><Volume2 size={12} /> Play</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 13. FINANCE ================= */}
        {activeTab === 'finance' && (
          <div className="space-y-5 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Wallet size={16} className="text-emerald-400" /> SaaS Billing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-slate-400">MRR</span><p className="text-2xl font-black text-emerald-400 mt-1">₹45,900</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-slate-400">Paid Clients</span><p className="text-2xl font-black text-blue-400 mt-1">24</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-slate-400">Pending</span><p className="text-2xl font-black text-amber-400 mt-1">₹8,500</p></div>
            </div>
          </div>
        )}

        {/* ================= 14. SOCIAL ================= */}
        {activeTab === 'social' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Share2 size={16} className="text-blue-400" /> Social Media Auto-Poster</h3>
            <textarea rows={3} defaultValue="💥 Ishwari Mobile कडून नवीन 5G स्मार्टफोन्सवर २०% सूट!" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-3 text-white outline-none" />
            <button onClick={() => alert('पोस्ट झाली!')} className="py-2 px-6 bg-blue-600 text-white font-bold rounded-xl">Publish</button>
          </div>
        )}

        {/* ================= 15. SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto w-full space-y-6 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Settings size={16} className="text-blue-400" /> Meta API Settings</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('क्रेडेन्शियल्स सेव्ह झाले!'); }} className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div><label className="text-slate-400 block mb-1">WhatsApp Phone Number ID</label><input type="text" placeholder="1230282856843762" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
              <button type="submit" className="py-2.5 px-6 bg-blue-600 text-white font-bold rounded-xl">Save</button>
            </form>
          </div>
        )}

        {/* LEAD MODAL POPUP */}
        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-base">{editingLead ? 'Edit Lead' : '+ Add New Inbound Lead'}</h3>
                <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">ग्राहकाचे नाव *</label>
                    <input type="text" required value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">मोबाईल नंबर *</label>
                    <input type="text" required value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">सेवा / उत्पादन</label>
                    <input type="text" value={leadForm.service} onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">अपेक्षित रक्कम (₹)</label>
                    <input type="number" value={leadForm.deal_value} onChange={(e) => setLeadForm({ ...leadForm, deal_value: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-bold outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Status</label>
                    <select value={leadForm.status} onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white outline-none">
                      <option value="New Lead">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Payment Sent">Payment Sent</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Source</label>
                    <select value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white outline-none">
                      <option value="Website">Website</option>
                      <option value="Meta Lead Ad">Meta Lead Ad</option>
                      <option value="WhatsApp Direct">WhatsApp Direct</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Sentiment</label>
                    <select value={leadForm.sentiment} onChange={(e) => setLeadForm({ ...leadForm, sentiment: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white outline-none">
                      <option value="Highly Interested">Highly Interested</option>
                      <option value="Interested">Interested</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Positive">Positive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">फॉलो-अप नोट्स</label>
                  <textarea rows={2} value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none" />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button type="button" onClick={() => setIsLeadModalOpen(false)} className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl">रद्द करा</button>
                  <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg">{editingLead ? 'बदल सेव्ह करा' : 'लीड सेव्ह करा'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FULLSCREEN PREVIEW MODAL */}
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
            <div className="bg-[#07090e] border border-slate-700 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-2"><Eye size={16} className="text-blue-400" /> Fullscreen Live Webpage Preview</span>
                <button onClick={() => setIsPreviewModalOpen(false)} className="p-1.5 bg-slate-800 text-slate-300 rounded-xl"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="p-4 bg-[#07090e] rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-xl font-black text-white">{currentSite.businessName}</h3>
                  <p className="text-xs text-slate-300">{currentSite.headline}</p>
                  <img src={currentSite.heroImage} alt="Hero" className="w-full h-48 object-cover rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}