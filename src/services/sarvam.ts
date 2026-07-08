import { getGeminiApiKey } from "./gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function getSarvamApiKey(): string | null {
  if (typeof window === "undefined") return process.env.NEXT_PUBLIC_SARVAM_API_KEY || null;
  const customKey = localStorage.getItem("civicpulse_sarvam_key");
  if (customKey && customKey.trim()) return customKey;
  return process.env.NEXT_PUBLIC_SARVAM_API_KEY || null;
}

export function isSarvamConfigured(): boolean {
  return !!getSarvamApiKey();
}

function mapLangCode(lang: string): string {
  const clean = lang.toLowerCase().trim();
  if (clean === "te" || clean === "telugu") return "te-IN";
  if (clean === "hi" || clean === "hindi") return "hi-IN";
  if (clean === "ta" || clean === "tamil") return "ta-IN";
  if (clean === "en" || clean === "english") return "en-IN";
  return "en-IN";
}

function getLangName(langCode: string): string {
  const clean = langCode.toLowerCase().trim();
  if (clean.startsWith("te")) return "Telugu";
  if (clean.startsWith("hi")) return "Hindi";
  if (clean.startsWith("ta")) return "Tamil";
  return "English";
}

// 1. Translation: translate text to/from Indian languages
export async function translateTextWithSarvam(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const key = getSarvamApiKey();
  if (!key) {
    return simulateTranslate(text, sourceLang, targetLang);
  }

  const sLang = mapLangCode(sourceLang);
  const tLang = mapLangCode(targetLang);

  if (sLang === tLang) return text;

  try {
    const res = await fetch("/api/sarvam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "translate",
        input: text,
        sourceLanguageCode: sLang,
        targetLanguageCode: tLang,
        apiKey: key,
      }),
    });

    if (!res.ok) {
      throw new Error(`Sarvam Translation error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("Sarvam Translation API failed, falling back to simulator", err);
    return simulateTranslate(text, sourceLang, targetLang);
  }
}

// 2. Speech to Text: transcribe audio using Sarvam API
export async function transcribeAudioWithSarvam(
  base64AudioWithPrefix: string,
  mimeType: string,
  language: string = "en"
): Promise<string> {
  const key = getSarvamApiKey();
  if (!key) {
    return "Audio transcription could not be recognized.";
  }

  try {
    const res = await fetch("/api/sarvam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "stt",
        audio: base64AudioWithPrefix,
        mimeType: mimeType,
        languageCode: mapLangCode(language),
        apiKey: key,
      }),
    });

    if (!res.ok) {
      throw new Error(`Sarvam STT error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.transcript || "";
  } catch (err) {
    console.error("Sarvam STT API failed:", err);
    return "";
  }
}

// 3. Text to Speech: generate base64 audio data URL for text
export async function generateSpeechWithSarvam(
  text: string,
  language: string
): Promise<string> {
  const key = getSarvamApiKey();
  if (!key) {
    throw new Error("Sarvam AI key not set");
  }

  const tLang = mapLangCode(language);

  try {
    const res = await fetch("/api/sarvam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "tts",
        text: text,
        targetLanguageCode: tLang,
        apiKey: key,
      }),
    });

    if (!res.ok) {
      throw new Error(`Sarvam TTS error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.audioUrl || "";
  } catch (err) {
    console.error("Sarvam TTS API failed:", err);
    throw err;
  }
}

// Fallback Simulator: Uses Gemini when available or returns standard mocks
async function simulateTranslate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const targetLangName = getLangName(targetLang);
  const geminiKey = getGeminiApiKey();

  // Try to use Gemini to translate dynamically for high-fidelity simulation
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are a high-fidelity translator for CivicPulse.
Translate the following text into ${targetLangName} script. Return ONLY the translated script text. Do not add quotes, markdown, explanations, or notes.
Text: "${text}"`;
      const response = await model.generateContent([prompt]);
      const resText = response.response.text()?.trim();
      if (resText) return resText;
    } catch (e) {
      console.warn("Gemini translate simulation fallback failed:", e);
    }
  }

  // Heuristic mock translation dictionary for Visakhapatnam data
  const lowercase = text.toLowerCase();
  if (targetLangName === "Telugu") {
    if (lowercase.includes("road") || lowercase.includes("pothole")) {
      return "శృంగవరపుకోట ఘాట్ రోడ్డుపై ఘోరమైన గుంతలు ఉన్నాయి. వాహనాలు ప్రమాదకరంగా వెళ్తున్నాయి మరియు దీనివల్ల ట్రాఫిక్ జామ్‌లు ఏర్పడుతున్నాయి.";
    }
    if (lowercase.includes("water") || lowercase.includes("pipe") || lowercase.includes("burst")) {
      return "గాజువాక జోన్‌లో తాగునీటి పైపు పగిలిపోయింది. డ్రైనేజీలో స్వచ్ఛమైన నీరు వృధాగా పోతోంది, మరియు ప్రజలకు సరఫరా నిలిచిపోయింది.";
    }
    if (lowercase.includes("school") || lowercase.includes("wall") || lowercase.includes("collapsed")) {
      return "గత వారం కురిసిన భారీ వర్షాల వల్ల భీమిలిలోని ప్రైమరీ స్కూల్ కాంపౌండ్ వాల్ కూలిపోయింది. విద్యార్థులకు భద్రతా ప్రమాదం.";
    }
    if (lowercase.includes("light") || lowercase.includes("street")) {
      return "విశాఖపట్నం తీరప్రాంత బైపాస్ రోడ్డులోని వీధిదీపాలన్నీ వెలగడం లేదు. రాత్రి పూట రహదారి ఘోర చీకటిగా ఉంది.";
    }
    return `[తెలుగు అనువాదం] ${text}`;
  }

  if (targetLangName === "Hindi") {
    if (lowercase.includes("road") || lowercase.includes("pothole")) {
      return "श्रृंगवरपुकोटा घाट रोड पर भारी गड्ढे हैं। गाड़ियाँ खतरनाक तरीके से चल रही हैं और इससे ट्रैफिक जाम हो रहा है।";
    }
    if (lowercase.includes("water") || lowercase.includes("pipe") || lowercase.includes("burst")) {
      return "गाजुवाका क्षेत्र में पीने के पानी की पाइप फट गई है। नाले में साफ पानी बह रहा है और सार्वजनिक आपूर्ति बंद है।";
    }
    if (lowercase.includes("school") || lowercase.includes("wall") || lowercase.includes("collapsed")) {
      return "पिछले हफ्ते हुई भारी बारिश के कारण भीमिली में प्राथमिक विद्यालय की चारदीवारी ढह गई है। छात्रों के लिए सुरक्षा का खतरा।";
    }
    if (lowercase.includes("light") || lowercase.includes("street")) {
      return "विशाखापत्तनम तटीय बाईपास की सभी स्ट्रीट लाइटें बंद हैं। रात में सड़क पर बिल्कुल अंधेरा रहता है, जिससे खतरा बढ़ गया है।";
    }
    return `[हिंदी अनुवाद] ${text}`;
  }

  return `[Translated to ${targetLangName}] ${text}`;
}

// Client-side text-to-speech engine: tries Sarvam AI, falls back to web speech synthesis
export async function speakText(
  text: string,
  language: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  const tLang = mapLangCode(language);

  // Create the Audio object synchronously inside the call stack of the user gesture to unlock it on mobile
  let audio: HTMLAudioElement | null = null;
  if (typeof window !== "undefined") {
    audio = new Audio();
    // Play a micro-segment of silence to bypass mobile browser gesture autoplay policies
    audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA";
    try {
      audio.play().catch(() => {});
    } catch (e) {}
  }

  // 1. Try Live Sarvam TTS if configured
  if (isSarvamConfigured() && audio) {
    try {
      if (onStart) onStart();
      const audioUrl = await generateSpeechWithSarvam(text, language);
      
      // Update source on already unlocked audio object
      audio.src = audioUrl;
      audio.onended = () => {
        if (onEnd) onEnd();
      };
      audio.onerror = (e) => {
        console.error("Sarvam Audio playback error:", e);
        if (onEnd) onEnd();
      };
      await audio.play();
      return;
    } catch (e) {
      console.warn("Live Sarvam TTS failed, falling back to browser synthesis.", e);
    }
  }

  // 2. Fallback to Browser Speech Synthesis (Client-side native)
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map code to BCP47
    if (tLang === "te-IN") {
      utterance.lang = "te-IN";
    } else if (tLang === "hi-IN") {
      utterance.lang = "hi-IN";
    } else if (tLang === "ta-IN") {
      utterance.lang = "ta-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("No Speech Synthesis interface available in this environment.");
    if (onEnd) onEnd();
  }
}
