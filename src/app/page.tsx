"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { langTranslations } from "@/utils/langTranslations";

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
    stepsSub: "How Pragathi Path ingests raw unstructured voice data and resolves them into structured prioritizations.",
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

  const copy = {
    ...translations.en,
    ...(translations[lang as keyof typeof translations] || {}),
    ...(langTranslations[lang] || {})
  };

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
    { icon: Mic,        title: copy.f1Title, description: copy.f1Desc },
    { icon: Layers,     title: copy.f2Title, description: copy.f2Desc },
    { icon: MapPin,     title: copy.f3Title, description: copy.f3Desc },
    { icon: TrendingUp, title: copy.f4Title, description: copy.f4Desc },
    { icon: Database,   title: copy.f5Title, description: copy.f5Desc },
    { icon: ImageIcon,  title: copy.f6Title, description: copy.f6Desc },
  ];

  const steps = [
    { number: "01", title: copy.s1Title, desc: copy.s1Desc },
    { number: "02", title: copy.s2Title, desc: copy.s2Desc },
    { number: "03", title: copy.s3Title, desc: copy.s3Desc },
    { number: "04", title: copy.s4Title, desc: copy.s4Desc },
    { number: "05", title: copy.s5Title, desc: copy.s5Desc },
    { number: "06", title: copy.s6Title, desc: copy.s6Desc },
  ];

  const metrics = [
    { icon: Clock, value: "85%", label: "Faster Decision Making", color: "text-blue-600 bg-blue-50" },
    { icon: Shield, value: "100%", label: "Transparent Prioritization", color: "text-emerald-600 bg-emerald-50" },
    { icon: Database, value: "4 Villages", label: "Seeded Planning Data", color: "text-indigo-600 bg-indigo-50" },
    { icon: Users, value: "Inclusive", label: "Citizen Participation", color: "text-purple-600 bg-purple-50" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      {/* ───────────────────────────────────────────────────
           HERO WRAPPER — one shared background for
           the Navbar + Hero section so they form a
           single seamless cinematic full-bleed banner.
      ─────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Shared crowd background image (scaled and clipped to hide stock edge watermarks) */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <Image
            src="/hero-crowd.jpg"
            alt="Citizens of India"
            fill
            priority
            quality={85}
            className="object-cover object-center scale-[1.15]"
          />
        </div>
        {/* Multi-layer dark overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-800/72 to-slate-900/88" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-transparent to-indigo-950/40" />
        {/* Subtle dot-grid texture */}
        <div className="absolute inset-0 dot-grid opacity-15" />

        {/* Navbar sits INSIDE the wrapper → transparent over the crowd */}
        <div className="relative z-50">
          <Navbar transparent />
        </div>

        {/* Hero content (added pt to compensate for fixed navbar) */}
        <section className="relative z-10 overflow-hidden pt-36 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Tagline pill */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/25 backdrop-blur-sm mb-6 font-outfit">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {copy.badge}
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-outfit font-extrabold text-white tracking-tight leading-tight drop-shadow-xl">
                {copy.heroTitle.split(" ").map((w, idx) => {
                  if (w.toLowerCase() === "data-driven" || w.includes("డేటా") || w.includes("டேட்டா") || w.includes("डेटा-संचालित")) {
                    return <span key={idx} className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{w} </span>;
                  }
                  return w + " ";
                })}
              </h1>

              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-sans leading-relaxed drop-shadow">
                {copy.heroDesc}
              </p>

              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/submit"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 sm:py-3.5 rounded-xl shadow-lg shadow-blue-900/50 hover:shadow-xl hover:shadow-blue-800/60 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-sm font-outfit border border-blue-400/30"
                >
                  <PlusCircle className="w-5 h-5" /> {copy.btnSubmit}
                </Link>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-bold px-8 py-4 sm:py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-sm border border-white/30 font-outfit"
                >
                  {copy.btnDashboard} <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Patriotic tricolor accent */}
              <div className="mt-12 flex items-center justify-center gap-1.5 opacity-60">
                <div className="h-1 w-16 rounded-full bg-orange-400" />
                <div className="h-1 w-16 rounded-full bg-white" />
                <div className="h-1 w-16 rounded-full bg-green-500" />
              </div>
            </motion.div>
          </div>
        </section>
      </div> {/* end hero wrapper */}


      {/* ── FEATURES SECTION ─────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-800">{copy.featuresTitle}</h2>
            <p className="mt-3 text-slate-500 text-sm">{copy.featuresSub}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-default overflow-hidden group"
              >
                {/* Glow blob */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit"
                  >
                    <feature.icon className="w-6 h-6" />
                  </motion.div>
                  <h3 className="mt-4 text-base font-bold text-slate-800 font-outfit group-hover:text-blue-700 transition-colors duration-300">{feature.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                </div>

                {/* Bottom accent bar slides in on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-2xl">
                  <div className="h-full w-full bg-blue-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ── INTELLIGENCE PIPELINE SECTION ─────────────────── */}
      <section className="py-14 sm:py-20 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
          >
            <h2 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-800">{copy.stepsTitle}</h2>
            <p className="mt-3 text-slate-500 text-sm">{copy.stepsSub}</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-colors duration-300 space-y-3 cursor-default relative overflow-hidden"
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/60 group-hover:to-indigo-50/40 transition-all duration-500 pointer-events-none rounded-2xl" />

                <span className="text-4xl font-black text-blue-100 group-hover:text-blue-200 block font-outfit leading-none transition-colors duration-300 relative z-10">
                  {step.number}
                </span>
                <h3 className="text-sm font-bold text-slate-800 font-outfit group-hover:text-blue-700 transition-colors duration-300 relative z-10">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed relative z-10">
                  {step.desc}
                </p>

                {/* Animated left accent bar */}
                <motion.div
                  className="absolute left-0 top-4 bottom-4 w-0.5 bg-blue-500 rounded-full origin-top"
                  initial={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  transition={{ duration: 0.25 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── IMPACT / METRICS SECTION ─────────────────────── */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-5 sm:space-y-6"
            >
              <h2 className="text-2xl sm:text-4xl font-outfit font-extrabold text-slate-800 tracking-tight leading-tight">{copy.impactTitle}</h2>
              <p className="text-slate-500 leading-relaxed text-sm">{copy.impactDesc}</p>
              <div className="pt-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/public-priorities"
                    className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl text-xs transition-all duration-300 shadow-sm hover:shadow-md font-outfit"
                  >
                    {copy.btnExplore} <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6"
            >
              {metrics.map((metric, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-150 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[8rem] sm:h-40 cursor-default group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-slate-800 font-outfit">{metric.value}</span>
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.15 }}
                      className={`p-2.5 rounded-xl ${metric.color} transition-all duration-300`}
                    >
                      <metric.icon className="w-5 h-5" />
                    </motion.div>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 leading-tight group-hover:text-slate-800 transition-colors">{metric.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Login Selection Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="absolute inset-0 bg-slate-900/60"
              onClick={() => setIsLoginModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white/90 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/50 overflow-hidden"
            >
              {/* Decorative glows */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100/50 hover:bg-slate-200/80 p-2.5 rounded-full transition-all duration-300 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-8 relative z-10">
                <h3 className="text-2xl font-black text-slate-900 font-outfit tracking-tight">Select Profile</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Choose your portal destination.</p>
              </div>

              <div className="space-y-4 relative z-10">
                <Link
                  href="/login/citizen"
                  className="flex items-center p-4 border border-slate-200/60 bg-white/60 hover:bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 rounded-2xl transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-blue-200/50 group-hover:scale-110 transition-transform duration-300">
                    <UserCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 font-outfit text-lg group-hover:text-blue-700 transition-colors">Citizen</h4>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5 font-medium">Public feed & grievance submission</p>
                  </div>
                </Link>

                <Link
                  href="/login/mp"
                  className="flex items-center p-4 border border-slate-200/60 bg-white/60 hover:bg-white hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/10 rounded-2xl transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mr-4 shadow-sm border border-emerald-200/50 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 font-outfit text-lg group-hover:text-emerald-700 transition-colors">MP / Official</h4>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5 font-medium">Priority algorithms & analytics</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left branding */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <Image 
                  src="/logo.png" 
                  alt="Pragathi Path Logo" 
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain"
                />
                <span className="font-outfit font-bold text-base tracking-tight text-white">
                  Pragathi Path
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                An advanced multilingual intelligence platform assisting Members of Parliament with geo-spatial priority tracking, census correlation, and administrative project management.
              </p>
            </div>

            {/* Middle links */}
            <div className="grid grid-cols-2 gap-8 md:col-span-4">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Platform</span>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                  <li><Link href="/submit" className="hover:text-white transition-colors">Submit Suggestion</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                </ul>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Portals</span>
                <ul className="space-y-2 text-xs text-left">
                  <li><button onClick={() => setIsLoginModalOpen(true)} className="hover:text-white transition-colors text-left">Citizen Login</button></li>
                  <li><button onClick={() => setIsLoginModalOpen(true)} className="hover:text-white transition-colors text-left">MP Office Portal</button></li>
                </ul>
              </div>
            </div>

            {/* Right support contacts */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Technical Support</span>
              <ul className="space-y-2 text-xs font-mono text-left">
                <li><a href="mailto:hemanthphani3@gmail.com" className="hover:text-white transition-colors block truncate">hemanthphani3@gmail.com</a></li>
                <li><a href="mailto:sananthkumar3@gmail.com" className="hover:text-white transition-colors block truncate">sananthkumar3@gmail.com</a></li>
                <li><a href="mailto:nandalaala99@gmail.com" className="hover:text-white transition-colors block truncate">nandalaala99@gmail.com</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-semibold">
            <span>© 2026 Pragathi Path. All rights reserved. Designed for Visakhapatnam Constituency.</span>
            <div className="flex gap-4">
              <Link href="/contact" className="hover:text-slate-400 transition-colors">Report Technical Bug</Link>
              <span>•</span>
              <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-slate-400 transition-colors">MP Portal</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



