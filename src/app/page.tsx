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
  Eye, Mic, MicOff, Star, Image as ImageIcon, Loader2, Printer,
  CreditCard, Landmark, ShieldCheck, DollarSign, Receipt
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
  amount: number;
  gateway: string;
  status: 'Success' | 'Pending' | 'Failed';
  date: string;
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

  // 10 Full 5-Star Templates Database
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
    },
    'Real Estate & Property': {
      id: 'Real Estate & Property',
      businessName: 'रॉयल हेरिटेज लक्झरी होम्स & व्हिलाज',
      tagline: 'प्रिमियम २ व ३ BHK लक्झरी फ्लॅट्स आणि कमर्शियल दुकाने',
      headline: 'तुमच्या स्वप्नातील लक्झरी घर - मोफत क्लबहाऊस आणि ०% ब्रोकरेज!',
      subheadline: 'प्राइम लोकेशन, २५+ जागतिक दर्जाच्या सोयीसुविधा आणि बँकांकडून ९०% पर्यंत होम लोन उपलब्ध.',
      heroImage: industryImages.property,
      phone: '9822334455',
      email: 'sales@royalheritagehomes.com',
      address: 'हायवे टच, ग्रीन व्हॅली, सांगली',
      timing: 'सकाळी ९:०० ते संध्याकाळी ७:००',
      primaryCta: 'मोफत साईट व्हिजिट बुक करा',
      badge: '★ RERA रजिस्टर्ड प्रोजेक्ट',
      services: [
        { title: '२ BHK प्रिमियम अपार्टमेंट', desc: 'विशाल बाल्कनी, मॉड्युलर किचन आणि सुरक्षित कव्हर्ड कार पार्किंग.', price: '₹३८ लाख पासून' },
        { title: '३ BHK लक्झरी पेंटहाऊस', desc: 'प्रायव्हेट टेरेस गार्डन, मास्टर बेडरूम आणि लाइफटाइम क्लब अ‍ॅक्सेस.', price: '₹५८ लाख पासून' },
        { title: 'मेन रोड टच कमर्शियल शॉप्स', desc: 'भरभराटीच्या बिझनेससाठी मोक्याच्या ठिकाणी दुकाने आणि ऑफिसेस.', price: '₹२५ लाख पासून' }
      ],
      stats: [
        { label: 'हँडओव्हर फ्लॅट्स', value: '६५०+' },
        { label: 'रेरा नोंदणीकृत', value: '१००%' },
        { label: 'बँक लोन सुविधा', value: '९०%' }
      ],
      testimonials: [
        { name: 'विकास मोरे', avatar: avatars.male2, location: 'पुणे', review: 'बांधकामाची गुणवत्ता अप्रतिम आहे आणि वेळेआधी पझेशन मिळाले. १ रुपयाही ब्रोकरेज घेतले नाही.', rating: 5 },
        { name: 'स्नेहल पवार', avatar: avatars.female1, location: 'सांगली', review: 'साईट व्हिजिटपासून ते लोन मंजूर होईपर्यंत सर्व मदत टीमने केली.', rating: 5 }
      ]
    },
    'Gym & Fitness': {
      id: 'Gym & Fitness',
      businessName: 'पॉवरफिट युनिव्हर्सल जिम & क्रॉसफिट स्टुडिओ',
      tagline: 'बॉडी ट्रान्सफॉर्मेशन, स्ट्रेंथ आणि पर्सनल फिटनेस क्लब',
      headline: '९० दिवसांत बॉडी ट्रान्सफॉर्मेशन करा - सर्टिफाइड फिटनेस कोचेसकडून!',
      subheadline: 'आधुनिक इम्पोर्टेड उपकरणे, स्टीम बाथ, न्यूट्रिशन डाएट प्लॅन आणि १:१ पर्सनल ट्रेनिंग उपलब्ध.',
      heroImage: industryImages.gym,
      phone: '9890123456',
      email: 'fit@powerfitgym.com',
      address: 'जिमखाना रोड, सांगली',
      timing: 'सकाळी ५:३० ते रात्री १०:००',
      primaryCta: '३ दिवस मोफत ट्रायल पास मिळवा',
      badge: '★ सर्टिफाइड फिटनेस ट्रेनर्स',
      services: [
        { title: 'वेट लॉस आणि फॅट बर्निंग प्रोग्रॅम', desc: 'कार्डिओ, झुम्बा आणि स्पेशल न्यूट्रिशन डाएट गायडन्स.', price: '₹१,२९९ / महिना' },
        { title: 'मसल बिल्डिंग & हेवी स्ट्रेंथ', desc: 'इम्पोर्टेड मशिन्स, हेवी वेट्स आणि व्हे प्रोटीन कन्सल्टन्सी.', price: '₹१,४९९ / महिना' },
        { title: '१:१ पर्सनल कोचिंग बॅच', desc: 'प्रमाणित कोचकडून वैयक्तिक लक्ष आणि १००% गॅरंटीड रिझल्ट्स.', price: '₹३,९९९ / महिना' }
      ],
      stats: [
        { label: 'ट्रान्सफॉर्मेशन्स', value: '३,०००+' },
        { label: 'प्रमाणित ट्रेनर्स', value: '१२+' },
        { label: 'गुगल रेटिंग', value: '५.० ★' }
      ],
      testimonials: [
        { name: 'रोहन शिंदे', avatar: avatars.male1, location: 'सांगली', review: 'मी ३ महिन्यांत १२ किलो वजन कमी केले. ट्रेनर्स खूप सपोर्टिव्ह आणि शिस्तबद्ध आहेत.', rating: 5 },
        { name: 'दिनेश गायकवाड', avatar: avatars.male2, location: 'मिरज', review: 'जिममधील वातावरण आणि उपकरणे खूपच आंतरराष्ट्रीय दर्जाची आहेत.', rating: 5 }
      ]
    },
    'Coaching Academy': {
      id: 'Coaching Academy',
      businessName: 'अ‍ॅपेक्स AI & डिजिटल करिअर अकॅडमी',
      tagline: '१००% प्रॅक्टिकल डिजिटल मार्केटिंग, AI स्किल्स आणि कोडिंग',
      headline: 'AI आणि डिजिटल मार्केटिंग शिका आणि घरबसल्या दरमहा ₹५०,०००+ कमवा!',
      subheadline: 'लाइव्ह प्रोजेक्ट्सवर प्रॅक्टिकल ट्रेनिंग, १००% जॉब प्लेसमेंट असिस्टन्स आणि मोफत प्रिमियम सॉफ्टवेअर टूल्स.',
      heroImage: industryImages.academy,
      phone: '9860127890',
      email: 'admissions@apexacademy.com',
      address: 'विश्रामबाग, कॉलेज कॉर्नर, सांगली',
      timing: 'सकाळी ८:०० ते संध्याकाळी ८:००',
      primaryCta: 'मोफत डेमो क्लास बुक करा',
      badge: '★ सरकारी मान्यताप्राप्त संस्था',
      services: [
        { title: 'Meta Ads & Google Ads मास्टरक्लास', desc: 'स्थानिक व्यवसायांसाठी जाहिराती चालवून दररोज लीड्स कशा मिळवायच्या ते शिका.', price: '₹४,९९९' },
        { title: 'ChatGPT, Canva & AI टूल्स कोर्स', desc: 'सर्व आधुनिक AI टूल्सचा वापर करून बिझनेस ऑटोमेशनचे प्रॅक्टिकल शिक्षण.', price: '₹३,४९९' },
        { title: '३ महिन्यांचा करिअर मास्टर डिप्लोमा', desc: '१००% जॉब आणि फ्रीलान्सिंग क्लायंट मिळवण्याच्या संपूर्ण मार्गदर्शनासह.', price: '₹९,९९९' }
      ],
      stats: [
        { label: 'प्रशिक्षित विद्यार्थी', value: '२,२००+' },
        { label: 'जॉब प्लेसमेंट दर', value: '९६%' },
        { label: 'प्रॅक्टिकल प्रोजेक्ट्स', value: '५०+' }
      ],
      testimonials: [
        { name: 'पूजा कुलकर्णी', avatar: avatars.female1, location: 'सांगली', review: 'कोर्स संपताच मला ₹३०,००० ची डिजिटल मार्केटिंग जॉब मिळाली. अत्यंत सोप्या भाषेत शिकवले जाते.', rating: 5 },
        { name: 'सुप्रिया भोसले', avatar: avatars.female2, location: 'मिरज', review: 'घरी बसून फ्रीलान्सिंग कसे करायचे याचे अतिशय मोलाचे मार्गदर्शन मिळाले.', rating: 5 }
      ]
    },
    'Restaurant & Cafe': {
      id: 'Restaurant & Cafe',
      businessName: 'हॉटेल शिवनेरी & फॅमिली रेस्टॉरंट',
      tagline: 'अस्सल महाराष्ट्रीयन घरगुती चव, स्पेशल थाळी आणि बिर्याणी',
      headline: 'अस्सल गावरान चव आणि मराठमोळे आदरातिथ्य - हॉटेल शिवनेरी!',
      subheadline: 'स्पेशल मटण/चिकन थाळी, तांबडा-पांढरा रस्सा, अस्सल शाकाहारी जेवण आणि कौटुंबिक बैठक व्यवस्था.',
      heroImage: industryImages.restaurant,
      phone: '9730445566',
      email: 'order@hotelshivneri.com',
      address: 'हायवे कॉर्नर, मिरज रोड, सांगली',
      timing: 'सकाळी ११:०० ते रात्री ११:००',
      primaryCta: 'तुमचे टेबल / ऑर्डर बुक करा',
      badge: '★ FSSAI प्रमाणित स्वच्छता',
      services: [
        { title: 'स्पेशल शिवनेरी मटण थाळी', desc: 'तांबडा-पांढरा रस्सा, चुलीवरची बाजरीची भाकरी, मटण सुक्का आणि इंद्रायणी भात.', price: '₹३५०' },
        { title: 'महाराजा स्पेशल व्हेज थाळी', desc: '२ स्पेशल भाज्या, गरमागरम चपाती, डाळ तडका, गोड शिरा आणि पापड.', price: '₹२२०' },
        { title: 'कौटुंबिक बर्थडे & पार्टी हॉल', desc: '५० ते १५० लोकांसाठी स्पेशल वातानुकूलित हॉल आणि केटरिंग व्यवस्था.', price: 'स्पेशल डिस्काउंट' }
      ],
      stats: [
        { label: 'आनंदी खवय्ये', value: '६०,०००+' },
        { label: 'स्पेशल डिशेस', value: '४५+' },
        { label: 'चवीची गॅरंटी', value: '१००%' }
      ],
      testimonials: [
        { name: 'अनिल काळे', avatar: avatars.male2, location: 'सांगली', review: 'तांबडा पांढरा रस्सा आणि बाजरीची भाकरी एक नंबर होती! फॅमिलीसाठी सर्वोत्तम हॉटेल.', rating: 5 },
        { name: 'किरण थोरात', avatar: avatars.male1, location: 'मिरज', review: 'सर्व्हिस खूप तत्पर आहे आणि जेवणाची चव अगदी घरगुती आहे.', rating: 5 }
      ]
    },
    'Auto Garage': {
      id: 'Auto Garage',
      businessName: 'स्पीड ऑटोकेअर & मल्टीब्रँड कार सर्व्हिस',
      tagline: 'कम्प्लिट कार वॉश, डेंटिंग, पेंटिंग, AC आणि इंजिन रिपेअरिंग',
      headline: 'तुमच्या गाडीची विश्वासार्ह आणि आधुनिक सर्व्हिसिंग - मोफत डोअरस्टेप पिकअप!',
      subheadline: 'ओरिजिनल स्पेअर पार्ट्स, कम्प्युटराइज्ड स्कॅनिंग, कॅशलेस इन्शुरन्स क्लेम आणि अनुभवी मेकॅनिक्स.',
      heroImage: industryImages.garage,
      phone: '9823998877',
      email: 'service@speedautocare.com',
      address: 'एमआयडीसी, कुपवाड रोड, सांगली',
      timing: 'सकाळी ९:०० ते रात्री ८:०० (रविवार सुरू)',
      primaryCta: 'सर्व्हिसिंग स्लॉट बुक करा',
      badge: '★ ओरिजिनल OEM स्पेअर पार्ट्स',
      services: [
        { title: 'कम्प्लिट जनरल सर्व्हिसिंग', desc: 'सिंथेटिक इंजिन ऑईल चेंज, ऑईल फिल्टर, ब्रेक क्लिनिंग आणि ४०-पॉईंट चेकअप.', price: '₹१,४९९ पासून' },
        { title: 'फोम वॉश & इंटिरियर डीप क्लीन', desc: 'हाय-प्रेशर अंडरबॉडी वॉश, व्हॅक्यूम क्लीनिंग आणि डॅशबोर्ड पॉलिशिंग.', price: '₹४९९ पासून' },
        { title: 'कम्प्युटर डेंटिंग & पेंटिंग', desc: 'कम्प्युटराइज्ड कलर मॅचिंग, स्क्रॅच रिमूव्हल आणि कॅशलेस इन्शुरन्स काम.', price: 'बेस्ट प्राईस' }
      ],
      stats: [
        { label: 'गाड्यांची सर्व्हिसिंग', value: '६,०००+' },
        { label: 'अनुभवी मेकॅनिक', value: '१५+' },
        { label: 'समाधानी ग्राहक', value: '९९%' }
      ],
      testimonials: [
        { name: 'महेश जाधव', avatar: avatars.male1, location: 'सांगली', review: 'माझ्या कारचा आवाज एका तासात शोधून गाडी एकदम स्मूथ करून दिली. वाजवी दर आहेत.', rating: 5 },
        { name: 'राहुल सावंत', avatar: avatars.male2, location: 'कुपवाड', review: 'फोम वॉशिंग आणि इंटिरियर क्लिनिंग इतकी छान केली की गाडी शोरूमसारखी नवीन वाटत आहे.', rating: 5 }
      ]
    },
    'Beauty Parlour': {
      id: 'Beauty Parlour',
      businessName: 'रुपम ब्रायडल & ब्युटी मेकओव्हर स्टुडिओ',
      tagline: 'प्रोफेसनल ब्रायडल मेकअप, हेअर स्पा आणि स्किन केअर ट्रीटमेंट्स',
      headline: 'तुमच्या खास दिवशी मिळवा स्वप्नवत आणि आकर्षक लूक - प्रिमियम ब्रायडल मेकअप!',
      subheadline: 'HD आणि एअरब्रश मेकअप, प्री-ब्रायडल पॅकेजेस, हेअर स्मूथनिंग आणि इंटरनॅशनल ब्रँड्सची स्किन केअर.',
      heroImage: industryImages.beauty,
      phone: '9765432109',
      email: 'bridal@rupambeauty.com',
      address: 'गांधी चौक, सांगली',
      timing: 'सकाळी १०:०० ते संध्याकाळी ८:००',
      primaryCta: 'ब्रायडल स्लॉट बुक करा',
      badge: '★ इंटरनॅशनल प्रमाणित आर्टिस्ट्स',
      services: [
        { title: 'HD & एअरब्रश ब्रायडल मेकअप', desc: 'वॉटरप्रूफ मेकअप, हेअरस्टाईल, साडी ड्रेपिंग आणि ज्वेलरी सेटिंगसह परिपूर्ण लूक.', price: '₹६,९९९ पासून' },
        { title: 'स्किन ब्राईटनिंग & ग्लो फेशियल', desc: 'इंटरनॅशनल ब्रँड्सचे डी-टॅन, हायड्रा फेशियल आणि इन्स्टंट ग्लो थेरपी.', price: '₹८९९ पासून' },
        { title: 'केराटिन & हेअर स्मूथनिंग', desc: 'सिल्की, चमकदार आणि मजबूत केसांसाठी प्रिमियम हेअर स्पा ट्रीटमेंट.', price: '₹१,९९९ पासून' }
      ],
      stats: [
        { label: 'नवरींचे मेकओव्हर', value: '१,५००+' },
        { label: 'प्रमाणित आर्टिस्ट्स', value: '८+' },
        { label: '५-स्टार रेटिंग', value: '१००%' }
      ],
      testimonials: [
        { name: 'स्नेहल पवार', avatar: avatars.female1, location: 'सांगली', review: 'माझ्या लग्नात सर्वांनी मेकअपचे खूप कौतुक केले. खूप नॅचरल लूक दिला होता!', rating: 5 },
        { name: 'प्रियांका शिंदे', avatar: avatars.female2, location: 'मिरज', review: 'सर्व्हिस खूप तत्पर आहे आणि प्रॉडक्ट्स १००% ओरिजिनल वापरतात.', rating: 5 }
      ]
    },
    'Digital Agency & AI': {
      id: 'Digital Agency & AI',
      businessName: 'महाग्रोथ मेटा ॲड्स & AI सोल्युशन्स',
      tagline: 'स्थानिक व्यवसायांची विक्री Meta Lead Ads द्वारे १० पटीने वाढवा',
      headline: 'तुमच्या बिझनेससाठी दररोज ५०+ थेट ग्राहक आणि कॉल्स मिळवा - १००% गॅरंटी!',
      subheadline: 'Facebook & Instagram हाय-कन्व्हर्टिंग लीड्स ॲड्स, WhatsApp ऑटोमेशन बॉट आणि १ दिवसात तयार होणारी ५-स्टार वेबसाइट.',
      heroImage: industryImages.agency,
      phone: '9876543210',
      email: 'growth@mahagrowth.in',
      address: 'आयटी पार्क, कॉलेज रोड, सांगली',
      timing: 'सकाळी ९:०० ते संध्याकाळी ७:००',
      primaryCta: 'मोफत मार्केटिंग ऑडिट मिळवा',
      badge: '★ Meta अधिकृत मीडिया पार्टनर',
      services: [
        { title: 'Meta Lead Ads मोहीम', desc: 'तुमच्या परिसरातील ग्राहकांसाठी टार्गेटेड जाहिराती आणि थेट फोन कॉल्स.', price: '₹४,९९९ / महिना' },
        { title: 'WhatsApp AI ऑटोमेशन बॉट', desc: '२४ तास ग्राहकांना आपोआप उत्तरे देणारा आणि पेमेंट लिंक पाठवणारा बॉट.', price: '₹२,९९९' },
        { title: 'हाय-कन्व्हर्टिंग लँडिंग पेज', desc: 'मोबाईल-फ्रेंडली, जलद उघडणारी आणि थेट WhatsApp जोडलेली आधुनिक वेबसाइट.', price: '₹३,४९९' }
      ],
      stats: [
        { label: 'वाढवलेले व्यवसाय', value: '१८०+' },
        { label: 'सरासरी ROI', value: '१०X' },
        { label: 'व्युवसाय महसूल वाढ', value: '३००%' }
      ],
      testimonials: [
        { name: 'ईश्वरी मोबाईल', avatar: avatars.male1, location: 'सांगली', review: 'महाग्रोथने मेटा ॲड्स सुरू केल्यावर आमच्या दुकानात दररोज नवीन ग्राहकांची गर्दी होत आहे!', rating: 5 },
        { name: 'संजीवनी क्लिनिक', avatar: avatars.female1, location: 'मिरज', review: 'दररोज १०+ नवीन रुग्णांच्या अपॉइंटमेंट्स आपोआप बुक होत आहेत. अप्रतिम निकाल!', rating: 5 }
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

  // Clean UPI Intent & Live Working QR URL
  const cleanAmt = (Number(amount) || 1).toFixed(2);
  const upiIntent = `upi://pay?pa=${upiId.trim()}&pn=${encodeURIComponent(businessNameUpi)}&am=${cleanAmt}&cu=INR&tn=${encodeURIComponent(paymentDesc)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiIntent)}`;
  const livePayUrl = `https://ai-growth-crm-nine.vercel.app/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(businessNameUpi)}&am=${cleanAmt}&tn=${encodeURIComponent(paymentDesc)}`;

  // Handle Razorpay Checkout Modal
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

  // ================= AI CHATBOT STATES =================
  const [botConfig, setBotConfig] = useState({
    name: 'Ishwari AI Assistant',
    personality: 'Professional & Friendly',
    language: 'मराठी + English (Hinglish)',
    autoDiscount: true,
    discountPercent: 10,
    systemPrompt: 'तुम्ही Ishwari Mobile आणि CSC केंद्राचे अधिकृत AI असिस्टंट आहात. ग्राहकांना मराठीत नम्रतेने उत्तरे द्या, नवीन 5G फोन्सच्या ऑफर्स सांगा आणि पेमेंट लिंक पाठवा.'
  });

  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
    { sender: 'bot', text: 'नमस्कार! 🙏 Ishwari AI मध्ये आपले स्वागत आहे. मी आपल्याला नवीन 5G स्मार्टफोन्स, सरकारी दाखले किंवा इन्स्टंट रिपेअरिंगबद्दल काय मदत करू?', time: '10:00 AM' }
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

      if (lower.includes('price') || lower.includes('किंमत') || lower.includes('ऑफर') || lower.includes('offer')) {
        botReply += `आज आमच्याकडे नवीन 5G स्मार्टफोन्सवर २०% सूट आणि ०% EMI उपलब्ध आहे! तुम्हाला बुकिंग करायची आहे का?`;
      } else if (lower.includes('दाखला') || lower.includes('csc') || lower.includes('पॅन') || lower.includes('आधार')) {
        botReply += `उत्पन्न दाखला, जात प्रमाणपत्र आणि पॅन कार्डची सर्व कामे २ दिवसांत पूर्ण करून मिळतील.`;
      } else if (lower.includes('pay') || lower.includes('पेमेंट') || lower.includes('qr')) {
        botReply += `थेट UPI द्वारे भरण्यासाठी आमचा UPI ID: ${upiId} आहे.`;
      } else {
        botReply += `आमची टीम तुम्हाला अधिक माहितीसाठी १० मिनिटांत कॉल करेल!`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 400);
  };

  // ================= AD LAUNCHER (META) STATES =================
  const [adBudget, setAdBudget] = useState<number>(500);
  const [targetAudience, setTargetAudience] = useState<string>('सांगली व मिरज (१० किमी परिसर)');
  const [adCampaignType, setAdCampaignType] = useState<string>('Meta Lead Ads (WhatsApp Direct)');

  // ================= AI INBOX / WHATSAPP STATES =================
  const [selectedLead, setSelectedLead] = useState<Lead>(initialLeads[0]);
  const [inboxText, setInboxText] = useState<string>('');
  const [inboxChats, setInboxChats] = useState<Record<string, { from: 'me' | 'them'; text: string; time: string }[]>>({
    '1': [
      { from: 'them', text: 'नमस्कार, मला नवीन क्लिनिकसाठी सेटअपची माहिती हवी होती.', time: '10:25 AM' },
      { from: 'me', text: 'नमस्कार रविराज जी, Ishwari CRM मध्ये आपले स्वागत आहे. आमची टीम संध्याकाळी ६ वाजता कॉल करेल.', time: '10:30 AM' }
    ],
    '2': [
      { from: 'them', text: 'iPhone 15 च्या EMI स्कीम्सबद्दल सांगा.', time: '11:10 AM' },
      { from: 'me', text: 'सचिन जी, ०% डाऊनपेमेंटवर दरमहा ₹2,500 EMI उपलब्ध आहे.', time: '11:15 AM' }
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

  // ================= AI SALES & IVR (CALLING BOT) STATES =================
  const [callingStatus, setCallingStatus] = useState<Record<string, 'Idle' | 'Calling' | 'Connected' | 'Completed'>>({});
  const [ivrScript, setIvrScript] = useState<string>(
    'नमस्कार, मी Ishwari Mobile कडून AI असिस्टंट बोलत आहे. आपल्या 5G स्मार्टफोनच्या चौकशीबद्दल धन्यवाद. आज आमच्याकडे खास २०% सूट उपलब्ध आहे.'
  );

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
      if (lines.length <= 1) return;
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
        alert(`${imported.length} कॉन्टॅक्ट्स यशस्वीरीत्या आयात झाले!`);
      }
    };
    reader.readAsText(file);
  };

  // Dynamic AI Website Prompt Generator
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
      } else if (lower.includes('doctor') || lower.includes('clinic') || lower.includes('दवाखाना') || lower.includes('दात') || lower.includes('हॉस्पिटल')) {
        matchedKey = 'Doctor & Clinic';
      } else if (lower.includes('flat') || lower.includes('घर') || lower.includes('property') || lower.includes('real estate') || lower.includes('बिल्डर') || lower.includes('प्लॉट')) {
        matchedKey = 'Real Estate & Property';
      } else if (lower.includes('gym') || lower.includes('फिटनेस') || lower.includes('व्यायाम') || lower.includes('कसरत') || lower.includes('जिम')) {
        matchedKey = 'Gym & Fitness';
      } else if (lower.includes('hotel') || lower.includes('हॉटेल') || lower.includes('जेवण') || lower.includes('थाळी') || lower.includes('रेस्टॉरंट') || lower.includes('कॅफे')) {
        matchedKey = 'Restaurant & Cafe';
      } else if (lower.includes('garage') || lower.includes('कार') || lower.includes('गाडी') || lower.includes('सर्व्हिस') || lower.includes('गॅरेज') || lower.includes('वॉश')) {
        matchedKey = 'Auto Garage';
      } else if (lower.includes('beauty') || lower.includes('पार्लर') || lower.includes('मेकअप') || lower.includes('ब्रायडल') || lower.includes('सलून')) {
        matchedKey = 'Beauty Parlour';
      } else if (lower.includes('class') || lower.includes('अकॅडमी') || lower.includes('कोर्स') || lower.includes('शिकणे') || lower.includes('क्लास') || lower.includes('ट्यूशन')) {
        matchedKey = 'Coaching Academy';
      } else if (lower.includes('agency') || lower.includes('मार्केटिंग') || lower.includes('ad') || lower.includes('जाहिरात') || lower.includes('डिजिटल')) {
        matchedKey = 'Digital Agency & AI';
      }

      if (matchedKey && templatesDb[matchedKey]) {
        setSelectedTemplate(matchedKey);
        setCurrentSite(templatesDb[matchedKey]);
      } else {
        const cleanTitle = promptInput.replace(/५-स्टार|5 star|स्टार|वेबसाइट|बनवा|करा|sathi|साठी|landing page|website|तयार|हवी|आहे/gi, '').trim() || 'प्रिमियम बिझनेस';
        const dynamicSite: TemplateData = {
          id: 'AI Custom Generated',
          businessName: `${cleanTitle} प्रिमियम हब`,
          tagline: `${cleanTitle} ची विश्वासार्ह आणि तत्पर सेवा`,
          headline: `${cleanTitle} वर मिळवा थेट विशेष डिस्काउंट आणि १००% खात्रीशीर सेवा!`,
          subheadline: `आमच्याकडे आधुनिक सोयीसुविधा, तज्ज्ञ मार्गदर्शन आणि वाजवी दर उपलब्ध आहेत. आजच तुमची सेवा बुक करा.`,
          heroImage: industryImages.generic,
          phone: '9876543210',
          email: 'contact@businessgrowth.com',
          address: 'मुख्य चौक, बाजारपेठ, सांगली',
          timing: 'सकाळी ९:०० ते रात्री ९:००',
          primaryCta: 'इन्स्टंट ऑफर क्लेम करा',
          badge: '★ AI व्हेरिफाइड ५-स्टार बिझनेस',
          services: [
            { title: `${cleanTitle} स्पेशल पॅकेज`, desc: 'उत्कृष्ट गुणवत्ता आणि वेळेवर सेवा.', price: '₹४९९ पासून' },
            { title: 'इन्स्टंट डोअरस्टेप सर्व्हिस', desc: 'कमीत कमी वेळेत अचूक व खात्रीशीर काम.', price: 'बेस्ट प्राईस' },
            { title: 'विशेष ग्राहक डिस्काउंट', desc: 'पहिल्या १०० ग्राहकांसाठी विशेष सवलत योजना.', price: '२०% सूट' }
          ],
          stats: [
            { label: 'समाधानी ग्राहक', value: '५,०००+' },
            { label: 'विश्वासार्हता', value: '१००%' },
            { label: 'गुगल रेटिंग', value: '५.० ★' }
          ],
          testimonials: [
            { name: 'सचिन कांबळे', avatar: avatars.male2, location: 'सांगली', review: 'उत्कृष्ट सेवा आणि अतिशय प्रामाणिक काम. ५-स्टार अनुभव!', rating: 5 },
            { name: 'प्रियांका शिंदे', avatar: avatars.female1, location: 'मिरज', review: 'काम खूप जलद आणि अचूक झाले. सर्वांनी नक्की भेट द्या!', rating: 5 }
          ]
        };
        setSelectedTemplate('AI Custom Generated');
        setCurrentSite(dynamicSite);
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

  // Webpage Renderer for Canvas & Fullscreen
  const renderWebpageContent = (isModal: boolean = false) => (
    <div className={`mx-auto bg-[#07090e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${!isModal && deviceView === 'Mobile' ? 'max-w-sm' : 'w-full'}`}>
      <header className="bg-[#0b101d] border-b border-slate-800/80 px-5 py-3.5 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h4 className="font-black text-white text-sm tracking-wide leading-tight">{currentSite.businessName}</h4>
          <span className="text-[10px] text-blue-400 font-semibold">{currentSite.tagline}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-md">
            <MessageSquare size={12} /> WhatsApp
          </a>
          <a href={`tel:${currentSite.phone}`} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-md">
            <Phone size={12} /> कॉल करा
          </a>
        </div>
      </header>

      <section className="p-6 md:p-8 bg-gradient-to-b from-[#0e1628] via-[#0a0f1d] to-[#07090e] text-left space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-[11px] font-bold">
          <Sparkles size={12} /> {currentSite.badge}
        </div>
        <h1 className="text-xl md:text-2xl font-black text-white leading-snug">{currentSite.headline}</h1>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">{currentSite.subheadline}</p>
        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
          <img src={currentSite.heroImage} alt="Hero Banner" className="w-full h-52 md:h-64 object-cover group-hover:scale-105 transition duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg flex items-center gap-2">
              <Zap size={14} /> {currentSite.primaryCta}
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 px-6 py-4 bg-[#0b101e] border-y border-slate-800 text-center">
        {currentSite.stats.map((st, i) => (
          <div key={i} className="p-2">
            <p className="text-lg md:text-xl font-black text-blue-400">{st.value}</p>
            <span className="text-[10px] md:text-xs text-slate-400 font-medium block mt-0.5">{st.label}</span>
          </div>
        ))}
      </section>

      <section className="p-6 md:p-8 space-y-4 text-left">
        <div className="text-center space-y-1 mb-5">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">आमच्या खास सेवा</span>
          <h3 className="text-base md:text-lg font-black text-white">लोकप्रिय उत्पादने आणि सेवा पॅकेजेस</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {currentSite.services.map((srv, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-2 flex flex-col justify-between shadow-md">
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-1">0{idx + 1}</span>
                <h4 className="font-bold text-white text-xs leading-snug">{srv.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{srv.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="font-black text-emerald-400 text-xs">{srv.price}</span>
                <a href={`https://wa.me/91${currentSite.phone}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-0.5">
                  चौकशी करा <ArrowRight size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-6 md:p-8 bg-[#0a0f1d] border-t border-slate-800 space-y-4 text-left">
        <div className="text-center space-y-1 mb-4">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">ग्राहकांचा विश्वास</span>
          <h3 className="text-base font-black text-white">समाधानी ग्राहकांचे ५-स्टार रिव्ह्यू</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentSite.testimonials.map((t, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#080b12] border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-blue-500/50" />
                  <div>
                    <span className="font-bold text-white text-xs block leading-tight">{t.name}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin size={9} /> {t.location}</span>
                  </div>
                </div>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} size={11} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-300 italic leading-relaxed">"{t.review}"</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#05070c] border-t border-slate-800 p-6 text-left space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-bold text-white text-sm">{currentSite.businessName}</h5>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{currentSite.address}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">वेळ: <b className="text-slate-300">{currentSite.timing}</b></p>
          </div>
          <div className="space-y-1.5 md:text-right">
            <span className="text-[11px] text-slate-400 block">थेट संपर्क व चौकशी:</span>
            <p className="font-mono text-blue-400 font-bold">+91 {currentSite.phone}</p>
            <p className="text-[11px] text-slate-400">{currentSite.email}</p>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-500 items-center">
          <span>© {new Date().getFullYear()} {currentSite.businessName}. सर्व हक्क राखीव.</span>
          <span className="text-blue-400">Powered by AI Growth OS</span>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans antialiased overflow-hidden">
      <SidebarComp activeTab={activeTab} setActiveTab={setActiveTab} />

      <input type="file" ref={fileInputRef} accept=".csv" onChange={handleImportCSV} className="hidden" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        
        {/* Top Header */}
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
               activeTab === 'inbox' ? 'AI Inbox & WhatsApp Suite' :
               activeTab === 'ivr' ? 'AI Sales & Outbound IVR' : activeTab.replace('_', ' ')}
            </h1>
            <div className="flex items-center gap-2 bg-[#0d1424] border border-slate-800 px-3.5 py-1.5 rounded-xl w-full text-xs">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search anything in CRM..."
                className="bg-transparent text-white outline-none w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleOpenAddModal}
              className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition"
            >
              + Add Lead
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
                <button onClick={handleOpenAddModal} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition shadow-lg shadow-blue-600/20">
                  <Plus size={14} /> + Add New Lead
                </button>
                <button onClick={() => alert(`सर्व ${leads.length} ग्राहकांना WhatsApp ब्रॉडकास्ट मेसेज पाठवला जात आहे...`)} className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center gap-1.5 transition">
                  <Send size={14} /> WhatsApp Broadcast ({leads.length})
                </button>
                <button onClick={() => setActiveTab('payments')} className="px-3.5 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-xl font-bold flex items-center gap-1.5 transition">
                  <QrCode size={14} /> Quick Payment QR
                </button>
                <button onClick={() => setActiveTab('website')} className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-xl font-bold flex items-center gap-1.5 transition">
                  <Sparkles size={14} /> AI Website Builder
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
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Revenue Growth</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">+34.8%</span>
                </div>
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
                      <div>
                        <p className="font-bold text-white">{l.name}</p>
                        <p className="text-[11px] text-slate-400">{l.phone} • {l.service}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={`https://wa.me/91${l.phone}`} target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold text-[11px] flex items-center gap-1">
                          <MessageSquare size={12} /> WhatsApp
                        </a>
                        <button onClick={() => alert(`${l.name} ला AI कॉल लावला जात आहे...`)} className="px-2.5 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg font-bold text-[11px] flex items-center gap-1">
                          <PhoneCall size={12} /> AI Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. GROWTH LEADS ================= */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-wrap justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2"><Users size={20} className="text-blue-400" /> Growth Leads Directory ({filteredLeads.length} Leads)</h2>
                <p className="text-xs text-slate-400">सर्व १५ इनबाउंड व आऊटबाउंड लीड्सचे व्यवस्थापन.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleOpenAddModal} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"><Plus size={15} /> + Add Lead</button>
                <button onClick={() => fileInputRef.current?.click()} className="px-3.5 py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"><Upload size={14} /> Import CSV</button>
                <button onClick={handleExportCSV} className="px-3.5 py-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5"><Download size={14} /> Export CSV</button>
              </div>
            </div>

            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[850px] text-xs">
                  <thead className="bg-[#080c18] text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr><th className="p-4">Customer Details</th><th className="p-4">Service Required</th><th className="p-4">Deal Value</th><th className="p-4">Status</th><th className="p-4 text-center">Instant Actions</th><th className="p-4 text-center">Manage</th></tr>
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
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-wrap justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2"><Layers size={20} className="text-blue-400" /> Growth CRM & Interactive Pipeline</h2>
                <p className="text-xs text-slate-400">कार्ड ओढून (Drag) पुढच्या टप्प्यात (Drop) टाका.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleOpenAddModal} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg"><Plus size={15} /> + Add Deal</button>
                <button onClick={handleExportCSV} className="px-3.5 py-2 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"><Download size={14} /> Export CSV</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['New Lead', 'Contacted', 'Payment Sent', 'Won'].map((stg) => (
                <div key={stg} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stg)} className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 space-y-3 min-h-[450px]">
                  <div className="flex justify-between border-b border-slate-800 pb-2 items-center">
                    <span className="font-bold text-xs text-white uppercase">{stg}</span>
                    <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-bold">{leads.filter(l => l.status === stg).length} Deals</span>
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
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">AI Voice & Prompt 5-Star Website Generator</h2>
                    <p className="text-xs text-slate-400">माईकवर बोलून किंवा प्रॉम्प्ट देऊन १ सेकंदात पूर्ण वेबसाईट बनवा.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPreviewModalOpen(true)} className="px-3.5 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md">
                    <Eye size={14} /> Full Screen Live Preview
                  </button>
                  <div className="flex items-center gap-1.5 bg-[#080b12] p-1.5 rounded-2xl border border-slate-800 text-xs">
                    <button onClick={() => setDeviceView('Desktop')} className={`px-3 py-1 rounded-xl font-bold ${deviceView === 'Desktop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>Desktop</button>
                    <button onClick={() => setDeviceView('Mobile')} className={`px-3 py-1 rounded-xl font-bold ${deviceView === 'Mobile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>Mobile</button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[280px] bg-[#080b12] border border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Sparkles size={18} className="text-blue-400 shrink-0" />
                  <input type="text" value={promptInput} onChange={(e) => setPromptInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerateWebsite()} placeholder="उदा. 'csc center sathi ५-स्टार वेबसाइट बनवा'..." className="bg-transparent text-white text-xs outline-none w-full" />
                </div>
                <button type="button" onClick={toggleVoiceRecording} className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition ${isListening ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-200 border-slate-700'}`}>
                  {isListening ? <MicOff size={16} /> : <Mic size={16} className="text-rose-400" />}
                  <span>{isListening ? 'बोलणे चालू आहे...' : 'Continuous Marathi Mic'}</span>
                </button>
                <button type="button" onClick={handleGenerateWebsite} disabled={isGenerating} className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>{isGenerating ? 'तयार होत आहे...' : 'Generate 5-Star Website'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                {Object.keys(templatesDb).map((key) => (
                  <button key={key} type="button" onClick={() => { setSelectedTemplate(key); setCurrentSite(templatesDb[key]); }} className={`p-2.5 rounded-xl text-xs font-semibold text-left border ${selectedTemplate === key ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-[#080b12] text-slate-400 border-slate-800'}`}>
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 text-xs max-h-[850px] overflow-y-auto shadow-xl">
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

              <div className="lg:col-span-8 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex justify-between text-xs border-b border-slate-800 pb-3 items-center">
                  <span className="font-mono text-slate-300 text-[11px]">Live Canvas</span>
                  <button onClick={() => setIsPreviewModalOpen(true)} className="text-[11px] text-blue-400 font-bold hover:underline flex items-center gap-1">
                    <Eye size={13} /> Full Screen View
                  </button>
                </div>
                {renderWebpageContent(false)}
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. PAYMENT GATEWAYS ================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 text-xs shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-sm">DYNAMIC MULTI-UPI & PAYMENT REQUEST GENERATOR</h3>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">Live 0% Commission</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div><label className="text-slate-300 block mb-1 font-bold">Your Working UPI ID *</label><input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none" /></div>
                  <div><label className="text-slate-300 block mb-1 font-bold">Business Name on UPI</label><input type="text" value={businessNameUpi} onChange={(e) => setBusinessNameUpi(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div><label className="text-slate-300 block mb-1 font-bold">Customer Full Name</label><input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                  <div><label className="text-slate-300 block mb-1 font-bold">Customer WhatsApp Number</label><input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none" /></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div><label className="text-slate-300 block mb-1 font-bold">Service / Description</label><input type="text" value={paymentDesc} onChange={(e) => setPaymentDesc(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
                  <div><label className="text-slate-300 block mb-1 font-bold">Amount (₹) *</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-emerald-400 font-black text-base outline-none" /></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <button type="button" onClick={handleRazorpayPay} className="py-3 px-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg"><CreditCard size={15} /> Pay with Razorpay</button>
                  <button type="button" onClick={handleSendWhatsAppBill} className="py-3 px-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-lg"><Send size={15} /> Send WhatsApp Bill</button>
                  <button type="button" onClick={handlePrintReceipt} className="py-3 px-3 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center justify-center gap-1.5"><Printer size={15} /> Print Receipt</button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-xl flex flex-col items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Live Instant Payment QR</span>
                <div className="p-4 bg-white rounded-2xl shadow-2xl inline-block border-4 border-slate-800">
                  <img src={qrUrl} alt="Live Dynamic UPI QR" className="w-48 h-48 block rounded-lg mx-auto" />
                  <div className="mt-2 pt-2 border-t border-slate-200 flex justify-center items-center gap-2 text-[10px] text-slate-700 font-bold">
                    <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                  </div>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(livePayUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-lg">
                  {copied ? <Check size={14} /> : <Copy size={14} />} <span>{copied ? 'लिंक कॉपी झाली!' : 'Copy Direct UPI Link'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. ADVANCED AI AGENTS & CHATBOT ================= */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2"><Bot size={18} className="text-blue-400" /><h3 className="font-bold text-white text-sm">AI Agent & Bot Studio</h3></div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">● Live Agent Active</span>
              </div>
              <div><label className="text-slate-300 block mb-1 font-bold">Agent Name</label><input type="text" value={botConfig.name} onChange={(e) => setBotConfig({ ...botConfig, name: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-slate-300 block mb-1 font-bold">Personality Mode</label><select value={botConfig.personality} onChange={(e) => setBotConfig({ ...botConfig, personality: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none"><option value="Professional & Friendly">Professional & Friendly</option><option value="Urgent Sales Closer">Urgent Sales Closer</option></select></div>
                <div><label className="text-slate-300 block mb-1 font-bold">Primary Language</label><select value={botConfig.language} onChange={(e) => setBotConfig({ ...botConfig, language: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none"><option value="मराठी + English (Hinglish)">मराठी + English</option><option value="शुद्ध मराठी (Marathi)">शुद्ध मराठी</option></select></div>
              </div>
              <div><label className="text-slate-300 block mb-1 font-bold">System Prompt & Business Knowledge Base</label><textarea rows={4} value={botConfig.systemPrompt} onChange={(e) => setBotConfig({ ...botConfig, systemPrompt: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-3 text-white outline-none resize-none leading-relaxed" /></div>
              <button onClick={() => alert('AI Agent Configuration यशस्वीरीत्या सेव्ह झाले!')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Save & Deploy AI Agent</button>
            </div>

            <div className="lg:col-span-7 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 text-xs shadow-xl flex flex-col justify-between h-[550px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">🤖</div><div><h4 className="font-bold text-white text-xs">{botConfig.name}</h4><span className="text-[10px] text-emerald-400">● Online | 24/7 Simulator</span></div></div>
                <button onClick={() => setChatMessages([chatMessages[0]])} className="text-[10px] text-slate-400 hover:text-white">Clear Chat</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-[#080b12] rounded-2xl border border-slate-800">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none shadow-md' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>{m.text}</div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {['नवीन 5G मोबाईल किंमत काय?', 'सरकारी दाखले किती दिवसांत मिळतील?', 'UPI द्वारे पेमेंट करायचे आहे'].map((chip, idx) => (
                  <button key={idx} onClick={() => setInputMsg(chip)} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] whitespace-nowrap border border-slate-700">{chip}</button>
                ))}
              </div>

              <div className="flex gap-2 pt-1 border-t border-slate-800">
                <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} placeholder="मेसेज टाईप करा किंवा बोला..." className="flex-1 bg-[#080b12] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none" />
                <button onClick={handleSendChat} className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold"><Send size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. AD LAUNCHER (META LEADS) ================= */}
        {activeTab === 'meta_ads' && (
          <div className="space-y-6">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2"><Megaphone size={18} className="text-blue-400" /><h3 className="font-bold text-white text-sm">Meta Lead Ads Auto-Webhook & Campaign Setup</h3></div>
                <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold">Meta Graph API v19.0</span>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Direct Webhook URL for Meta App</label>
                <div className="flex gap-2">
                  <input readOnly value="https://ai-growth-crm-nine.vercel.app/api/lead-webhook" className="flex-1 bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-blue-400 font-mono outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText('https://ai-growth-crm-nine.vercel.app/api/lead-webhook'); alert('Webhook URL कॉपी झाला!'); }} className="px-4 bg-slate-800 text-white font-bold rounded-xl">Copy</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2"><span className="font-bold text-white block">Daily Ad Budget</span><input type="number" value={adBudget} onChange={(e) => setAdBudget(Number(e.target.value))} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2 text-emerald-400 font-bold text-sm outline-none" /></div>
                <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2"><span className="font-bold text-white block">Target Location</span><input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2 text-white outline-none" /></div>
                <div className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2"><span className="font-bold text-white block">Ad Campaign Goal</span><select value={adCampaignType} onChange={(e) => setAdCampaignType(e.target.value)} className="w-full bg-[#0d1424] border border-slate-700 rounded-xl p-2 text-white outline-none"><option value="Meta Lead Ads (WhatsApp Direct)">Direct WhatsApp Leads</option><option value="Instant Lead Form">Instant Lead Forms</option></select></div>
              </div>
              <button onClick={() => alert('Meta Lead Ads मोहीम यशस्वीरीत्या लॉन्च झाली!')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Launch 1-Click Meta Ad Campaign</button>
            </div>
          </div>
        )}

        {/* ================= 8. TEMPLATES ================= */}
        {activeTab === 'templates' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><FileText size={16} className="text-blue-400" /> WhatsApp & Email Message Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Welcome Inquiry', text: 'नमस्कार {Name} जी, Ishwari Mobile मध्ये आपले स्वागत आहे. आम्ही आपली कशी मदत करू शकतो?' },
                { title: 'Instant UPI Payment Request', text: 'नमस्कार {Name} जी, आपल्या {Service} चे ₹{Amount} चे डिजिटल बिल व UPI QR लिंक खालीलप्रमाणे आहे.' },
                { title: 'Appointment Confirmed', text: 'आपली {Service} ची अपॉइंटमेंट निश्चित झाली आहे. वेळेवर उपस्थित राहावे.' }
              ].map((t, i) => (
                <div key={i} className="bg-[#0d1424] border border-slate-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                  <div><span className="font-bold text-white block mb-1">{t.title}</span><p className="bg-[#080b12] p-3 rounded-xl text-slate-300 border border-slate-800 font-mono text-[11px] leading-relaxed">{t.text}</p></div>
                  <button onClick={() => alert('टेम्प्लेट कॉपी झाले!')} className="w-full py-1.5 bg-slate-800 text-slate-300 rounded-lg font-bold text-[10px]">Copy Template</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 9. WORKFLOW BUILDER ================= */}
        {activeTab === 'workflow' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-center">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center justify-center gap-2"><GitBranch size={16} className="text-blue-400" /> Multi-Step AI Automation Workflow</h3>
            <div className="p-3 bg-blue-950/60 border border-blue-600/50 rounded-xl font-bold text-blue-300 max-w-md mx-auto">1. Trigger: New Lead from Meta Lead Ads / Website</div>
            <div className="text-slate-500 font-bold">↓ (Instant 0 Sec)</div>
            <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl font-bold text-emerald-300 max-w-md mx-auto">2. Action: Send Welcome WhatsApp Message & Dynamic UPI QR</div>
            <div className="text-slate-500 font-bold">↓ (After 5 Minutes)</div>
            <div className="p-3 bg-amber-950/60 border border-amber-600/50 rounded-xl font-bold text-amber-300 max-w-md mx-auto">3. Action: AI Sales Voice Agent Outbound Call</div>
          </div>
        )}

        {/* ================= 10. AI INBOX / WHATSAPP SUITE ================= */}
        {activeTab === 'inbox' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[550px] shadow-xl text-xs">
            <div className="md:col-span-4 border-r border-slate-800 p-3 overflow-y-auto space-y-1 bg-[#080c16]">
              <div className="px-2 py-1.5 flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Conversations</span>
                <span className="text-[10px] bg-blue-950 text-blue-400 px-2 py-0.5 rounded-full font-bold">{leads.length}</span>
              </div>
              {leads.map((l) => (
                <div key={l.id} onClick={() => setSelectedLead(l)} className={`p-3 rounded-2xl cursor-pointer transition ${selectedLead.id === l.id ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-slate-800/50 text-slate-300'}`}>
                  <div className="flex justify-between items-center"><p className="text-xs font-bold leading-tight">{l.name}</p><span className="text-[9px] opacity-70">10:30 AM</span></div>
                  <p className="text-[10px] opacity-80 truncate mt-0.5">{l.service} • +91 {l.phone}</p>
                </div>
              ))}
            </div>

            <div className="md:col-span-8 p-4 flex flex-col justify-between bg-[#080b12]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div><h4 className="font-bold text-white text-sm">{selectedLead.name}</h4><span className="text-[10px] text-emerald-400 font-mono">+91 {selectedLead.phone} ({selectedLead.service})</span></div>
                <a href={`https://wa.me/91${selectedLead.phone}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold text-[10px] flex items-center gap-1"><MessageSquare size={12} /> Open WhatsApp</a>
              </div>

              <div className="space-y-3 py-4 overflow-y-auto h-72">
                {(inboxChats[selectedLead.id] || [
                  { from: 'them', text: `नमस्कार, मला ${selectedLead.service} बद्दल माहिती हवी आहे.`, time: '10:15 AM' },
                  { from: 'me', text: `नमस्कार ${selectedLead.name} जी, आम्ही आपल्या सेवेसाठी उपलब्ध आहोत.`, time: '10:20 AM' }
                ]).map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.from === 'me' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[75%] text-xs leading-relaxed ${m.from === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>{m.text}</div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <input type="text" value={inboxText} onChange={(e) => setInboxText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendInbox()} placeholder="Type reply message..." className="flex-1 bg-[#0d1424] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none" />
                <button onClick={handleSendInbox} className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold"><Send size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 11. CALENDAR ================= */}
        {activeTab === 'calendar' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Calendar size={16} className="text-blue-400" /> Scheduled Appointments</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['11:00 AM - सचिन कांबळे (5G Phone)', '02:00 PM - अमित देशमुख (Repairing)', '05:30 PM - प्रियांका शिंदे (Clinic)'].map((s, i) => (
                <div key={i} className="p-4 bg-[#080b12] border border-slate-800 rounded-2xl font-bold text-blue-400">{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 12. AI SALES & IVR (CALLING BOT) ================= */}
        {activeTab === 'ivr' && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-5 lg:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2"><PhoneCall size={18} className="text-blue-400" /><h3 className="font-bold text-white text-sm">AI Outbound Sales Calling Bot</h3></div>
                <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold">Marathi TTS Voice Engine</span>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-bold">AI Voice Calling Script (Marathi/Hindi)</label>
                <textarea rows={2} value={ivrScript} onChange={(e) => setIvrScript(e.target.value)} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none resize-none" />
              </div>
            </div>

            <div className="bg-[#0d1424] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center"><span className="font-bold text-white text-xs uppercase tracking-wider">Outbound Calling Queue</span><span className="text-[10px] text-slate-400">Total Leads: <b className="text-white">{leads.length}</b></span></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-[#080c18] text-slate-400 uppercase text-[10px]">
                    <tr><th className="p-3">Customer Details</th><th className="p-3">Service Interest</th><th className="p-3">Sentiment</th><th className="p-3 text-center">Calling Status</th><th className="p-3 text-center">Trigger AI Call</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {leads.slice(0, 6).map((lead) => {
                      const status = callingStatus[lead.id] || 'Idle';
                      return (
                        <tr key={lead.id} className="hover:bg-slate-800/30">
                          <td className="p-3"><p className="font-bold text-white">{lead.name}</p><span className="text-[10px] text-slate-400 font-mono">+91 {lead.phone}</span></td>
                          <td className="p-3">{lead.service}</td>
                          <td className="p-3"><span className="text-[10px] text-emerald-400 font-bold">● {lead.sentiment}</span></td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              status === 'Calling' ? 'bg-amber-950 text-amber-400 border-amber-500/40 animate-pulse' :
                              status === 'Connected' ? 'bg-blue-950 text-blue-400 border-blue-500/40 animate-pulse' :
                              status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>{status === 'Idle' ? 'Ready' : status}</span>
                          </td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleTriggerIvrCall(lead)} disabled={status === 'Calling' || status === 'Connected'} className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-1 mx-auto transition disabled:opacity-50">
                              <PhoneCall size={12} /> {status === 'Completed' ? 'Re-call' : 'Start Call'}
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

        {/* ================= 13. FINANCE ================= */}
        {activeTab === 'finance' && (
          <div className="space-y-5 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Wallet size={16} className="text-emerald-400" /> SaaS Billing & Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-slate-400">MRR</span><p className="text-2xl font-black text-emerald-400 mt-1">₹45,900</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-slate-400">Paid Clients</span><p className="text-2xl font-black text-blue-400 mt-1">24</p></div>
              <div className="bg-[#0d1424] border border-slate-800 p-4 rounded-2xl"><span className="text-slate-400">Pending Settlements</span><p className="text-2xl font-black text-amber-400 mt-1">₹8,500</p></div>
            </div>
          </div>
        )}

        {/* ================= 14. SOCIAL AUTO-POST ================= */}
        {activeTab === 'social' && (
          <div className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Share2 size={16} className="text-blue-400" /> Social Media Auto-Poster</h3>
            <textarea rows={3} defaultValue="💥 Ishwari Mobile कडून नवीन 5G स्मार्टफोन्सवर २०% सूट आणि शून्य डाऊनपेमेंट EMI!" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-3 text-white outline-none" />
            <button onClick={() => alert('फेसबुक आणि इंस्टाग्रामवर पोस्ट झाली!')} className="py-2 px-6 bg-blue-600 text-white font-bold rounded-xl">Publish Post</button>
          </div>
        )}

        {/* ================= 15. SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto w-full space-y-6 text-xs">
            <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-2"><Settings size={16} className="text-blue-400" /> Meta API Settings & Credentials</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('क्रेडेन्शियल्स सेव्ह झाले!'); }} className="bg-[#0d1424] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div><label className="text-slate-400 block mb-1">WhatsApp Phone Number ID</label><input type="text" defaultValue="1230282856843762" className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" /></div>
              <button type="submit" className="py-2.5 px-6 bg-blue-600 text-white font-bold rounded-xl">Save Settings</button>
            </form>
          </div>
        )}

        {/* LEAD MODAL POPUP */}
        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1424] border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-base">{editingLead ? 'Edit Lead' : '+ Add New Lead'}</h3>
                <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-400 hover:text-white p-1"><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">नाव *</label>
                    <input type="text" required value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-bold">मोबाईल *</label>
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
                {renderWebpageContent(true)}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}