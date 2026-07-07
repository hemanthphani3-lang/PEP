"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { 
  MessageSquare, 
  Cpu, 
  MapPin, 
  TrendingUp, 
  Droplet, 
  Road, 
  Activity, 
  GraduationCap, 
  Eye, 
  FileCheck2, 
  DollarSign, 
  Wrench, 
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Truck
} from "lucide-react";
import { motion } from "framer-motion";
import { langTranslations } from "@/utils/langTranslations";

const translations = {
  en: {
    badge: "Platform Architecture",
    heroTitle: "How Pragathi Path Works",
    heroDesc: "Empowering Visakhapatnam citizens to collaborate directly with constituency representatives. We use natural language processing and spatial analytics to build a transparent development roadmap.",
    meaningLabel: "What does \"Pragathi Path\" mean?",
    pipelineTitle: "The Core Processing Pipeline",
    pipelineSub: "Four integrated steps that turn a raw citizen voice input into an executive decision metric.",
    step1Title: "Voice & Text Submission",
    step1Desc: "Citizens submit their development suggestions in English, Telugu, or Hindi. They can type details or record voice memos naturally.",
    step2Title: "Multilingual AI Translation",
    step2Desc: "Sarvam AI and Gemini translate, analyze, and extract the topic, location details, and core grievance contents automatically.",
    step3Title: "Geotagging & Clustering",
    step3Desc: "Submissions are pinned on a geo-spatial map and grouped with neighboring requests to highlight regional priority clusters.",
    step4Title: "Priority Impact Scoring",
    step4Desc: "Algorithmic weights correlate clusters with local village census data (population, literacy, assets) to generate action priorities.",
    monitorTitle: "Status & Progress Monitoring",
    monitorSub: "Every suggestion goes through a multi-stage lifecycle, ensuring accountability and visible progress.",
    stage1Status: "Submitted",
    stage1Desc: "The suggestion is registered in the database, geo-tagged, and made visible on the public feed.",
    stage2Status: "AI Context Check",
    stage2Desc: "Translation pipelines process audio records and classify issues for local constituency matching.",
    stage3Status: "Verification Process",
    stage3Desc: "Constituency administrative officers review the report to eliminate duplicates and confirm details.",
    stage4Status: "Budget Review",
    stage4Desc: "Proposed works are analyzed against village demands and constituency budgets for financial sanction.",
    stage5Status: "Executive Action",
    stage5Desc: "The project gets allocated to contractors, and physical construction work commences on the ground.",
    stage6Status: "Completed",
    stage6Desc: "Development work is successfully completed, certified by local officers, and updated on the dashboard.",
    useCasesTitle: "Constituency Use Cases",
    useCasesSub: "Categorized domains where Pragathi Path resolves village developmental requirements.",
    uc1Title: "Water Infrastructure",
    uc1Desc: "Requests for clean drinking water piping, borewell installations, water tank cleaning, and leaks resolution.",
    uc1Stats: "24% of submissions",
    uc2Title: "Roads & Transportation",
    uc2Desc: "Reports of pothole repairs, tarring extensions, street light upgrades, and drainage construction requests.",
    uc2Stats: "38% of submissions",
    uc3Title: "Healthcare Services",
    uc3Desc: "Requests for health sub-centers supplies, sanitization drives, medical camp coordination, and ambulance access.",
    uc3Stats: "18% of submissions",
    uc4Title: "Educational Facilities",
    uc4Desc: "Requests for school building repairs, digital equipment setups, library books, and sanitary facility builds.",
    uc4Stats: "20% of submissions",
    issuesTitle: "What Can Be Suggested?",
    issuesSub: "Real-world issues reported directly by Visakhapatnam citizens, mapped and tracked to completion.",
    issueRotateNote: "Auto-rotating (Pause on hover)",
    issue1Title: "Street Light Repair & Public Safety",
    issue1Cat: "Roads & Public Safety",
    issue1Desc: "Reporting non-functional streetlights or broken electrical poles to restore lighting, prevent accidents, and ensure citizen safety on public streets after dark.",
    issue1Tag: "Active Maintenance",
    issue2Title: "Drinking Water Pipeline Installation",
    issue2Cat: "Water Infrastructure",
    issue2Desc: "Laying new underground main water pipelines in residential areas to establish direct drinking water connections, replacing old manual pumps.",
    issue2Tag: "Under Construction",
    issue3Title: "Water Tanker Dispatch Coordination",
    issue3Cat: "Water Scarcity & Management",
    issue3Desc: "Requesting and tracking municipal water tankers in high-scarcity rural or semi-urban neighborhoods during dry seasons.",
    issue3Tag: "Emergency Dispatch",
    issue4Title: "Rural Health Checkup Camp Setup",
    issue4Cat: "Healthcare & Wellness",
    issue4Desc: "Organizing and staffing periodic health camps in remote villages to check blood pressure, conduct basic tests, and distribute necessary prescriptions.",
    issue4Tag: "Community Wellness",
    issue5Title: "Classroom Infrastructure Renovation",
    issue5Cat: "Educational Facilities",
    issue5Desc: "Requesting classroom building repairs, library books, and study desks to provide a safe and inspiring learning environment for rural children.",
    issue5Tag: "Renovation Scheduled",
    issue6Title: "Main Road Asphalt Resurfacing",
    issue6Cat: "Roads & Transportation",
    issue6Desc: "Laying high-durability asphalt resurfacing over degraded village approach roads to facilitate easy access, public transit, and commercial linkups.",
    issue6Tag: "Work In Progress",
    govTitle: "How Pragathi Path Helps the Government",
    govDesc: "By transforming isolated local demands into aggregated visual datasets, Pragathi Path acts as a decision support system for public administration.",
    govBtn: "Get Started Now",
    govP1Title: "Objective Funding Allocation",
    govP1Desc: "Allocates constituency development budgets based on calculated impact scores (population density, school count, water scarcity) instead of speculative inputs.",
    govP2Title: "Elimination of Bureaucratic Delays",
    govP2Desc: "Fast-tracks suggestions by delivering them straight to the MP's dashboard, cutting out weeks of nested administrative delays and paperwork.",
    govP3Title: "Constituency Demand Heatmaps",
    govP3Desc: "Gives planners spatial awareness, plotting priority hot spots visually on Leaflet maps so that roads and water lines can be planned systematically.",
    govP4Title: "Multilingual Accessibility",
    govP4Desc: "Allows rural communities to voice suggestions in their local languages, bringing previously disconnected groups into the governance feedback cycle.",
    footerText: "© 2026 Pragathi Path. All rights reserved. Designed for Visakhapatnam Constituency."
  },
  hi: {
    badge: "प्लेटफ़ॉर्म आर्किटेक्चर",
    heroTitle: "प्रगति पथ कैसे काम करता है",
    heroDesc: "विशाखापत्तनम के नागरिकों को निर्वाचन क्षेत्र के प्रतिनिधियों के साथ सीधे सहयोग करने के लिए सशक्त बनाना। हम एक पारदर्शी विकास रोडमैप बनाने के लिए प्राकृतिक भाषा प्रसंस्करण और भू-स्थानिक विश्लेषण का उपयोग करते हैं।",
    meaningLabel: "\"प्रगति पथ\" का क्या अर्थ है?",
    pipelineTitle: "मुख्य प्रसंस्करण पाइपलाइन",
    pipelineSub: "चार एकीकृत कदम जो एक कच्चे नागरिक आवाज इनपुट को एक कार्यकारी निर्णय मीट्रिक में बदलते हैं।",
    step1Title: "आवाज और पाठ सबमिशन",
    step1Desc: "नागरिक अंग्रेजी, तेलुगु या हिंदी में अपने विकास सुझाव प्रस्तुत करते हैं। वे विवरण टाइप कर सकते हैं या स्वाभाविक रूप से आवाज मेमो रिकॉर्ड कर सकते हैं।",
    step2Title: "बहुभाषी एआई अनुवाद",
    step2Desc: "सर्वम एआई और जेमिनी स्वचालित रूप से विषय, स्थान विवरण और मुख्य शिकायत सामग्री का अनुवाद, विश्लेषण और निष्कर्ष निकालते हैं।",
    step3Title: "जियोटैगिंग और क्लस्टरिंग",
    step3Desc: "सबमिशन को भू-स्थानिक मानचित्र पर पिन किया जाता है और क्षेत्रीय प्राथमिकता क्लस्टर को उजागर करने के लिए पड़ोसी अनुरोधों के साथ समूहीकृत किया जाता है।",
    step4Title: "प्राथमिकता प्रभाव स्कोरिंग",
    step4Desc: "एल्गोरिथम भार स्थानीय ग्राम जनगणना डेटा (जनसंख्या, साक्षरता, संपत्ति) के साथ क्लस्टर को सहसंबंधित करते हैं ताकि कार्रवाई प्राथमिकताओं को उत्पन्न किया जा सके।",
    monitorTitle: "स्थिति और प्रगति की निगरानी",
    monitorSub: "जवाबदेही और दृश्यमान प्रगति सुनिश्चित करने के लिए हर सुझाव एक बहु-चरण जीवनचक्र से गुजरता है।",
    stage1Status: "प्रस्तुत किया गया",
    stage1Desc: "सुझाव डेटाबेस में पंजीकृत है, जियो-टैग किया गया है, और सार्वजनिक फ़ीड पर दृश्यमान है।",
    stage2Status: "एआई संदर्भ जांच",
    stage2Desc: "अनुवाद पाइपलाइन ऑडियो रिकॉर्ड को संसाधित करती है और स्थानीय निर्वाचन क्षेत्र मिलान के लिए मुद्दों को वर्गीकृत करती है।",
    stage3Status: "सत्यापन प्रक्रिया",
    stage3Desc: "निर्वाचन क्षेत्र के प्रशासनिक अधिकारी डुप्लिकेट को खत्म करने और विवरण की पुष्टि करने के लिए रिपोर्ट की समीक्षा करते हैं।",
    stage4Status: "बजट समीक्षा",
    stage4Desc: "प्रस्तावित कार्यों का वित्तीय मंजूरी के लिए ग्राम मांगों और निर्वाचन क्षेत्र के बजट के खिलाफ विश्लेषण किया जाता है।",
    stage5Status: "कार्यकारी कार्रवाई",
    stage5Desc: "परियोजना ठेकेदारों को आवंटित की जाती है, और जमीन पर भौतिक निर्माण कार्य शुरू होता है।",
    stage6Status: "पूर्ण",
    stage6Desc: "विकास कार्य सफलतापूर्वक पूरा हो गया है, स्थानीय अधिकारियों द्वारा प्रमाणित है, और डैशबोर्ड पर अपडेट किया गया है।",
    useCasesTitle: "निर्वाचन क्षेत्र उपयोग मामले",
    useCasesSub: "वर्गीकृत क्षेत्र जहां प्रगति पथ ग्राम विकासात्मक आवश्यकताओं का समाधान करता है।",
    uc1Title: "जल बुनियादी ढांचा",
    uc1Desc: "स्वच्छ पेयजल पाइपिंग, बोरवेल स्थापना, पानी की टंकी की सफाई और लीक के समाधान के अनुरोध।",
    uc1Stats: "24% प्रस्तुतियाँ",
    uc2Title: "सड़कें और परिवहन",
    uc2Desc: "गड्ढों की मरम्मत, डामरीकरण विस्तार, स्ट्रीट लाइट अपग्रेड और जल निकासी निर्माण अनुरोधों की रिपोर्ट।",
    uc2Stats: "38% प्रस्तुतियाँ",
    uc3Title: "स्वास्थ्य सेवाएं",
    uc3Desc: "स्वास्थ्य उप-केंद्रों की आपूर्ति, स्वच्छता अभियान, चिकित्सा शिविर समन्वय और एम्बुलेंस पहुंच के अनुरोध।",
    uc3Stats: "18% प्रस्तुतियाँ",
    uc4Title: "शैक्षिक सुविधाएं",
    uc4Desc: "स्कूल भवन की मरम्मत, डिजिटल उपकरण सेटअप, पुस्तकालय पुस्तकों और सेनेटरी सुविधा निर्माण के अनुरोध।",
    uc4Stats: "20% प्रस्तुतियाँ",
    issuesTitle: "क्या सुझाव दिया जा सकता है?",
    issuesSub: "विशाखापत्तनम के नागरिकों द्वारा सीधे रिपोर्ट किए गए वास्तविक दुनिया के मुद्दे, जिन्हें मैप किया गया है और पूरा होने तक ट्रैक किया गया है।",
    issueRotateNote: "ऑटो-रोटेटिंग (होवर पर रोकें)",
    issue1Title: "स्ट्रीट लाइट मरम्मत और सार्वजनिक सुरक्षा",
    issue1Cat: "सड़कें और सार्वजनिक सुरक्षा",
    issue1Desc: "रोशनी बहाल करने, दुर्घटनाओं को रोकने और अंधेरे के बाद सार्वजनिक सड़कों पर नागरिक सुरक्षा सुनिश्चित करने के लिए गैर-कार्यात्मक स्ट्रीटलाइट्स या टूटे हुए बिजली के खंभों की रिपोर्ट करना।",
    issue1Tag: "सक्रिय रखरखाव",
    issue2Title: "पेयजल पाइपलाइन स्थापना",
    issue2Cat: "जल बुनियादी ढांचा",
    issue2Desc: "पुराने मैनुअल पंपों को बदलकर सीधे पेयजल कनेक्शन स्थापित करने के लिए आवासीय क्षेत्रों में नई भूमिगत मुख्य पानी की पाइपलाइन बिछाना।",
    issue2Tag: "निर्माण के अधीन",
    issue3Title: "पानी के टैंकर प्रेषण समन्वय",
    issue3Cat: "पानी की कमी और प्रबंधन",
    issue3Desc: "शुष्क मौसम के दौरान अत्यधिक कमी वाले ग्रामीण या अर्ध-शहरी क्षेत्रों में नगर निगम के पानी के टैंकरों का अनुरोध करना और उन पर नज़र रखना।",
    issue3Tag: "आपातकालीन प्रेषण",
    issue4Title: "ग्रामीण स्वास्थ्य जांच शिविर सेटअप",
    issue4Cat: "स्वास्थ्य और कल्याण",
    issue4Desc: "रक्तचाप की जांच करने, बुनियादी परीक्षण करने और आवश्यक नुस्खे वितरित करने के लिए दूरदराज के गांवों में समय-समय पर स्वास्थ्य शिविरों का आयोजन करना।",
    issue4Tag: "सामुदायिक कल्याण",
    issue5Title: "कक्षा बुनियादी ढांचा नवीनीकरण",
    issue5Cat: "शैक्षिक सुविधाएं",
    issue5Desc: "ग्रामीण बच्चों के लिए एक सुरक्षित और प्रेरक सीखने का माहौल प्रदान करने के लिए कक्षा के भवन की मरम्मत, पुस्तकालय की पुस्तकों और अध्ययन डेस्क का अनुरोध करना।",
    issue5Tag: "नवीनीकरण निर्धारित",
    issue6Title: "मुख्य सड़क डामर पुनरुत्थान",
    issue6Cat: "सड़कें और परिवहन",
    issue6Desc: "आसान पहुंच, सार्वजनिक पारगमन और वाणिज्यिक संपर्क की सुविधा के लिए खराब ग्रामीण सड़कों पर उच्च-टिकाऊ डामर बिछाना।",
    issue6Tag: "कार्य प्रगति पर है",
    govTitle: "प्रगति पथ सरकार की कैसे मदद करता है",
    govDesc: "अलग-अलग स्थानीय मांगों को एकीकृत विज़ुअल डेटासेट में बदलकर, प्रगति पथ सार्वजनिक प्रशासन के लिए निर्णय समर्थन प्रणाली के रूप में कार्य करता है।",
    govBtn: "अभी शुरू करें",
    govP1Title: "उद्देश्यपूर्ण निधि आवंटन",
    govP1Desc: "काल्पनिक इनपुट के बजाय गणना किए गए प्रभाव स्कोर (जनसंख्या घनत्व, स्कूल संख्या, पानी की कमी) के आधार पर निर्वाचन क्षेत्र विकास बजट आवंटित करता है।",
    govP2Title: "नौकरशाही देरी का उन्मूलन",
    govP2Desc: "सुझावों को सीधे सांसद के डैशबोर्ड पर भेजकर तेजी से काम करता है, जिससे हफ्तों की प्रशासनिक देरी और कागजी कार्रवाई समाप्त हो जाती है।",
    govP3Title: "निर्वाचन क्षेत्र मांग हीटमैप",
    govP3Desc: "योजनाकारों को स्थानिक जागरूकता देता है, लीफलेट मानचित्रों पर भौगोलिक रूप से हॉट स्पॉट दिखाता है ताकि सड़कों और पानी की लाइनों की व्यवस्थित योजना बनाई जा सके।",
    govP4Title: "बहुभाषी सुलभता",
    govP4Desc: "ग्रामीण समुदायों को उनकी स्थानीय भाषाओं में सुझाव देने की अनुमति देता है, जिससे पहले से कटे हुए समूहों को शासन प्रतिक्रिया चक्र में शामिल किया जाता है।",
    footerText: "© 2026 प्रगति पथ। सभी अधिकार सुरक्षित। विशाखापत्तनम निर्वाचन क्षेत्र के लिए डिज़ाइन किया गया।"
  },
  te: {
    badge: "ప్లాట్‌ఫారమ్ నిర్మాణం",
    heroTitle: "ప్రగతి పథం ఎలా పనిచేస్తుంది",
    heroDesc: "విశాఖపట్నం పౌరులు నియోజకవర్గ ప్రతినిధులతో నేరుగా సహకరించడానికి వీలు కల్పిస్తుంది. పారదర్శకమైన అభివృద్ధి ప్రణాళికను రూపొందించడానికి మేము సహజ భాషా ప్రాసెసింగ్ మరియు జియో-స్పేషియల్ విశ్లేషణను ఉపయోగిస్తాము.",
    meaningLabel: "\"ప్రగతి పథం\" అంటే ఏమిటి?",
    pipelineTitle: "ప్రధాన విశ్లేషణ విధానం",
    pipelineSub: "పౌరుల ముడి వాయిస్ ఇన్‌పుట్‌ను నిర్ణయాత్మక కొలమానంగా మార్చే నాలుగు సమగ్ర దశలు.",
    step1Title: "వాయిస్ & టెక్స్ట్ సమర్పణ",
    step1Desc: "పౌరులు తమ అభివృద్ధి సూచనలను ఇంగ్లీష్, తెలుగు లేదా హిందీలో సమర్పిస్తారు. వారు వివరాలను టైప్ చేయవచ్చు లేదా సహజంగా వాయిస్ మెమోలను రికార్డ్ చేయవచ్చు.",
    step2Title: "బహుభాషా AI అనువాదం",
    step2Desc: "సర్వం AI మరియు జెమిని స్వయంచాలకంగా అంశాన్ని, లొకేషన్ వివరాలను మరియు ప్రధాన ఫిర్యాదు కంటెంట్‌ను అనువదిస్తాయి, విశ్లేషిస్తాయి మరియు సంగ్రహిస్తాయి.",
    step3Title: "జియోట్యాగింగ్ & క్లస్టరింగ్",
    step3Desc: "సమర్పణలు జియో-స్పేషియల్ మ్యాప్‌లో పిన్ చేయబడతాయి మరియు ప్రాంతీయ ప్రాధాన్యత సమూహాలను హైలైట్ చేయడానికి పొరుగు అభ్యర్థనలతో సమూహం చేయబడతాయి.",
    step4Title: "ప్రాధాన్యత ప్రభావ స్కోరింగ్",
    step4Desc: "అల్గారిథమిక్ బరువులు స్థానిక గ్రామ జనాభా లెక్కల డేటా (జనాభా, అక్షరాస్యత, ఆస్తులు) తో సమూహాలను పరస్పరం అనుసంధానించి ప్రాధాన్యతలను రూపొందిస్తాయి.",
    monitorTitle: "స్థితి & ప్రగతి పర్యవేక్షణ",
    monitorSub: "ప్రతి సూచన పారదర్శకత మరియు కనిపించే పురోగతిని నిర్ధారించడానికి బహుళ-దశల జీవనచక్రం ద్వారా వెళుతుంది.",
    stage1Status: "సమర్పించబడింది",
    stage1Desc: "సూచన డేటాబేస్లో నమోదు చేయబడింది, జియో-ట్యాగ్ చేయబడింది మరియు పబ్లిక్ ఫీడ్లో కనిపిస్తుంది.",
    stage2Status: "AI కాంటెక్స్ట్ తనిఖీ",
    stage2Desc: "అనువాద పైప్‌లైన్‌లు ఆడియో రికార్డులను ప్రాసెస్ చేస్తాయి మరియు స్థానిక నియోజకవర్గ సరిపోలిక కోసం సమస్యలను వర్గీకరిస్తాయి.",
    stage3Status: "ధృవీకరణ ప్రక్రియ",
    stage3Desc: "నియోజకవర్గ పరిపాలనా అధికారులు నకిలీలను తొలగించడానికి మరియు వివరాలను నిర్ధారించడానికి నివేదికను సమీక్షిస్తారు.",
    stage4Status: "బడ్జెట్ సమీక్ష",
    stage4Desc: "ప్రతిపాదిత పనులు గ్రామాల డిమాండ్లు మరియు నియోజకవర్గ బడ్జెట్‌ల ఆధారంగా ఆర్థిక మంజూరు కోసం విశ్లేషించబడతాయి.",
    stage5Status: "కార్యనిర్వాహక చర్య",
    stage5Desc: "ప్రాజెక్ట్ కాంట్రాక్టర్లకు కేటాయించబడుతుంది మరియు క్షేత్రస్థాయిలో భౌతిక నిర్మాణ పనులు ప్రారంభమవుతాయి.",
    stage6Status: "పూర్తయింది",
    stage6Desc: "అభివృద్ధి పనులు విజయవంతంగా పూర్తయ్యాయి, స్థానిక అధికారులచే ధృవీకరించబడ్డాయి మరియు డాష్‌బోర్డ్‌లో నవీకరించబడ్డాయి.",
    useCasesTitle: "నియోజకవర్గ వినియోగ సందర్భాలు",
    useCasesSub: "గ్రామ అభివృద్ధి అవసరాలను ప్రగతి పథం పరిష్కరించే వర్గీకృత రంగాలు.",
    uc1Title: "నీటి మౌలిక సదుపాయాలు",
    uc1Desc: "శుభ్రమైన తాగునీటి పైపింగ్, బోర్‌వెల్ ఏర్పాటు, వాటర్ ట్యాంక్ క్లీనింగ్ మరియు లీకేజీల పరిష్కారం కోసం అభ్యర్థనలు.",
    uc1Stats: "24% సమర్పణలు",
    uc2Title: "రోడ్లు & రవాణా",
    uc2Desc: "గుంతల మరమ్మత్తులు, తారు రోడ్ల విస్తరణ, వీధి దీపాల ఆధునీకరణ మరియు పారుదల నిర్మాణ అభ్యర్థనలు.",
    uc2Stats: "38% సమర్పణలు",
    uc3Title: "ఆరోగ్య సేవలు",
    uc3Desc: "ఆరోగ్య ఉప-కేంద్రాల సరఫరా, పారిశుధ్య కార్యక్రమాలు, వైద్య శిబిరాల సమన్వయం మరియు అంబులెన్స్ సదుపాయాల అభ్యర్థనలు.",
    uc3Stats: "18% సమర్పణలు",
    uc4Title: "విద్యా సౌకర్యాలు",
    uc4Desc: "పాఠశాల భవనాల మరమ్మత్తులు, డిజిటల్ పరికరాల ఏర్పాటు, గ్రంథాలయ పుస్తకాలు మరియు పారిశుధ్య సౌకర్యాల నిర్మాణం.",
    uc4Stats: "20% సమర్పణలు",
    issuesTitle: "ఏమి సూచించవచ్చు?",
    issuesSub: "విశాఖపట్నం పౌరులు నేరుగా నివేదించిన నిజ-ప్రపంచ సమస్యలు, పటంలో గుర్తించబడి మరియు పూర్తి చేయడానికి పర్యవేక్షించబడతాయి.",
    issueRotateNote: "ఆటో-రొటేటింగ్ (హోవర్ వద్ద ఆగుతుంది)",
    issue1Title: "వీధి దీపాల మరమ్మత్తు & ప్రజా భద్రత",
    issue1Cat: "రోడ్లు & ప్రజా భద్రత",
    issue1Desc: "చీకటి పడిన తర్వాత పౌరుల భద్రతను నిర్ధారించడానికి మరియు ప్రమాదాలను నివారించడానికి వీధి దీపాలను పునరుద్ధరించడం.",
    issue1Tag: "క్రియాశీల నిర్వహణ",
    issue2Title: "తాగునీటి పైప్‌లైన్ ఏర్పాటు",
    issue2Cat: "నీటి మౌలిక సదుపాయాలు",
    issue2Desc: "నేరుగా తాగునీటి కనెక్షన్‌లను ఏర్పాటు చేయడానికి నివాస ప్రాంతాలలో కొత్త భూగర్భ వాటర్ పైప్‌లైన్‌లను వేయడం.",
    issue2Tag: "నిర్మాణంలో ఉంది",
    issue3Title: "వాటర్ ట్యాంకర్ సరఫరా సమన్వయం",
    issue3Cat: "నీటి కొరత & నిర్వహణ",
    issue3Desc: "ఎండకాలంలో నీటి కొరత ఎక్కువగా ఉన్న గ్రామీణ ప్రాంతాలలో మునిసిపల్ వాటర్ ట్యాంకర్లను అభ్యర్థించడం మరియు ట్రాక్ చేయడం.",
    issue3Tag: "అత్యవసర రవాణా",
    issue4Title: "గ్రామీణ ఉచిత వైద్య శిబిరాల ఏర్పాటు",
    issue4Cat: "ఆరోగ్యం & శ్రేయస్సు",
    issue4Desc: "ప్రాథమిక పరీక్షలు నిర్వహించడానికి మరియు ఉచిత మందులను పంపిణీ చేయడానికి మారుమూల గ్రామాలలో వైద్య శిబిరాలను నిర్వహించడం.",
    issue4Tag: "సామాజిక శ్రేయస్సు",
    issue5Title: "పాఠశాల మౌలిక సదుపాయాల పునరుద్ధరణ",
    issue5Cat: "విద్యా సౌకర్యాలు",
    issue5Desc: "గ్రామీణ పిల్లలకు సురక్షితమైన మరియు ప్రోత్సాహకరమైన అధ్యయన వాతావరణాన్ని అందించడానికి పాఠశాల మరమ్మత్తులు.",
    issue5Tag: "షెడ్యూల్ చేయబడింది",
    issue6Title: "ప్రధాన రహదారి తారు రోడ్డు నిర్మాణం",
    issue6Cat: "రోడ్లు & రవాణా",
    issue6Desc: "రవాణా సదుపాయాలను మెరుగుపరచడానికి గ్రామీణ రహదారులపై తారు రోడ్లను పునరుద్ధరించడం.",
    issue6Tag: "పని జరుగుతోంది",
    govTitle: "ప్రగతి పథం ప్రభుత్వానికి ఎలా సహాయపడుతుంది",
    govDesc: "వివిక్త స్థానిక డిమాండ్లను ఏకీకృత విజువల్ డేటాసెట్లుగా మార్చడం ద్వారా, ప్రగతి పథం ప్రజా परिపాలనకు నిర్ణయాత్మక మద్దతు వ్యవస్థగా పనిచేస్తుంది.",
    govBtn: "ఇప్పుడే ప్రారంభించండి",
    govP1Title: "నిష్పాక్షిక నిధుల కేటాయింపు",
    govP1Desc: "speculative ఇన్‌పుట్‌లకు బదులుగా లెక్కించబడిన ప్రభావ స్కోర్‌ల ఆధారంగా నియోజకవర్గ అభివృద్ధి బడ్జెట్‌లను కేటాయిస్తుంది.",
    govP2Title: "కార్యాలయ జాప్యాల నివారణ",
    govP2Desc: "సూచనలను నేరుగా ఎంపీ డాష్‌బోర్డ్‌కు చేరవేయడం ద్వారా వారాల పరిపాలనా జాప్యాలను మరియు పత్రాల పనిని తగ్గిస్తుంది.",
    govP3Title: "నియోజకవర్గ డిమాండ్ హీట్‌మ్యాప్స్",
    govP3Desc: "ప్రణాళికాధికారులకు భౌగోళిక అవగాహనను అందిస్తుంది, రోడ్లు మరియు నీటి మార్గాలను పద్ధతి ప్రకారం ప్లాన్ చేయడానికి మ్యాప్‌లపై హాట్‌స్పాట్‌లను చూపుతుంది.",
    govP4Title: "బహుభాషా అందుబాటు",
    govP4Desc: "గ్రామీణ ప్రజలు తమ స్థానిక భాషలలో సూచనలను తెలియజేయడానికి అనుమతిస్తుంది, తద్వారా వారిని కూడా అభివృద్ధి భాగస్వాములుగా చేస్తుంది.",
    footerText: "© 2026 ప్రగతి పథం. సర్వ హక్కులు ప్రత్యేకించబడినవి. విశాఖపట్నం నియోజకవర్గం కోసం రూపొందించబడింది."
  },
  ta: {
    badge: "தளத்தின் கட்டமைப்பு",
    heroTitle: "பிரகதி பாதை எவ்வாறு செயல்படுகிறது",
    heroDesc: "விசாகப்பட்டினம் குடிமக்கள் தங்களின் தொகுதிப் பிரதிநிதிகளுடன் நேரடியாகப் பங்களிக்க வழிவகை செய்கிறது. ஒரு வெளிப்படையான மேம்பாட்டுத் திட்டத்தை உருவாக்க நாங்கள் இயற்கை மொழி செயலாக்கம் மற்றும் புவிசார் பகுப்பாய்வைப் பயன்படுத்துகிறோம்.",
    meaningLabel: "\"பிரகதி பாதை\" என்பதன் அர்த்தம் என்ன?",
    pipelineTitle: "முக்கிய செயலாக்க முறைமை",
    pipelineSub: "குடிமக்களின் குரல் பதிவை ஒரு நிர்வாக முடிவுக்கான அளவுகோலாக மாற்றும் நான்கு ஒருங்கிணைந்த கட்டங்கள்.",
    step1Title: "குரல் மற்றும் உரை சமர்ப்பிப்பு",
    step1Desc: "குடிமக்கள் தங்கள் மேம்பாட்டு பரிந்துரைகளை ஆங்கிலம், தெலுங்கு அல்லது இந்தியில் சமர்ப்பிக்கிறார்கள். அவர்கள் தட்டச்சு செய்யலாம் அல்லது குரல் பதிவாக அனுப்பலாம்.",
    step2Title: "பன்மொழி AI மொழிபெயர்ப்பு",
    step2Desc: "சர்வம் AI மற்றும் ஜெமினி ஆகியவை தானாகவே தலைப்பு, இருப்பிட விவரங்கள் மற்றும் புகாரின் முக்கிய விவரங்களை மொழிபெயர்த்து பகுப்பாய்வு செய்கின்றன.",
    step3Title: "புவிஇருப்பிடம் குறித்தல் & குழுவாக்கம்",
    step3Desc: "சமர்ப்பிப்புகள் வரைபடத்தில் குறிக்கப்பட்டு, ஒத்த கோரிக்கைகளை ஒன்றாகக் குழுவாக மாற்றி முன்னுரிமை இடங்களைக் காட்டுகின்றன.",
    step4Title: "முன்னுரிமை தாக்க மதிப்பீடு",
    step4Desc: "உள்ளூர் கிராம மக்கள் தொகை தரவு (மக்கள் தொகை, கல்வியறிவு) அடிப்படையில் அல்காரிதம் முன்னுரிமை மதிப்பெண்களை உருவாக்குகிறது.",
    monitorTitle: "நிலை மற்றும் முன்னேற்றக் கண்காணிப்பு",
    monitorSub: "ஒவ்வொரு பரிந்துரையும் பொறுப்புக்கூறல் மற்றும் வெளிப்படையான முன்னேற்றத்தை உறுதிப்படுத்த பல கட்டங்களை கடந்து செல்கிறது.",
    stage1Status: "சமர்ப்பிக்கப்பட்டது",
    stage1Desc: "பரிந்துரை தரவுத்தளத்தில் பதிவு செய்யப்பட்டு, வரைபடத்தில் குறிக்கப்பட்டு, பொதுப் பார்வையில் வைக்கப்படுகிறது.",
    stage2Status: "AI சூழல் சரிபார்ப்பு",
    stage2Desc: "மொழிபெயர்ப்பு முறைமைகள் குரல் பதிவுகளைச் சரிசெய்து, உள்ளூர் தொகுதி வாரியாகப் பிரிக்கின்றன.",
    stage3Status: "சரிபார்ப்பு செயல்முறை",
    stage3Desc: "நகல் கோரிக்கைகளைத் தவிர்க்க தொகுதி அதிகாரிகள் சமர்ப்பிப்புகளை ஆராய்ந்து உறுதிப்படுத்துகிறார்கள்.",
    stage4Status: "பட்ஜெட் மதிப்பாய்வு",
    stage4Desc: "பரிந்துரைக்கப்பட்ட பணிகள் கிராமத்தின் தேவைகள் மற்றும் தொகுதி பட்ஜெட்டின் கீழ் நிதி ஒப்புதலுக்கு உட்படுத்தப்படுகின்றன.",
    stage5Status: "நிர்வாக நடவடிக்கை",
    stage5Desc: "திட்டம் ஒப்பந்ததாரர்களுக்கு ஒதுக்கப்பட்டு, களத்தில் கட்டுமானப் பணிகள் தொடங்குகின்றன.",
    stage6Status: "முடிவடைந்தது",
    stage6Desc: "மேம்பாட்டுப் பணிகள் வெற்றிகரமாக முடிக்கப்பட்டு, அதிகாரிகளால் சான்றளிக்கப்பட்டு, டேஷ்போர்டில் புதுப்பிக்கப்படுகின்றன.",
    useCasesTitle: "தொகுதியின் பயன்பாட்டு விவரங்கள்",
    useCasesSub: "பிரகதி பாதை கிராம மேம்பாட்டுத் தேவைகளைத் தீர்க்கும் வகைப்படுத்தப்பட்ட பிரிவுகள்.",
    uc1Title: "குடிநீர் உள்கட்டமைப்பு",
    uc1Desc: "சுத்தமான குடிநீர் குழாய்கள், ஆழ்துளைக் கிணறுகள் அமைத்தல், குடிநீர்த் தொட்டி சுத்தம் செய்தல் மற்றும் கசிவு சரிசெய்தல் கோரிக்கைகள்.",
    uc1Stats: "24% சமர்ப்பிப்புகள்",
    uc2Title: "சாலைகள் மற்றும் போக்குவரத்து",
    uc2Desc: "சாலைப் பள்ளங்கள் சரிசெய்தல், தார்ச் சாலை விரிவாக்கம், தெருவிளக்கு மேம்பாடு மற்றும் வடிகால் கட்டமைப்பு கோரிக்கைகள்.",
    uc2Stats: "38% சமர்ப்பிப்புகள்",
    uc3Title: "சுகாதார சேவைகள்",
    uc3Desc: "சுகாதார நிலையங்களுக்குத் தேவையான பொருட்கள், தூய்மைப் பணிகள், மருத்துவ முகாம் மற்றும் ஆம்புலன்ஸ் வசதி கோரிக்கைகள்.",
    uc3Stats: "18% சமர்ப்பிப்புகள்",
    uc4Title: "கல்வி வசதிகள்",
    uc4Desc: "பள்ளி கட்டிடங்கள் பழுதுபார்த்தல், டிஜிட்டல் வகுப்பறை அமைத்தல், நூலகப் புத்தகங்கள் மற்றும் சுகாதார வசதிகள் கோரிக்கைகள்.",
    uc4Stats: "20% சமர்ப்பிப்புகள்",
    issuesTitle: "என்ன பரிந்துரைக்கலாம்?",
    issuesSub: "விசாகப்பட்டினம் குடிமக்களால் நேரடியாகப் புகாரளிக்கப்பட்ட, வரைபடத்தில் குறிக்கப்பட்டு கண்காணிக்கப்படும் உண்மையான சிக்கல்கள்.",
    issueRotateNote: "தானாக சுழலும் (தற்காலிகமாக நிறுத்த ஹோவர் செய்யவும்)",
    issue1Title: "தெருவிளக்கு பழுது மற்றும் பொதுப் பாதுகாப்பு",
    issue1Cat: "சாலைகள் மற்றும் பொதுப் பாதுகாப்பு",
    issue1Desc: "அந்தி சாய்ந்த பின் குடிமக்களின் பாதுகாப்பை உறுதி செய்யவும், விபத்துகளைத் தவிர்க்கவும் தெருவிளக்குகள் மற்றும் உடைந்த மின் கம்பங்களைச் சரிசெய்தல்.",
    issue1Tag: "செயலில் உள்ள பராமரிப்பு",
    issue2Title: "குடிநீர் குழாய் தடம் அமைத்தல்",
    issue2Cat: "நீர் உள்கட்டமைப்பு",
    issue2Desc: "குடியிருப்புப் பகுதிகளில் புதிய குடிநீர் குழாய்களை அமைத்து, பழைய கைப் பம்புகளுக்குப் பதிலாக நேரடி இணைப்புகளை வழங்குதல்.",
    issue2Tag: "கட்டுமானத்தில் உள்ளது",
    issue3Title: "குடிநீர்த్ தொட்டி விநியோக ஒருங்கிணைப்பு",
    issue3Cat: "நீர் பற்றாக்குறை மேலாண்மை",
    issue3Desc: "கோடை காலத்தில் பற்றாக்குறை உள்ள கிராமப்புற மற்றும் நகர்ப்புறப் பகுதிகளில் நகராட்சி குடிநீர் லாரிகளை வரவழைத்து கண்காணித்தல்.",
    issue3Tag: "அவசர விநியோகம்",
    issue4Title: "கிராமப்புற மருத்துவ முகாம் அமைத்தல்",
    issue4Cat: "சுகாதாரம் மற்றும் நல்வாழ்வு",
    issue4Desc: "கிராமப்புற மக்களுக்கு இரத்த அழுத்த பரிசோதனை, அடிப்படை ஆய்வக சோதனைகள் மற்றும் இலவச மருந்துகளை வழங்க சிறப்பு மருத்துவ முகாம்களை நடத்துதல்.",
    issue4Tag: "சமூக நல்வாழ்வு",
    issue5Title: "வகுப்பறை உள்கட்டமைப்பு புதுப்பித்தல்",
    issue5Cat: "கல்வி வசதிகள்",
    issue5Desc: "கிராமப்புற குழந்தைகளுக்குப் பாதுகாப்பான மற்றும் ஊக்கமளிக்கும் கற்றல் சூழலை வழங்க வகுப்பறை பழுது மற்றும் மேசைகள் அமைத்தல்.",
    issue5Tag: "புதுப்பித்தல் திட்டமிடப்பட்டுள்ளது",
    issue6Title: "பிரதான தார்ச் சாலை சீரமைப்பு",
    issue6Cat: "சாலைகள் மற்றும் போக்குவரத்து",
    issue6Desc: "போக்குவரத்தை எளிதாக்கவும், பொதுப் பேருந்து வசதி மற்றும் வர்த்தக தொடர்புகளை மேம்படுத்தவும் தார்ச் சாலைகளைப் புதுப்பித்தல்.",
    issue6Tag: "பணிகள் நடைபெறுகின்றன",
    govTitle: "பிரகதி பாதை அரசாங்கத்திற்கு எவ்வாறு உதவுகிறது",
    govDesc: "தனித்தனியான உள்ளூர்த் தேவைகளைத் தொகுக்கப்பட்ட தரவுகளாக மாற்றுவதன் மூலம், பிரகதி பாதை பொது நிர்வாகத்திற்கான சிறந்த முடிவெடுக்கும் அமைப்பாகச் செயல்படுகிறது.",
    govBtn: "இப்போதே தொடங்குங்கள்",
    govP1Title: "நோக்கமுள்ள நிதி ஒதுக்கீடு",
    govP1Desc: "யூகங்களின் அடிப்படையில் அல்லாமல் கணக்கிடப்பட்ட தாக்க மதிப்பெண்களின் (மக்கள் தொகை, கல்வி, குடிநீர் பற்றாக்குறை) அடிப்படையில் நிதி ஒதுக்கீடு செய்கிறது.",
    govP2Title: "அதிகாரத்துவ காலதாமதத்தைத் தவிர்த்தல்",
    govP2Desc: "பரிந்துரைகளை நேரடியாக எம்பியின் பார்வைக்குக் கொண்டு செல்வதன் மூலம் வாரக்கணக்கில் ஏற்படும் நிர்வாகத் தாமதங்களையும் ஆவணப் பணிகளையும் குறைக்கிறது.",
    govP3Title: "தொகுதியின் தேவைகளைக் காட்டும் வரைபடம்",
    govP3Desc: "சாலைகள் மற்றும் குடிநீர் இணைப்புகளை முறையாகத் திட்டமிட, வரைபடத்தில் அதிகத் தேவையுள்ள இடங்களை புவியியல் ரீதியாகக் காட்டுகிறது.",
    govP4Title: "பன்மொழி அணுகல்தன்மை",
    govP4Desc: "கிராமப்புற மக்கள் தங்களின் உள்ளூர் மொழிகளிலேயே தங்களின் தேவைகளைத் தெரிவிக்க அனுமதிப்பதன் மூலம் அவர்களை மேம்பாட்டுத் திட்டத்தில் இணைக்கிறது.",
    footerText: "© 2026 பிரகதி பாதை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. விசாகப்பட்டினம் தொகுதிக்காக வடிவமைக்கப்பட்டது."
  }
};

export default function HowItWorks() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("civicpulse_lang") || "en";
    setLang(saved);
    const handleLangChange = () => {
      setLang(localStorage.getItem("civicpulse_lang") || "en");
    };
    window.addEventListener("language-change", handleLangChange);
    return () => window.removeEventListener("language-change", handleLangChange);
  }, []);

  const copy = {
    ...translations.en,
    ...(translations[lang as keyof typeof translations] || {}),
    ...(langTranslations[lang] || {})
  };

  const steps = [
    {
      num: "01",
      icon: MessageSquare,
      title: copy.step1Title,
      desc: copy.step1Desc,
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      num: "02",
      icon: Cpu,
      title: copy.step2Title,
      desc: copy.step2Desc,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      num: "03",
      icon: MapPin,
      title: copy.step3Title,
      desc: copy.step3Desc,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
      num: "04",
      icon: TrendingUp,
      title: copy.step4Title,
      desc: copy.step4Desc,
      color: "bg-purple-50 text-purple-600 border-purple-100"
    }
  ];

  const useCases = [
    {
      icon: Droplet,
      title: copy.uc1Title,
      desc: copy.uc1Desc,
      stats: copy.uc1Stats
    },
    {
      icon: Road,
      title: copy.uc2Title,
      desc: copy.uc2Desc,
      stats: copy.uc2Stats
    },
    {
      icon: Activity,
      title: copy.uc3Title,
      desc: copy.uc3Desc,
      stats: copy.uc3Stats
    },
    {
      icon: GraduationCap,
      title: copy.uc4Title,
      desc: copy.uc4Desc,
      stats: copy.uc4Stats
    }
  ];

  const monitoringStages = [
    {
      status: copy.stage1Status,
      icon: Eye,
      desc: copy.stage1Desc
    },
    {
      status: copy.stage2Status,
      icon: Cpu,
      desc: copy.stage2Desc
    },
    {
      status: copy.stage3Status,
      icon: FileCheck2,
      desc: copy.stage3Desc
    },
    {
      status: copy.stage4Status,
      icon: DollarSign,
      desc: copy.stage4Desc
    },
    {
      status: copy.stage5Status,
      icon: Wrench,
      desc: copy.stage5Desc
    },
    {
      status: copy.stage6Status,
      icon: CheckCircle,
      desc: copy.stage6Desc
    }
  ];

  const citizenIssues = [
    {
      title: copy.issue1Title,
      category: copy.issue1Cat,
      desc: copy.issue1Desc,
      image: "/issue-street-light.jpg",
      icon: Lightbulb,
      tag: copy.issue1Tag
    },
    {
      title: copy.issue2Title,
      category: copy.issue2Cat,
      desc: copy.issue2Desc,
      image: "/issue-pipeline-trench.png",
      icon: Droplet,
      tag: copy.issue2Tag
    },
    {
      title: copy.issue3Title,
      category: copy.issue3Cat,
      desc: copy.issue3Desc,
      image: "/issue-water-tanker.jpg",
      icon: Truck,
      tag: copy.issue3Tag
    },
    {
      title: copy.issue4Title,
      category: copy.issue4Cat,
      desc: copy.issue4Desc,
      image: "/issue-medical-camp.jpg",
      icon: Activity,
      tag: copy.issue4Tag
    },
    {
      title: copy.issue5Title,
      category: copy.issue5Cat,
      desc: copy.issue5Desc,
      image: "/issue-classroom.png",
      icon: GraduationCap,
      tag: copy.issue5Tag
    },
    {
      title: copy.issue6Title,
      category: copy.issue6Cat,
      desc: copy.issue6Desc,
      image: "/issue-road-paving.png",
      icon: Road,
      tag: copy.issue6Tag
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200 py-16 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{copy.badge}</span>
              <h1 className="text-4xl sm:text-5xl font-outfit font-extrabold text-slate-900 tracking-tight leading-none">
                {copy.heroTitle}
              </h1>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed font-medium">
                {copy.heroDesc}
              </p>

              {/* Multilingual Meaning Section */}
              <div className="mt-16 pt-12 border-t border-slate-100 max-w-6xl mx-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-8 text-center">{copy.meaningLabel}</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
                  
                  {/* Telugu */}
                  <div className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-350 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[9px] font-extrabold text-blue-600 tracking-wider uppercase bg-blue-50 px-2.5 py-0.5 rounded-full font-outfit">Telugu</span>
                        <span className="text-[10px] font-semibold text-slate-400">తెలుగు</span>
                      </div>
                      <span className="text-xl font-black text-slate-800 font-outfit tracking-tight block">ప్రగతి పథం</span>
                      <p className="text-xs text-slate-550 mt-3 leading-relaxed font-semibold">
                        "The Path of Progress". Symbolises growth, community advancement, and transparent development tracks.
                      </p>
                    </div>
                  </div>

                  {/* Hindi */}
                  <div className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-350 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[9px] font-extrabold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-2.5 py-0.5 rounded-full font-outfit">Hindi</span>
                        <span className="text-[10px] font-semibold text-slate-400">हिन्दी</span>
                      </div>
                      <span className="text-xl font-black text-slate-800 font-outfit tracking-tight block">प्रगति पथ</span>
                      <p className="text-xs text-slate-550 mt-3 leading-relaxed font-semibold">
                        "The Way to Development". Signifies setting a clear roadmap for constituency improvements and public welfare.
                      </p>
                    </div>
                  </div>

                  {/* Sanskrit */}
                  <div className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-350 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[9px] font-extrabold text-purple-600 tracking-wider uppercase bg-purple-50 px-2.5 py-0.5 rounded-full font-outfit">Sanskrit</span>
                        <span className="text-[10px] font-semibold text-slate-400">संस्कृतम्</span>
                      </div>
                      <span className="text-xl font-black text-slate-800 font-outfit tracking-tight block">प्रगति मार्गः</span>
                      <p className="text-xs text-slate-550 mt-3 leading-relaxed font-semibold">
                        "The Route of Upliftment". Represents an elevating journey towards prosperous public infrastructure.
                      </p>
                    </div>
                  </div>

                  {/* Tamil */}
                  <div className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-350 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[9px] font-extrabold text-sky-600 tracking-wider uppercase bg-sky-50 px-2.5 py-0.5 rounded-full font-outfit">Tamil</span>
                        <span className="text-[10px] font-semibold text-slate-400">தமிழ்</span>
                      </div>
                      <span className="text-xl font-black text-slate-800 font-outfit tracking-tight block">பிரகதி பாதை</span>
                      <p className="text-xs text-slate-550 mt-3 leading-relaxed font-semibold">
                        "The Roadway of Development". Focuses on building community assets and empowering citizen feedback loops.
                      </p>
                    </div>
                  </div>

                  {/* Kannada */}
                  <div className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-350 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[9px] font-extrabold text-amber-600 tracking-wider uppercase bg-amber-50 px-2.5 py-0.5 rounded-full font-outfit">Kannada</span>
                        <span className="text-[10px] font-semibold text-slate-400">ಕನ್ನಡ</span>
                      </div>
                      <span className="text-xl font-black text-slate-800 font-outfit tracking-tight block">ಪ್ರಗತಿ ಪಥ</span>
                      <p className="text-xs text-slate-550 mt-3 leading-relaxed font-semibold">
                        "The Path of Growth". Symbolises a collective journey towards local infrastructure advancement and village progress.
                      </p>
                    </div>
                  </div>

                  {/* Marathi */}
                  <div className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-orange-550/5 transition-all duration-350 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[9px] font-extrabold text-orange-600 tracking-wider uppercase bg-orange-50 px-2.5 py-0.5 rounded-full font-outfit">Marathi</span>
                        <span className="text-[10px] font-semibold text-slate-400">मराठी</span>
                      </div>
                      <span className="text-xl font-black text-slate-800 font-outfit tracking-tight block">प्रगती पथ</span>
                      <p className="text-xs text-slate-555 mt-3 leading-relaxed font-semibold">
                        "The Road to Prosperity". Signifies guiding administration directly to resolve high-priority local projects.
                      </p>
                    </div>
                  </div>

                  {/* Bengali */}
                  <div className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-350 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-550 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[9px] font-extrabold text-rose-600 tracking-wider uppercase bg-rose-50 px-2.5 py-0.5 rounded-full font-outfit">Bengali</span>
                        <span className="text-[10px] font-semibold text-slate-400">বাংলা</span>
                      </div>
                      <span className="text-xl font-black text-slate-800 font-outfit tracking-tight block">प्रगति पथ</span>
                      <p className="text-xs text-slate-550 mt-3 leading-relaxed font-semibold">
                        "The Journey of Evolution". Focuses on translating citizen demand into active physical development and infrastructure.
                      </p>
                    </div>
                  </div>

                  {/* English Translation */}
                  <div className="group relative bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-350 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <div>
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[9px] font-extrabold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full font-outfit">English</span>
                        <span className="text-[10px] font-semibold text-slate-400">Literal</span>
                      </div>
                      <span className="text-xl font-black text-slate-800 font-outfit tracking-tight block">Progress Path</span>
                      <p className="text-xs text-slate-550 mt-3 leading-relaxed font-semibold">
                        "The Roadmap of Progress". Captures the pipeline of translating citizen suggestions into actual project executions.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4-Step Pipeline Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-800 tracking-tight">{copy.pipelineTitle}</h2>
            <p className="text-slate-500 text-sm font-medium">{copy.pipelineSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 relative shadow-sm hover:shadow-md transition-all group hover:border-slate-300 text-left"
                >
                  <span className="absolute top-4 right-6 text-3xl font-black text-slate-100 group-hover:text-slate-200 transition-colors font-outfit">{step.num}</span>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${step.color} mb-6`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 font-outfit mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Suggestion Monitoring Stepper */}
        <section className="bg-slate-100/60 border-y border-slate-200/80 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-800 tracking-tight">{copy.monitorTitle}</h2>
              <p className="text-slate-500 text-sm font-medium">{copy.monitorSub}</p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Timeline Connector Line */}
              <div className="absolute left-6 lg:left-1/2 top-4 bottom-4 w-0.5 bg-slate-200 hidden lg:block" />

              <div className="space-y-8 lg:space-y-12">
                {monitoringStages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isLeft = idx % 2 === 0;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className={`flex flex-col lg:flex-row items-start lg:items-center ${isLeft ? "lg:flex-row-reverse" : ""}`}
                    >
                      {/* Empty side spacer for desktop */}
                      <div className="w-full lg:w-1/2 hidden lg:block" />

                      {/* Timeline Dot */}
                      <div className="z-10 w-12 h-12 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center shrink-0 my-3 lg:my-0 lg:mx-6 shadow-sm">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>

                      {/* Content Card */}
                      <div className="w-full lg:w-1/2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1 hover:border-slate-300 transition-colors text-left">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Stage 0{idx + 1}</span>
                        <h4 className="font-bold text-slate-800 font-outfit text-sm">{stage.status}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{stage.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-800 tracking-tight">{copy.useCasesTitle}</h2>
            <p className="text-slate-500 text-sm font-medium">{copy.useCasesSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex gap-5 shadow-sm hover:border-slate-300 transition-all hover:shadow-md text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-800 font-outfit">{useCase.title}</h3>
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">{useCase.stats}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{useCase.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Issues Faced by Citizens (Infinite Marquee Loop Left to Right) */}
        <section className="bg-slate-100/60 border-t border-b border-slate-200 py-16 sm:py-24 overflow-hidden relative">
          {/* Custom style injection for loop animation */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee-left-to-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .marquee-track {
              display: flex;
              width: max-content;
              animation: marquee-left-to-right 45s linear infinite;
            }
            .marquee-track:hover {
              animation-play-state: paused;
            }
          `}} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Citizen Submissions</span>
              <h2 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-800 tracking-tight">{copy.issuesTitle}</h2>
              <p className="text-slate-500 text-sm font-medium">{copy.issuesSub}</p>
            </div>
          </div>

          <div className="relative w-full py-4">
            {/* Soft gradient glass fade on left and right edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="flex w-full overflow-hidden">
              <div className="marquee-track gap-6 py-2">
                {/* Render list twice to create seamless loop */}
                {[...citizenIssues, ...citizenIssues].map((issue, idx) => {
                  const Icon = issue.icon;
                  return (
                    <div 
                      key={idx}
                      className="w-[280px] sm:w-[350px] flex-shrink-0 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group hover:border-blue-400 hover:-translate-y-1 cursor-pointer flex flex-col"
                    >
                      {/* Image Header */}
                      <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden shrink-0">
                        <img 
                          src={issue.image} 
                          alt={issue.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-600 text-white text-[8px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md font-outfit">
                            {issue.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="bg-slate-900/70 text-slate-200 text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-sm font-outfit">
                            {issue.tag}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5 text-left">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-800 font-outfit line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {issue.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-3">
                            {issue.desc}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-outfit">
                          <Icon className="w-3.5 h-3.5 text-blue-500" />
                          <span>{issue.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Helping the Government Section */}
        <section className="bg-slate-900 text-slate-400 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6 text-left">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-950 px-3.5 py-1 rounded-full border border-blue-900">Governance Value</span>
                <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-white tracking-tight leading-tight">
                  {copy.govTitle}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {copy.govDesc}
                </p>

                <div className="pt-2">
                  <Link 
                    href="/submit"
                    className="inline-flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-950 font-outfit"
                  >
                    {copy.govBtn} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div className="bg-slate-800/50 border border-slate-800 rounded-3xl p-6 space-y-3">
                  <span className="text-xs font-bold text-white font-outfit block">{copy.govP1Title}</span>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {copy.govP1Desc}
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-800 rounded-3xl p-6 space-y-3">
                  <span className="text-xs font-bold text-white font-outfit block">{copy.govP2Title}</span>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {copy.govP2Desc}
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-800 rounded-3xl p-6 space-y-3">
                  <span className="text-xs font-bold text-white font-outfit block">{copy.govP3Title}</span>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {copy.govP3Desc}
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-800 rounded-3xl p-6 space-y-3">
                  <span className="text-xs font-bold text-white font-outfit block">{copy.govP4Title}</span>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {copy.govP4Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Styled Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-center text-xs">
        <p>{copy.footerText}</p>
      </footer>
    </div>
  );
}
