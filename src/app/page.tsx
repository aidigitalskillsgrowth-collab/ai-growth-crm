'use client';

import React, { useState } from 'react';
// @ts-ignore
import Sidebar from '../components/Sidebar';
import { 
  Search, RefreshCw, Layers, Users, PhoneCall, MessageSquare, Send, 
  Sparkles, Monitor, Smartphone, Volume2, Upload, Download, Plus, 
  ExternalLink, QrCode, Check, Copy, Bot, Megaphone, FileText, 
  GitBranch, Calendar, Wallet, Share2, Settings, Play, ArrowRight,
  Clock, MapPin, Phone, Edit3, Trash2, Filter, X, CheckSquare, Tag,
  FileSpreadsheet, MessageCircle
} from 'lucide-react';

// TypeScript Lead Interface
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

interface TemplateData {
  businessName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  phone: string;
  address: string;
  timing: string;
  primaryCta: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('leads');
  const [deviceView, setDeviceView] = useState<'Desktop' | 'Mobile'>('Desktop');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Mobile & Electronics');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtering States for Leads Directory
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  // Modal State for Add / Edit Lead
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  // 15 Comprehensive Inbound Leads Database
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
  const stages: string[] = ['New Lead', 'Contacted', 'Payment Sent', 'Won', 'Lost'];

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingLead(null);
    setLeadForm({
      name: '',
      phone: '',
      service: '',
      deal_value: '2000',
      status: 'New Lead',
      source: 'Website',
      sentiment: 'Interested',
      notes: ''
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setLeadForm({
      name: lead.name,
      phone: lead.phone,
      service: lead.service,
      deal_value: lead.deal_value.toString(),
      status: lead.status,
      source: lead.source,
      sentiment: lead.sentiment,
      notes: lead.notes || ''
    });
    setIsModalOpen(true);
  };

  // Save Add / Edit Lead
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
      alert('लीड माहिती यशस्वीरीत्या अपडेट झाली!');
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
    setIsModalOpen(false);
  };

  // Delete Lead
  const handleDeleteLead = (id: string, name: string) => {
    if (confirm(`तुम्हाला नक्की '${name}' ही लीड हटवायची आहे का?`)) {
      setLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  // Quick Inline Status Change
  const handleStatusChange = (id: string, newStatus: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Name,Phone,Service,Deal_Value,Status,Source,Sentiment,Notes\n';
    const rows = leads.map(l => `${l.id},"${l.name}","${l.phone}","${l.service}",${l.deal_value},"${l.status}","${l.source}","${l.sentiment}","${l.notes || ''}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Leads_Directory_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Filter Leads
  const filteredLeads = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        l.phone.includes(searchTerm) || 
                        l.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    const matchSource = sourceFilter === 'All' || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  // Templates Database (Preserved)
  const templatesDb: Record<string, TemplateData> = {
    'Mobile & Electronics': {
      businessName: 'ईश्वरी मोबाईल & ५G स्मार्ट गॅलरी',
      tagline: 'स्मार्टफोन्स, ॲक्सेसरीज आणि इन्स्टंट रिपेअरिंग',
      headline: 'नवीन 5G स्मार्टफोन्सवर मिळवा थेट २०% सूट आणि शून्य डाऊनपेमेंट EMI!',
      subheadline: 'iPhone, OnePlus, Samsung, Vivo चे सर्व मॉडेल्स उपलब्ध. सोबत फ्री गिफ्ट्स आणि वॉरंटी.',
      heroImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      phone: '9876543210',
      address: 'कॉलेज रोड, ईश्वरी टॉवर, सांगली',
      timing: 'सकाळी १०:०० ते रात्री १०:००',
      primaryCta: 'ऑफर क्लेम करा'
    },
    'Doctor & Clinic': {
      businessName: 'संजीवनी मल्टिस्पेशालिटी क्लिनिक',
      tagline: 'विश्वासार्ह दंत व आरोग्य चिकित्सा केंद्र',
      headline: 'तुमच्या आणि कुटुंबाच्या आरोग्याची संपूर्ण काळजी - तज्ज्ञ डॉक्टरांकडून',
      subheadline: 'आधुनिक लेझर तंत्रज्ञान, वेदनाविरहित उपचार आणि १०+ वर्षांचा प्रदीर्घ अनुभव.',
      heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
      phone: '9876543210',
      address: 'स्टेशन रोड, मुख्य चौक, सांगली',
      timing: 'सकाळी ९:०० ते रात्री ९:००',
      primaryCta: 'अपॉइंटमेंट बुक करा'
    },
    'Real Estate & Property': {
      businessName: 'रॉयल हेरिटेज लक्झरी होम्स',
      tagline: 'पुणे व सांगलीतील प्रिमियम २ व ३ BHK फ्लॅट्स',
      headline: 'पुण्यातील सर्वोत्तम २ व ३ BHK लक्झरी फ्लॅट्स - ०% ब्रोकरेज!',
      subheadline: 'प्राइम लोकेशन, २५+ सोयीसुविधा आणि ९०% पर्यंत होम लोन उपलब्ध.',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      phone: '9822334455',
      address: 'हायवे टच, ग्रीन व्हॅली, सांगली',
      timing: 'सकाळी ९:०० ते संध्याकाळी ७:००',
      primaryCta: 'मोफत साईट व्हिजिट बुक करा'
    }
  };
  const [currentSite, setCurrentSite] = useState<TemplateData>(templatesDb['Mobile & Electronics']);

  // Payment Setup State
  const [upiId, setUpiId] = useState<string>('ishwarimobile@ibl');
  const [amount, setAmount] = useState<string>('999');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(`upi://pay?pa=${upiId}&am=${amount}&cu=INR`)}`;
  const livePayUrl = `https://ai-growth-crm-nine.vercel.app/pay?pa=${encodeURIComponent(upiId)}&am=${amount}`;

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

  // Drag and drop Kanban
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

  const SidebarComp = Sidebar as any;

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans antialiased overflow-hidden">
      <SidebarComp activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between pb-5 mb-5 border-b border-slate-800/80 gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h1 className="text-xl font-black text-white shrink-0 capitalize">{activeTab.replace('_', ' ')}</h1>
            <div className="flex items-center gap-2 bg-[#0d1424] border border-slate-800 px-3.5 py-1.5 rounded-xl w-full text-xs">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search lead name, phone or service..."
                className="bg-transparent text-white outline-none w-full"
              />
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </header>

        {/* Global Leads Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-[#0d1424] border border-slate-800/80 p-4 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Total Inbound Leads</span>
            <p className="text-2xl font-black text-white mt-0.5">{leads.length}</p>
          </div>
          <div className="bg-[#0d1424] border border-slate-800/80 p-4 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">New / Uncontacted</span>
            <p className="text-2xl font-black text-blue-400 mt-0.5">{leads.filter(l => l.status === 'New Lead').length}</p>
          </div>
          <div className="bg-[#0d1424] border border-slate-800/80 p-4 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Deals Won (Paid)</span>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">{leads.filter(l => l.status === 'Won').length}</p>
          </div>
          <div className="bg-[#0d1424] border border-slate-800/80 p-4 rounded-2xl">
            <span className="text-[11px] text-slate-400 block font-medium">Pipeline Value</span>
            <p className="text-2xl font-black text-amber-400 mt-0.5">₹{leads.reduce((acc, c) => acc + c.deal_value, 0).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* ================= 1. DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
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
                    <div className="flex justify-between text-[11px] mb-1"><span className="text-slate-400">Website</span><span className="text-indigo-400 font-bold">30%</span></div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full w-[30%]"></div></div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">AI Voice Agent Success</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">82.4% Answer Rate</p>
                <p className="text-xs text-slate-400">Positive Customer Sentiment: <span className="text-white font-bold">76%</span></p>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. ENHANCED AI LEADS DIRECTORY ================= */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            
            {/* Top Action Bar with Filters */}
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Users size={20} className="text-blue-400" /> AI Leads Directory ({filteredLeads.length} Leads)
                  </h2>
                  <p className="text-xs text-slate-400">सर्व इनबाउंड व आऊटबाउंड लीड्सचे रिअल-टाइम व्यवस्थापन, थेट संवाद आणि नोट्स.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button 
                    onClick={handleOpenAddModal}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition"
                  >
                    <Plus size={15} /> + Add New Lead
                  </button>
                  <button 
                    onClick={handleExportCSV} 
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Status and Source Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 font-bold flex items-center gap-1"><Filter size={13} /> Status:</span>
                  {['All', 'New Lead', 'Contacted', 'Payment Sent', 'Won', 'Lost'].map((stg) => (
                    <button
                      key={stg}
                      onClick={() => setStatusFilter(stg)}
                      className={`px-3 py-1.5 rounded-xl font-medium transition ${statusFilter === stg ? 'bg-blue-600 text-white font-bold shadow-md' : 'bg-[#080b12] text-slate-400 hover:text-white border border-slate-800'}`}
                    >
                      {stg} {stg === 'All' ? `(${leads.length})` : `(${leads.filter(l => l.status === stg).length})`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">Source:</span>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="bg-[#080b12] border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs outline-none"
                  >
                    <option value="All">All Sources</option>
                    <option value="Website">Website</option>
                    <option value="Meta Lead Ad">Meta Lead Ad</option>
                    <option value="Instagram Ad">Instagram Ad</option>
                    <option value="Facebook Ad">Facebook Ad</option>
                    <option value="WhatsApp Direct">WhatsApp Direct</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[850px] text-xs">
                  <thead className="bg-[#080c18] text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Service Required</th>
                      <th className="p-4">Deal Value</th>
                      <th className="p-4">Status & Pipeline</th>
                      <th className="p-4">Source & Notes</th>
                      <th className="p-4 text-center">Instant 1-Click Actions</th>
                      <th className="p-4 text-center">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                        
                        {/* Name & Phone */}
                        <td className="p-4">
                          <p className="font-bold text-white text-sm leading-snug">{lead.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                            <Phone size={11} className="text-blue-400" /> +91 {lead.phone}
                          </p>
                          {lead.created_at && <span className="text-[10px] text-slate-500 block mt-0.5">{lead.created_at}</span>}
                        </td>

                        {/* Service */}
                        <td className="p-4">
                          <span className="font-medium text-slate-200 block">{lead.service}</span>
                          <span className="text-[10px] text-slate-400">Sentiment: <b className="text-blue-400">{lead.sentiment}</b></span>
                        </td>

                        {/* Deal Value */}
                        <td className="p-4 font-black text-white text-sm">
                          ₹{lead.deal_value.toLocaleString('en-IN')}
                        </td>

                        {/* Interactive Status Dropdown */}
                        <td className="p-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-xl font-bold text-xs outline-none border cursor-pointer ${
                              lead.status === 'Won' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' :
                              lead.status === 'Payment Sent' ? 'bg-purple-950/80 text-purple-400 border-purple-500/40' :
                              lead.status === 'Contacted' ? 'bg-amber-950/80 text-amber-400 border-amber-500/40' :
                              lead.status === 'Lost' ? 'bg-rose-950/80 text-rose-400 border-rose-500/40' :
                              'bg-blue-950/80 text-blue-400 border-blue-500/40'
                            }`}
                          >
                            <option value="New Lead" className="bg-slate-900 text-white">New Lead</option>
                            <option value="Contacted" className="bg-slate-900 text-white">Contacted</option>
                            <option value="Payment Sent" className="bg-slate-900 text-white">Payment Sent</option>
                            <option value="Won" className="bg-slate-900 text-white">Won (Closed)</option>
                            <option value="Lost" className="bg-slate-900 text-white">Lost</option>
                          </select>
                        </td>

                        {/* Source & Notes */}
                        <td className="p-4 max-w-[200px]">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                            {lead.source}
                          </span>
                          {lead.notes && (
                            <p className="text-[11px] text-slate-400 truncate mt-1 italic" title={lead.notes}>
                              "{lead.notes}"
                            </p>
                          )}
                        </td>

                        {/* Instant Communication Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <a 
                              href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(`नमस्कार ${lead.name} जी, आपल्या ${lead.service} च्या चौकशीबद्दल धन्यवाद. मी आपली कशी मदत करू शकतो?`)}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1 shadow-md shadow-emerald-600/20 transition"
                            >
                              <MessageSquare size={13} /> WhatsApp
                            </a>
                            <button 
                              onClick={() => alert(`${lead.name} (${lead.phone}) ला AI व्हॉइस कॉल जोडला जात आहे...`)} 
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1 shadow-md shadow-blue-600/20 transition"
                            >
                              <PhoneCall size={13} /> AI Call
                            </button>
                          </div>
                        </td>

                        {/* Edit & Delete Actions */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-slate-400">
                            <button 
                              onClick={() => handleOpenEditModal(lead)} 
                              className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-blue-400 transition" 
                              title="Edit Lead"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              onClick={() => handleDeleteLead(lead.id, lead.name)} 
                              className="p-1.5 hover:bg-slate-800 rounded-lg hover:text-rose-400 transition" 
                              title="Delete Lead"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLeads.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  कोणतीही लीड सापडली नाही. कृपया सर्च किंवा फिल्टर तपासा.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 3. PIPELINE ================= */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white">Visual Pipeline (Kanban)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['New Lead', 'Contacted', 'Payment Sent', 'Won'].map((stg) => (
                <div 
                  key={stg} 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stg)}
                  className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 space-y-3 min-h-[400px]"
                >
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-white uppercase">{stg}</span>
                    <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">{leads.filter(l => l.status === stg).length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {leads.filter(l => l.status === stg).map((l) => (
                      <div 
                        key={l.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, l.id)}
                        className="p-3 bg-[#080b12] border border-slate-700 rounded-xl space-y-1 cursor-grab active:cursor-grabbing hover:border-blue-500 transition"
                      >
                        <div className="flex justify-between font-bold text-xs"><span className="text-white">{l.name}</span><span className="text-emerald-400">₹{l.deal_value}</span></div>
                        <p className="text-[11px] text-slate-400">{l.service}</p>
                        <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">{l.phone}</p>
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
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles size={16} className="text-blue-400" /> AI Landing Page Generator</h2>
                <div className="flex gap-1.5 bg-[#080b12] p-1 rounded-xl border border-slate-800 text-xs">
                  <button onClick={() => setDeviceView('Desktop')} className={`px-3 py-1 rounded-lg ${deviceView === 'Desktop' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}>Desktop</button>
                  <button onClick={() => setDeviceView('Mobile')} className={`px-3 py-1 rounded-lg ${deviceView === 'Mobile' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'}`}>Mobile</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {Object.keys(templatesDb).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedTemplate(key); setCurrentSite(templatesDb[key]); }}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition ${selectedTemplate === key ? 'bg-blue-600 text-white border-blue-500' : 'bg-[#080b12] text-slate-400 border-slate-800'}`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 text-xs">
                <h3 className="font-bold text-white uppercase text-[11px]">Section Editor</h3>
                <div><label className="text-slate-400 block mb-1">Business Name</label><input type="text" value={currentSite.businessName} onChange={(e) => setCurrentSite({ ...currentSite, businessName: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                <div><label className="text-slate-400 block mb-1">Main Headline</label><textarea rows={2} value={currentSite.headline} onChange={(e) => setCurrentSite({ ...currentSite, headline: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none" /></div>
                <div><label className="text-slate-400 block mb-1">Subheadline</label><textarea rows={2} value={currentSite.subheadline} onChange={(e) => setCurrentSite({ ...currentSite, subheadline: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none" /></div>
              </div>

              <div className="lg:col-span-7 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4">
                <div className={`mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl ${deviceView === 'Mobile' ? 'max-w-xs' : 'w-full'}`}>
                  <header className="bg-[#0b101d] border-b border-slate-800 px-5 py-3 flex justify-between text-xs items-center">
                    <span className="font-bold text-white">{currentSite.businessName}</span>
                    <a href={`tel:${currentSite.phone}`} className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]">कॉल करा</a>
                  </header>
                  <div className="p-6 space-y-3 text-left">
                    <h1 className="text-lg font-black text-white leading-tight">{currentSite.headline}</h1>
                    <p className="text-xs text-slate-300">{currentSite.subheadline}</p>
                    <img src={currentSite.heroImage} alt="Hero" className="w-full h-44 object-cover rounded-xl border border-slate-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. PAYMENT GATEWAYS ================= */}
        {activeTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
              <h3 className="font-bold text-white uppercase text-[11px]">Instant UPI QR & Link Generator</h3>
              <div><label className="text-slate-400 block mb-1">Working UPI ID</label><input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none" /></div>
              <div><label className="text-slate-400 block mb-1">Amount (₹)</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-bold text-base outline-none" /></div>
            </div>

            <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-center space-y-4">
              <div className="p-3 bg-white rounded-2xl shadow-xl inline-block"><img src={qrUrl} alt="Live QR" className="w-44 h-44 block rounded-lg" /></div>
              <p className="text-sm font-black text-white">रक्कम: ₹{amount}</p>
              <button onClick={() => { navigator.clipboard.writeText(livePayUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                {copied ? <Check size={14} /> : <Copy size={14} />} <span>{copied ? 'लिंक कॉपी झाली!' : 'Copy Payment Link'}</span>
              </button>
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

        {/* ================= ADD / EDIT LEAD MODAL POPUP ================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-base flex items-center gap-2">
                  <Users size={18} className="text-blue-400" />
                  {editingLead ? 'Edit Lead Details' : '+ Add New Inbound Lead'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">ग्राहकाचे पूर्ण नाव *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="उदा. सचिन कांबळे"
                      value={leadForm.name} 
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">मोबाईल नंबर *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="उदा. 9876543210"
                      value={leadForm.phone} 
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500 font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">सेवा / उत्पादन (Service)</label>
                    <input 
                      type="text" 
                      placeholder="उदा. 5G Smartphone / Clinic"
                      value={leadForm.service} 
                      onChange={(e) => setLeadForm({ ...leadForm, service: e.target.value })}
                      className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">अपेक्षित रक्कम (Deal Value ₹)</label>
                    <input 
                      type="number" 
                      value={leadForm.deal_value} 
                      onChange={(e) => setLeadForm({ ...leadForm, deal_value: e.target.value })}
                      className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-bold outline-none focus:border-blue-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Pipeline Status</label>
                    <select 
                      value={leadForm.status} 
                      onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                      className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white outline-none"
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Payment Sent">Payment Sent</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Lead Source</label>
                    <select 
                      value={leadForm.source} 
                      onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                      className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white outline-none"
                    >
                      <option value="Website">Website</option>
                      <option value="Meta Lead Ad">Meta Lead Ad</option>
                      <option value="Instagram Ad">Instagram Ad</option>
                      <option value="Facebook Ad">Facebook Ad</option>
                      <option value="WhatsApp Direct">WhatsApp Direct</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">Sentiment</label>
                    <select 
                      value={leadForm.sentiment} 
                      onChange={(e) => setLeadForm({ ...leadForm, sentiment: e.target.value })}
                      className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white outline-none"
                    >
                      <option value="Highly Interested">Highly Interested</option>
                      <option value="Interested">Interested</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Positive">Positive</option>
                      <option value="Cold">Cold</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-bold">विशेष नोट्स / फॉलो-अप तपशील</label>
                  <textarea 
                    rows={2}
                    placeholder="ग्राहकासोबत झालेल्या चर्चेचे महत्त्वाचे मुद्दे..."
                    value={leadForm.notes} 
                    onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                    className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none" 
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                  >
                    रद्द करा
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30"
                  >
                    {editingLead ? 'बदल सेव्ह करा' : 'लीड सेव्ह करा'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}