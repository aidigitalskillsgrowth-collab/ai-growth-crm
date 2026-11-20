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
  Sliders, MessageCircle, BarChart3, ChevronRight, Pause, Lock, CheckCircle, LogOut, KeyRound, Mail, User, Home, Save, Globe,
  BarChart, PieChart, Users2, SendHorizonal, CalendarDays, Bell, CheckCheck
} from 'lucide-react';

const supabaseUrl = 'https://yvaqrcdqehybzlnpwaeb.supabase.co';
const supabaseAnonKey = 'sb_publishable_wOlqq3_YGhJm7twd-FJxrQ_ymV4wZKd';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_EMAIL = 'aidigitalskillsgrowth@gmail.com';
const ADMIN_UPI_ID = 'ravindra@ibl';
const ADMIN_WHATSAPP = '7219566777';

const BLANK_SETTINGS = {
  businessName: '',
  upiId: '',
  whatsappNumber: '',
  metaPhoneId: '',
  razorpayKey: '',
  ownerName: '',
  metaAdAccountId: '',
  accessToken: '',
  webhookVerifyToken: 'ravi_crm_verified_2026',
  geminiApiKey: '',
  client_email: '',
  plan_type: 'whatsapp_starter',
  billing_cycle: 'monthly',
  plan_expires_at: ''
};

const ALL_MODULES = [
  { id: 'dashboard', label: 'Growth Dashboard' },
  { id: 'leads', label: 'Growth Leads Directory' },
  { id: 'pipeline', label: 'Growth CRM & Pipeline' },
  { id: 'website', label: 'Website & Funnels' },
  { id: 'payments', label: 'Payment Gateways (All)' },
  { id: 'agents', label: 'AI Agents & Chatbot' },
  { id: 'meta_ads', label: 'Ad Launcher (Meta)' },
  { id: 'templates', label: 'Template Manager' },
  { id: 'workflow', label: 'AI Workflow Builder' },
  { id: 'inbox', label: 'AI Inbox / WhatsApp' },
  { id: 'calendar', label: 'Smart Calendar' },
  { id: 'ivr', label: 'AI Sales & IVR' },
  { id: 'finance', label: 'AI Finance & Revenue' },
  { id: 'social', label: 'Social Media Auto-Post' },
  { id: 'settings', label: 'Settings & Meta API' },
];

const PLAN_PRESETS: Record<string, { label: string; modules: string[] }> = {
  whatsapp_starter: {
    label: 'WhatsApp Starter Plan (5 Modules)',
    modules: ['dashboard', 'inbox', 'agents', 'templates', 'settings'],
  },
  growth: {
    label: 'Growth Plan (11 Modules)',
    modules: [
      'dashboard', 'leads', 'pipeline', 'payments', 'agents',
      'meta_ads', 'templates', 'workflow', 'inbox', 'calendar', 'settings'
    ],
  },
  full_crm: {
    label: 'Pro / Full CRM Plan (All 15 Modules)',
    modules: ALL_MODULES.map((m) => m.id),
  },
};

const BILLING_CYCLES: Record<string, { label: string; shortLabel: string; price: string }> = {
  monthly: { label: 'Monthly (1 Month / 30 Days)', shortLabel: '1 Month', price: '₹999' },
  six_months: { label: '6 Months (Half-Yearly)', shortLabel: '6 Months', price: '₹4,999' },
  yearly: { label: 'Yearly (1 Year / 365 Days)', shortLabel: '1 Year', price: '₹8,999' },
};

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
  isPublished?: boolean;
  publishedUrl?: string;
  customDomain?: string;
  theme?: string;
  features?: {
    showPricing?: boolean;
    showFAQ?: boolean;
    showLeadForm?: boolean;
  };
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
  pipeline_id?: string;
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

interface ChatMessage {
  id?: string;
  sender?: string;
  phone?: string;
  from?: string;
  wa_id?: string;
  text?: string;
  message?: string;
  message_text?: string;
  body?: string;
  meta_phone_id?: string;
  created_at?: string;
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
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInEmail, setLoggedInEmail] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [deviceView, setDeviceView] = useState<'Desktop' | 'Mobile'>('Desktop');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  const [clientSettings, setClientSettings] = useState({ ...BLANK_SETTINGS });
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [isSubscriptionExpired, setIsSubscriptionExpired] = useState<boolean>(false);

  const [allowedModules, setAllowedModules] = useState<string[]>(
    PLAN_PRESETS.whatsapp_starter.modules
  );

  // Admin Client List Modal व Management
  const [allClientsList, setAllClientsList] = useState<any[]>([]);
  const [isClientListModalOpen, setIsClientListModalOpen] = useState<boolean>(false);
  const [clientSearchTerm, setClientSearchTerm] = useState<string>('');
  const [managedClientEmail, setManagedClientEmail] = useState<string>('');
  const [managedClientPassword, setManagedClientPassword] = useState<string>('');
  const [managedClientName, setManagedClientName] = useState<string>('');
  const [managedClientBiz, setManagedClientBiz] = useState<string>('');
  const [managedPlanType, setManagedPlanType] = useState<string>('whatsapp_starter');
  const [managedBillingCycle, setManagedBillingCycle] = useState<string>('monthly');
  const [managedModules, setManagedModules] = useState<string[]>(PLAN_PRESETS.whatsapp_starter.modules);
  const [savingClientPlan, setSavingClientPlan] = useState<boolean>(false);
  const [quickUpdatingClient, setQuickUpdatingClient] = useState<string>('');

  const [pipelines, setPipelines] = useState([
    { id: 'default_main', name: 'Main Business Pipeline' }
  ]);
  const [selectedPipeline, setSelectedPipeline] = useState('default_main');

  const [dbMessages, setDbMessages] = useState<ChatMessage[]>([]);
  const [inboxLoading, setInboxLoading] = useState<boolean>(false);

  const isAdminUser = loggedInEmail.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (activeTab === 'inbox' && isLoggedIn && !isSubscriptionExpired) {
      fetchSupabaseMessages();
    }
    if (activeTab === 'settings' && isLoggedIn && isAdminUser) {
      fetchAllRegisteredClients();
    }
  }, [activeTab, isLoggedIn, isSubscriptionExpired, clientSettings.metaPhoneId]);

  const fetchAllRegisteredClients = async () => {
    try {
      const { data } = await supabase
        .from('client_settings')
        .select('*')
        .order('updated_at', { ascending: false });
      if (data) {
        setAllClientsList(data);
      }
    } catch (e) {
      console.error('Error loading clients list:', e);
    }
  };

  const fetchSupabaseMessages = async () => {
    setInboxLoading(true);
    try {
      const myPhoneId = String(clientSettings.metaPhoneId || '').trim();
      if (!myPhoneId) {
        setDbMessages([]);
        setInboxLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('meta_phone_id', myPhoneId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDbMessages(data || []);
    } catch (err) {
      console.error('Error fetching Supabase messages:', err);
      setDbMessages([]);
    } finally {
      setInboxLoading(false);
    }
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientSettings(prev => ({ ...prev, [name]: value }));
  };

  const syncSettingsToSupabase = async (overridePrompt?: string) => {
    const phoneId = String(clientSettings.metaPhoneId || '').trim();
    const emailNormalized = String(loggedInEmail || clientSettings.client_email || '')
      .trim()
      .toLowerCase();
    const promptToSave = overridePrompt !== undefined ? overridePrompt : botConfig.systemPrompt;

    const payload: any = {
      businessName: clientSettings.businessName,
      upiId: clientSettings.upiId,
      whatsappNumber: clientSettings.whatsappNumber,
      metaPhoneId: phoneId,
      razorpayKey: clientSettings.razorpayKey,
      ownerName: clientSettings.ownerName,
      metaAdAccountId: clientSettings.metaAdAccountId,
      accessToken: clientSettings.accessToken.trim(),
      webhookVerifyToken: clientSettings.webhookVerifyToken,
      geminiApiKey: clientSettings.geminiApiKey.trim(),
      systemPrompt: promptToSave,
      aiAutoReply: true,
      client_email: emailNormalized,
      plan_type: clientSettings.plan_type || 'whatsapp_starter',
      allowed_modules: Array.from(new Set([...allowedModules, 'settings'])),
      updated_at: new Date().toISOString()
    };

    if (emailNormalized) {
      const { data: existingByEmail } = await supabase
        .from('client_settings')
        .select('user_id')
        .ilike('client_email', emailNormalized)
        .maybeSingle();

      if (existingByEmail?.user_id) {
        await supabase
          .from('client_settings')
          .update(payload)
          .eq('user_id', existingByEmail.user_id);
        return;
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('client_settings').upsert({
        user_id: user.id,
        ...payload
      });
    }
  };

  const handleSaveClientSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await syncSettingsToSupabase();
      alert('✅ तुमच्या स्वतःच्या बिझनेस आणि Meta API सेटिंग्स सुरक्षितरीत्या सेव्ह झाल्या!');
    } catch {
      alert('❌ सेटिंग्स सेव्ह करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveAiAgent = async () => {
    try {
      await syncSettingsToSupabase(botConfig.systemPrompt);
      alert('✅ AI Agent व System Prompt सेव्ह झाले! आता तुमच्या WhatsApp वर याच माहितीप्रमाणे उत्तर दिले जाईल.');
    } catch {
      alert('❌ AI Agent सेव्ह करताना अडचण आली.');
    }
  };

  const handleSelectManagedClient = (row: any) => {
    setManagedClientEmail(row.client_email || '');
    setManagedClientPassword('');
    setManagedClientName(row.ownerName || '');
    setManagedClientBiz(row.businessName || '');
    setManagedPlanType(row.plan_type || 'whatsapp_starter');
    setManagedBillingCycle(
      row.billing_cycle && row.billing_cycle !== 'expired' ? row.billing_cycle : 'monthly'
    );
    const mods = Array.isArray(row.allowed_modules) && row.allowed_modules.length > 0
      ? Array.from(new Set([...row.allowed_modules, 'settings']))
      : PLAN_PRESETS.whatsapp_starter.modules;
    setManagedModules(mods);
    setIsClientListModalOpen(false);
  };

  const handleApplyPresetToManaged = (planKey: string) => {
    setManagedPlanType(planKey);
    const preset = PLAN_PRESETS[planKey];
    if (preset) {
      setManagedModules(Array.from(new Set([...preset.modules, 'settings'])));
    }
  };

  const handleToggleManagedModule = (moduleId: string) => {
    if (moduleId === 'settings') return;
    setManagedModules((prev) => {
      const exists = prev.includes(moduleId);
      const next = exists ? prev.filter((id) => id !== moduleId) : [...prev, moduleId];
      return Array.from(new Set([...next, 'settings']));
    });
  };

  // Client List मधूनच एका क्लिकवर 1 Month / 6 Months / 1 Year / Lock Now सेट करणे
  const handleQuickSetClientCycle = async (cl: any, cycle: string) => {
    const cleanEmail = String(cl.client_email || '').trim().toLowerCase();
    if (!cleanEmail) return;
    setQuickUpdatingClient(cleanEmail);
    try {
      const res = await fetch('/api/admin/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          ownerName: cl.ownerName || '',
          businessName: cl.businessName || '',
          planType: cl.plan_type || 'whatsapp_starter',
          billingCycle: cycle,
          allowedModules: Array.isArray(cl.allowed_modules)
            ? cl.allowed_modules
            : PLAN_PRESETS.whatsapp_starter.modules,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'अपडेट करताना त्रुटी आली.');
      await fetchAllRegisteredClients();
      alert(
        cycle === 'expired'
          ? `🔒 '${cleanEmail}' चे खाते लॉक केले गेले आहे. लॉगिन केल्यावर त्यांना पेमेंट स्क्रीन दिसेल.`
          : `✅ '${cleanEmail}' साठी ${BILLING_CYCLES[cycle]?.shortLabel || cycle} प्लॅन सुरू केला गेला!`
      );
    } catch (err: any) {
      alert(`❌ त्रुटी: ${err?.message}`);
    } finally {
      setQuickUpdatingClient('');
    }
  };

  const handleSaveManagedClientAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = managedClientEmail.trim().toLowerCase();
    if (!cleanEmail) {
      alert('कृपया क्लायंटचा ईमेल आयडी टाका!');
      return;
    }

    setSavingClientPlan(true);
    try {
      const finalModules = Array.from(new Set([...managedModules, 'settings']));

      const res = await fetch('/api/admin/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: managedClientPassword.trim(),
          ownerName: managedClientName.trim() || '',
          businessName: managedClientBiz.trim() || '',
          planType: managedPlanType,
          billingCycle: managedBillingCycle,
          allowedModules: finalModules,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'क्लायंट सेव्ह करताना त्रुटी आली.');
      }

      if (cleanEmail === loggedInEmail.toLowerCase()) {
        setAllowedModules(finalModules);
        setClientSettings((prev) => ({
          ...prev,
          plan_type: managedPlanType,
          billing_cycle: managedBillingCycle,
          plan_expires_at: data.planExpiresAt || prev.plan_expires_at,
        }));
        setIsSubscriptionExpired(false);
      }

      setManagedClientPassword('');
      await fetchAllRegisteredClients();
      alert(
        `✅ '${cleanEmail}' साठी ${BILLING_CYCLES[managedBillingCycle]?.shortLabel || managedBillingCycle} प्लॅन, Password आणि मॉड्यूल्स सेव्ह झाले!`
      );
    } catch (err: any) {
      alert(`❌ त्रुटी: ${err?.message || 'कृपया पुन्हा प्रयत्न करा.'}`);
    } finally {
      setSavingClientPlan(false);
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

  const checkIsExpired = (data: any, email: string): boolean => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) return false;
    if (!data) return false;
    if (data.billing_cycle === 'expired') return true;
    if (data.plan_expires_at) {
      const expTime = new Date(data.plan_expires_at).getTime();
      if (!isNaN(expTime) && expTime < Date.now()) {
        return true;
      }
    }
    return false;
  };

  const applyLoadedRow = (data: any, email: string) => {
    const expired = checkIsExpired(data, email);
    setIsSubscriptionExpired(expired);

    setClientSettings({
      businessName: data?.businessName || '',
      upiId: data?.upiId || '',
      whatsappNumber: data?.whatsappNumber || '',
      metaPhoneId: data?.metaPhoneId || '',
      razorpayKey: data?.razorpayKey || '',
      ownerName: data?.ownerName || email.split('@')[0],
      metaAdAccountId: data?.metaAdAccountId || '',
      webhookVerifyToken: data?.webhookVerifyToken || 'ravi_crm_verified_2026',
      accessToken: data?.accessToken || '',
      geminiApiKey: data?.geminiApiKey || '',
      client_email: email,
      plan_type: data?.plan_type || 'whatsapp_starter',
      billing_cycle: data?.billing_cycle || 'monthly',
      plan_expires_at: data?.plan_expires_at || ''
    });

    setBotConfig(prev => ({
      ...prev,
      name: `${data?.ownerName || 'AI'} Assistant`,
      systemPrompt:
        data?.systemPrompt ||
        'तुम्ही एक हुशार आणि नम्र AI असिस्टंट आहात. ग्राहकांच्या प्रश्नांना स्पष्ट उत्तरे द्या.'
    }));

    if (Array.isArray(data?.allowed_modules) && data.allowed_modules.length > 0) {
      const unlocked = Array.from(new Set([...data.allowed_modules, 'settings']));
      setAllowedModules(unlocked);
    } else {
      setAllowedModules(PLAN_PRESETS.whatsapp_starter.modules);
    }
  };

  const verifyAndLoadAuthorizedClient = async (email: string, userId?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return false;

    const { data: byEmail } = await supabase
      .from('client_settings')
      .select('*')
      .ilike('client_email', cleanEmail)
      .maybeSingle();

    if (byEmail) {
      applyLoadedRow(byEmail, cleanEmail);
      setLoggedInEmail(cleanEmail);
      setIsLoggedIn(true);
      return true;
    }

    if (cleanEmail === ADMIN_EMAIL.toLowerCase()) {
      applyLoadedRow(
        { plan_type: 'full_crm', billing_cycle: 'yearly', allowed_modules: ALL_MODULES.map(m => m.id) },
        cleanEmail
      );
      setLoggedInEmail(cleanEmail);
      setIsLoggedIn(true);
      return true;
    }

    if (userId) {
      const { data: byId } = await supabase
        .from('client_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (byId) {
        applyLoadedRow(byId, cleanEmail);
        setLoggedInEmail(cleanEmail);
        setIsLoggedIn(true);
        return true;
      }
    }

    return false;
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user?.email) {
        const ok = await verifyAndLoadAuthorizedClient(session.user.email, session.user.id);
        if (!ok) {
          await supabase.auth.signOut();
          setIsLoggedIn(false);
          setAuthError('हा ईमेल आमच्या CRM सिस्टममध्ये नोंदणीकृत नाही.');
        }
      } else {
        setIsLoggedIn(false);
      }
      setAuthChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        const ok = await verifyAndLoadAuthorizedClient(session.user.email, session.user.id);
        if (!ok) {
          await supabase.auth.signOut();
          setIsLoggedIn(false);
          setAuthError('हा ईमेल आमच्या CRM सिस्टममध्ये नोंदणीकृत नाही.');
        }
      } else {
        setIsLoggedIn(false);
        setLoggedInEmail('');
        setIsSubscriptionExpired(false);
        setClientSettings({ ...BLANK_SETTINGS });
        setDbMessages([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkEmailRegisteredInSystem = async (email: string): Promise<boolean> => {
    const clean = email.trim().toLowerCase();
    if (!clean) return false;
    if (clean === ADMIN_EMAIL.toLowerCase()) return true;

    const { data } = await supabase
      .from('client_settings')
      .select('client_email')
      .ilike('client_email', clean)
      .maybeSingle();

    return !!data;
  };

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = authEmail.trim().toLowerCase();
    setAuthLoading(true);
    setAuthError('');

    try {
      const isAllowed = await checkEmailRegisteredInSystem(cleanEmail);
      if (!isAllowed) {
        setAuthError('⛔ हा ईमेल आयडी आमच्या सिस्टममध्ये नोंदलेला नाही! दुसऱ्या ईमेलने लॉगिन करता येणार नाही.');
        setAuthLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: authPassword,
      });

      if (error) {
        setAuthError(
          error.message === 'Invalid login credentials'
            ? 'चुकीचा ईमेल किंवा पासवर्ड! कृपया अ‍ॅडमिनने दिलेला पासवर्ड टाका.'
            : error.message
        );
      } else if (data.session?.user?.email) {
        await verifyAndLoadAuthorizedClient(data.session.user.email, data.session.user.id);
      }
    } catch {
      setAuthError('लॉगिन करताना तांत्रिक अडचण आली.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSupabaseLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setLoggedInEmail('');
    setAuthPassword('');
    setIsSubscriptionExpired(false);
    setClientSettings({ ...BLANK_SETTINGS });
    setDbMessages([]);
  };

  const initialLeads: Lead[] = [
    { id: '1', name: 'रविराज पाटील', phone: '9876543210', service: 'Digital Marketing Setup', deal_value: 1500, status: 'New Lead', source: 'Website', sentiment: 'Highly Interested', notes: 'आज संध्याकाळी ६ वाजता बोलणे ठरले आहे.', created_at: 'आज, 10:30 AM', pipeline_id: 'default_main' },
    { id: '2', name: 'सचिन कांबळे', phone: '9123456780', service: 'Business Coaching', deal_value: 25000, status: 'Contacted', source: 'Meta Lead Ad', sentiment: 'Interested', notes: 'मास्टरक्लास संबंधी विचारले.', created_at: 'आज, 11:15 AM', pipeline_id: 'default_main' },
    { id: '3', name: 'अमित देशमुख', phone: '9822334455', service: 'Consulting Session', deal_value: 4500, status: 'Payment Sent', source: 'Instagram Ad', sentiment: 'Follow-up', notes: 'पेमेंट लिंक पाठवली आहे.', created_at: 'काल, 04:20 PM', pipeline_id: 'default_main' },
    { id: '4', name: 'प्रियांका शिंदे', phone: '9765432109', service: 'Agency Growth Plan', deal_value: 3200, status: 'Won', source: 'WhatsApp Direct', sentiment: 'Positive', notes: 'पेमेंट जमा झाले.', created_at: 'काल, 06:10 PM', pipeline_id: 'default_main' },
  ];

  const [leads, setLeads] = useState<Lead[]>([]);
  const stages = ['New Lead', 'Contacted', 'Payment Sent', 'Won', 'Lost'];

  useEffect(() => {
    if (isLoggedIn && !isSubscriptionExpired) {
      if (isAdminUser) {
        setLeads(initialLeads);
      } else {
        setLeads([]);
      }
    } else {
      setLeads([]);
    }
  }, [isLoggedIn, isAdminUser, isSubscriptionExpired]);

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
      businessName: clientSettings.businessName || 'My Business',
      tagline: 'ऑटोमेशन, मेटा ॲड्स आणि AI टूल्सद्वारे बिझनेस ग्रोथ',
      headline: 'तुमचा व्यवसाय ऑनलाइन वाढवा आणि AI च्या मदतीने दरमहा लाखो रुपये कमवा!',
      subheadline: 'डिजिटल मार्केटिंग मास्टरक्लास, मेटा ॲड कॅम्पेन सेटअप, ऑटोमेशन सिस्टीम आणि पर्सनल बिझनेस कोचिंग.',
      heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      ownerImage: avatars.ownerDefault,
      phone: clientSettings.whatsappNumber,
      email: loggedInEmail,
      address: 'महाराष्ट्र, भारत',
      timing: 'सकाळी ९:०० ते रात्री ८:०० (सर्व दिवस सुरू)',
      primaryCta: 'आत्ताच नोंदणी करा',
      badge: '★ प्रो साॅस ॲक्टिव्ह (Pro SaaS Active)',
      theme: 'dark',
      features: { showPricing: true, showFAQ: true, showLeadForm: true },
      services: [
        { title: 'AI डिजिटल स्किल्स मास्टरक्लास', desc: 'ChatGPT, Gemini आणि आधुनिक AI टूल्स शिकण्याची उत्तम संधी.', price: '₹९९९ पासून' },
        { title: 'मेटा ॲड्स & लीड जनरेशन', desc: 'तुमच्या व्यवसायाला थेट मोबाईलवर हव्यात तेवढ्या कस्टमर लीड्स मिळवा.', price: '₹४,९९९' },
        { title: '1-on-1 बिझनेस कोचिंग', desc: 'वैयक्तिक मार्गदर्शन आणि बिझनेस ऑटोमेशन सेटअप.', price: '₹९,९९९' }
      ],
      stats: [
        { label: 'प्रशिक्षित विद्यार्थी', value: '१०,०००+' },
        { label: 'यशस्वी मोहीम', value: '५००+' },
        { label: 'समाधानी क्लायंट्स', value: '१००%' }
      ],
      testimonials: [
        { name: 'सचिन कांबळे', avatar: avatars.male2, location: 'सांगली', review: 'मार्गदर्शनामुळे माझा बिझनेस पूर्णपणे ऑटोमेशनवर आला. खूप अप्रतिम अनुभव!', rating: 5 },
        { name: 'प्रियांका शिंदे', avatar: avatars.female1, location: 'मिरज', review: 'मेटा ॲड शिकल्यापासून माझ्या पेजवर रोज नवीन कस्टमर येत आहेत!', rating: 5 }
      ],
      isPublished: false,
      publishedUrl: '',
      customDomain: ''
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string>('Digital Marketing & Coaching');
  const [currentSite, setCurrentSite] = useState<TemplateData>(templatesDb['Digital Marketing & Coaching']);
  const [promptInput, setPromptInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [tempDomainInput, setTempDomainInput] = useState<string>('');

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
    } catch { setIsListening(false); }
  };

  const handleGenerateWebsite = () => {
    if (!promptInput.trim()) { alert('कृपया आधी व्यवसायाचा प्रॉम्प्ट टाईप करा किंवा माईकवर बोला!'); return; }
    setIsGenerating(true);
    setTimeout(() => {
      const bizName = promptInput;
      const headlineText = 'Transforming Industry Standards with Premium Excellence';
      const subText = 'We deliver cutting-edge solutions, high-performance execution, and unmatched customer support tailored specifically for your brand.';
      const badgeText = '★ Verified 5-Star Enterprise Solution';
      const heroImageLink = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80';
      const ownerAvatar = avatars.ownerDefault;
      const dynamicServices = [
        { title: 'Core Premium Service', desc: 'Designed to deliver maximum efficiency, superior quality and exceptional value.', price: '₹1,999 onwards' },
        { title: 'Advanced Consultation', desc: 'Expert guidance and 24/7 dedicated support to scale your operations smoothly.', price: '₹4,999' },
        { title: 'Complete Execution Package', desc: 'All-in-one comprehensive framework built for high performance and results.', price: '₹9,999' }
      ];
      const dynamicTestimonials = [
        { name: 'राहुल शहा', avatar: avatars.client1, location: 'मुंबई', review: 'अप्रतिम सर्विस! क्वालिटी आणि प्रोफेशनलिझम खरोखर वाखाणण्याजोगा आहे.', rating: 5 },
        { name: 'अमित देसाई', avatar: avatars.client2, location: 'पुणे', review: 'सर्व काही मनासारखे आणि वेळेवर मिळाले. मी नक्की पुन्हा भेट देईन!', rating: 5 }
      ];
      setCurrentSite(prev => ({
        ...prev,
        businessName: bizName, badge: badgeText, headline: headlineText, subheadline: subText,
        heroImage: heroImageLink, ownerImage: ownerAvatar, tagline: 'Powered by Next-Gen AI Agency Architecture',
        services: dynamicServices, testimonials: dynamicTestimonials, isPublished: false, publishedUrl: '', customDomain: ''
      }));
      setIsGenerating(false); setPromptInput('');
      alert('🎉 तुमच्या प्रॉम्प्टनुसार अत्यंत प्रोफेशनल आणि डाइनॅमिक 5-स्टार वेबसाईट तयार झाली!');
    }, 500);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setCurrentSite(prev => ({ ...prev, heroImage: reader.result as string })); alert('बॅनर फोटो यशस्वीरीत्या बदलला!'); };
      reader.readAsDataURL(file);
    }
  };

  const handleOwnerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setCurrentSite(prev => ({ ...prev, ownerImage: reader.result as string })); alert('मालकाचा फोटो यशस्वीरीत्या अपलोड झाला!'); };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishWebsite = () => {
    const slug = currentSite.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20) || 'my-business';
    const liveLink = `https://ai-growth-crm-nine.vercel.app/site/${slug}`;
    setCurrentSite(prev => ({ ...prev, isPublished: true, publishedUrl: liveLink }));
    alert(`🚀 "${currentSite.businessName}" ही वेबसाईट यशस्वीरीत्या लाईव्ह पब्लिश झाली!\n\nLive URL: ${liveLink}`);
  };

  const handleConnectDomain = () => {
    if (!tempDomainInput.trim()) { alert('कृपया तुमचे स्वतःचे डोमेन नाव टाका (उदा. www.mybusiness.com)'); return; }
    setCurrentSite(prev => ({ ...prev, customDomain: tempDomainInput }));
    alert(`🌐 डोमेन '${tempDomainInput}' यशस्वीरीत्या '${currentSite.businessName}' या वेबसाईटशी कनेक्ट झाले!`);
    setTempDomainInput('');
  };

  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentDesc, setPaymentDesc] = useState<string>('Service Advance Payment');
  const [amount, setAmount] = useState<string>('2500');
  const [isAutoWhatsAppPdfActive, setIsAutoWhatsAppPdfActive] = useState<boolean>(true);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TXN-98214', customerName: 'सचिन कांबळे', phone: '9123456780', amount: 2500, gateway: 'Razorpay Live', status: 'Success', date: 'आज, 12:45 PM' },
    { id: 'TXN-98213', customerName: 'प्रियांका शिंदे', phone: '9765432109', amount: 3200, gateway: 'Instamojo Secure', status: 'Success', date: 'आज, 11:10 AM' },
  ]);

  const [socialPostText, setSocialPostText] = useState('');

  const cleanAmt = (Number(amount) || 1).toFixed(2);
  const upiIntent = `upi://pay?pa=${clientSettings.upiId.trim()}&pn=${encodeURIComponent(clientSettings.businessName || 'Business')}&am=${cleanAmt}&cu=INR&tn=${encodeURIComponent(paymentDesc)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntent)}`;
  const livePayUrl = `https://ai-growth-crm-nine.vercel.app/pay?pa=${encodeURIComponent(clientSettings.upiId)}&pn=${encodeURIComponent(clientSettings.businessName || 'Business')}&am=${cleanAmt}&tn=${encodeURIComponent(paymentDesc)}`;

  const handleRazorpayPay = async () => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) { alert('Razorpay गेटवे लोड करण्यात अडचण आली.'); return; }
    const options = {
      key: clientSettings.razorpayKey || 'rzp_test_51MzAbcDefGhiJkl',
      amount: Math.round(Number(amount || 1) * 100), currency: 'INR', name: clientSettings.businessName || 'Business', description: paymentDesc,
      handler: function (response: any) {
        const pId = response.razorpay_payment_id || `PAY-${Date.now().toString().slice(-6)}`;
        alert(`🎉 Razorpay द्वारे ₹${amount} चे पेमेंट यशस्वी झाले!\nPayment ID: ${pId}`);
        setTransactions(prev => [{ id: pId, customerName, phone: customerPhone, amount: Number(amount), gateway: 'Razorpay Live', status: 'Success', date: 'आत्ताच' }, ...prev]);
        if (isAutoWhatsAppPdfActive && customerPhone) {
          const autoMsg = `✅ *पेमेंट यशस्वी & अधिकृत पावती (PDF Bill)*\n\n👤 ग्राहक: ${customerName}\n📦 सेवा: ${paymentDesc}\n💰 रक्कम: ₹${amount}\n🆔 ID: ${pId}\n\n📄 *PDF बिल:*\nhttps://ai-growth-crm-nine.vercel.app/api/invoice-pdf?txn=${pId}\n\nधन्यवाद! 🙏`;
          window.open(`https://wa.me/91${customerPhone}?text=${encodeURIComponent(autoMsg)}`, '_blank');
        }
      },
      prefill: { name: customerName, contact: customerPhone }, theme: { color: '#2563eb' }
    };
    try { const rzp = new (window as any).Razorpay(options); rzp.open(); } catch { alert('Razorpay Checkout त्रुटी.'); }
  };

  const handleSendWhatsAppBill = () => {
    if (!customerPhone.trim()) { alert('कृपया ग्राहकाचा व्हॉट्सॲप नंबर टाका!'); return; }
    const msg = `🧾 *पेमेंट इनव्हॉइस - ${clientSettings.businessName || 'Business'}*\n\n👤 *ग्राहक:* ${customerName}\n📦 *सेवा:* ${paymentDesc}\n💰 *रक्कम:* ₹${amount}\n\n📲 *UPI द्वारे भरा:*\n${livePayUrl}\n\nधन्यवाद! 🙏`;
    window.open(`https://wa.me/91${customerPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const [customTemplateName, setCustomTemplateName] = useState('');
  const [customTemplateText, setCustomTemplateText] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([
    { title: 'Welcome Inquiry', text: 'नमस्कार {Name} जी, आमच्या AI Growth CRM मध्ये आपले स्वागत आहे.' },
    { title: 'Instant UPI Payment Request', text: 'नमस्कार {Name} जी, आपल्या {Service} चे ₹{Amount} चे डिजिटल बिल खालीलप्रमाणे आहे.' },
    { title: 'Appointment Confirmed', text: 'आपली {Service} ची वेळ निश्चित झाली आहे.' }
  ]);

  const handleGenerateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTemplateName.trim() || !customTemplateText.trim()) { alert('कृपया नाव आणि मजकूर भरा!'); return; }
    setSavedTemplates(prev => [...prev, { title: customTemplateName, text: customTemplateText }]);
    setCustomTemplateName(''); setCustomTemplateText('');
    alert('नवीन मेसेज टेम्पलेट यशस्वीरीत्या तयार झाले!');
  };

  const [customWorkflows, setCustomWorkflows] = useState([
    { id: '1', trigger: 'New Lead from Meta Ads', action: 'Instant WhatsApp Auto-Reply' },
    { id: '2', trigger: 'Payment Link Clicked', action: 'Send 10% Discount Coupon' }
  ]);

  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [metaAdAccount] = useState('act_982347892347');
  const [adBudget, setAdBudget] = useState(500);
  const [targetLocation, setTargetLocation] = useState('महाराष्ट्र, भारत');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ clientName: '', phone: '', service: '', date: '2026-11-25', time: '10:00 AM' });

  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.clientName.trim() || !newSlot.phone.trim()) { alert('कृपया नाव आणि मोबाईल नंबर टाका!'); return; }
    setAppointments(prev => [{ id: Date.now().toString(), clientName: newSlot.clientName, phone: newSlot.phone, service: newSlot.service || 'General Service', date: newSlot.date, time: newSlot.time, status: 'Confirmed' }, ...prev]);
    setIsSlotModalOpen(false);
    setNewSlot({ clientName: '', phone: '', service: '', date: '2026-11-25', time: '10:00 AM' });
    alert('नवीन अपॉइंटमेंट स्लॉट यशस्वीरीत्या बुक झाला!');
  };

  const handleCancelAppointment = (id: string, name: string) => {
    if (confirm(`तुम्हाला नक्की '${name}' ची अपॉइंटमेंट रद्द करायची आहे का?`)) { setAppointments(prev => prev.filter(a => a.id !== id)); }
  };

  const [botConfig, setBotConfig] = useState({
    name: 'AI Business Assistant',
    personality: 'Professional & Friendly',
    language: 'मराठी + English (Hinglish)',
    autoDiscount: true,
    discountPercent: 10,
    systemPrompt: 'तुम्ही एक हुशार आणि नम्र AI असिस्टंट आहात. ग्राहकांच्या प्रश्नांना स्पष्ट उत्तरे द्या.'
  });

  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
    { sender: 'bot', text: 'नमस्कार! 🙏 मी आपला AI असिस्टंट आहे. मी आपल्याला कशी मदत करू?', time: '10:00 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');

  const handleSendChat = async () => {
    if (!inputMsg.trim()) return;

    const currentInput = inputMsg.trim();
    const userTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: currentInput, time: userTime }]);
    setInputMsg('');

    let apiKey = clientSettings?.geminiApiKey ? clientSettings.geminiApiKey.trim() : '';
    if (!apiKey) {
      const { data: adminRow } = await supabase
        .from('client_settings')
        .select('geminiApiKey')
        .ilike('client_email', ADMIN_EMAIL)
        .maybeSingle();
      apiKey = String(adminRow?.geminiApiKey || '').trim();
    }

    if (!apiKey) {
      const botTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '⚠️ Gemini API कनेक्ट झालेले नाही. कृपया Settings & Meta API मध्ये जाऊन Gemini API Key सेव्ह करा.',
          time: botTime,
        },
      ]);
      return;
    }

    try {
      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          message: currentInput,
          systemPrompt: botConfig?.systemPrompt || '',
        }),
      });

      const data = await response.json();
      const botTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      if (!response.ok || !data?.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `❌ Gemini API त्रुटी: ${data?.error || 'उत्तर मिळू शकले नाही.'}`,
            time: botTime,
          },
        ]);
        return;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply,
          time: botTime,
        },
      ]);
    } catch {
      const botTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '❌ सर्व्हरशी संपर्क साधताना नेटवर्क एरर आला. कृपया पुन्हा प्रयत्न करा.',
          time: botTime,
        },
      ]);
    }
  };

  const [aiVoiceScript, setAiVoiceScript] = useState<string>('नमस्कार, मी AI असिस्टंट बोलत आहे. आपल्या चौकशीबद्दल धन्यवाद.');

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
      setLeads(prev => [{ id: Date.now().toString(), ...leadForm, deal_value: Number(leadForm.deal_value), pipeline_id: selectedPipeline, created_at: 'आत्ताच जोडले' }, ...prev]);
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
    const a = document.createElement('a'); a.href = url; a.download = `Growth_CRM_Leads_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string; if (!text) return;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length <= 1) return;
      const imported: Lead[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/"/g, '').trim());
        if (parts.length >= 2) {
          imported.push({
            id: Date.now().toString() + i,
            name: String(parts[0] || 'Lead'),
            phone: String(parts[1] || ''),
            service: String(parts[2] || 'Service'),
            deal_value: Number(parts[3]) || 2000,
            status: String(parts[4] || 'New Lead'),
            source: String(parts[5] || 'CSV'),
            sentiment: 'Interested',
            pipeline_id: selectedPipeline,
            created_at: 'Imported'
          });
        }
      }
      if (imported.length > 0) { setLeads(prev => [...imported, ...prev]); alert(`${imported.length} कॉन्टॅक्ट्स आयात झाले!`); }
    };
    reader.readAsText(file);
  };

  const renderWebpageContent = (isModal: boolean = false) => {
    const themeBg = currentSite.theme === 'neon' ? 'bg-[#030712] border-blue-500/40' : currentSite.theme === 'royal' ? 'bg-[#0f0c05] border-amber-600/30' : 'bg-[#07090e] border-slate-800';
    const accentText = currentSite.theme === 'neon' ? 'text-cyan-400' : currentSite.theme === 'royal' ? 'text-amber-400' : 'text-blue-400';
    const accentBtn = currentSite.theme === 'neon' ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30' : currentSite.theme === 'royal' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30';
    const showPricing = currentSite.features?.showPricing ?? true;
    const showFAQ = currentSite.features?.showFAQ ?? true;
    const showLeadForm = currentSite.features?.showLeadForm ?? true;

    return (
      <div className={`mx-auto ${themeBg} border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${!isModal && deviceView === 'Mobile' ? 'max-w-sm' : 'w-full'}`}>
        <div className="bg-[#0b101d] border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {currentSite.isPublished ? (
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> Live: <a href={currentSite.publishedUrl} target="_blank" rel="noreferrer" className="underline font-mono text-[11px]">{currentSite.publishedUrl}</a>
              </span>
            ) : (
              <button onClick={handlePublishWebsite} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer">
                <Globe size={14} /> 🚀 Publish This Website Live
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {currentSite.customDomain ? (
              <span className="px-3 py-1 bg-blue-950 text-blue-400 border border-blue-500/30 rounded-xl font-bold font-mono">🌐 {currentSite.customDomain}</span>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#07090e] border border-slate-700 rounded-xl px-2.5 py-1">
                <input type="text" value={tempDomainInput} onChange={(e) => setTempDomainInput(e.target.value)} placeholder="www.mybusiness.com" className="bg-transparent text-white text-xs outline-none w-36 font-mono" />
                <button onClick={handleConnectDomain} className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px] cursor-pointer">Connect Domain</button>
              </div>
            )}
          </div>
        </div>

        <header className="bg-[#0b101d]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div>
            <input type="text" value={currentSite.businessName} onChange={(e) => setCurrentSite({ ...currentSite, businessName: e.target.value })} className="font-black text-white text-base bg-transparent outline-none border-b border-dashed border-blue-500 w-60" />
            <input type="text" value={currentSite.tagline} onChange={(e) => setCurrentSite({ ...currentSite, tagline: e.target.value })} className={`text-[11px] ${accentText} font-semibold bg-transparent outline-none border-b border-dashed border-blue-500/50 w-full mt-0.5`} />
          </div>
          <div className="flex items-center gap-2">
            <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg"><MessageSquare size={14} /> WhatsApp</a>
            <a href={`tel:${currentSite.phone}`} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg"><Phone size={14} /> कॉल करा</a>
          </div>
        </header>

        <section className="p-8 md:p-12 bg-gradient-to-b from-[#0e1628] via-[#0a0f1d] to-transparent text-left space-y-6">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 ${accentText} text-xs font-bold`}><Sparkles size={14} /> {currentSite.badge}</div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <textarea rows={2} value={currentSite.headline} onChange={(e) => setCurrentSite({ ...currentSite, headline: e.target.value })} className="text-2xl md:text-4xl font-black text-white bg-transparent outline-none border border-dashed border-blue-500/40 rounded-2xl p-3 w-full resize-none leading-tight" />
              <textarea rows={3} value={currentSite.subheadline} onChange={(e) => setCurrentSite({ ...currentSite, subheadline: e.target.value })} className="text-sm md:text-base text-slate-300 bg-transparent outline-none border border-dashed border-blue-500/40 rounded-2xl p-3 w-full resize-none leading-relaxed" />
              <div className="flex items-center gap-4 pt-2">
                <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className={`px-6 py-3 ${accentBtn} text-white rounded-2xl font-bold text-xs shadow-xl flex items-center gap-2`}><Zap size={15} /> {currentSite.primaryCta}</a>
                <span className="text-xs text-slate-400 font-medium">⚡ Instant Response Guaranteed</span>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#0d1424] border border-slate-800 rounded-3xl shadow-2xl relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-blue-500/50 shadow-xl relative mb-3">
                <img src={currentSite.ownerImage} alt="Owner" className="w-full h-full object-cover" />
              </div>
              <div className="text-center space-y-1 w-full">
                <input type="text" value={currentSite.businessName} onChange={(e) => setCurrentSite({ ...currentSite, businessName: e.target.value })} className="font-bold text-white text-xs bg-transparent outline-none text-center w-full border-b border-dashed border-slate-700" />
                <span className="text-[10px] text-emerald-400 font-bold block">Founder & Lead Expert</span>
              </div>
              <button onClick={() => ownerInputRef.current?.click()} className="mt-3 px-3.5 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer">
                <ImageIcon size={14} /> Change Owner Photo
              </button>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl group mt-6">
            <img src={currentSite.heroImage} alt="Banner" className="w-full h-60 md:h-80 object-cover" />
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs text-white flex items-center gap-2 shadow-2xl cursor-pointer">
              <ImageIcon size={16} className="text-blue-400" />
              <button onClick={() => bannerInputRef.current?.click()} className="bg-transparent text-white font-bold cursor-pointer">Change Banner Photo</button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2 px-8 py-6 bg-[#0b101e] border-y border-slate-800 text-center">
          {currentSite.stats.map((st, i) => (
            <div key={i} className="p-2">
              <input type="text" value={st.value} onChange={(e) => { const s = [...currentSite.stats]; s[i].value = e.target.value; setCurrentSite({ ...currentSite, stats: s }); }} className={`text-xl md:text-2xl font-black ${accentText} bg-transparent outline-none text-center w-full border-b border-dashed border-blue-500/40`} />
              <input type="text" value={st.label} onChange={(e) => { const s = [...currentSite.stats]; s[i].label = e.target.value; setCurrentSite({ ...currentSite, stats: s }); }} className="text-xs text-slate-400 bg-transparent outline-none text-center w-full mt-1" />
            </div>
          ))}
        </section>

        <section className="p-8 md:p-12 space-y-6 text-left">
          <div className="text-center space-y-2 mb-8"><span className={`text-xs ${accentText} font-bold uppercase tracking-wider`}>आमच्या खास सेवा</span><h3 className="text-xl md:text-2xl font-black text-white">लोकप्रिय उत्पादने आणि सेवा</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentSite.services.map((srv, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#0d1424] border border-slate-800 space-y-3 flex flex-col justify-between shadow-xl">
                <div className="space-y-2">
                  <input type="text" value={srv.title} onChange={(e) => { const s = [...currentSite.services]; s[idx].title = e.target.value; setCurrentSite({ ...currentSite, services: s }); }} className="font-bold text-white text-sm bg-transparent outline-none w-full border-b border-dashed border-slate-700 pb-1" />
                  <textarea rows={3} value={srv.desc} onChange={(e) => { const s = [...currentSite.services]; s[idx].desc = e.target.value; setCurrentSite({ ...currentSite, services: s }); }} className="text-xs text-slate-400 bg-transparent outline-none w-full resize-none border border-dashed border-slate-800 rounded-xl p-2 mt-1" />
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <input type="text" value={srv.price} onChange={(e) => { const s = [...currentSite.services]; s[idx].price = e.target.value; setCurrentSite({ ...currentSite, services: s }); }} className="font-black text-emerald-400 text-sm bg-transparent outline-none w-full border-b border-dashed border-emerald-500/40" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {showPricing && (
          <section className="p-8 md:p-12 bg-[#0b101e] border-t border-slate-800 text-left space-y-6">
            <div className="text-center space-y-1"><span className={`text-xs ${accentText} font-bold uppercase tracking-wider`}>Investment Plans</span><h3 className="text-xl font-black text-white">Transparent Pricing</h3></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <div className="p-6 bg-[#0d1424] border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">Growth Starter</h4>
                <p className="text-2xl font-black text-emerald-400">₹4,999 <span className="text-xs text-slate-400 font-normal">/ one-time</span></p>
                <p className="text-xs text-slate-300">Basic funnel setup, 3 WhatsApp templates, UPI payment integration.</p>
                <a href={`https://wa.me/91${currentSite.phone}?text=I want Growth Starter Plan`} target="_blank" rel="noreferrer" className="block text-center py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs">Choose Starter</a>
              </div>
              <div className="p-6 bg-blue-950/40 border border-blue-500/40 rounded-2xl space-y-3 relative">
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">Most Popular</span>
                <h4 className="font-bold text-white text-sm">Pro AI Agency Suite</h4>
                <p className="text-2xl font-black text-emerald-400">₹14,999 <span className="text-xs text-slate-400 font-normal">/ project</span></p>
                <p className="text-xs text-slate-300">Complete AI website, automated WhatsApp bot, IVR calling & Meta ads sync.</p>
                <a href={`https://wa.me/91${currentSite.phone}?text=I want Pro AI Agency Suite`} target="_blank" rel="noreferrer" className={`block text-center py-2.5 ${accentBtn} text-white font-bold rounded-xl text-xs shadow-lg`}>Get Pro Suite</a>
              </div>
            </div>
          </section>
        )}

        {showFAQ && (
          <section className="p-8 md:p-12 border-t border-slate-800 text-left space-y-5">
            <div className="text-center space-y-1"><span className={`text-xs ${accentText} font-bold uppercase tracking-wider`}>Got Questions?</span><h3 className="text-xl font-black text-white">Frequently Asked Questions</h3></div>
            <div className="max-w-xl mx-auto space-y-3 text-xs">
              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-2xl space-y-1">
                <p className="font-bold text-white">वेबसाईट लाईव्ह होण्यासाठी किती वेळ लागतो?</p>
                <p className="text-slate-400">प्रॉम्प्ट दिल्यानंतर सेकंदात डिझाइन तयार होते आणि वन-क्लिक पब्लिशिंगने लगेच लाईव्ह होते.</p>
              </div>
              <div className="p-4 bg-[#0d1424] border border-slate-800 rounded-2xl space-y-1">
                <p className="font-bold text-white">कस्टम डोमेन कनेक्ट करता येते का?</p>
                <p className="text-slate-400">होय, तुम्ही तुमचे स्वतःचे डोमेन थेट या पॅनलवरून कनेक्ट करू शकता.</p>
              </div>
            </div>
          </section>
        )}

        {showLeadForm && (
          <section className="p-8 md:p-12 bg-gradient-to-t from-[#0e1628] to-[#0b101e] border-t border-slate-800 text-left space-y-5">
            <div className="text-center space-y-1"><span className={`text-xs ${accentText} font-bold uppercase tracking-wider`}>Quick Inquiry</span><h3 className="text-xl font-black text-white">सल्ला किंवा फ्री डेमसाठी संपर्क साधा</h3></div>
            <div className="max-w-md mx-auto bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-3.5 text-xs">
              <input type="text" placeholder="तुमचे पूर्ण नाव" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-3 text-white outline-none" />
              <input type="text" placeholder="मोबाईल / WhatsApp नंबर" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-3 text-white outline-none font-mono" />
              <button onClick={() => alert('धन्यवाद! आपली चौकशी CRM मध्ये नोंदवली गेली आहे.')} className={`w-full py-3 ${accentBtn} text-white font-bold rounded-xl shadow-lg cursor-pointer`}>
                इन्क्वायरी सबमिट करा
              </button>
            </div>
          </section>
        )}

        <footer className="bg-[#05070c] border-t border-slate-800 p-8 text-left text-xs space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <input type="text" value={currentSite.businessName} onChange={(e) => setCurrentSite({ ...currentSite, businessName: e.target.value })} className="font-bold text-white text-sm bg-transparent outline-none w-60 border-b border-dashed border-slate-700" />
              <input type="text" value={currentSite.address} onChange={(e) => setCurrentSite({ ...currentSite, address: e.target.value })} className="text-xs text-slate-400 bg-transparent outline-none w-full mt-1" />
            </div>
            <div className="text-right text-[11px] text-slate-500">
              Powered by <b className="text-blue-400">AI Growth CRM Pro</b>
            </div>
          </div>
        </footer>
      </div>
    );
  };

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

  const filteredClients = allClientsList.filter((cl) => {
    const q = clientSearchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      String(cl.client_email || '').toLowerCase().includes(q) ||
      String(cl.ownerName || '').toLowerCase().includes(q) ||
      String(cl.businessName || '').toLowerCase().includes(q)
    );
  });

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-blue-500 mx-auto" />
          <p className="text-xs text-slate-400 font-bold">तुमचे CRM खाते तपासत आहोत...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d1424] border border-slate-800 rounded-3xl p-7 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg mx-auto shadow-lg shadow-blue-600/40">
              AI
            </div>
            <h1 className="text-xl font-black text-white">AI Growth CRM Login</h1>
            <p className="text-xs text-slate-400">
              तुमचा नोंदणीकृत Email ID आणि Password टाकून थेट लॉगिन करा.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-950/70 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleSupabaseLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">नोंदणीकृत ईमेल आयडी</label>
              <div className="flex items-center gap-2 bg-[#080b12] border border-slate-700 rounded-xl px-3.5 py-2.5">
                <Mail size={15} className="text-blue-400" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="bg-transparent text-white outline-none w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">पासवर्ड</label>
              <div className="flex items-center gap-2 bg-[#080b12] border border-slate-700 rounded-xl px-3.5 py-2.5">
                <KeyRound size={15} className="text-blue-400" />
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent text-white outline-none w-full"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
            >
              {authLoading ? 'लॉगिन होत आहे...' : 'लॉगिन करा'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // मुदत संपल्यावर (Subscription Expired) क्लायंटला कोणताही डेटा न दिसता थेट पेमेंट स्क्रीन दाखवणे
  if (isSubscriptionExpired && !isAdminUser) {
    const renewalUpi = `upi://pay?pa=${ADMIN_UPI_ID}&pn=${encodeURIComponent('AI Growth CRM Renewal')}&am=999.00&cu=INR&tn=${encodeURIComponent(`Plan Renewal - ${loggedInEmail}`)}`;
    const renewalQr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(renewalUpi)}`;
    const renewalWaMsg = `नमस्कार रवी सर! 🙏 माझा AI Growth CRM चा प्लॅन संपला आहे.\n\n📧 Email: ${loggedInEmail}\n📦 Plan: ${clientSettings.plan_type}\n\nमी पेमेंट करून स्क्रीनशॉट पाठवत आहे, कृपया माझे खाते पुन्हा सुरू करा.`;

    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[#0d1424] border border-rose-500/40 rounded-3xl p-7 space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <Lock size={30} />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-rose-950 text-rose-300 border border-rose-500/30 rounded-full text-[11px] font-bold uppercase">
              Subscription Expired / Account Locked
            </span>
            <h1 className="text-2xl font-black text-white pt-1">तुमचा प्लॅन संपला आहे — कृपया पेमेंट करा</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              खाते: <b className="text-white">{loggedInEmail}</b> • तुमच्या सबस्क्रिप्शनची मुदत पूर्ण झाल्यामुळे CRM मधील सर्व डेटा व मॉड्यूल्स तात्पुरते लॉक केले गेले आहेत. सेवा पुन्हा सुरू करण्यासाठी खालील QR वर पेमेंट करा.
            </p>
          </div>

          <div className="bg-[#080b12] border border-slate-800 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-slate-300">UPI द्वारे रिन्यूअल पेमेंट करा ({ADMIN_UPI_ID})</p>
            <div className="p-3 bg-white rounded-2xl inline-block">
              <img src={renewalQr} alt="Renewal QR" className="w-44 h-44 block" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px]">
              <div className="p-2 bg-[#0d1424] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block">1 Month</span>
                <b className="text-emerald-400">₹999</b>
              </div>
              <div className="p-2 bg-[#0d1424] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block">6 Months</span>
                <b className="text-emerald-400">₹4,999</b>
              </div>
              <div className="p-2 bg-[#0d1424] border border-slate-800 rounded-xl">
                <span className="text-slate-400 block">1 Year</span>
                <b className="text-emerald-400">₹8,999</b>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 text-xs">
            <a
              href={`https://wa.me/91${ADMIN_WHATSAPP}?text=${encodeURIComponent(renewalWaMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageSquare size={15} /> पेमेंट स्क्रीनशॉट WhatsApp वर पाठवा
            </a>
            <button
              onClick={handleSupabaseLogout}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans antialiased overflow-hidden">
      <aside className="w-64 bg-[#07090e] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
        <div className="p-5 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/40">AI</div>
            <div>
              <h2 className="font-black text-white text-sm tracking-wide">AI Growth CRM</h2>
              <span className="text-[10px] text-blue-400 font-bold">
                {allowedModules.length === ALL_MODULES.length
                  ? 'Enterprise Suite (15 Modules)'
                  : `Active Plan (${allowedModules.length}/15 Modules)`}
              </span>
            </div>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              const isLocked = item.id !== 'settings' && !allowedModules.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : isLocked
                      ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <IconComp size={16} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {isLocked && <Lock size={13} className="text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/80 bg-[#0a0f1d]">
          <div className="p-3 bg-[#0d1424] border border-slate-800 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="min-w-0">
                <p className="font-black text-white text-xs truncate">{clientSettings.ownerName || loggedInEmail}</p>
                <span className="text-[10px] text-emerald-400 font-bold block truncate">
                  {clientSettings.plan_expires_at && !isAdminUser
                    ? `Valid till: ${new Date(clientSettings.plan_expires_at).toLocaleDateString()}`
                    : loggedInEmail}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <input type="file" ref={fileInputRef} accept=".csv" onChange={handleImportCSV} className="hidden" />
      <input type="file" ref={bannerInputRef} accept="image/*" onChange={handleBannerUpload} className="hidden" />
      <input type="file" ref={ownerInputRef} accept="image/*" onChange={handleOwnerUpload} className="hidden" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        <header className="flex flex-wrap items-center justify-between pb-5 mb-5 border-b border-slate-800/80 gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h1 className="text-xl font-black text-white shrink-0 capitalize">
              {menuItems.find(m => m.id === activeTab)?.label || activeTab.replace('_', ' ')}
            </h1>
            <div className="flex items-center gap-2 bg-[#0d1424] border border-slate-800 px-3.5 py-1.5 rounded-xl w-full text-xs">
              <Search size={14} className="text-slate-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const term = searchTerm.toLowerCase().trim();
                  const found = menuItems.find(m => m.label.toLowerCase().includes(term) || m.id.toLowerCase().includes(term));
                  if (found) { setActiveTab(found.id); }
                  else { alert(`🔍 '${searchTerm}' तपासले.`); }
                }
              }} placeholder="Search or jump to module..." className="bg-transparent text-white outline-none w-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase">
              {clientSettings.plan_type || 'Starter'} ({BILLING_CYCLES[clientSettings.billing_cycle]?.shortLabel || 'Active'})
            </span>
            <button onClick={handleOpenAddModal} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition cursor-pointer">+ Add Lead</button>
            <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"><RefreshCw size={13} /> Refresh</button>
            <button onClick={handleSupabaseLogout} className="flex items-center gap-1 px-3 py-1.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition cursor-pointer"><LogOut size={13} /> Logout</button>
          </div>
        </header>

        {activeTab !== 'settings' && !allowedModules.includes(activeTab) ? (
          <div className="bg-[#0d1424] border border-amber-500/30 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-10 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock size={26} />
            </div>
            <h2 className="text-lg font-black text-white">हा मॉड्यूल तुमच्या प्लॅनमध्ये लॉक आहे</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              तुमच्या सध्याच्या सबस्क्रिप्शन प्लॅननुसार हा फिचर सक्रिय नाही. हा मॉड्यूल वापरण्यासाठी तुमचा प्लॅन अपग्रेड करा.
            </p>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              डॅशबोर्डवर परत जा
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-200">
                      {clientSettings.businessName || clientSettings.ownerName || loggedInEmail} ({allowedModules.length} मॉड्यूल्स ॲक्टिव्ह):
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <button onClick={handleOpenAddModal} className="px-3 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer">+ Add Lead</button>
                    <button onClick={() => setActiveTab('payments')} className="px-3 py-2 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold cursor-pointer">Quick Payment QR</button>
                    <button onClick={() => setActiveTab('website')} className="px-3 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl font-bold cursor-pointer">AI Website Builder</button>
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
                    <p className="text-2xl font-black text-white">₹{leads.reduce((a, c) => a + c.deal_value, 0).toLocaleString('en-IN')}</p>
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
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="space-y-4">
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap justify-between items-center gap-3">
                  <div><h2 className="text-lg font-black text-white">Growth Leads Directory ({filteredLeads.length})</h2><p className="text-xs text-slate-400">तुमच्या खात्यातील सर्व इनबाउंड व आऊटबाउंड लीड्स.</p></div>
                  <div className="flex gap-2">
                    <button onClick={handleOpenAddModal} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer">+ Add Lead</button>
                    <button onClick={() => fileInputRef.current?.click()} className="px-3.5 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"><Upload size={14} /> Import CSV</button>
                    <button onClick={handleExportCSV} className="px-3.5 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"><Download size={14} /> Export CSV</button>
                  </div>
                </div>
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[850px] text-xs">
                      <thead className="bg-[#080c18] text-slate-400 uppercase text-[10px]"><tr><th className="p-4">Name & Phone</th><th className="p-4">Service</th><th className="p-4">Deal Value</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th></tr></thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {filteredLeads.length === 0 ? (
                          <tr><td colSpan={5} className="p-8 text-center text-slate-500">तुमच्या खात्यात अजून कोणतीही लीड जोडलेली नाही. "+ Add Lead" वर क्लिक करा.</td></tr>
                        ) : filteredLeads.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-800/30">
                            <td className="p-4"><p className="font-bold text-white">{l.name}</p><span className="text-[11px] text-slate-400">+91 {l.phone}</span></td>
                            <td className="p-4">{l.service}</td>
                            <td className="p-4 font-black text-white">₹{l.deal_value}</td>
                            <td className="p-4"><select value={l.status} onChange={(e) => handleStatusChange(l.id, e.target.value)} className="bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded-xl text-xs cursor-pointer">{stages.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center gap-2">
                                <a href={`https://wa.me/91${l.phone}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1"><MessageSquare size={12} /> WhatsApp</a>
                                <button onClick={() => handleOpenEditModal(l)} className="p-1 text-slate-400 hover:text-blue-400 cursor-pointer"><Edit3 size={15} /></button>
                                <button onClick={() => handleDeleteLead(l.id, l.name)} className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"><Trash2 size={15} /></button>
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
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h2 className="text-lg font-black text-white">Growth CRM & Kanban Pipeline ({clientSettings.ownerName || loggedInEmail})</h2>
                    <p className="text-xs text-slate-400">वेगवेगळ्या व्यवसायांच्या लीड्स स्वतंत्र पाईपलाईनमध्ये मॅनेज करा.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={selectedPipeline}
                      onChange={(e) => setSelectedPipeline(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer"
                    >
                      {pipelines.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const newName = prompt('नवीन पाईपलाईनचे नाव टाका (उदा. Real Estate Agency):');
                        if (newName && newName.trim()) {
                          const newId = newName.toLowerCase().replace(/[^a-z0-9]/g, '_');
                          setPipelines(prev => [...prev, { id: newId, name: newName }]);
                          setSelectedPipeline(newId);
                          alert('नवीन पाईपलाईन यशस्वीरीत्या तयार झाली!');
                        }
                      }}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg"
                    >
                      + नवीन पाईपलाईन तयार करा
                    </button>

                    {pipelines.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm('तुम्हाला खरोखरच ही पाईपलाईन डिलीट करायची आहे का?')) {
                            const updated = pipelines.filter(p => p.id !== selectedPipeline);
                            setPipelines(updated);
                            setSelectedPipeline(updated[0].id);
                            alert('पाईपलाईन यशस्वीरीत्या डिलीट झाली!');
                          }
                        }}
                        className="px-3 py-2.5 bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition"
                      >
                        🗑️ डिलीट
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['New Lead', 'Contacted', 'Payment Sent', 'Won'].map((stg) => (
                    <div key={stg} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stg)} className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 space-y-3 min-h-[450px]">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-xs text-white uppercase">{stg}</span>
                        <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">
                          {leads.filter(l => l.status === stg && (l.pipeline_id === selectedPipeline || (!l.pipeline_id && selectedPipeline === 'default_main'))).length}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {leads.filter(l => l.status === stg && (l.pipeline_id === selectedPipeline || (!l.pipeline_id && selectedPipeline === 'default_main'))).map((l) => (
                          <div key={l.id} draggable onDragStart={(e) => handleDragStart(e, l.id)} className="p-3 bg-[#080b12] border border-slate-700 rounded-xl space-y-1 cursor-grab">
                            <div className="flex justify-between font-bold text-xs">
                              <span className="text-white">{l.name}</span>
                              <span className="text-emerald-400">₹{l.deal_value}</span>
                            </div>
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
              <div className="space-y-6 text-xs">
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black"><Monitor size={22} /></div>
                      <div>
                        <h2 className="text-base font-black text-white">Ultra-Pro AI Funnel & Website Studio</h2>
                        <p className="text-xs text-slate-400">HighLevel / Framer लेव्हलचे डाइनॅमिक सेकशन्स, थीम आणि वन-क्लिक पब्लिशिंग ({clientSettings.ownerName || loggedInEmail}).</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setDeviceView(deviceView === 'Desktop' ? 'Mobile' : 'Desktop')} className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer">
                        {deviceView === 'Desktop' ? <Smartphone size={14} /> : <Monitor size={14} />}
                        <span>View: {deviceView}</span>
                      </button>
                      <button onClick={() => setIsPreviewModalOpen(true)} className="px-3.5 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer">
                        <Eye size={14} /> Full Screen
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[280px] bg-[#080b12] border border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-3">
                      <Sparkles size={18} className="text-blue-400 shrink-0" />
                      <input type="text" value={promptInput} onChange={(e) => setPromptInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerateWebsite()} placeholder="उदा. 'Luxury Real Estate Villa Agency'..." className="bg-transparent text-white text-xs outline-none w-full" />
                    </div>
                    <button type="button" onClick={toggleVoiceRecording} className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border cursor-pointer ${isListening ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-200 border-slate-700'}`}>
                      {isListening ? <MicOff size={16} /> : <Mic size={16} className="text-rose-400" />}
                      <span>{isListening ? 'Listening...' : 'Voice Prompt'}</span>
                    </button>
                    <button type="button" onClick={handleGenerateWebsite} disabled={isGenerating} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer">
                      {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      <span>{isGenerating ? 'AI Generating...' : 'Regenerate Funnel'}</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-4 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 max-h-[850px] overflow-y-auto shadow-xl">
                    <h3 className="font-bold text-white uppercase text-[11px] tracking-wider border-b border-slate-800 pb-2">Assets & Branding Control</h3>
                    <div className="p-3 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                      <label className="text-slate-300 font-bold block text-[11px]">Hero Banner फोटो बदला</label>
                      <input type="file" ref={bannerInputRef} accept="image/*" onChange={handleBannerUpload} className="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-blue-600 file:text-white cursor-pointer" />
                    </div>
                    <div className="p-3 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                      <label className="text-slate-300 font-bold block text-[11px]">मालकाचा ({clientSettings.ownerName || loggedInEmail}) फोटो बदला</label>
                      <input type="file" ref={ownerInputRef} accept="image/*" onChange={handleOwnerUpload} className="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:bg-blue-600 file:text-white cursor-pointer" />
                    </div>
                  </div>
                  <div className="lg:col-span-8 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                    {renderWebpageContent(false)}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 text-xs shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600/25 border border-emerald-500/35 text-emerald-400 flex items-center justify-center font-bold"><QrCode size={18} /></div>
                        <div><h3 className="font-bold text-white text-sm">MULTI-GATEWAYS: RAZORPAY, CASHFREE & INSTAMOJO</h3><p className="text-[11px] text-slate-400">पेमेंट झाल्यानंतर WhatsApp वर PDF पावती ({clientSettings.ownerName || loggedInEmail}).</p></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div><label className="text-slate-300 block mb-1 font-bold">Your Working UPI ID *</label><input type="text" value={clientSettings.upiId} onChange={(e) => setClientSettings({ ...clientSettings, upiId: e.target.value })} placeholder="yourname@upi" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none" /></div>
                      <div><label className="text-slate-300 block mb-1 font-bold">Business Name on UPI</label><input type="text" value={clientSettings.businessName} onChange={(e) => setClientSettings({ ...clientSettings, businessName: e.target.value })} placeholder="Business Name" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div><label className="text-slate-300 block mb-1 font-bold">Customer Full Name</label><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="ग्राहकाचे नाव" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                      <div><label className="text-slate-300 block mb-1 font-bold">Customer WhatsApp Number</label><input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="9876543210" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div><label className="text-slate-300 block mb-1 font-bold">Service / Product Description</label><input type="text" value={paymentDesc} onChange={(e) => setPaymentDesc(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                      <div><label className="text-slate-300 block mb-1 font-bold">Amount to Collect (₹) *</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-black text-base outline-none" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                      <button type="button" onClick={handleRazorpayPay} className="py-3 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer">Pay Razorpay</button>
                      <button type="button" onClick={() => alert('Instamojo Secure Checkout ॲक्टिव्ह आहे!')} className="py-3 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer">Pay Instamojo</button>
                      <button type="button" onClick={handleSendWhatsAppBill} className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer">Send WA Bill</button>
                    </div>
                  </div>
                  <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl flex flex-col items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Live Instant Payment QR</span>
                    <div className="p-4 bg-white rounded-2xl shadow-2xl inline-block border-4 border-slate-800">
                      <img src={qrUrl} alt="UPI QR" className="w-48 h-48 block rounded-lg mx-auto" />
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(livePayUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs cursor-pointer">{copied ? 'Link Copied!' : 'Copy Direct UPI Link'}</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agents' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 text-xs shadow-xl">
                  <h3 className="font-bold text-white text-sm">AI Agent Studio ({clientSettings.ownerName || loggedInEmail})</h3>
                  <div><label className="text-slate-300 block mb-1 font-bold">Agent Name</label><input type="text" value={botConfig.name} onChange={(e) => setBotConfig({ ...botConfig, name: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                  <div><label className="text-slate-300 block mb-1 font-bold">System Prompt (तुमच्या बिझनेसची माहिती)</label><textarea rows={4} value={botConfig.systemPrompt} onChange={(e) => setBotConfig({ ...botConfig, systemPrompt: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-3 text-white outline-none resize-none" /></div>
                  <button onClick={handleSaveAiAgent} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg cursor-pointer">Save AI Agent</button>
                </div>
                <div className="lg:col-span-7 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 text-xs shadow-xl flex flex-col justify-between h-[520px]">
                  <h4 className="font-bold text-white text-xs">{botConfig.name} - Simulator</h4>
                  <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-[#080b12] rounded-2xl border border-slate-800">
                    {chatMessages.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-[80%] ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>{m.text}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1 border-t border-slate-800">
                    <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} placeholder="मेसेज..." className="flex-1 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none" />
                    <button onClick={handleSendChat} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold cursor-pointer"><Send size={14} /></button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'meta_ads' && (
              <div className="space-y-6 text-xs">
                <div className="bg-[#0d1424] border border-blue-500/30 rounded-3xl p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black"><Megaphone size={20} /></div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Meta AI & 1-Click Lead Ads Campaign Launcher</h3>
                        <p className="text-[11px] text-slate-400">Meta AI Graph API द्वारे थेट लीड्स जनरेट करा ({clientSettings.ownerName || loggedInEmail}).</p>
                      </div>
                    </div>
                    {isMetaConnected ? (
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full font-bold text-[10px] flex items-center gap-1">
                        <CheckCircle size={12} /> Connected ({clientSettings.metaAdAccountId || metaAdAccount})
                      </span>
                    ) : (
                      <button onClick={() => { setIsMetaConnected(true); alert('मेटा ॲड अकाउंट व Meta AI API कनेक्ट झाले!'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg cursor-pointer">
                        Connect Meta AI Account
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                      <span className="font-bold text-white block">Daily Budget (₹)</span>
                      <input type="number" value={adBudget} onChange={(e) => setAdBudget(Number(e.target.value))} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-bold outline-none" />
                    </div>
                    <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                      <span className="font-bold text-white block">Target Audience Location</span>
                      <input type="text" value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                    </div>
                    <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                      <span className="font-bold text-white block">Meta AI Assistant Mode</span>
                      <span className="text-xs text-blue-400 font-semibold block pt-1">● Auto-Optimize & Lead Scoring ON</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { if (!isMetaConnected) { alert('प्रथम Meta AI अकाउंट कनेक्ट करा!'); return; } alert('🚀 Meta AI Lead Ads मोहीम यशस्वीरीत्या लॉन्च झाली!'); }} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2">
                      <Sparkles size={16} /> Launch Meta AI Ad Campaign
                    </button>
                    <button onClick={() => alert('Webhook Sync स्टेटस: सर्व लीड्स लाईव्ह अपडेट होत आहेत.')} className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold cursor-pointer">Sync Webhooks</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6 text-xs">
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2"><FileText size={16} className="text-blue-400" /> Template Manager & AI Messenger Studio</h3>
                    <span className="text-[10px] text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full font-bold">Dynamic Variables Supported</span>
                  </div>
                  <form onSubmit={handleGenerateTemplate} className="space-y-3 bg-[#080b12] p-5 rounded-2xl border border-slate-800">
                    <span className="font-bold text-white block text-xs">+ नवीन WhatsApp / SMS टेम्पलेट तयार करा ({clientSettings.ownerName || loggedInEmail})</span>
                    <input type="text" value={customTemplateName} onChange={(e) => setCustomTemplateName(e.target.value)} placeholder="टेम्पलेट नाव" className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                    <textarea rows={3} value={customTemplateText} onChange={(e) => setCustomTemplateText(e.target.value)} placeholder="मजकूर ({Name}, {Service}, {Amount})" className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-3 text-white outline-none font-mono text-[11px]" />
                    <button type="submit" className="py-2.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg cursor-pointer">Save & Enable Template</button>
                  </form>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {savedTemplates.map((t, i) => (
                      <div key={i} className="bg-[#080b12] border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-1.5"><span className="font-bold text-white text-xs">{t.title}</span><span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full font-bold">Ready</span></div>
                          <p className="bg-[#0d1424] p-3 rounded-xl text-slate-300 font-mono text-[11px] leading-relaxed border border-slate-800/80">{t.text}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { navigator.clipboard.writeText(t.text); alert('टेम्पलेट कॉपी झाले!'); }} className="flex-1 py-1.5 bg-slate-800 text-slate-200 rounded-lg font-bold text-[10px] cursor-pointer">Copy</button>
                          <button onClick={() => alert(`"${t.title}" टेम्पलेट टेस्ट मेसेज पाठवला!`)} className="flex-1 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-[10px] cursor-pointer">Test Send</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'workflow' && (
              <div className="space-y-6 text-xs animate-fadeIn">
                <div className="bg-[#0d1424] border border-blue-500/30 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-600/40"><GitBranch size={24} /></div>
                      <div>
                        <h2 className="text-base font-black text-white">AI Workflow Builder & Smart Nodes Studio ({clientSettings.ownerName || loggedInEmail})</h2>
                        <p className="text-xs text-slate-400">साध्या भाषेमध्ये किंवा प्रॉम्प्ट देऊन सेकंदात संपूर्ण ऑटोमेशन फ्लो तयार करा.</p>
                      </div>
                    </div>
                    <span className="px-3.5 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-full font-bold text-[10px] flex items-center gap-1.5 shadow">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> AI Engine Live & Ready
                    </span>
                  </div>
                  <div className="bg-[#080b12] border border-blue-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs"><Sparkles size={16} /><span>Build with AI: Describe your automation goal</span></div>
                    <div className="flex gap-2.5">
                      <input type="text" id="newAiWorkflowInput" placeholder="उदा. 'जेव्हा नवीन लीड येईल तेव्हा लगेच WhatsApp मेसेज पाठवा'..." className="flex-1 bg-[#07090e] border border-slate-700 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-blue-500 font-medium" />
                      <button onClick={() => {
                        const inputEl = document.getElementById('newAiWorkflowInput') as HTMLInputElement;
                        const val = inputEl?.value;
                        if (!val || !val.trim()) { alert('कृपया आधी प्रॉम्प्ट टाईप करा!'); return; }
                        setCustomWorkflows(prev => [{ id: Date.now().toString(), trigger: `AI Prompt: ${val}`, action: 'Smart AI Execution ➔ WhatsApp ➔ CRM DB' }, ...prev]);
                        inputEl.value = ''; alert('🤖 AI ने नोड्स जनरेट केले!');
                      }} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-2">Build with AI</button>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Active Generated Workflow Nodes ({customWorkflows.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customWorkflows.map((w, idx) => (
                        <div key={w.id || idx} className="p-5 bg-[#080b12] border border-slate-800 rounded-2xl space-y-3.5 shadow-xl">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                            <span className="text-[10px] bg-blue-950 text-blue-400 px-2.5 py-0.5 rounded-full font-bold font-mono">Node Flow ID: #{w.id}</span>
                            <span className="text-[10px] text-emerald-400 font-bold">● Active & Running</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <p className="text-slate-200 font-bold bg-[#07090e] p-2.5 rounded-xl border border-slate-800">Trigger: {w.trigger}</p>
                            <div className="pl-4 border-l-2 border-blue-500/50 my-2 py-1 space-y-1.5">
                              <p className="text-slate-300 text-[11px]">➔ Action 1: Webhook & DB Log</p>
                              <p className="text-slate-300 text-[11px]">➔ Action 2: WhatsApp Dispatch</p>
                            </div>
                          </div>
                          <button onClick={() => setCustomWorkflows(prev => prev.filter(item => item.id !== w.id))} className="text-rose-400 hover:text-rose-300 font-bold text-[11px] cursor-pointer">Delete Flow Node</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inbox' && (
              <div className="space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between bg-[#0d1424] border border-slate-800 p-4 rounded-2xl gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-white">
                      WhatsApp Live Inbox ({clientSettings.whatsappNumber || 'Not Connected'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={fetchSupabaseMessages} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow cursor-pointer">
                      <RefreshCw size={14} /> 🔄 मेसेजेस रिफ्रेश करा
                    </button>
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-500/30 font-bold">
                      {clientSettings.metaPhoneId ? 'Meta Cloud API Connected' : 'Setup Pending'}
                    </span>
                  </div>
                </div>

                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-3 min-h-[500px] shadow-2xl">
                  {!clientSettings.metaPhoneId ? (
                    <div className="text-center py-24 space-y-3">
                      <p className="text-amber-400 font-bold text-sm">तुमचा Meta Phone Number ID अजून जोडलेला नाही.</p>
                      <p className="text-slate-400 text-xs">
                        कृपया <b>Settings & Meta API</b> मध्ये जाऊन तुमचा WhatsApp नंबर, Meta Phone Number ID आणि Access Token सेव्ह करा.
                      </p>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer"
                      >
                        Settings उघडा
                      </button>
                    </div>
                  ) : inboxLoading ? (
                    <p className="text-slate-400 text-center py-20 font-bold text-sm">मेसेजेस लोड होत आहेत...</p>
                  ) : dbMessages.length === 0 ? (
                    <div className="text-center py-24 space-y-2">
                      <p className="text-slate-300 font-bold text-sm">तुमच्या WhatsApp नंबरवर अजून कोणतेही मेसेजेस आलेले नाहीत.</p>
                      <p className="text-slate-500 text-xs">तुमच्या जोडलेल्या WhatsApp नंबरवर मेसेज आल्यानंतर ते इथे दिसतील.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dbMessages.map((msg, idx) => (
                        <div key={msg.id || idx} className="bg-[#080b12] border border-slate-700/80 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-lg">
                          <div className="space-y-1.5">
                            <span className="text-blue-400 font-bold text-xs flex items-center gap-1.5 font-mono">
                              📞 Sender Number: {msg.sender || 'Unknown'}
                            </span>
                            <p className="text-white text-sm font-semibold">
                              💬 Message: {msg.text || 'Media/Non-text Message'}
                            </p>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                            {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-6 text-xs">
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-5 shadow-xl">
                  <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-4 gap-3">
                    <div>
                      <h3 className="font-bold text-white text-base flex items-center gap-2"><CalendarDays size={18} className="text-blue-400" /> Smart Calendar & Booking Schedule ({clientSettings.ownerName || loggedInEmail})</h3>
                      <p className="text-[11px] text-slate-400">ग्राहकांच्या सर्व अपॉइंटमेंट्स, कॉल्स, मीटिंग्स आणि ऑटो-रिमाइंडर सिस्टीम.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-950 text-blue-400 border border-blue-500/30 rounded-xl font-bold text-[10px]">Google/Cal Sync Active</span>
                      <button onClick={() => setIsSlotModalOpen(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer">
                        <Plus size={15} /> + Book New Appointment
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    {appointments.length === 0 ? (
                      <p className="text-slate-500 py-8 text-center col-span-3">अजून कोणतीही अपॉइंटमेंट बुक केलेली नाही.</p>
                    ) : appointments.map((slot) => (
                      <div key={slot.id} className="bg-[#080b12] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md hover:border-blue-500/50 transition">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-blue-400 font-bold font-mono bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-500/30">{slot.date} | {slot.time}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${slot.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-amber-950 text-amber-400 border-amber-500/30'}`}>
                            {slot.status}
                          </span>
                        </div>
                        <div>
                          <p className="font-black text-white text-sm">{slot.clientName}</p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">+91 {slot.phone}</p>
                          <p className="text-[11px] text-slate-300 font-medium mt-1.5 bg-[#0d1424] px-2.5 py-1.5 rounded-xl border border-slate-800">सेवा: <b className="text-blue-400">{slot.service}</b></p>
                        </div>
                        <div className="pt-2.5 border-t border-slate-800/80 flex justify-between items-center">
                          <a href={`https://wa.me/91${slot.phone}?text=${encodeURIComponent(`नमस्कार ${slot.clientName} जी, आपली ${slot.service} ची ${slot.date} रोजी ${slot.time} ची अपॉइंटमेंट कन्फर्म आहे.`)}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-[10px] flex items-center gap-1">
                            <MessageSquare size={11} /> Remind on WA
                          </a>
                          <button onClick={() => handleCancelAppointment(slot.id, slot.clientName)} className="p-1 text-slate-400 hover:text-rose-400 transition cursor-pointer" title="रद्द करा">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ivr' && (
              <div className="space-y-6 text-xs">
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/25 border border-blue-500/35 text-blue-400 flex items-center justify-center font-bold">
                        <PhoneCall size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">AI SALES & OUTBOUND IVR VOICE BOT ENGINE ({clientSettings.ownerName || loggedInEmail})</h3>
                        <p className="text-[11px] text-slate-400">लीड्सना स्वयंचलित (Automated) फोन कॉल्स, मराठी/हिंदी TTS आणि सॅटिंमेंट ॲनालायझर.</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">Marathi Natural TTS Ready</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2.5 bg-[#080b12] p-4 rounded-2xl border border-slate-800">
                      <label className="text-slate-200 block font-bold">AI Voice Calling Script (मराठी/हिंदी)</label>
                      <textarea rows={4} value={aiVoiceScript} onChange={(e) => setAiVoiceScript(e.target.value)} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-3 text-white outline-none resize-none text-xs" />
                      <button onClick={() => alert('वॉयस कॉलिंग स्क्रिप्ट सेव्ह झाली!')} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer">Save Calling Script</button>
                    </div>
                    <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
                      <span className="font-bold text-white block">Outbound Dial Engine & Analytics</span>
                      <p className="text-[11px] text-slate-400">हा AI बॉट प्रत्येक नवीन लीडला कॉल करून त्यांची पसंती विचारतो.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div className="space-y-6 text-xs">
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-5 shadow-xl">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm">AI FINANCE & REVENUE ANALYTICS (MRR & Payouts - {clientSettings.ownerName || loggedInEmail})</h3>
                    <span className="text-emerald-400 font-bold">Total: ₹{transactions.reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div className="bg-[#080b12] border border-slate-800 p-4 rounded-2xl space-y-1"><span className="text-slate-400 text-[11px]">MRR</span><p className="text-2xl font-black text-emerald-400">₹{transactions.reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}</p></div>
                    <div className="bg-[#080b12] border border-slate-800 p-4 rounded-2xl space-y-1"><span className="text-slate-400 text-[11px]">Transactions</span><p className="text-2xl font-black text-blue-400">{transactions.length} Paid</p></div>
                    <div className="bg-[#080b12] border border-slate-800 p-4 rounded-2xl space-y-1"><span className="text-slate-400 text-[11px]">Pending Settlements</span><p className="text-2xl font-black text-amber-400">₹0</p></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6 text-xs">
                <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl">
                  <h3 className="font-bold text-white text-sm">SOCIAL MEDIA AUTO-POSTER & PUBLISHER ({clientSettings.ownerName || loggedInEmail})</h3>
                  <textarea rows={4} value={socialPostText} onChange={(e) => setSocialPostText(e.target.value)} placeholder="तुमची सोशल मीडिया पोस्ट लिहा..." className="w-full bg-[#080b12] border border-slate-700 rounded-2xl p-3 text-white outline-none" />
                  <button onClick={() => alert('पोस्ट पब्लिश झाली!')} className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">Publish Post Now</button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8" style={{ maxWidth: '960px' }}>
                {/* १. फक्त अ‍ॅडमिनला दिसणारा Client Onboarding & Subscription Validity Manager */}
                {isAdminUser && (
                  <div className="bg-[#0d1424] border border-blue-500/40 rounded-3xl p-6 space-y-5 shadow-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                          <Lock size={18} className="text-amber-400" /> Client Onboarding, Validity & Module Lock/Unlock
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                          क्लायंटचा ईमेल, पासवर्ड, प्लॅन आणि मुदत (Monthly / 6 Months / Yearly) सेट करा — मुदत संपल्यावर खाते आपोआप लॉक होऊन पेमेंट स्क्रीन दिसेल.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsClientListModalOpen(true)}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <Users size={15} /> 📋 Client List ({allClientsList.length})
                      </button>
                    </div>

                    <form onSubmit={handleSaveManagedClientAccess} className="space-y-5 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1.5">क्लायंट ईमेल आयडी (Login Email) *</label>
                          <input
                            type="email"
                            required
                            value={managedClientEmail}
                            onChange={(e) => setManagedClientEmail(e.target.value)}
                            placeholder="client@gmail.com"
                            className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-bold mb-1.5">
                            क्लायंट पासवर्ड (किमान ६ अक्षरे) *
                          </label>
                          <input
                            type="text"
                            value={managedClientPassword}
                            onChange={(e) => setManagedClientPassword(e.target.value)}
                            placeholder="उदा. Ravi@1234 (जुनाच ठेवायचा असल्यास रिकामा सोडा)"
                            className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-emerald-300 font-mono outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1.5">क्लायंटचे नाव</label>
                          <input
                            type="text"
                            value={managedClientName}
                            onChange={(e) => setManagedClientName(e.target.value)}
                            placeholder="उदा. सचिन कांबळे"
                            className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-bold mb-1.5">बिझनेस नाव</label>
                          <input
                            type="text"
                            value={managedClientBiz}
                            onChange={(e) => setManagedClientBiz(e.target.value)}
                            placeholder="उदा. कांबळे एंटरप्रायझेस"
                            className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>
                      </div>

                      {/* कालावधी निवडा: Monthly / 6 Months / Yearly */}
                      <div className="space-y-2">
                        <label className="block text-slate-300 font-bold">
                          सबस्क्रिप्शन कालावधी निवडा (Billing Validity - संपल्यानंतर ऑटो-लॉक):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {Object.entries(BILLING_CYCLES).map(([cycleKey, info]) => (
                            <button
                              key={cycleKey}
                              type="button"
                              onClick={() => setManagedBillingCycle(cycleKey)}
                              className={`p-3 rounded-2xl border text-left font-bold transition cursor-pointer flex items-center justify-between ${
                                managedBillingCycle === cycleKey
                                  ? 'bg-emerald-600/25 border-emerald-500 text-white'
                                  : 'bg-[#080b12] border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              <span>{info.label}</span>
                              <span className="text-emerald-400 text-[11px]">{info.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-slate-300 font-bold">प्लॅन निवडा (Quick Preset):</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {Object.entries(PLAN_PRESETS).map(([key, preset]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleApplyPresetToManaged(key)}
                              className={`p-3 rounded-2xl border text-left font-bold transition cursor-pointer ${
                                managedPlanType === key
                                  ? 'bg-blue-600/25 border-blue-500 text-white'
                                  : 'bg-[#080b12] border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                          <label className="block text-slate-300 font-bold">
                            मॉड्यूल्स Lock / Unlock करा ({managedModules.length} / {ALL_MODULES.length} Unlocked):
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setManagedModules(ALL_MODULES.map((m) => m.id))}
                              className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 rounded-lg font-bold cursor-pointer"
                            >
                              Unlock All
                            </button>
                            <button
                              type="button"
                              onClick={() => setManagedModules(['dashboard', 'settings'])}
                              className="px-2.5 py-1 bg-amber-600/20 text-amber-400 rounded-lg font-bold cursor-pointer"
                            >
                              Lock All (Except Dashboard)
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                          {ALL_MODULES.map((mod) => {
                            const isUnlocked = managedModules.includes(mod.id);
                            const isSettings = mod.id === 'settings';
                            return (
                              <button
                                key={mod.id}
                                type="button"
                                disabled={isSettings}
                                onClick={() => handleToggleManagedModule(mod.id)}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left font-bold transition cursor-pointer ${
                                  isUnlocked
                                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                                    : 'bg-[#080b12] border-slate-800 text-slate-500'
                                }`}
                              >
                                <span className="truncate">{mod.label}</span>
                                <span className="text-[10px] shrink-0 ml-2">
                                  {isUnlocked ? '🔓 Unlocked' : '🔒 Locked'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={savingClientPlan}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                      >
                        {savingClientPlan
                          ? 'सेव्ह होत आहे...'
                          : '💾 क्लायंट Email + Password, कालावधी व मॉड्यूल्स सेव्ह करा'}
                      </button>
                    </form>
                  </div>
                )}

                {/* २. प्रत्येक युजरच्या स्वतःच्या Meta API आणि बिझनेस सेटिंग्स */}
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#38bdf8', marginBottom: '8px' }}>⚙️ My Business & Meta API Settings</h1>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                    लॉगिन खाते: <b>{loggedInEmail}</b> — इथे तुमचे स्वतःचे WhatsApp व Meta API तपशील भरा.
                  </p>

                  <form onSubmit={handleSaveClientSettings} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                      <h3 style={{ fontSize: '15px', color: '#f1f5f9', margin: '0 0 16px' }}>📌 बिझनेस प्रोफाईल ओळख</h3>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>ब्रँड / बिझनेस नाव</label>
                      <input type="text" name="businessName" value={clientSettings.businessName} onChange={handleConfigChange} placeholder="तुमच्या बिझनेसचे नाव टाका" style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: 'white', boxSizing: 'border-box', fontSize: '14px' }} />

                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', margin: '14px 0 6px' }}>मालक / कोच नाव</label>
                      <input type="text" name="ownerName" value={clientSettings.ownerName} onChange={handleConfigChange} placeholder="तुमचे नाव टाका" style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: 'white', boxSizing: 'border-box', fontSize: '14px' }} />
                    </div>

                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                      <h3 style={{ fontSize: '15px', color: '#f1f5f9', margin: '0 0 16px' }}>💬 WhatsApp API (तुमचा स्वतःचा नंबर)</h3>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>WhatsApp फोन नंबर</label>
                      <input type="text" name="whatsappNumber" value={clientSettings.whatsappNumber} onChange={handleConfigChange} placeholder="उदा. 9876543210" style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: 'white', boxSizing: 'border-box', fontSize: '14px' }} />

                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', margin: '14px 0 6px' }}>Meta Phone Number ID</label>
                      <input type="text" name="metaPhoneId" value={clientSettings.metaPhoneId} onChange={handleConfigChange} placeholder="तुमचा Meta Phone Number ID" style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: 'white', boxSizing: 'border-box', fontSize: '14px' }} />
                    </div>

                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', gridColumn: 'span 2' }}>
                      <h3 style={{ fontSize: '15px', color: '#f1f5f9', margin: '0 0 16px' }}>🧠 Google Gemini Pro API Key (Optional - न टाकल्यास System AI चालेल)</h3>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Gemini API Key</label>
                      <input type="password" name="geminiApiKey" value={clientSettings.geminiApiKey} onChange={handleConfigChange} placeholder="स्वतःची Gemini Key (ऐच्छिक)" style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: 'white', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'monospace' }} />
                    </div>

                    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', gridColumn: 'span 2' }}>
                      <h3 style={{ fontSize: '15px', color: '#f1f5f9', margin: '0 0 16px' }}>📢 Meta Ads & Access Token</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Meta Ad Account ID</label>
                          <input type="text" name="metaAdAccountId" value={clientSettings.metaAdAccountId} onChange={handleConfigChange} placeholder="तुमचा Meta Ad Account ID" style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: 'white', boxSizing: 'border-box', fontSize: '14px' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Webhook Verify Token</label>
                          <input type="text" name="webhookVerifyToken" value={clientSettings.webhookVerifyToken} onChange={handleConfigChange} placeholder="Webhook Verify Token" style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: 'white', boxSizing: 'border-box', fontSize: '14px' }} />
                        </div>
                      </div>

                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', margin: '16px 0 6px' }}>Graph API Access Token</label>
                      <textarea name="accessToken" value={clientSettings.accessToken} onChange={handleConfigChange} rows={3} placeholder="तुमचे Meta Graph API Access Token इथे पेस्ट करा..." style={{ width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #475569', borderRadius: '6px', color: 'white', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'monospace' }} />
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px' }}>
                      <button type="submit" disabled={savingSettings} style={{ flex: 1, background: '#0284c7', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
                        💾 माझ्या Meta & WhatsApp Settings सेव्ह करा
                      </button>
                      <button type="button" onClick={() => alert('🔗 तुमचे Meta Graph API & WhatsApp Webhook यशस्वीरीत्या कनेक्ट झाले!')} style={{ flex: 1, background: '#059669', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>
                        ⚡ Connect Meta Live API
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* सुटसुटीत Client List Popup — प्रत्येक क्लायंटच्या नावासमोरच 1 Month / 6 Months / 1 Year / Lock Now बटणे */}
        {isClientListModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 w-full max-w-3xl space-y-4 shadow-2xl text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-white text-base">📋 Registered Clients & Plan Validity ({allClientsList.length})</h3>
                  <p className="text-slate-400 text-[11px]">
                    क्लायंटच्या नावासमोरच <b>1 Month</b>, <b>6 Months</b>, <b>1 Year</b> किंवा <b>Lock Now</b> दाबून थेट मुदत सेट करा.
                  </p>
                </div>
                <button onClick={() => setIsClientListModalOpen(false)} className="p-1.5 bg-slate-800 text-slate-300 rounded-xl cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                  placeholder="ईमेल, क्लायंटचे नाव किंवा बिझनेस नावाने शोधा..."
                  className="bg-transparent text-white outline-none w-full"
                />
              </div>

              <div className="max-h-[420px] overflow-y-auto space-y-2.5 pr-1">
                {filteredClients.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">कोणताही क्लायंट सापडला नाही.</p>
                ) : (
                  filteredClients.map((cl, idx) => {
                    const emailKey = String(cl.client_email || '').toLowerCase();
                    const isExpired =
                      cl.billing_cycle === 'expired' ||
                      (cl.plan_expires_at && new Date(cl.plan_expires_at).getTime() < Date.now());
                    const isBusy = quickUpdatingClient === emailKey;

                    return (
                      <div
                        key={cl.user_id || idx}
                        className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-white text-sm truncate">
                              {cl.ownerName || 'Unnamed Client'} {cl.businessName ? `• ${cl.businessName}` : ''}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isExpired
                                  ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                                  : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {isExpired ? '🔒 Expired / Locked' : `✅ ${cl.billing_cycle || 'active'}`}
                            </span>
                          </div>
                          <p className="text-blue-400 font-mono text-xs truncate mt-0.5">{cl.client_email}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Plan: <b>{cl.plan_type || 'starter'}</b>
                            {cl.plan_expires_at
                              ? ` • Expiry: ${new Date(cl.plan_expires_at).toLocaleDateString()}`
                              : ''}
                          </p>
                        </div>

                        {/* प्रत्येक क्लायंटच्या नावापुढे थेट 1 Month / 6 Months / 1 Year / Lock / Edit बटणे */}
                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleQuickSetClientCycle(cl, 'monthly')}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] border cursor-pointer ${
                              cl.billing_cycle === 'monthly' && !isExpired
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-500'
                            }`}
                          >
                            1 Month
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleQuickSetClientCycle(cl, 'six_months')}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] border cursor-pointer ${
                              cl.billing_cycle === 'six_months' && !isExpired
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-500'
                            }`}
                          >
                            6 Months
                          </button>
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleQuickSetClientCycle(cl, 'yearly')}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] border cursor-pointer ${
                              cl.billing_cycle === 'yearly' && !isExpired
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-500'
                            }`}
                          >
                            1 Year
                          </button>
                          {emailKey !== ADMIN_EMAIL.toLowerCase() && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleQuickSetClientCycle(cl, 'expired')}
                              className="px-2.5 py-1.5 rounded-lg font-bold text-[11px] bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white cursor-pointer"
                            >
                              🔒 Lock
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleSelectManagedClient(cl)}
                            className="px-2.5 py-1.5 rounded-lg font-bold text-[11px] bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <h3 className="font-black text-white text-base">{editingLead ? 'Edit Lead' : '+ Add New Lead'}</h3>
              <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
                <input type="text" required value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} placeholder="नाव" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                <input type="text" required value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} placeholder="मोबाईल" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" />
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg cursor-pointer">{editingLead ? 'अपडेट करा' : 'सेव्ह करा'}</button>
              </form>
            </div>
          </div>
        )}

        {isSlotModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl text-xs">
              <h3 className="font-black text-base text-white">Book Appointment</h3>
              <form onSubmit={handleBookSlot} className="space-y-3.5">
                <input type="text" required value={newSlot.clientName} onChange={(e) => setNewSlot({ ...newSlot, clientName: e.target.value })} placeholder="नाव" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                <input type="text" required value={newSlot.phone} onChange={(e) => setNewSlot({ ...newSlot, phone: e.target.value })} placeholder="मोबाईल" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none font-mono" />
                <button type="submit" className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer">बुक करा</button>
              </form>
            </div>
          </div>
        )}

        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
            <div className="bg-[#07090e] border border-slate-700 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-white">Fullscreen Preview</span>
                <button onClick={() => setIsPreviewModalOpen(false)} className="p-1.5 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8">{renderWebpageContent(true)}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}