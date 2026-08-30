'use client';

import React, { useState } from 'react';
// @ts-ignore
import Sidebar from '../components/Sidebar';
import { 
  Search, RefreshCw, Sparkles, Monitor, Smartphone, 
  MessageSquare, Phone, Edit3, Image as ImageIcon, 
  Loader2, Mic, MicOff, Star, CheckCircle2, Zap, ArrowRight,
  ExternalLink, Eye, X, Check, ShieldCheck, MapPin, Mail, Clock
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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('website');
  const [deviceView, setDeviceView] = useState<'Desktop' | 'Mobile'>('Desktop');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  // Industry Stock Images Mapping
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

  // Indian Customer Avatar Library
  const avatars = {
    male1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    male2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    female1: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    female2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  };

  // Database of 10 Pro Multi-Section Templates
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
        { name: 'सुप्रिया भोसले', avatar: avatars.female2, location: 'मिरज', review: 'सांधेदुखीवर इथे खूप चांगला गुण आला. अत्यंत स्वच्छ आणि विश्वासार्ह रुग्णालय.', rating: 5 }
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
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string>('CSC & Online Services');
  const [currentSite, setCurrentSite] = useState<TemplateData>(templatesDb['CSC & Online Services']);

  const [promptInput, setPromptInput] = useState<string>('csc center sathi ५-स्टार वेबसाइट बनवा');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Voice Mic Logic
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

  // TRUE INTELLIGENT AI PROMPT PARSER & GENERATOR
  const handleGenerateWebsite = () => {
    if (!promptInput.trim()) {
      alert('कृपया माईकवर बोला किंवा प्रॉम्प्ट टाईप करा!');
      return;
    }
    setIsGenerating(true);

    setTimeout(() => {
      const lower = promptInput.toLowerCase();
      let matchedKey = '';

      if (lower.includes('csc') || lower.includes('सेतू') || lower.includes('दाखले') || lower.includes('online') || lower.includes('ऑनलाईन') || lower.includes('पॅन') || lower.includes('आधार') || lower.includes('सरकारी') || lower.includes('योजना')) {
        matchedKey = 'CSC & Online Services';
      } else if (lower.includes('mobile') || lower.includes('मोबाईल') || lower.includes('फोन') || lower.includes('smartphone') || lower.includes('रिपेअर')) {
        matchedKey = 'Mobile & Electronics';
      } else if (lower.includes('doctor') || lower.includes('clinic') || lower.includes('दवाखाना') || lower.includes('दात') || lower.includes('डेंटल') || lower.includes('हॉस्पिटल')) {
        matchedKey = 'Doctor & Clinic';
      } else if (lower.includes('flat') || lower.includes('घर') || lower.includes('property') || lower.includes('real estate') || lower.includes('बिल्डर') || lower.includes('प्लॉट')) {
        matchedKey = 'Real Estate & Property';
      } else if (lower.includes('gym') || lower.includes('फिटनेस') || lower.includes('व्यायाम') || lower.includes('कसरत') || lower.includes('जिम')) {
        matchedKey = 'Gym & Fitness';
      }

      if (matchedKey && templatesDb[matchedKey]) {
        setSelectedTemplate(matchedKey);
        setCurrentSite(templatesDb[matchedKey]);
      } else {
        // Clean prompt of junk keywords
        const cleanBusinessTopic = promptInput
          .replace(/५-स्टार|5 star|स्टार|वेबसाइट|बनवा|करा|sathi|साठी|landing page|website|तयार|हवी|आहे/gi, '')
          .trim() || 'प्रिमियम डिजिटल बिझनेस';

        // Select suitable stock image
        let autoImage = industryImages.generic;
        if (lower.includes('hotel') || lower.includes('जेवण') || lower.includes('कॅफे') || lower.includes('हॉटेल')) autoImage = industryImages.restaurant;
        else if (lower.includes('car') || lower.includes('गॅरेज') || lower.includes('गाडी')) autoImage = industryImages.garage;
        else if (lower.includes('beauty') || lower.includes('पार्लर') || lower.includes('मेकअप')) autoImage = industryImages.beauty;
        else if (lower.includes('class') || lower.includes('अकॅडमी') || lower.includes('कोर्स')) autoImage = industryImages.academy;

        const dynamicSite: TemplateData = {
          id: 'AI Custom Generated',
          businessName: `${cleanBusinessTopic} प्रिमियम हब`,
          tagline: `${cleanBusinessTopic} साठी विश्वासार्ह आणि तत्पर सेवा`,
          headline: `${cleanBusinessTopic} वर मिळवा थेट विशेष डिस्काउंट आणि १००% खात्रीशीर सेवा!`,
          subheadline: `आमच्याकडे आधुनिक सोयीसुविधा, तज्ज्ञ मार्गदर्शन आणि वाजवी दर उपलब्ध आहेत. आजच तुमची सेवा बुक करा.`,
          heroImage: autoImage,
          phone: '9876543210',
          email: 'contact@businessgrowth.com',
          address: 'मुख्य चौक, बाजारपेठ, सांगली',
          timing: 'सकाळी ९:०० ते रात्री ९:००',
          primaryCta: 'इन्स्टंट ऑफर क्लेम करा',
          badge: '★ AI व्हेरिफाइड ५-स्टार बिझनेस',
          services: [
            { title: `${cleanBusinessTopic} स्पेशल पॅकेज`, desc: 'उत्कृष्ट गुणवत्ता आणि वेळेवर सेवा.', price: '₹४९९ पासून' },
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

  // Render Webpage View (Reusable for Canvas and Fullscreen Preview)
  const renderWebpageContent = (isModal: boolean = false) => (
    <div className={`mx-auto bg-[#07090e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${!isModal && deviceView === 'Mobile' ? 'max-w-sm' : 'w-full'}`}>
      
      {/* 1. TOP HEADER & NAVIGATION */}
      <header className="bg-[#0b101d] border-b border-slate-800/80 px-5 py-3.5 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h4 className="font-black text-white text-sm tracking-wide leading-tight">{currentSite.businessName}</h4>
          <span className="text-[10px] text-blue-400 font-semibold">{currentSite.tagline}</span>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href={`https://wa.me/91${currentSite.phone}?text=${encodeURIComponent(`नमस्कार, मला ${currentSite.businessName} बद्दल माहिती हवी आहे.`)}`}
            target="_blank" 
            rel="noreferrer"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-md shadow-emerald-600/20"
          >
            <MessageSquare size={12} /> WhatsApp
          </a>
          <a 
            href={`tel:${currentSite.phone}`}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-md shadow-blue-600/20"
          >
            <Phone size={12} /> कॉल करा
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="p-6 md:p-8 bg-gradient-to-b from-[#0e1628] via-[#0a0f1d] to-[#07090e] text-left space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-[11px] font-bold">
          <Sparkles size={12} /> {currentSite.badge}
        </div>
        
        <h1 className="text-xl md:text-2xl font-black text-white leading-snug">
          {currentSite.headline}
        </h1>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {currentSite.subheadline}
        </p>

        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
          <img 
            src={currentSite.heroImage} 
            alt="Hero Banner" 
            className="w-full h-52 md:h-64 object-cover group-hover:scale-105 transition duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
            <a 
              href={`https://wa.me/91${currentSite.phone}`}
              target="_blank" 
              rel="noreferrer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/40 flex items-center gap-2"
            >
              <Zap size={14} /> {currentSite.primaryCta}
            </a>
          </div>
        </div>
      </section>

      {/* 3. TRUST & STATS METRICS COUNTER */}
      <section className="grid grid-cols-3 gap-2 px-6 py-4 bg-[#0b101e] border-y border-slate-800 text-center">
        {currentSite.stats.map((st, i) => (
          <div key={i} className="p-2">
            <p className="text-lg md:text-xl font-black text-blue-400">{st.value}</p>
            <span className="text-[10px] md:text-xs text-slate-400 font-medium block mt-0.5">{st.label}</span>
          </div>
        ))}
      </section>

      {/* 4. CORE SERVICES & PACKAGES */}
      <section className="p-6 md:p-8 space-y-4 text-left">
        <div className="text-center space-y-1 mb-5">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">आमच्या खास सेवा</span>
          <h3 className="text-base md:text-lg font-black text-white">लोकप्रिय उत्पादने आणि सेवा पॅकेजेस</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {currentSite.services.map((srv, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0d1424] border border-slate-800 hover:border-blue-500/60 transition space-y-2 flex flex-col justify-between shadow-md">
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-1">0{idx + 1}</span>
                <h4 className="font-bold text-white text-xs leading-snug">{srv.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{srv.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="font-black text-emerald-400 text-xs">{srv.price}</span>
                <a 
                  href={`https://wa.me/91${currentSite.phone}?text=${encodeURIComponent(`मला ${srv.title} बद्दल माहिती हवी आहे.`)}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  चौकशी करा <ArrowRight size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 5-STAR TESTIMONIALS & REVIEWS WITH CUSTOMER AVATARS */}
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

      {/* 6. INSTANT LEAD BOOKING FORM */}
      <section className="p-6 md:p-8 bg-gradient-to-b from-[#0a0f1d] to-[#0e1628] border-t border-slate-800 text-left space-y-3">
        <div className="text-center space-y-1 mb-3">
          <h3 className="text-base font-black text-white">विशेष ऑफरसाठी नाव नोंदवा</h3>
          <p className="text-[11px] text-slate-400">खालील फॉर्म भरा, आमची टीम तुम्हाला १० मिनिटांत संपर्क करेल.</p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            alert('धन्यवाद! आपली चौकशी यशस्वीरीत्या नोंदवली गेली आहे.');
          }} 
          className="space-y-2.5 max-w-md mx-auto text-xs"
        >
          <input 
            type="text" 
            required 
            placeholder="आपले पूर्ण नाव" 
            className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" 
          />
          <input 
            type="tel" 
            required 
            placeholder="आपला १० अंकी मोबाईल नंबर" 
            className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500 font-mono" 
          />
          <button 
            type="submit" 
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 size={14} /> इन्स्टंट ऑफर क्लेम करा
          </button>
        </form>
      </section>

      {/* 7. COMPLETE FOOTER */}
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

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        
        {/* Top Header */}
        <header className="flex flex-wrap items-center justify-between pb-5 mb-5 border-b border-slate-800/80 gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h1 className="text-xl font-black text-white shrink-0 capitalize">Website & Funnels</h1>
            <div className="flex items-center gap-2 bg-[#0d1424] border border-slate-800 px-3.5 py-1.5 rounded-xl w-full text-xs">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search templates or settings..."
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

        {/* 5-STAR AI WEBSITE BUILDER */}
        <div className="space-y-6">
          
          {/* Top Prompt & Voice Mic Bar */}
          <div className="bg-[#0d1424] border border-slate-800/90 rounded-3xl p-5 lg:p-6 space-y-4 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    AI Voice & Prompt 5-Star Website Generator
                  </h2>
                  <p className="text-xs text-slate-400">माईकवर सलग बोलून किंवा कोणताही प्रॉम्प्ट टाईप करून १ सेकंदात पूर्ण वेबसाईट बनवा.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsPreviewModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <Eye size={14} /> Full Screen Live Preview
                </button>

                <div className="flex items-center gap-1.5 bg-[#080b12] p-1.5 rounded-2xl border border-slate-800 text-xs">
                  <button 
                    onClick={() => setDeviceView('Desktop')} 
                    className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1 ${deviceView === 'Desktop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Monitor size={13} /> Desktop
                  </button>
                  <button 
                    onClick={() => setDeviceView('Mobile')} 
                    className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1 ${deviceView === 'Mobile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Smartphone size={13} /> Mobile
                  </button>
                </div>
              </div>
            </div>

            {/* Input Prompt Box & Continuous Voice Mic Button */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[280px] bg-[#080b12] border border-slate-700/90 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-inner">
                <Sparkles size={18} className="text-blue-400 shrink-0 animate-pulse" />
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateWebsite()}
                  placeholder="उदा. 'csc center sathi ५-स्टार वेबसाइट बनवा' किंवा 'क्लिनिकसाठी लँडिंग पेज तयार करा'..."
                  className="bg-transparent text-white text-xs outline-none w-full font-medium placeholder:text-slate-500"
                />
              </div>

              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition shadow-lg cursor-pointer ${
                  isListening 
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse ring-4 ring-rose-600/30' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} className="text-rose-400" />}
                <span>{isListening ? 'बोलणे चालू आहे...' : 'Continuous Marathi Mic'}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateWebsite}
                disabled={isGenerating}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>{isGenerating ? 'तयार होत आहे...' : 'Generate 5-Star Website'}</span>
              </button>
            </div>

            {/* Quick Templates Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-black text-slate-400 block uppercase tracking-wider">
                १० रेडीमेड ५-स्टार व्यावसायिक टेम्पलेट्स (१-क्लिकने निवडा):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {Object.keys(templatesDb).map((key) => {
                  const isSelected = selectedTemplate === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setSelectedTemplate(key); setCurrentSite(templatesDb[key]); }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition text-left border cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20 font-bold scale-[1.02]' 
                          : 'bg-[#080b12] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate text-[11px]">{key}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Split Screen: Section Customizer & 5-Star Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Side: Real-time Section Editor */}
            <div className="lg:col-span-4 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 text-xs max-h-[850px] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                  <Edit3 size={14} className="text-blue-400" /> Live Content Editor
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold">Auto-Sync On</span>
              </div>

              {/* Image Upload */}
              <div className="p-3 bg-[#080b12] border border-slate-800 rounded-2xl space-y-2">
                <label className="text-slate-300 font-bold block flex items-center gap-1.5 text-[11px]">
                  <ImageIcon size={14} className="text-blue-400" /> स्वतःचा बॅनर फोटो अपलोड करा
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="w-full text-[11px] text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-600 file:text-white cursor-pointer" 
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Business Name</label>
                <input 
                  type="text" 
                  value={currentSite.businessName} 
                  onChange={(e) => setCurrentSite({ ...currentSite, businessName: e.target.value })} 
                  className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Tagline</label>
                <input 
                  type="text" 
                  value={currentSite.tagline} 
                  onChange={(e) => setCurrentSite({ ...currentSite, tagline: e.target.value })} 
                  className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500" 
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Main Headline (H1)</label>
                <textarea 
                  rows={2} 
                  value={currentSite.headline} 
                  onChange={(e) => setCurrentSite({ ...currentSite, headline: e.target.value })} 
                  className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500 resize-none" 
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Subheadline Description</label>
                <textarea 
                  rows={3} 
                  value={currentSite.subheadline} 
                  onChange={(e) => setCurrentSite({ ...currentSite, subheadline: e.target.value })} 
                  className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:border-blue-500 resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">WhatsApp / Phone</label>
                  <input 
                    type="text" 
                    value={currentSite.phone} 
                    onChange={(e) => setCurrentSite({ ...currentSite, phone: e.target.value })} 
                    className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white font-mono outline-none" 
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold">Primary Button Text</label>
                  <input 
                    type="text" 
                    value={currentSite.primaryCta} 
                    onChange={(e) => setCurrentSite({ ...currentSite, primaryCta: e.target.value })} 
                    className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2 text-white outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-bold">Shop / Center Address</label>
                <input 
                  type="text" 
                  value={currentSite.address} 
                  onChange={(e) => setCurrentSite({ ...currentSite, address: e.target.value })} 
                  className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" 
                />
              </div>
            </div>

            {/* Right Side: Full 5-Star Multi-Section Live Webpage Preview Canvas */}
            <div className="lg:col-span-8 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex justify-between text-xs border-b border-slate-800 pb-3 items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-mono text-slate-300 text-[11px]">Live Preview Canvas</span>
                </div>
                <button 
                  onClick={() => setIsPreviewModalOpen(true)} 
                  className="text-[11px] text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Eye size={13} /> Full Screen View
                </button>
              </div>

              {renderWebpageContent(false)}
            </div>

          </div>
        </div>

        {/* FULL SCREEN LIVE PREVIEW MODAL */}
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
            <div className="bg-[#07090e] border border-slate-700 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Eye size={16} className="text-blue-400" /> Fullscreen Live Webpage Preview
                </div>
                <button 
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  <X size={18} />
                </button>
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