"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  PlusCircle, 
  ChevronRight, 
  Mic, 
  Layers, 
  MapPin, 
  TrendingUp, 
  Database, 
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Shield,
  Users,
  UserCircle,
  Briefcase,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const translations = {
  en: {
    badge: "Next-Generation Civic Intelligence",
    heroTitle: "Transform Citizen Voices into Data-Driven Development Priorities",
    heroDesc: "AI-powered multilingual platform helping MPs identify and prioritize real citizen needs using demand intelligence, public data, and explainable AI.",
    btnSubmit: "Submit a Suggestion",
    btnDashboard: "Login",
    featuresTitle: "Platform Features Built on Google Tech",
    featuresSub: "Leveraging advanced Gemini 2.5 Flash and Geolocation APIs to automate and refine local development workflows.",
    stepsTitle: "The Intelligence Pipeline",
    stepsSub: "How CivicPulse AI ingests raw unstructured voice data and resolves them into structured prioritizations.",
    impactTitle: "Designed for Transparency and Speed",
    impactDesc: "By bypassing bureaucratic paperwork, we ensure that underrepresented communities have a voice, and that government investments are optimized where need is highest.",
    btnExplore: "Explore prioritizations",
    
    // Feature list
    f1Title: "Voice & Multilingual Input",
    f1Desc: "Allows citizens to submit requests in Telugu, Hindi, or English via text or voice message.",
    f2Title: "AI Demand Clustering",
    f2Desc: "Gemini automatically aggregates duplicate complaints and groups similar requests together.",
    f3Title: "Geo-Spatial Heatmaps",
    f3Desc: "Visualizes demand clusters as geographic hotspots on an interactive, prioritized map layout.",
    f4Title: "Explainable Priority Engine",
    f4Desc: "Scores requests out of 100 based on citizen count, service gaps, and national alignment.",
    f5Title: "Public Data Validation",
    f5Desc: "Validates local infrastructure needs using census population databases and distance maps.",
    f6Title: "AI Image Analysis",
    f6Desc: "Processes pictures to verify pothole severity, broken streetlights, or school structure damage.",

    // Steps list
    s1Title: "Citizen Submits Request",
    s1Desc: "Citizen submits voice, text, or photo from their mobile device.",
    s2Title: "Gemini AI Processes",
    s2Desc: "API handles transcription, translates language, and categorizes complaints.",
    s3Title: "Smart Clustering Groups",
    s3Desc: "Duplicates are filtered out and similar issues are grouped into clusters.",
    s4Title: "Constituency Map Heatspot",
    s4Desc: "Demands are pinned geographically to highlight high-urgency zones.",
    s5Title: "Census & Data Check",
    s5Desc: "Algorithm correlates claims with actual local infrastructure gaps.",
    s6Title: "MP Prioritized Ranking",
    s6Desc: "The MP receives a ranked list of projects with explainable priority scores."
  },
  hi: {
    badge: "अगली पीढ़ी की नागरिक खुफिया प्रणाली",
    heroTitle: "नागरिकों की आवाज़ों को डेटा-संचालित विकास प्राथमिकताओं में बदलें",
    heroDesc: "सांसदों को मांग खुफिया, सार्वजनिक डेटा और स्पष्ट करने योग्य एआई का उपयोग करके वास्तविक नागरिक आवश्यकताओं की पहचान करने और उन्हें प्राथमिकता देने में मदद करने वाला एआई-संचालित बहुभाषी मंच।",
    btnSubmit: "सुझाव प्रस्तुत करें",
    btnDashboard: "लॉग इन करें",
    featuresTitle: "गूगल तकनीक पर निर्मित प्लेटफॉर्म विशेषताएं",
    featuresSub: "स्थानीय विकास कार्यप्रवाह को स्वचालित और परिष्कृत करने के लिए उन्नत जेमिनी 2.5 फ्लैश और जियोलोकेशन एपीआई का लाभ उठाना।",
    stepsTitle: "खुफिया पाइपलाइन",
    stepsSub: "सिविकपल्स एआई कैसे कच्चे असंरचित वॉयस डेटा को ग्रहण करता है और उन्हें संरचित प्राथमिकताओं में हल करता है।",
    impactTitle: "पारदर्शिता और गति के लिए डिज़ाइन किया गया",
    impactDesc: "नौकरशाही कागजी कार्रवाई को दरकिनार करके, हम यह सुनिश्चित करते हैं कि कम प्रतिनिधित्व वाले समुदायों की बात सुनी जाए, और सरकारी निवेश वहां अनुकूलित किया जाए जहां सबसे अधिक आवश्यकता है।",
    btnExplore: "प्राथमिकताएं खोजें",

    f1Title: "आवाज और बहुभाषी इनपुट",
    f1Desc: "नागरिकों को तेलुगु, हिंदी या अंग्रेजी में टेक्स्ट या वॉयस संदेश के माध्यम से अनुरोध प्रस्तुत करने की अनुमति देता है।",
    f2Title: "एआई मांग क्लस्टरिंग",
    f2Desc: "जेमिनी स्वचालित रूप से डुप्लिकेट शिकायतों को एकत्रित करता है और समान अनुरोधों को एक साथ समूहित करता है।",
    f3Title: "भू-स्थानिक हीटमैप",
    f3Desc: "एक इंटरैक्टिव, प्राथमिकता वाले मानचित्र लेआउट पर मांग क्लस्टर को भौगोलिक हॉटस्पॉट के रूप में विज़ुअलाइज़ करता है।",
    f4Title: "स्पष्ट करने योग्य प्राथमिकता इंजन",
    f4Desc: "नागरिकों की संख्या, सेवा अंतराल और राष्ट्रीय संरेखण के आधार पर 100 में से अनुरोधों को स्कोर करता है।",
    f5Title: "सार्वजनिक डेटा सत्यापन",
    f5Desc: "जनगणना जनसंख्या डेटाबेस और दूरी मानचित्रों का उपयोग करके स्थानीय बुनियादी ढांचे की जरूरतों को सत्यापित करता है।",
    f6Title: "एआई छवि विश्लेषण",
    f6Desc: "गड्ढों की गंभीरता, टूटी हुई स्ट्रीटलाइट्स, या स्कूल संरचना क्षति को सत्यापित करने के लिए चित्रों को संसाधित करता है।",

    s1Title: "नागरिक अनुरोध प्रस्तुत करता है",
    s1Desc: "नागरिक अपने मोबाइल डिवाइस से आवाज, पाठ या फोटो जमा करता है।",
    s2Title: "जेमिनी एआई प्रक्रियाएं",
    s2Desc: "एपीआई ट्रांसक्रिप्शन संभालता है, भाषा का अनुवाद करता है, और शिकायतों को वर्गीकृत करता है।",
    s3Title: "स्मार्ट क्लस्टरिंग समूह",
    s3Desc: "डुप्लिकेट को फ़िल्टर किया जाता है और समान समस्याओं को क्लस्टर में समूहित किया जाता है।",
    s4Title: "निर्वाचन क्षेत्र का नक्शा हॉटस्पॉट",
    s4Desc: "उच्च तात्कालिकता वाले क्षेत्रों को उजागर करने के लिए मांगों को भौगोलिक रूप से पिन किया जाता है।",
    s5Title: "जनगणना और डेटा जांच",
    s5Desc: "एल्गोरिथ्म वास्तविक स्थानीय बुनियादी ढांचे के अंतराल के साथ दावों को सहसंबंधित करता है।",
    s6Title: "सांसद प्राथमिकता रैंकिंग",
    s6Desc: "सांसद को स्पष्ट प्राथमिकता स्कोर के साथ परियोजनाओं की एक क्रमबद्ध सूची प्राप्त होती है।"
  },
  te: {
    badge: "తదుపరి తరం పౌర విశ్లేషణ వ్యవస్థ",
    heroTitle: "పౌరుల గొంతుకలను డేటా ఆధారిత అభివృద్ధి ప్రాధాన్యతలుగా మార్చండి",
    heroDesc: "డిమాండ్ ఇంటెలిజెన్స్, పబ్లిక్ డేటా మరియు వివరించదగిన AIని ఉపయోగించి నిజమైన పౌరుల అవసరాలను గుర్తించడంలో మరియు ప్రాధాన్యత ఇవ్వడంలో ఎంపీలకు సహాయపడే AI-ఆధారిత బహుభాషా వేదిక.",
    btnSubmit: "సూచనను సమర్పించండి",
    btnDashboard: "లాగిన్ చేయండి",
    featuresTitle: "గూగుల్ టెక్నాలజీతో నిర్మించిన ప్లాట్‌ఫారమ్ ఫీచర్లు",
    featuresSub: "స్థానిక అభివృద్ధి పనులను స్వయంచాలకంగా మరియు పారదర్శకంగా చేయడానికి అధునాతన జెమిని 2.5 ఫ్లాష్ మరియు జియోలొకేషన్ APIలను ఉపయోగించడం.",
    stepsTitle: "పౌర విశ్లేషణ విధానం",
    stepsSub: "సివిక్‌పల్స్ AI ముడి వాయిస్ డేటాను ఎలా స్వీకరించి, వాటిని క్రమబద్ధమైన ప్రాధాన్యతలుగా మారుస్తుందో వివరణ.",
    impactTitle: "పారదర్శకత మరియు వేగం కోసం రూపొందించబడింది",
    impactDesc: "అధికారిక వ్రాతపనిని దాటవేయడం ద్వారా, తక్కువ ప్రాతినిధ్యం ఉన్న వర్గాలకు గొంతు లభిస్తుందని మరియు ప్రభుత్వ పెట్టుబడులు అత్యంత అవసరమైన చోట సద్వినియోగం అవుతాయని మేము నిర్ధారిస్తాము.",
    btnExplore: "ప్రాధాన్యతలను అన్వేషించండి",

    f1Title: "వాయిస్ & బహుభాషా ఇన్‌పుట్",
    f1Desc: "పౌరులు తెలుగు, హిందీ లేదా ఇంగ్లీషులో వచన లేదా వాయిస్ సందేశం ద్వారా అభ్యర్థనలను సమర్పించడానికి అనుమతిస్తుంది.",
    f2Title: "AI డిమాండ్ క్లస్టరింగ్",
    f2Desc: "జెమిని స్వయంచాలకంగా నకిలీ ఫిర్యాదులను నివారిస్తుంది మరియు ఒకే రకమైన సమస్యలను ఒక సమూహంగా మారుస్తుంది.",
    f3Title: "జియో-స్పేషియల్ హీట్‌మ్యాప్స్",
    f3Desc: "ఇంటరాక్టివ్ మరియు ప్రాధాన్యత కలిగిన మ్యాప్ లేఅవుట్‌లో డిమాండ్ క్లస్టర్‌లను భౌగోళిక హాట్‌స్పాట్‌లుగా చూపుతుంది.",
    f4Title: "వివరించదగిన ప్రాధాన్యత ఇంజిన్",
    f4Desc: "పౌరుల సంఖ్య, సేవా లోపాలు మరియు జాతీయ అమరిక ఆధారంగా అభ్యర్థనలను 100కి స్కోర్ చేస్తుంది.",
    f5Title: "పబ్లిక్ డేటా ధృవీకరణ",
    f5Desc: "స్థానిక జనాభా లెక్కల డేటాబేస్ మరియు దూరం మ్యాప్‌లను ఉపయోగించి స్థానిక మౌలిక सదుపాయాల అవసరాలను ధృవీకరిస్తుంది.",
    f6Title: "AI చిత్ర విశ్లేషణ",
    f6Desc: "రోడ్ల గుంతల తీవ్రత, విరిగిన వీధి దీపాలు లేదా పాఠశాల నిర్మాణ నష్టాన్ని ధృవీకరించడానికి చిత్రాలను విశ్లేషిస్తుంది.",

    s1Title: "పౌరుడు అభ్యర్థన సమర్పణ",
    s1Desc: "పౌరుడు తన మొబైల్ పరికరం నుండి వాయిస్, టెక్స్ట్ లేదా ఫోటోను సమర్పిస్తాడు.",
    s2Title: "జెమిని AI ప్రక్రియలు",
    s2Desc: "లిప్యంతరీకరణ, भाषा అనువాదం మరియు ఫిర్యాదుల వర్గీకరణను API నిర్వహిస్తుంది.",
    s3Title: "స్మార్ట్ క్లస్టరింగ్ సమూహాలు",
    s3Desc: "నకిలీలు ఫిల్టర్ చేయబడి, ఒకే రకమైన సమస్యలు క్లస్టర్‌లుగా వర్గీకరించబడతాయి.",
    s4Title: "నియోజకవర్గ మ్యాప్ హాట్‌స్పాట్",
    s4Desc: "అత్యవసర మండలాలను హైలైట్ చేయడానికి డిమాండ్లు భౌగోళికంగా పిన్ చేయబడతాయి.",
    s5Title: "జనాభా గణన & డేటా తనిఖీ",
    s5Desc: "స్థానిక మౌలిక సదుపాయాల వాస్తవ లోపాలతో క్లెయిమ్‌లను అల్గారిథమ్ సరిపోల్చుతుంది.",
    s6Title: "ఎంపీ ప్రాధాన్యత ర్యాంకింగ్",
    s6Desc: "ఎంపీ ప్రాజెక్ట్‌ల వివరణాత్మక ప్రాధాన్యత స్కోర్‌లతో కూడిన జాబితాను పొందుతారు."
  },
  ta: {
    badge: "அடுத்த தலைமுறை குடிமை நுண்ணறிவு",
    heroTitle: "குடிமக்களின் குரல்களை தரவு சார்ந்த மேம்பாட்டு முன்னுரிமைகளாக மாற்றவும்",
    heroDesc: "எம்பிக்கள் தங்களின் தொகுதியின் தேவைகளைக் கண்டறிந்து முன்னுரிமை அளிக்க உதவும் வகையில், Gemini AI மற்றும் மக்கள்தொகை கணக்கெடுப்புத் தரவுகளை ஒருங்கிணைக்கும் மேம்பட்ட தளம்.",
    btnSubmit: "பரிந்துரையை சமர்ப்பிக்கவும்",
    btnDashboard: "உள்நுழைய",
    featuresTitle: "கூகுள் தொழில்நுட்பத்தில் உருவாக்கப்பட்ட தளத்தின் அம்சங்கள்",
    featuresSub: "உள்ளூர் உள்கட்டமைப்பு மேம்பாடுகளை எளிமையாக்க மேம்பட்ட Gemini 2.5 Flash மற்றும் Geolocation APIகளைப் பயன்படுத்துதல்.",
    stepsTitle: "நுண்ணறிவு முறைமை",
    stepsSub: "சிவிக்பல்ஸ் AI எவ்வாறு குடிமக்களின் குரல் பதிவை பெற்று முன்னுரிமை பட்டியலாக மாற்றுகிறது என்ற விளக்கம்.",
    impactTitle: "வெளிப்படைத்தன்மை மற்றும் வேகத்திற்காக வடிவமைக்கப்பட்டது",
    impactDesc: "அதிகாரத்துவ ஆவணங்களை புறக்கணிப்பதன் மூலம், குறைந்த பிரதிநிதித்துவம் உள்ள சமூகங்களுக்கு குரல் கிடைப்பதை உறுதிசெய்கிறோம், மேலும் அரசு முதலீடுகள் தேவை அதிகம் உள்ள இடங்களில் மேம்படுத்தப்படுகின்றன.",
    btnExplore: "முன்னரிமைகளை ஆராயுங்கள்",

    f1Title: "குரல் மற்றும் பன்மொழி உள்ளீடு",
    f1Desc: "குடிமக்கள் தெலுங்கு, இந்தி அல்லது ஆங்கிலத்தில் உரை அல்லது குரல் செய்தி மூலம் கோரிக்கைகளை சமர்ப்பிக்க அனுமதிக்கிறது.",
    f2Title: "AI தேவை கிளஸ்டரிங்",
    f2Desc: "ஜெமினி தானாகவே நகல் புகார்களைக் களைந்து, ஒத்த கோரிக்கைகளை ஒன்றாகக் குழுவாக்குகிறது.",
    f3Title: "புவியியல் வெப்ப வரைபடங்கள்",
    f3Desc: "உள்நாட்டு வரைபடத்தில் தேவைகளைக் கண்டறிந்து முன்னுரிமை இடங்களை புவியியல் ரீதியாகக் காட்டுகிறது.",
    f4Title: "விளக்கக்கூடிய முன்னுரிமை இயந்திரம்",
    f4Desc: "குடிமக்களின் எண்ணிக்கை, சேவை இடைவெளிகள் ஆகியவற்றின் அடிப்படையில் கோரிக்கைகளை 100க்கு மதிப்பிடுகிறது.",
    f5Title: "பொது தரவு சரிபார்ப்பு",
    f5Desc: "மக்கள்தொகை கணக்கெடுப்பு தரவுத்தளங்கள் மற்றும் தூர வரைபடங்களைப் பயன்படுத்தி உள்ளூர் தேவைகளைச் சரிபார்க்கிறது.",
    f6Title: "AI பட பகுப்பாய்வு",
    f6Desc: "சாலைப் பள்ளங்களின் தீவிரம், உடைந்த தெருவிளக்குகள் அல்லது பள்ளிச் சேதங்களைச் சரிபார்க்க படங்களை பகுப்பாய்வு செய்கிறது.",

    s1Title: "குடிமகன் கோரிக்கையை சமர்ப்பிக்கிறார்",
    s1Desc: "குடிமகன் தனது மொபைலில் இருந்து குரல், உரை அல்லது புகைப்படத்தை சமர்ப்பிக்கிறார்.",
    s2Title: "ஜெமினி AI செயலாக்கம்",
    s2Desc: "படியெடுத்தல், மொழிபெயர்ப்பு மற்றும் புகார்களை வகைப்படுத்துவதை API செய்கிறது.",
    s3Title: "ஸ்மார்ட் கிளஸ்டரிங் குழுக்கள்",
    s3Desc: "நகல்கள் வடிகட்டப்பட்டு, ஒத்த சிக்கல்கள் குழுக்களாகப் பிரிக்கப்படுகின்றன.",
    s4Title: "தொகுதி வரைபட ஹாட்ஸ்பாட்",
    s4Desc: "அவசரத் தேவைகளைக் குறிக்க கோரிக்கைகள் வரைபடத்தில் புவியியல் ரீதியாகப் பின்கோடிடப்படுகின்றன.",
    s5Title: "மக்கள் தொகை கணக்கெடுப்பு & தரவு சரிபார்ப்பு",
    s5Desc: "உள்ளூர் உள்கட்டமைப்பு இடைவெளிகளுடன் அல்காரிதம் கோரிக்கைகளை ஒப்பிடுகிறது.",
    s6Title: "எம்பி முன்னுரிமை தரவரிசை",
    s6Desc: "நாடாளுமன்ற உறுப்பினர் திட்டங்களின் முன்னுரிமை மதிப்பெண்களுடன் கூடிய பட்டியலைப் பெறுவார்."
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "hi" | "te" | "ta">("en");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    setLang((localStorage.getItem("civicpulse_lang") as any) || "en");

    const handleLangChange = () => {
      setLang((localStorage.getItem("civicpulse_lang") as any) || "en");
    };
    window.addEventListener("language-change", handleLangChange);
    return () => window.removeEventListener("language-change", handleLangChange);
  }, []);

  const copy = translations[lang] || translations.en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const features = [
    { icon: Mic, title: copy.f1Title, description: copy.f1Desc },
    { icon: Layers, title: copy.f2Title, description: copy.f2Desc },
    { icon: MapPin, title: copy.f3Title, description: copy.f3Desc },
    { icon: TrendingUp, title: copy.f4Title, description: copy.f4Desc },
    { icon: Database, title: copy.f5Title, description: copy.f5Desc },
    { icon: ImageIcon, title: copy.f6Title, description: copy.f6Desc }
  ];

  const steps = [
    { number: "01", title: copy.s1Title, desc: copy.s1Desc },
    { number: "02", title: copy.s2Title, desc: copy.s2Desc },
    { number: "03", title: copy.s3Title, desc: copy.s3Desc },
    { number: "04", title: copy.s4Title, desc: copy.s4Desc },
    { number: "05", title: copy.s5Title, desc: copy.s5Desc },
    { number: "06", title: copy.s6Title, desc: copy.s6Desc }
  ];

  const metrics = [
    { icon: Clock, value: "85%", label: "Faster Decision Making", color: "text-blue-600 bg-blue-50" },
    { icon: Shield, value: "100%", label: "Transparent Prioritization", color: "text-emerald-600 bg-emerald-50" },
    { icon: Database, value: "4 Villages", label: "Seeded Planning Data", color: "text-indigo-600 bg-indigo-50" },
    { icon: Users, value: "Inclusive", label: "Citizen Participation", color: "text-purple-600 bg-purple-50" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-28 dot-grid border-b border-slate-200/50 bg-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/40 via-transparent to-emerald-50/30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Tagline pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-6 font-outfit">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {copy.badge}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-outfit font-extrabold text-slate-800 tracking-tight leading-tight">
              {copy.heroTitle.split(" ").map((w, idx) => {
                if (w.toLowerCase() === "data-driven" || w.includes("డేటా") || w.includes("டேட்டா") || w.includes("डेटा-संचालित")) {
                  return <span key={idx} className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">{w} </span>;
                }
                return w + " ";
              })}
            </h1>
            
            <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed">
              {copy.heroDesc}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/login/citizen"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 sm:py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-sm font-outfit"
              >
                <PlusCircle className="w-5 h-5" /> {copy.btnSubmit}
              </Link>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-4 sm:py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-sm border border-slate-200 font-outfit"
              >
                {copy.btnDashboard} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-800">
              {copy.featuresTitle}
            </h2>
            <p className="mt-3 text-slate-500 text-sm">
              {copy.featuresSub}
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-slate-800 font-outfit">{feature.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Flow Steps Section */}
      <section className="py-14 sm:py-20 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-800">{copy.stepsTitle}</h2>
            <p className="mt-3 text-slate-500 text-sm">
              {copy.stepsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:shadow-sm transition-all duration-300 space-y-3">
                <span className="text-3xl font-black text-blue-100 block font-outfit leading-none">{step.number}</span>
                <h3 className="text-sm font-bold text-slate-800 font-outfit">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              <h2 className="text-2xl sm:text-4xl font-outfit font-extrabold text-slate-800 tracking-tight leading-tight">
                {copy.impactTitle}
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                {copy.impactDesc}
              </p>
              <div className="pt-2">
                <Link
                  href="/public-priorities"
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl text-xs transition-colors shadow-sm font-outfit"
                >
                  {copy.btnExplore} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
              {metrics.map((metric, i) => (
                <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-150 shadow-sm flex flex-col justify-between min-h-[8rem] sm:h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-slate-800 font-outfit">{metric.value}</span>
                    <div className={`p-2.5 rounded-xl ${metric.color}`}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 leading-tight">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Login Selection Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6 mt-2">
                <h3 className="text-xl font-bold text-slate-800 font-outfit">Select Profile</h3>
                <p className="text-xs text-slate-500 mt-1">Choose how you want to interact with CivicPulse.</p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login/citizen"
                  className="flex items-center p-4 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 rounded-xl flex items-center justify-center mr-4 transition-colors">
                    <UserCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 font-outfit group-hover:text-blue-700 transition-colors">Citizen</h4>
                    <p className="text-xs text-slate-500 leading-tight mt-0.5">View public feed and submit new grievances</p>
                  </div>
                </Link>

                <Link
                  href="/login/mp"
                  className="flex items-center p-4 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-600 rounded-xl flex items-center justify-center mr-4 transition-colors">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 font-outfit group-hover:text-emerald-700 transition-colors">Member of Parliament</h4>
                    <p className="text-xs text-slate-500 leading-tight mt-0.5">Access priority algorithms & secure analytics</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
