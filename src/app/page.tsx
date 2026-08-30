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
  TrendingUp, Zap, Target, Activity, CheckCircle2, ArrowUpRight,
  Mic, MicOff, Star, ShieldCheck, Stethoscope, Building2, SmartphoneCharging,
  Dumbbell, GraduationCap, UtensilsCrossed, Wrench, Sparkle, Briefcase, Scale,
  Image as ImageIcon, Loader2, Award, HeartHandshake, Mail
} from 'lucide-react';

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
  id: string;
  iconName: string;
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
  testimonials: { name: string; review: string; rating: number }[];
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('website');
  const [deviceView, setDeviceView] = useState<'Desktop' | 'Mobile'>('Desktop');
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 10 Comprehensive 5-Star Business Landing Page Templates Database
  const templatesDb: Record<string, TemplateData> = {
    'Mobile & Electronics': {
      id: 'Mobile & Electronics',
      iconName: 'SmartphoneCharging',
      businessName: 'ईश्वरी मोबाईल & ५G स्मार्ट गॅलरी',
      tagline: 'स्मार्टफोन्स, प्रिमियम ॲक्सेसरीज आणि इन्स्टंट रिपेअरिंग',
      headline: 'नवीन 5G स्मार्टफोन्सवर मिळवा थेट २०% सूट आणि शून्य डाऊनपेमेंट EMI!',
      subheadline: 'iPhone, OnePlus, Samsung, Vivo चे सर्व अधिकृत मॉडेल्स सर्वोत्तम किमतीत उपलब्ध. सोबत फ्री गिफ्ट्स आणि २ वर्षांची वॉरंटी.',
      heroImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
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
        { name: 'सचिन कांबळे', review: 'माझ्या iPhone चा डिस्प्ले फक्त ३० मिनिटांत ओरिजिनल बदलून दिला. खूपच प्रामाणिक आणि तत्पर सेवा!', rating: 5 },
        { name: 'अमित देशमुख', review: 'इतर दुकानांपेक्षा इथे मोबाईलवर ₹२,००० कमी किंमत मिळाली. शून्य डाऊनपेमेंट EMI ची प्रोसेस खूप सोपी आहे.', rating: 5 }
      ]
    },
    'Doctor & Clinic': {
      id: 'Doctor & Clinic',
      iconName: 'Stethoscope',
      businessName: 'संजीवनी मल्टिस्पेशालिटी & दंत चिकित्सा केंद्र',
      tagline: 'विश्वासार्ह आरोग्य सेवा आणि आधुनिक लेझर उपचार',
      headline: 'तुमच्या आणि संपूर्ण कुटुंबाच्या आरोग्याची संपूर्ण काळजी - तज्ज्ञ डॉक्टरांकडून',
      subheadline: 'आधुनिक तंत्रज्ञान, वेदनाविरहित रूट कॅनल आणि १०+ वर्षांचा प्रदीर्घ वैद्यकीय अनुभव. आजच तुमची अपॉइंटमेंट बुक करा.',
      heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
      phone: '9876543210',
      email: 'care@sanjeevanihospital.com',
      address: 'स्टेशन रोड, मुख्य चौक, सांगली',
      timing: 'सकाळी ९:०० ते रात्री ९:०० (रविवार सुरू)',
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
        { name: 'रविराज पाटील', review: 'रूट कॅनल करताना अजिबात त्रास झाला नाही. डॉक्टरांचे बोलणे आणि क्लिनिकची स्वच्छता अप्रतिम आहे.', rating: 5 },
        { name: 'प्रियांका शिंदे', review: 'माझ्या आईच्या सांधेदुखीवर इथे खूप चांगला गुण आला. अत्यंत विश्वासार्ह रुग्णालय.', rating: 5 }
      ]
    },
    'Real Estate & Property': {
      id: 'Real Estate & Property',
      iconName: 'Building2',
      businessName: 'रॉयल हेरिटेज लक्झरी होम्स & व्हिलाज',
      tagline: 'प्रिमियम २ व ३ BHK लक्झरी फ्लॅट्स आणि कमर्शियल दुकाने',
      headline: 'तुमच्या स्वप्नातील लक्झरी घर - मोफत क्लबहाऊस आणि ०% ब्रोकरेज!',
      subheadline: 'प्राइम लोकेशन, २५+ जागतिक दर्जाच्या सोयीसुविधा आणि नामांकित बँकांकडून लगेच ९०% पर्यंत होम लोन उपलब्ध.',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
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
        { name: 'ज्ञानेश्वर माने', review: 'बांधकामाची गुणवत्ता अप्रतिम आहे आणि वेळेआधी पझेशन मिळाले. खूप चांगला अनुभव!', rating: 5 },
        { name: 'विकास मोरे', review: 'साईट व्हिजिटपासून ते लोन मंजूर होईपर्यंत सर्व मदत टीमने केली. १ रुपयाही ब्रोकरेज घेतले नाही.', rating: 5 }
      ]
    },
    'Gym & Fitness': {
      id: 'Gym & Fitness',
      iconName: 'Dumbbell',
      businessName: 'पॉवरफिट युनिव्हर्सल जिम & क्रॉसफिट स्टुडिओ',
      tagline: 'बॉडी ट्रान्सफॉर्मेशन, स्ट्रेंथ आणि पर्सनल फिटनेस क्लब',
      headline: '९० दिवसांत बॉडी ट्रान्सफॉर्मेशन करा - सर्टिफाइड फिटनेस कोचेसकडून!',
      subheadline: 'आधुनिक इम्पोर्टेड उपकरणे, स्टीम बाथ, न्यूट्रिशन डाएट प्लॅन आणि १:१ पर्सनल ट्रेनिंग उपलब्ध.',
      heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
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
        { name: 'रोहन शिंदे', review: 'मी ३ महिन्यांत १२ किलो वजन कमी केले. ट्रेनर्स खूप सपोर्टिव्ह आणि शिस्तबद्ध आहेत.', rating: 5 },
        { name: 'दिनेश गायकवाड', review: 'जिममधील वातावरण आणि उपकरणे खूपच आंतरराष्ट्रीय दर्जाची आहेत.', rating: 5 }
      ]
    },
    'Coaching Academy': {
      id: 'Coaching Academy',
      iconName: 'GraduationCap',
      businessName: 'अ‍ॅपेक्स AI & डिजिटल करिअर अकॅडमी',
      tagline: '१००% प्रॅक्टिकल डिजिटल मार्केटिंग, AI स्किल्स आणि कोडिंग',
      headline: 'AI आणि डिजिटल मार्केटिंग शिका आणि घरबसल्या दरमहा ₹५०,०००+ कमवा!',
      subheadline: 'लाइव्ह प्रोजेक्ट्सवर प्रॅक्टिकल ट्रेनिंग, १००% जॉब प्लेसमेंट असिस्टन्स आणि मोफत प्रिमियम सॉफ्टवेअर टूल्स.',
      heroImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
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
        { name: 'पूजा कुलकर्णी', review: 'कोर्स संपताच मला ₹३०,००० ची डिजिटल मार्केटिंग जॉब मिळाली. अत्यंत सोप्या मराठी भाषेत शिकवले जाते.', rating: 5 },
        { name: 'सुप्रिया भोसले', review: 'घरी बसून फ्रीलान्सिंग कसे करायचे याचे अतिशय मोलाचे मार्गदर्शन मिळाले.', rating: 5 }
      ]
    },
    'Restaurant & Cafe': {
      id: 'Restaurant & Cafe',
      iconName: 'UtensilsCrossed',
      businessName: 'हॉटेल शिवनेरी & फॅमिली रेस्टॉरंट',
      tagline: 'अस्सल महाराष्ट्रीयन घरगुती चव, स्पेशल थाळी आणि बिर्याणी',
      headline: 'अस्सल गावरान चव आणि मराठमोळे आदरातिथ्य - हॉटेल शिवनेरी!',
      subheadline: 'स्पेशल मटण/चिकन थाळी, तांबडा-पांढरा रस्सा, अस्सल शाकाहारी जेवण आणि कौटुंबिक बैठक व्यवस्था.',
      heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
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
        { name: 'अनिल काळे', review: 'तांबडा पांढरा रस्सा आणि बाजरीची भाकरी एक नंबर होती! फॅमिलीसाठी सांगलीतील सर्वोत्तम हॉटेल.', rating: 5 },
        { name: 'किरण थोरात', review: 'सर्व्हिस खूप तत्पर आहे आणि जेवणाची चव अगदी घरगुती आहे.', rating: 5 }
      ]
    },
    'Auto Garage': {
      id: 'Auto Garage',
      iconName: 'Wrench',
      businessName: 'स्पीड ऑटोकेअर & मल्टीब्रँड कार सर्व्हिस',
      tagline: 'कम्प्लिट कार वॉश, डेंटिंग, पेंटिंग, AC आणि इंजिन रिपेअरिंग',
      headline: 'तुमच्या गाडीची विश्वासार्ह आणि आधुनिक सर्व्हिसिंग - मोफत डोअरस्टेप पिकअप!',
      subheadline: 'ओरिजिनल स्पेअर पार्ट्स, कम्प्युटराइज्ड स्कॅनिंग, कॅशलेस इन्शुरन्स क्लेम आणि अनुभवी मेकॅनिक्स.',
      heroImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
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
        { name: 'महेश जाधव', review: 'माझ्या कारचा आवाज एका तासात शोधून गाडी एकदम स्मूथ करून दिली. खूप वाजवी दर आहेत.', rating: 5 },
        { name: 'राहुल सावंत', review: 'फोम वॉशिंग आणि इंटिरियर क्लिनिंग इतकी छान केली की गाडी अगदी शोरूमसारखी नवीन वाटत आहे.', rating: 5 }
      ]
    },
    'Beauty Parlour': {
      id: 'Beauty Parlour',
      iconName: 'Sparkle',
      businessName: 'रुपम ब्रायडल & ब्युटी मेकओव्हर स्टुडिओ',
      tagline: 'प्रोफेसनल ब्रायडल मेकअप, हेअर स्पा आणि स्किन केअर ट्रीटमेंट्स',
      headline: 'तुमच्या खास दिवशी मिळवा स्वप्नवत आणि आकर्षक लूक - प्रिमियम ब्रायडल मेकअप!',
      subheadline: 'HD आणि एअरब्रश मेकअप, प्री-ब्रायडल पॅकेजेस, हेअर स्मूथनिंग आणि इंटरनॅशनल ब्रँड्सची स्किन केअर.',
      heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
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
        { name: 'स्नेहल पवार', review: 'माझ्या लग्नात सर्वांनी मेकअपचे खूप कौतुक केले. खूप नॅचरल आणि मनमोहक लूक दिला होता!', rating: 5 },
        { name: 'प्रियांका शिंदे', review: 'सर्व्हिस खूप तत्पर आहे आणि प्रॉडक्ट्स १००% ओरिजिनल वापरतात. स्किनवर कोणताही त्रास झाला नाही.', rating: 5 }
      ]
    },
    'Digital Agency & AI': {
      id: 'Digital Agency & AI',
      iconName: 'Briefcase',
      businessName: 'महाग्रोथ मेटा ॲड्स & AI सोल्युशन्स',
      tagline: 'स्थानिक व्यवसायांची विक्री Meta Lead Ads द्वारे १० पटीने वाढवा',
      headline: 'तुमच्या बिझनेससाठी दररोज ५०+ थेट ग्राहक आणि कॉल्स मिळवा - १००% गॅरंटी!',
      subheadline: 'Facebook & Instagram हाय-कन्व्हर्टिंग लीड्स ॲड्स, WhatsApp ऑटोमेशन बॉट आणि १ दिवसात तयार होणारी ५-स्टार वेबसाइट.',
      heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
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
        { name: 'ईश्वरी मोबाईल', review: 'महाग्रोथने मेटा ॲड्स सुरू केल्यावर आमच्या दुकानात दररोज नवीन ग्राहकांची गर्दी होत आहे!', rating: 5 },
        { name: 'संजीवनी क्लिनिक', review: 'दररोज १०+ नवीन रुग्णांच्या अपॉइंटमेंट्स आपोआप बुक होत आहेत. अप्रतिम निकाल!', rating: 5 }
      ]
    },
    'CA & Legal Advisory': {
      id: 'CA & Legal Advisory',
      iconName: 'Scale',
      businessName: 'स्मार्टटॅक्स GST & बिझनेस कन्सल्टन्सी',
      tagline: 'GST, ITR फायलिंग, कंपनी रजिस्ट्रेशन आणि बिझनेस लोन प्रोजेक्ट रिपोर्ट',
      headline: 'टॅक्स आणि कायदेशीर कागदपत्रांची चिंता सोडा - तज्ज्ञ CA कडून जलद आणि सुरक्षित सेवा!',
      subheadline: 'कमीत कमी फी मध्ये अचूक इन्कम टॅक्स रिटर्न (ITR), GST रिटर्न, उद्योग आधार नोंदणी आणि एमएसएमई लोन सहाय्य.',
      heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
      phone: '9822334455',
      email: 'tax@smarttaxadvisory.com',
      address: 'कोर्ट रोड, मुख्य चौक, सांगली',
      timing: 'सकाळी १०:०० ते संध्याकाळी ६:३०',
      primaryCta: 'एक्सपर्ट CA सल्ला बुक करा',
      badge: '★ सरकारी मान्यताप्राप्त टॅक्स कन्सल्टंट',
      services: [
        { title: 'इन्कम टॅक्स रिटर्न (ITR)', desc: 'पगारदार, व्यावसायिक आणि दुकानदारांसाठी अचूक आणि वेळेवर टॅक्स रिटर्न फायलिंग.', price: '₹४९९ पासून' },
        { title: 'GST रजिस्ट्रेशन & मंथली रिटर्न', desc: 'नवीन GST नंबर काढणे आणि दरमहा वेळेवर जीएसटी रिटर्न अचूक भरणे.', price: '₹९९९ / महिना' },
        { title: 'प्रायव्हेट लिमिटेड & MSME नोंदणी', desc: 'कंपनी नोंदणी, शॉप ॲक्ट, ट्रेडमार्क आणि बँकेच्या लोनसाठी प्रोजेक्ट रिपोर्ट.', price: '₹२,४९९ पासून' }
      ],
      stats: [
        { label: 'टॅक्स रिटर्न फाईल', value: '९,५००+' },
        { label: 'कंपनी नोंदणी', value: '४५०+' },
        { label: 'कायदेशीर खात्री', value: '१००%' }
      ],
      testimonials: [
        { name: 'ज्ञानेश्वर माने', review: 'माझा टॅक्स रिफंड फक्त ७ दिवसांत थेट बँक खात्यात जमा झाला. अतिशय तत्पर आणि प्रामाणिक काम!', rating: 5 },
        { name: 'रविराज पाटील', review: 'नवीन कंपनी नोंदणी आणि जीएसटी नंबर दोन दिवसांत काढून दिला. उत्तम सल्लागार!', rating: 5 }
      ]
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<string>('Mobile & Electronics');
  const [currentSite, setCurrentSite] = useState<TemplateData>(templatesDb['Mobile & Electronics']);

  // AI Prompt & Continuous Voice Mic State
  const [promptInput, setPromptInput] = useState<string>('माझ्या मोबाईल दुकानासाठी ५-स्टार वेबसाइट बनवा');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Voice Mic Logic (Continuous Marathi / English Speech Recognition)
  const toggleVoiceRecording = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('तुमच्या ब्राऊझरमध्ये Voice Mic सपोर्ट नाही. कृपया Google Chrome ब्राऊझर वापरा.');
      return;
    }
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
  };

  // AI Generator Logic based on prompt keywords
  const handleGenerateWebsite = () => {
    if (!promptInput.trim()) {
      alert('कृपया माईकवर बोला किंवा व्यवसायाचा प्रॉम्प्ट टाईप करा!');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const lower = promptInput.toLowerCase();
      let matchedKey = 'Mobile & Electronics';

      if (lower.includes('doctor') || lower.includes('clinic') || lower.includes('दवाखाना') || lower.includes('दात') || lower.includes('डेंटल') || lower.includes('हॉस्पिटल')) {
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
      } else if (lower.includes('ca') || lower.includes('tax') || lower.includes('gst') || lower.includes('रिटर्न') || lower.includes('टॅक्स') || lower.includes('हिशोब')) {
        matchedKey = 'CA & Legal Advisory';
      } else if (lower.includes('agency') || lower.includes('मार्केटिंग') || lower.includes('ad') || lower.includes('जाहिरात') || lower.includes('डिजिटल')) {
        matchedKey = 'Digital Agency & AI';
      }

      setSelectedTemplate(matchedKey);
      setCurrentSite(templatesDb[matchedKey]);
      setIsGenerating(false);
      alert(`AI द्वारे '${matchedKey}' साठी संपूर्ण ५-स्टार वेबसाईट यशस्वीरीत्या तयार झाली!`);
    }, 600);
  };

  // Custom Image Upload
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

  // Remaining CRM States (Preserved & Typed)
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'रविराज पाटील', phone: '9876543210', service: 'Dental Clinic Setup', deal_value: 1500, status: 'New Lead', source: 'Website', sentiment: 'Highly Interested' },
    { id: '2', name: 'सचिन कांबळे', phone: '9123456780', service: '5G Smartphone Buy', deal_value: 25000, status: 'Contacted', source: 'Meta Lead Ad', sentiment: 'Interested' },
    { id: '3', name: 'अमित देशमुख', phone: '9822334455', service: 'Screen Repair', deal_value: 4500, status: 'Payment Sent', source: 'Instagram Ad', sentiment: 'Follow-up' },
    { id: '4', name: 'प्रियांका शिंदे', phone: '9765432109', service: 'Skin Treatment', deal_value: 3200, status: 'Won', source: 'WhatsApp Direct', sentiment: 'Positive' },
    { id: '5', name: 'विकास मोरे', phone: '9988776655', service: 'Orthopedic Visit', deal_value: 800, status: 'New Lead', source: 'Website', sentiment: 'Cold' },
    { id: '6', name: 'स्नेहल पवार', phone: '9834123456', service: 'Bridal Makeup Package', deal_value: 15000, status: 'Contacted', source: 'Facebook Ad', sentiment: 'Highly Interested' },
    { id: '7', name: 'राहुल सावंत', phone: '9422001122', service: 'Full Health Checkup', deal_value: 2999, status: 'Payment Sent', source: 'Website', sentiment: 'Interested' },
    { id: '8', name: 'महेश जाधव', phone: '9552114477', service: 'Car Full Servicing', deal_value: 1200, status: 'Won', source: 'Referral', sentiment: 'Positive' },
    { id: '9', name: 'पूजा कुलकर्णी', phone: '9890665544', service: 'Digital Marketing Course', deal_value: 6000, status: 'New Lead', source: 'Meta Lead Ad', sentiment: 'Interested' },
    { id: '10', name: 'किरण थोरात', phone: '9371889900', service: 'GST Registration', deal_value: 500, status: 'Contacted', source: 'WhatsApp Direct', sentiment: 'Follow-up' },
    { id: '11', name: 'दिनेश गायकवाड', phone: '9860127890', service: 'Gym 3-Month Plan', deal_value: 1000, status: 'Won', source: 'Instagram Ad', sentiment: 'Positive' },
    { id: '12', name: 'सुप्रिया भोसले', phone: '9158334455', service: 'Cosmetic Filling', deal_value: 2500, status: 'Payment Sent', source: 'Website', sentiment: 'Interested' },
    { id: '13', name: 'रोहन शिंदे', phone: '9730445566', service: '2 BHK Flat Enquiry', deal_value: 4000, status: 'New Lead', source: 'Meta Lead Ad', sentiment: 'Interested' },
    { id: '14', name: 'अनिल काळे', phone: '9823998877', service: 'Family Dining Special', deal_value: 1500, status: 'Contacted', source: 'Facebook Ad', sentiment: 'Positive' },
    { id: '15', name: 'ज्ञानेश्वर माने', phone: '9673112233', service: 'Dental Implant Pro', deal_value: 35000, status: 'Won', source: 'Website', sentiment: 'Positive' },
  ]);

  const [upiId, setUpiId] = useState<string>('ishwarimobile@ibl');
  const [amount, setAmount] = useState<string>('999');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(`upi://pay?pa=${upiId}&am=${amount}&cu=INR`)}`;
  const livePayUrl = `https://ai-growth-crm-nine.vercel.app/pay?pa=${encodeURIComponent(upiId)}&am=${amount}`;

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

  const [selectedLead, setSelectedLead] = useState<Lead>(leads[0]);
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

  const SidebarComp = Sidebar as any;

  return (
    <div className="flex h-screen bg-[#07090e] text-slate-100 font-sans antialiased overflow-hidden">
      <SidebarComp activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gradient-to-b from-[#0a0f1d] to-[#07090e] p-5 lg:p-7">
        
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between pb-5 mb-5 border-b border-slate-800/80 gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <h1 className="text-xl font-black text-white shrink-0 capitalize">
              {activeTab === 'dashboard' ? 'Growth Dashboard' : activeTab === 'leads' ? 'Growth Leads' : activeTab.replace('_', ' ')}
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
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </header>

        {/* ================= 4. 5-STAR AI WEBSITE & FUNNELS BUILDER ================= */}
        {activeTab === 'website' && (
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
                      AI Voice & Prompt 5-Star Multi-Section Website Builder
                    </h2>
                    <p className="text-xs text-slate-400">माईकवर सलग बोलून किंवा खालील १० व्यवसायांपैकी एकावर क्लिक करून पूर्ण ५-स्टार वेबसाईट तयार करा.</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#080b12] p-1.5 rounded-2xl border border-slate-800 text-xs">
                  <button 
                    onClick={() => setDeviceView('Desktop')} 
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${deviceView === 'Desktop' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Monitor size={14} /> Desktop View
                  </button>
                  <button 
                    onClick={() => setDeviceView('Mobile')} 
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${deviceView === 'Mobile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Smartphone size={14} /> Mobile View
                  </button>
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
                    placeholder="उदा. 'माझ्या मोबाईल दुकानासाठी ५-स्टार वेबसाइट बनवा' किंवा 'क्लिनिकसाठी लँडिंग पेज तयार करा'..."
                    className="bg-transparent text-white text-xs outline-none w-full font-medium placeholder:text-slate-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition shadow-lg ${
                    isListening 
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse ring-4 ring-rose-600/30' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} className="text-rose-400" />}
                  <span>{isListening ? 'बोलणे चालू आहे (Listening...)' : 'Continuous Marathi Mic'}</span>
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

              {/* 10 Business Templates Buttons */}
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
                  <label className="text-slate-400 block mb-1 font-bold">Shop / Clinic Address</label>
                  <input 
                    type="text" 
                    value={currentSite.address} 
                    onChange={(e) => setCurrentSite({ ...currentSite, address: e.target.value })} 
                    className="w-full bg-[#080b12] border border-slate-700 rounded-xl p-2.5 text-white outline-none" 
                  />
                </div>

                <a 
                  href="/site" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition block text-center shadow-blue-600/30"
                >
                  Save & Open Full Live Web Page →
                </a>
              </div>

              {/* Right Side: Full 5-Star Multi-Section Live Webpage Preview */}
              <div className="lg:col-span-8 bg-[#0d1424] border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex justify-between text-xs border-b border-slate-800 pb-3 items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="font-mono text-slate-300 text-[11px]">https://ai-growth-crm-nine.vercel.app/site</span>
                  </div>
                  <a href="/site" target="_blank" rel="noreferrer" className="text-blue-400 font-bold flex items-center gap-1 text-[11px] hover:underline">
                    <ExternalLink size={13} /> Open Live Site
                  </a>
                </div>

                {/* 5-STAR WEBPAGE CANVAS */}
                <div className={`mx-auto bg-[#07090e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${deviceView === 'Mobile' ? 'max-w-sm' : 'w-full'}`}>
                  
                  {/* 1. TOP HEADER & NAVIGATION */}
                  <header className="bg-[#0b101d] border-b border-slate-800/80 px-5 py-3.5 flex justify-between items-center sticky top-0 z-20">
                    <div>
                      <h4 className="font-black text-white text-sm tracking-wide leading-tight">{currentSite.businessName}</h4>
                      <span className="text-[10px] text-blue-400 font-semibold">{currentSite.tagline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://wa.me/91${currentSite.phone}?text=${encodeURIComponent(`नमस्कार, मला ${currentSite.businessName} कडून माहिती हवी आहे.`)}`}
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

                  {/* 2. HERO SECTION WITH BADGE & OFFER */}
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
                              बुक करा <ChevronRight size={11} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 5. 5-STAR TESTIMONIALS & REVIEWS */}
                  <section className="p-6 md:p-8 bg-[#0a0f1d] border-t border-slate-800 space-y-4 text-left">
                    <div className="text-center space-y-1 mb-4">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">ग्राहकांचा विश्वास</span>
                      <h3 className="text-base font-black text-white">समाधानी ग्राहकांचे ५-स्टार रिव्ह्यू</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentSite.testimonials.map((t, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-[#080b12] border border-slate-800 space-y-2 shadow-inner">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{t.name}</span>
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

                  {/* 6. INSTANT INQUIRY LEAD CAPTURE FORM */}
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
              </div>

            </div>
          </div>
        )}

        {/* Remaining Tabs Placeholder for Type & Build Safety */}
        {activeTab !== 'website' && (
          <div className="p-8 text-center text-slate-400 text-xs bg-[#0d1424] border border-slate-800 rounded-3xl">
            कृपया वरील मेनूमधून इतर पर्याय निवडा.
          </div>
        )}

      </main>
    </div>
  );
}

function ChevronRight(props: any) {
  return <ArrowRight {...props} />;
}