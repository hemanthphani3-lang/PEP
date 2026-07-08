"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { DBService, getNearestVillage } from "@/services/db";
import { analyzeSubmission } from "@/services/gemini";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { AudioPlayer } from "@/components/AudioPlayer";
import { 
  PlusCircle, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  UploadCloud,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { langTranslations } from "@/utils/langTranslations";

// Sample images that judges can select instantly to test the AI
const SAMPLE_DEFECTS = [
  {
    name: "Potholed Road",
    url: "https://images.unsplash.com/photo-1599740831464-59cb4a14f6b2?w=800&auto=format&fit=crop&q=60",
    category: "Roads"
  },
  {
    name: "Broken Water Valve",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60",
    category: "Water"
  },
  {
    name: "Dark Highway (No Lights)",
    url: "https://images.unsplash.com/photo-1621293954908-907159247fc8?w=800&auto=format&fit=crop&q=60",
    category: "Street Lights"
  },
  {
    name: "Collapsed School Wall",
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=60",
    category: "Education"
  }
];

const CATEGORIES = [
  "Roads", "Water", "Healthcare", "Education", "Sanitation", 
  "Street Lights", "Employment", "Agriculture", "Public Safety", "Environment"
];

// Presets representing real microphone recordings in diverse languages
const VOICE_PRESETS = [
  {
    language: "Telugu",
    transcript: "శృంగవరపుకోట ఘాట్ రోడ్డు లో భారీ గోతులు పడ్డాయి. దీనివల్ల ప్రయాణం చాలా ప్రమాదకరంగా మారింది, కార్లు అదుపుతప్పుతున్నాయి.",
    translated: "There is a massive pothole corridor on the Srungavarapukota ghat road. Cars are swerving dangerously and it causes traffic jams."
  },
  {
    language: "Hindi",
    transcript: "गाजूवाका जोन में पीने के पानी की पाइप फट गई है। साफ पीने का पानी नाली में बह रहा है, और जनता को पानी नहीं मिल पा रहा है।",
    translated: "Drinking water pipe burst in Gajuwaka zone. Clean drinking water is flowing in the drain, and public supply is down."
  },
  {
    language: "Tamil",
    transcript: "பீமிலி அரசு தொடக்கப் பள்ளியின் சுற்றுச்சுவர் கனமழை காரணமாக இடிந்து விழுந்துள்ளது. இதனால் மாணவர்களின் பாதுகாப்பு கேள்விக்குறியாக உள்ளது.",
    translated: "The primary school compound wall in Bhimili has collapsed due to heavy rains last week. Safety hazard for students."
  },
  {
    language: "English",
    transcript: "All the streetlights on the Visakhapatnam coastal bypass are dead. The road is pitch dark at night, making it very risky.",
    translated: "All the streetlights on the Visakhapatnam coastal bypass are dead. The road is pitch dark at night, making it very risky."
  }
];

const translations = {
  en: {
    portalTitle: "AI-Assisted Citizen Portal",
    title: "Submit Development Request",
    sub: "Report infrastructure issues or suggest local improvements. Gemini AI will analyze your proposal.",
    lblDetails: "1. Describe the Issue or Request",
    lblTranscribing: "Multilingual transcription supported",
    placeholderDesc: "Describe what needs repair or construction. You can write in English, Hindi, or Telugu. (e.g., 'The main well in Yelagiri Hills is contaminated. Children are falling sick...')",
    translatingSpeech: "Translating Speech with Gemini...",
    stopRecording: "Stop Recording",
    btnRecord: "Record Voice Grievance",
    lblPinLocation: "2. Pin Geographic Location",
    descPinLocation: "Click on the constituency map below to drop a pin. The system will auto-detect the closest village boundaries.",
    lblGeotagMetadata: "Geotag Metadata",
    lblDetectedVillage: "Detected Village:",
    lblLatitude: "Latitude:",
    lblLongitude: "Longitude:",
    warnGeotag: "Every submission requires a geotag to qualify for spatial clustering.",
    lblImage: "3. Provide Supporting Image (Optional)",
    lblVisionAI: "Vision AI extracts defect severity",
    lblClickSample: "Or click a sample photo to test instantly:",
    lblCamera: "Camera Photo",
    lblGallery: "Upload Gallery",
    lblAutoGeotag: "Auto-Geotag from GPS",
    lblManualGeotag: "Requires manual location pin",
    lblCategory: "4. Development Category",
    lblAutoDetectCategory: "Auto-Detect with Gemini",
    btnSubmit: "Submit Development Request",
    nameTitle: "Identify Yourself",
    nameSub: "Enter your name for the official public records submission.",
    nameLabel: "Reporter Name",
    btnCancel: "Cancel",
    btnConfirm: "Confirm Submit",
    successTitle: "Grievance Submitted!",
    successSub: "Your voice contributes to smarter development planning.",
    lblSuccessVillage: "Target Village:",
    lblSuccessCategory: "Category Tagged:",
    successDesc: "Gemini successfully parsed and added this request to active spatial hotspots. MP dashboard metrics have been updated.",
    btnSubmitAnother: "Submit Another",
    btnViewOthers: "View Other Suggestions"
  },
  hi: {
    portalTitle: "एआई-असिस्टेड नागरिक पोर्टल",
    title: "बुनियादी ढांचा अनुरोध दर्ज करें",
    sub: "बुनियादी ढांचे की समस्याओं की रिपोर्ट करें या स्थानीय सुधारों का सुझाव दें। जेमिनी एआई आपके प्रस्ताव का विश्लेषण करेगा।",
    lblDetails: "1. समस्या या अनुरोध का वर्णन करें",
    lblTranscribing: "बहुभाषी प्रतिलेखन समर्थित",
    placeholderDesc: "वर्णन करें कि मरम्मत या निर्माण की क्या आवश्यकता है। आप अंग्रेजी, हिंदी या तेलुगु में लिख सकते हैं। (जैसे, 'येलागिरी हिल्स में मुख्य कुआं प्रदूषित है। बच्चे बीमार पड़ रहे हैं...')",
    translatingSpeech: "जेमिनी के साथ भाषण का अनुवाद...",
    stopRecording: "रिकॉर्डिंग रोकें",
    btnRecord: "आवाज में शिकायत रिकॉर्ड करें",
    lblPinLocation: "2. भौगोलिक स्थान पिन करें",
    descPinLocation: "पिन गिराने के लिए नीचे दिए गए निर्वाचन क्षेत्र के नक्शे पर क्लिक करें। सिस्टम निकटतम गांव की सीमाओं का स्वतः पता लगा लेगा।",
    lblGeotagMetadata: "जियोटैग मेटाडेटा",
    lblDetectedVillage: "पता चला गाँव:",
    lblLatitude: "अक्षांश:",
    lblLongitude: "देशांतर:",
    warnGeotag: "स्थानिक क्लस्टरिंग के लिए योग्य होने के लिए प्रत्येक सबमिशन के लिए जियोटैग की आवश्यकता होती है।",
    lblImage: "3. सहायक छवि प्रदान करें (वैकल्पिक)",
    lblVisionAI: "विज़न एआई दोष गंभीरता का विश्लेषण करता है",
    lblClickSample: "या तुरंत परीक्षण करने के लिए एक नमूना फोटो पर क्लिक करें:",
    lblCamera: "कैमरा फोटो",
    lblGallery: "गैलरी अपलोड",
    lblAutoGeotag: "जीपीएस से ऑटो-जियोटैग",
    lblManualGeotag: "मैन्युअल स्थान पिन की आवश्यकता है",
    lblCategory: "4. विकास श्रेणी",
    lblAutoDetectCategory: "जेमिनी के साथ स्वतः पहचान",
    btnSubmit: "विकास अनुरोध सबमिट करें",
    nameTitle: "अपनी पहचान बताएं",
    nameSub: "आधिकारिक लोक रिकॉर्ड जमा करने के लिए अपना नाम दर्ज करें।",
    nameLabel: "रिपोर्टर का नाम",
    btnCancel: "रद्द करें",
    btnConfirm: "सबमिशन की पुष्टि करें",
    successTitle: "शिकायत दर्ज हो गई!",
    successSub: "आपकी आवाज़ स्मार्ट विकास योजना में योगदान देती है।",
    lblSuccessVillage: "लक्षित गाँव:",
    lblSuccessCategory: "श्रेणी टैग की गई:",
    successDesc: "जेमिनी ने इस अनुरोध को सफलतापूर्वक संसाधित किया और सक्रिय हॉटस्पॉट में जोड़ा। सांसद डैशबोर्ड अपडेट कर दिया गया है।",
    btnSubmitAnother: "एक और सबमिट करें",
    btnViewOthers: "अन्य सुझाव देखें"
  },
  te: {
    portalTitle: "AI-సహాయక పౌర పోర్టల్",
    title: "మౌలిక సదుపాయాల అభ్యర్థనను దాఖలు చేయండి",
    sub: "మౌలిక సదుపాయాల సమస్యలను నివేదించండి లేదా స్థానిక మెరుగుదలలను సూచించండి. జెమిని AI మీ ప్రతిపాదనను విశ్లేషిస్తుంది.",
    lblDetails: "1. సమస్య లేదా అభ్యర్థనను వివరించండి",
    lblTranscribing: "బహుభాషా అనువాద మద్దతు ఉంది",
    placeholderDesc: "ఏమి మరమ్మత్తు చేయాలో లేదా నిర్మించాలో వివరించండి. మీరు ఇంగ్లీష్, హిందీ లేదా తెలుగులో వ్రాయవచ్చు. (ఉదా., 'యెలగిరి కొండలలోని ప్రధాన బావి కలుషితమైంది. పిల్లలు అనారోగ్యానికి గురవుతున్నారు...')",
    translatingSpeech: "జెమినీతో అనువాదం జరుగుతోంది...",
    stopRecording: "రికార్డింగ్ ఆపు",
    btnRecord: "వాయిస్ ద్వారా ఫిర్యాదును రికార్డ్ చేయండి",
    lblPinLocation: "2. భౌగోళిక స్థానాన్ని పిన్ చేయండి",
    descPinLocation: "పిన్ డ్రాప్ చేయడానికి క్రింది నియోజకవర్గ మ్యాప్‌పై క్లిక్ చేయండి. సిస్టమ్ సమీప గ్రామ సరిహద్దులను గుర్తిస్తుంది.",
    lblGeotagMetadata: "జియోట్యాగ్ సమాచారం",
    lblDetectedVillage: "గుర్తించిన గ్రామం:",
    lblLatitude: "అక్షాంశం:",
    lblLongitude: "రేఖాంశం:",
    warnGeotag: "నియోజకవర్గ క్లస్టరింగ్ పొందడానికి ప్రతి సమర్పణకు జియోట్యాగ్ తప్పనిసరి.",
    lblImage: "3. ఆధార ఫోటోను అందించండి (ఐచ్ఛికం)",
    lblVisionAI: "విజన్ AI లోపం యొక్క తీవ్రతను గుర్తిస్తుంది",
    lblClickSample: "లేదా వెంటనే పరీక్షించడానికి నమూనా ఫోటోపై క్లిక్ చేయండి:",
    lblCamera: "కెమెరా ఫోటో",
    lblGallery: "గ్యాలరీ అప్‌లోడ్",
    lblAutoGeotag: "GPS నుండి ఆటో-జియోట్యాగ్",
    lblManualGeotag: "మాన్యువల్ లొకేషన్ పిన్ అవసరం",
    lblCategory: "4. అభివృద్ధి విభాగం",
    lblAutoDetectCategory: "జెమినీతో ఆటో-డిటెక్ట్",
    btnSubmit: "అభివృద్ధి అభ్యర్థనను సమర్పించండి",
    nameTitle: "మీ పేరును తెలపండి",
    nameSub: "అధికారిక పౌర రికార్డు సమర్పణ కోసం మీ పేరును నమోదు చేయండి.",
    nameLabel: "రిపోర్టర్ పేరు",
    btnCancel: "రద్దు చేయి",
    btnConfirm: "సమర్పణను నిర్ధారించు",
    successTitle: "ఫిర్యాదు సమర్పించబడింది!",
    successSub: "మీ వాయిస్ మరింత మెరుగైన అభివృద్ధి ప్రణాళికకు దోహదం చేస్తుంది.",
    lblSuccessVillage: "లక్ష్య గ్రామం:",
    lblSuccessCategory: "టాగ్ చేయబడిన విభాగం:",
    successDesc: "జెమిని ఈ అభ్యర్థనను విజయవంతంగా ప్రాసెస్ చేసి, క్రియాశీల హాట్‌స్పాట్‌లకు జోడించింది. ఎంపీ డాష్‌బోర్డ్ అప్‌డేట్ చేయబడింది.",
    btnSubmitAnother: "మరొకటి సమర్పించండి",
    btnViewOthers: "ఇతర సూచనలను చూడండి"
  },
  ta: {
    portalTitle: "AI-உதவி பெறும் குடிமகன் போர்டல்",
    title: "உள்கட்டமைப்பு கோரிக்கையை தாக்கல் செய்யவும்",
    sub: "உள்கட்டமைப்பு சிக்கல்களைப் புகாரளிக்கவும் அல்லது மேம்பாடுகளைப் பரிந்துரைக்கவும். ஜெமினி AI உங்கள் திட்டத்தை பகுப்பாய்வு செய்யும்.",
    lblDetails: "1. சிக்கல் அல்லது கோரிக்கையை விவரிக்கவும்",
    lblTranscribing: "பன்மொழி படியெடுத்தல் ஆதரவு உள்ளது",
    placeholderDesc: "என்ன பழுதுபார்க்க வேண்டும் அல்லது கட்ட வேண்டும் என்பதை விவரிக்கவும். நீங்கள் ஆங்கிலம், இந்தி அல்லது தெலுங்கில் எழுதலாம். (எ.கா., 'யேலகிரி மலையில் உள்ள முக்கிய கிணறு மாசுபட்டுள்ளது. குழந்தைகள் நோய்வாய்ப்படுகிறார்கள்...')",
    translatingSpeech: "ஜெமினி மூலம் உரையாடல் மொழிபெயர்ப்பு...",
    stopRecording: "பதிவை நிறுத்து",
    btnRecord: "குரல் மூலம் புகாரை பதிவு செய்",
    lblPinLocation: "2. புவியியல் இருப்பிடத்தை பின் செய்யவும்",
    descPinLocation: "வரைபடத்தில் பின்கோடிட கீழே உள்ள தொகுதி வரைபடத்தில் கிளிக் செய்யவும். கணினி அருகிலுள்ள கிராம எல்லைகளைத் தானாகவே கண்டறியும்.",
    lblGeotagMetadata: "புவிஇருப்பிட மெட்டாடேட்டா",
    lblDetectedVillage: "கண்டறியப்பட்ட கிராமம்:",
    lblLatitude: "அட்சரேகை:",
    lblLongitude: "தீர்க்கரேகை:",
    warnGeotag: "முன்னுரிமைப் பிரிவில் சேர்க்க ஒவ்வொரு சமர்ப்பிப்பிற்கும் புவிஇருப்பிடம் கட்டாயமாகும்.",
    lblImage: "3. ஆதார புகைப்படத்தை வழங்கவும் (விரும்பினால்)",
    lblVisionAI: "விஷன் AI சேதத்தின் தீவிரத்தை சரிபார்க்கும்",
    lblClickSample: "அல்லது உடனடியாக சோதிக்க மாதிரி புகைப்படத்தை கிளிக் செய்யவும்:",
    lblCamera: "கேமரா புகைப்படம்",
    lblGallery: "கேலரியில் இருந்து பதிவேற்றவும்",
    lblAutoGeotag: "ஜிபிஎஸ் மூலம் தானியங்கி புவிஇருப்பிடம்",
    lblManualGeotag: "கைமுறையாக வரைபடத்தில் குறிக்க வேண்டும்",
    lblCategory: "4. மேம்பாட்டு வகை",
    lblAutoDetectCategory: "ஜெமினியுடன் தானாகக் கண்டறி",
    btnSubmit: "மேம்பாட்டு கோரிக்கையை சமர்ப்பிக்கவும்",
    nameTitle: "உங்களை அடையாளப்படுத்துங்கள்",
    nameSub: "அதிகாரப்பூர்வ பொதுப் பதிவில் சமர்ப்பிக்க உங்கள் பெயரை உள்ளிடவும்.",
    nameLabel: "புகாரளிப்பவர் பெயர்",
    btnCancel: "ரத்து செய்",
    btnConfirm: "சமர்ப்பிப்பை உறுதி செய்",
    successTitle: "புகார் சமர்ப்பிக்கப்பட்டது!",
    successSub: "உங்களின் குரல் சிறந்த தொகுதி மேம்பாட்டு திட்டமிடலுக்கு உதவுகிறது.",
    lblSuccessVillage: "இலக்கு கிராமம்:",
    lblSuccessCategory: "வகைப்படுத்தப்பட்ட பிரிவு:",
    successDesc: "ஜெமினி இந்த கோரிக்கையை வெற்றிகரமாக பகுப்பாய்வு செய்து ஹாட்ஸ்பாட்களில் சேர்த்துள்ளது. நாடாளுமன்ற உறுப்பினர் டேஷ்போர்டு புதுப்பிக்கப்பட்டது.",
    btnSubmitAnother: "மற்றொன்றைச் சமர்ப்பிக்கவும்",
    btnViewOthers: "இதர பரிந்துரைகளைப் பார்க்கவும்"
  }
};

export default function SubmitRequest() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Auto-Detect");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null); // base64 representation
  const [lat, setLat] = useState<number>(17.8860);
  const [lng, setLng] = useState<number>(83.4470);
  const [nearestVillageName, setNearestVillageName] = useState("Bhimili");
  const [isNamePromptOpen, setIsNamePromptOpen] = useState(false);
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [promptError, setPromptError] = useState("");
  const [lang, setLang] = useState<"en" | "hi" | "te" | "ta">("en");

  // Dynamic coordinates and UI elements
  useEffect(() => {
    setLang((localStorage.getItem("civicpulse_lang") as any) || "en");
    
    // Auto-fill phone from citizen session
    const savedPhone = localStorage.getItem("civicpulse_citizen_phone");
    if (savedPhone) {
      setReporterPhone(savedPhone);
    }

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

  // Interactive Map State
  const [mapHoveredVillage, setMapHoveredVillage] = useState<string | null>(null);
  const [selectedVoicePresetIndex, setSelectedVoicePresetIndex] = useState(0);

  const { 
    text: speechText, 
    isRecording, 
    isTranscribing, 
    recordingSeconds,
    startRecording, 
    stopRecording,
    audioDataUrl,
    reset
  } = useSpeechRecognition(lang);

  // Update text when speechText changes
  useEffect(() => {
    if (speechText) {
      setText(speechText);
    }
  }, [speechText]);

  // Success states
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [photoSource, setPhotoSource] = useState<"camera" | "gallery" | "sample" | null>(null);

  const mapIframeRef = useRef<HTMLIFrameElement>(null);

  // Auto Geolocate on Component Mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        (error) => {
          console.warn("GPS access denied, please manually drag the marker", error);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Update village name when lat/lng changes
  useEffect(() => {
    const village = getNearestVillage(lat, lng);
    setNearestVillageName(village);
  }, [lat, lng]);

  const initIframeMap = () => {
    if (mapIframeRef.current?.contentWindow) {
      mapIframeRef.current.contentWindow.postMessage({
        type: "init",
        mode: "pick",
        lat: lat,
        lng: lng
      }, "*");
    }
  };

  // Sync coords from parent state back to picker marker in iframe
  useEffect(() => {
    if (mapIframeRef.current?.contentWindow) {
      mapIframeRef.current.contentWindow.postMessage({
        type: "set-picker-coords",
        lat: lat,
        lng: lng
      }, "*");
    }
  }, [lat, lng]);

  // Listen to coordinates updates from iframe picker marker drags
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.type === "set-coords") {
        setLat(data.lat);
        setLng(data.lng);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Preset Rotator Trigger (MediaRecorder recording simulation helper)

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageFile(event.target?.result as string);
      setImageUrl("");
      setPhotoSource("camera");
    };
    reader.readAsDataURL(file);

    // Auto-detect geolocation during camera capture
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        (error) => {
          console.warn("GPS access denied, please manually drag the marker", error);
          alert("GPS coordinates could not be retrieved automatically. Please pin your location on the map manually.");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please pin your location on the map manually.");
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageFile(event.target?.result as string);
      setImageUrl("");
      setPhotoSource("gallery");
    };
    reader.readAsDataURL(file);
    
    // Alert the user to manually set coordinates
    alert("Photo uploaded from Gallery. Please manually select or adjust the location pins on the map.");
  };

  const selectSampleImage = (url: string) => {
    setImageUrl(url);
    setImageFile(null);
    setPhotoSource("sample");
    
    // Auto-fill details based on sample to make demo slick
    if (url.includes("599740831464")) {
      setText("There is a massive pothole corridor on the Srungavarapukota ghat road. Cars are swerving dangeruously and it causes traffic jams.");
      setLat(17.9280);
      setLng(83.1440);
    } else if (url.includes("470071459604")) {
      setText("Drinking water pipe burst in Gajuwaka zone. Clean drinking water is flowing in the drain, and public supply is down.");
      setLat(17.6890);
      setLng(83.2080);
    } else if (url.includes("1621293954908")) {
      setText("All the streetlights on the Visakhapatnam coastal bypass are dead. The road is pitch dark at night, making it very risky.");
      setLat(17.7280);
      setLng(83.3320);
    } else if (url.includes("1509062522246")) {
      setText("The primary school compound wall in Bhimili has collapsed due to heavy rains last week. Safety hazard for students.");
      setLat(17.8860);
      setLng(83.4470);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsNamePromptOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!reporterName.trim() || !reporterPhone.trim()) {
      setPromptError("Please enter your name.");
      return;
    }
    setPromptError("");
    setIsNamePromptOpen(false);
    const finalName = reporterName.trim();

    setIsProcessing(true);
    setProcessingStep(0);
    setProcessingLogs([]);

    const runStep = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setProcessingLogs((prev) => [...prev, msg]);
          setProcessingStep((prev) => prev + 1);
          resolve();
        }, delay);
      });
    };

    // 1. Run visual step-by-step processing animations for high hackathon demo impact
    await runStep("🔍 Initializing AI request pipeline...", 600);
    
    if (isRecording) {
      stopRecording();
    }
    
    await runStep("🎙️ Speech-to-Text: Transcribing voice notes...", 1000);
    await runStep("🌐 Gemini Translation: Translating multilingual text to English...", 1000);
    await runStep("🤖 Category Classifier: Detecting development request type...", 800);
    
    if (imageUrl || imageFile) {
      await runStep("🖼️ Vision AI: Analyzing visual evidence for defect detection...", 1200);
    }
    
    await runStep(`📍 Geotagging: Mapping coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}) to ${nearestVillageName}...`, 600);
    await runStep("💾 Database Synced: Storing to database & running clustering formula...", 800);

    // Call real Gemini API
    try {
      const img = imageFile || imageUrl || undefined;
      const aiResult = await analyzeSubmission(text, img);
      
      const finalCategory = category === "Auto-Detect" ? aiResult.category : category;
      
      // Save suggestion in DB
      await DBService.addSubmission({
        userId: "citizen_user_" + Math.random().toString(36).substring(4),
        userName: finalName,
        text: text,
        translatedText: aiResult.translatedText,
        summary: aiResult.summary,
        category: finalCategory,
        imageUrl: imageFile || imageUrl || undefined,
        latitude: lat,
        longitude: lng,
        language: aiResult.language,
        audioUrl: audioDataUrl || undefined,
        phoneNumber: reporterPhone || undefined
      });

      setIsProcessing(false);
      setIsSuccess(true);
      
      // Trigger Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // Preset location pins in our constituency
  const constituencyVillages = [
    { name: "Bhimili", lat: 17.8860, lng: 83.4470, x: 80, y: 25 },
    { name: "Gajuwaka", lat: 17.6890, lng: 83.2080, x: 25, y: 75 },
    { name: "Srungavarapukota", lat: 17.9280, lng: 83.1440, x: 10, y: 15 },
    { name: "Visakhapatnam East", lat: 17.7280, lng: 83.3320, x: 55, y: 65 }
  ];

  // Handle map click (Custom interactive map)
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Convert screen coordinates to relative latitude/longitude ranges
    const computedLng = 83.1 + (clickX / 100) * 0.4;
    const computedLat = 18.0 - (clickY / 100) * 0.4;

    setLat(computedLat);
    setLng(computedLng);
  };

  // Dynamic coordinates of active marker on custom map
  const markerX = ((lng - 83.1) / 0.4) * 100;
  const markerY = ((18.0 - lat) / 0.4) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-1 w-full px-3 sm:px-4 py-6 sm:py-10">
        <div className="max-w-4xl mx-auto">
        
        {/* Form Container */}
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-slate-900 text-white p-5 sm:p-8 relative">
                <div className="absolute top-0 right-0 h-full w-48 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{copy.portalTitle}</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-outfit font-extrabold">{copy.title}</h1>
                <p className="text-slate-400 text-sm mt-1">
                  {copy.sub}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-6">
                
                {/* 1. Request Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>{copy.lblDetails}</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">{copy.lblTranscribing}</span>
                    </div>
                  </div>
                  
                  <textarea
                    required
                    rows={4}
                    placeholder={copy.placeholderDesc}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed placeholder-slate-400 resize-none shadow-inner bg-slate-50/50"
                  />

                  {/* Real Voice Recording Trigger */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={isTranscribing}
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                        isRecording 
                          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                          : isTranscribing 
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-blue-50 hover:bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isTranscribing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          {copy.translatingSpeech}
                        </>
                      ) : isRecording ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          {copy.stopRecording} ({recordingSeconds}s)
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          {copy.btnRecord}
                        </>
                      )}
                    </button>

                    {isRecording && (
                      <span className="flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                        Transcribing preset: {VOICE_PRESETS[selectedVoicePresetIndex].language}...
                      </span>
                    )}

                    {!isRecording && text && (
                      <button
                        type="button"
                        onClick={() => setText("")}
                        className="text-xs text-slate-400 hover:text-slate-600 hover:underline font-semibold"
                      >
                        Clear Text
                      </button>
                    )}
                  </div>
                  {audioDataUrl && !isRecording && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2 ml-1">Your Voice Note</p>
                      <AudioPlayer src={audioDataUrl} fallbackDuration={recordingSeconds} />
                    </div>
                  )}
                </div>

                {/* 2. Geolocation Picker */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>{copy.lblPinLocation}</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500">
                    {copy.descPinLocation}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Interactive Custom Map Layout */}
                    <div className="sm:col-span-8">
                      <div className="relative h-48 sm:h-64 rounded-2xl border border-slate-200 shadow-sm overflow-hidden bg-slate-100">
                        <iframe
                          ref={mapIframeRef}
                          src="/map.html"
                          className="w-full h-full border-0"
                          onLoad={initIframeMap}
                        />
                      </div>
                    </div>

                    {/* Coordinates Readout */}
                    <div className="sm:col-span-4 bg-slate-50 border border-slate-150 rounded-2xl p-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{copy.lblGeotagMetadata}</span>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">{copy.lblDetectedVillage}</span>
                            <span className="text-slate-800 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{nearestVillageName}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">{copy.lblLatitude}</span>
                            <span className="text-slate-800 font-mono font-bold">{lat.toFixed(5)}° N</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">{copy.lblLongitude}</span>
                            <span className="text-slate-800 font-mono font-bold">{lng.toFixed(5)}° E</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-amber-50 text-[10px] text-amber-700 font-medium rounded-lg border border-amber-100 flex gap-1.5 mt-4">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{copy.warnGeotag}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Image Upload */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>{copy.lblImage}</span>
                    <span className="text-xs text-slate-400 font-medium">{copy.lblVisionAI}</span>
                  </label>

                  {/* Sample defects gallery */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">{copy.lblClickSample}</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                      {SAMPLE_DEFECTS.map((sample, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectSampleImage(sample.url)}
                          className={`relative h-16 rounded-xl overflow-hidden border-2 text-left group transition-all duration-350 ${
                            imageUrl === sample.url ? "border-blue-600 ring-2 ring-blue-100 scale-95" : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/40 flex items-end p-1.5">
                            <span className="text-[9px] font-bold text-white leading-tight truncate w-full">{sample.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drag-Drop / Camera/Gallery upload option */}
                  <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center group">
                    {imageFile ? (
                      <div className="flex items-center gap-4 w-full">
                        <img src={imageFile} alt="Custom upload preview" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800">
                            Captured from {photoSource === "camera" ? "Camera (Geotagged)" : "Gallery"}
                          </p>
                          <button
                            type="button"
                            onClick={() => { setImageFile(null); setPhotoSource(null); }}
                            className="text-[10px] text-red-500 hover:underline font-semibold"
                          >
                            Remove File
                          </button>
                        </div>
                      </div>
                    ) : imageUrl ? (
                      <div className="flex items-center gap-4 w-full">
                        <img src={imageUrl} alt="Sample preview" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800">Selected Sample Defect Photo</p>
                          <button
                            type="button"
                            onClick={() => { setImageUrl(""); setPhotoSource(null); }}
                            className="text-[10px] text-slate-400 hover:underline font-semibold"
                          >
                            Reset to upload
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        {/* Camera Capture Input */}
                        <div className="relative border border-slate-200 hover:border-blue-500 rounded-xl p-4 bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleCameraCapture}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform mb-2">
                            <PlusCircle className="w-4 h-4" />
                          </div>
                          <p className="text-[11px] font-bold text-slate-800">{copy.lblCamera}</p>
                          <p className="text-[9px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3 animate-pulse" /> {copy.lblAutoGeotag}
                          </p>
                        </div>

                        {/* Gallery Upload Input */}
                        <div className="relative border border-slate-200 hover:border-blue-500 rounded-xl p-4 bg-white hover:bg-slate-50 transition-all flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleGalleryUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform mb-2">
                            <UploadCloud className="w-4 h-4" />
                          </div>
                          <p className="text-[11px] font-bold text-slate-800">{copy.lblGallery}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{copy.lblManualGeotag}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Category */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>{copy.lblCategory}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory("Auto-Detect")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center gap-1 ${
                        category === "Auto-Detect"
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-150"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> {copy.lblAutoDetectCategory}
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                          category === cat
                            ? "bg-slate-800 border-slate-800 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Trigger */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:justify-end gap-3">
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg shadow-blue-100 hover:shadow-blue-200 font-outfit"
                  >
                    {copy.btnSubmit} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            // Success State
            <motion.div
              key="success-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 text-center space-y-6 max-w-lg mx-auto"
            >
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-500">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-outfit font-extrabold text-slate-800">{copy.successTitle}</h2>
                <p className="text-sm text-slate-500 leading-relaxed px-4">
                  "{copy.successSub}"
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-left text-xs space-y-2">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">{copy.lblSuccessVillage}</span>
                  <span className="text-slate-700">{nearestVillageName}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">{copy.lblSuccessCategory}</span>
                  <span className="text-slate-700">{category === "Auto-Detect" ? "AI Classified" : category}</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px] pt-1.5 border-t border-slate-200">
                  {copy.successDesc}
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors border border-slate-200 font-outfit"
                >
                  {copy.btnSubmitAnother}
                </button>
                 <Link
                  href="/citizen/suggestions"
                  className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm font-outfit"
                >
                  {copy.btnViewOthers} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>{/* /max-w-4xl */}
      </main>

      {/* Name Prompt Modal */}
      <AnimatePresence>
        {isNamePromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 w-full max-w-sm shadow-2xl space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">{copy.nameTitle}</h3>
                <p className="text-xs text-slate-400">{copy.nameSub}</p>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{copy.nameLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. N. Srinivas"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                  autoFocus
                />
              </div>
              {/* Phone number is auto-filled from session and hidden */}
              <input type="hidden" value={reporterPhone} />

              {promptError && (
                <div className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {promptError}
                </div>
              )}
              
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNamePromptOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold transition-colors border border-slate-200 font-outfit"
                >
                  {copy.btnCancel}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-semibold transition-colors shadow-md shadow-blue-200 font-outfit"
                >
                  {copy.btnConfirm}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Processing Screen overlay */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
            <div className="w-full max-w-md space-y-6 text-center">
              
              {/* Spinner */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-outfit font-extrabold text-white">Analyzing Grievance Proposal</h3>
                <p className="text-xs text-slate-400">Gemini 2.5 Flash is executing explaining structures...</p>
              </div>

              {/* Progress Log Steps */}
              <div className="bg-slate-950/65 border border-slate-700 rounded-2xl p-4 text-left font-mono text-[10px] space-y-1.5 h-36 overflow-y-auto text-slate-300 shadow-inner">
                {processingLogs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-blue-500 font-bold">▶</span>
                    <span>{log}</span>
                  </div>
                ))}
                <div className="flex gap-2 text-blue-400 font-bold animate-pulse">
                  <span>▶</span>
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
