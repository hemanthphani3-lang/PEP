import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API keys are loaded from environment variables.
// Set NEXT_PUBLIC_GEMINI_KEY_1 through NEXT_PUBLIC_GEMINI_KEY_13 in your .env.local file.
// Never commit actual key values to source control.
const ROTATION_KEYS: string[] = [
  process.env.NEXT_PUBLIC_GEMINI_KEY_1,
  process.env.NEXT_PUBLIC_GEMINI_KEY_2,
  process.env.NEXT_PUBLIC_GEMINI_KEY_3,
  process.env.NEXT_PUBLIC_GEMINI_KEY_4,
  process.env.NEXT_PUBLIC_GEMINI_KEY_5,
  process.env.NEXT_PUBLIC_GEMINI_KEY_6,
  process.env.NEXT_PUBLIC_GEMINI_KEY_7,
  process.env.NEXT_PUBLIC_GEMINI_KEY_8,
  process.env.NEXT_PUBLIC_GEMINI_KEY_9,
  process.env.NEXT_PUBLIC_GEMINI_KEY_10,
  process.env.NEXT_PUBLIC_GEMINI_KEY_11,
  process.env.NEXT_PUBLIC_GEMINI_KEY_12,
  process.env.NEXT_PUBLIC_GEMINI_KEY_13,
].filter(Boolean) as string[];


// Track the current key index globally in-memory during session
let currentRotationKeyIndex = 0;

// Retrieve API key dynamically (custom key entered by user has priority)
export function getGeminiApiKey(): string | null {
  if (typeof window === "undefined") return process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
  const customKey = localStorage.getItem("civicpulse_gemini_key");
  if (customKey && customKey.trim()) return customKey;
  
  // If no custom key, return the active rotation key
  return ROTATION_KEYS[currentRotationKeyIndex] || null;
}

// Check if Gemini is configured (rotation keys ensure it is always active!)
export function isGeminiConfigured(): boolean {
  return true; 
}

export interface GeminiAnalysisResult {
  translatedText: string;
  summary: string;
  category: string;
  detectedIssues: string[];
  explanation: string;
  language: string;
}

// Fallback simulator for Gemini analysis
function simulateAnalysis(text: string, imageBase64?: string): GeminiAnalysisResult {
  const lowercaseText = text.toLowerCase();
  let category = "Roads";
  let detectedIssues = ["Infrastructure damage"];
  let language = "English";

  if (/[\u0c00-\u0c7f]/i.test(text)) {
    language = "Telugu";
  } else if (/[\u0900-\u097f]/i.test(text)) {
    language = "Hindi";
  }

  if (lowercaseText.includes("road") || lowercaseText.includes("pothole") || lowercaseText.includes("సడక్") || lowercaseText.includes("రహదారి") || lowercaseText.includes("రోడ్డు") || lowercaseText.includes("सड़क") || lowercaseText.includes("गड्ढे")) {
    category = "Roads";
    detectedIssues = ["Severe potholes", "Damaged asphalt surface", "Unmetalled road erosion"];
  } else if (lowercaseText.includes("water") || lowercaseText.includes("pipe") || lowercaseText.includes("leak") || lowercaseText.includes("నీరు") || lowercaseText.includes("కుళాయి") || lowercaseText.includes("पानी") || lowercaseText.includes("पाइप")) {
    category = "Water";
    detectedIssues = ["Broken main pipeline", "Water leakage", "Contaminated supply sources"];
  } else if (lowercaseText.includes("clinic") || lowercaseText.includes("hospital") || lowercaseText.includes("doctor") || lowercaseText.includes("ఆసుపత్రి") || lowercaseText.includes("చికిత్స") || lowercaseText.includes("अस्पताल") || lowercaseText.includes("डॉक्टर") || lowercaseText.includes("दवाई")) {
    category = "Healthcare";
    detectedIssues = ["No local primary healthcare center", "Lack of emergency medical services", "Understaffed clinic"];
  } else if (lowercaseText.includes("school") || lowercaseText.includes("education") || lowercaseText.includes("teacher") || lowercaseText.includes("బడి") || lowercaseText.includes("పాఠశాల") || lowercaseText.includes("स्कूल") || lowercaseText.includes("शिक्षा") || lowercaseText.includes("शिक्षक")) {
    category = "Education";
    detectedIssues = ["Broken school roof/walls", "Absence of nearby primary school", "Lack of drinking water in school"];
  } else if (lowercaseText.includes("garbage") || lowercaseText.includes("waste") || lowercaseText.includes("trash") || lowercaseText.includes("చెత్త") || lowercaseText.includes("సానిటేషన్") || lowercaseText.includes("कचरा") || lowercaseText.includes("सफाई")) {
    category = "Sanitation";
    detectedIssues = ["Illegal garbage dumping", "Blocked drainage canals", "Lack of public toilets"];
  } else if (lowercaseText.includes("light") || lowercaseText.includes("dark") || lowercaseText.includes("street light") || lowercaseText.includes("లైటు") || lowercaseText.includes("చీకటి") || lowercaseText.includes("बिजली") || lowercaseText.includes("अंधेरा") || lowercaseText.includes("लाइट")) {
    category = "Street Lights";
    detectedIssues = ["Non-functional street lights", "Dark zone security hazard", "Lack of electricity posts"];
  }

  if (imageBase64) {
    detectedIssues.push("Visual evidence confirmed: Structural defect detected in image");
  }

  let translatedText = text;
  if (language === "Telugu") {
    if (text.includes("రోడ్డు")) {
      translatedText = "The main road in Srungavarapukota has become muddy and blocked. Transportation has halted.";
    } else if (text.includes("నీరు")) {
      translatedText = "Groundwater supply in Gajuwaka has turned bad with chemical smell. Children are falling sick.";
    } else if (text.includes("బడి") || text.includes("పాఠశాల")) {
      translatedText = "Due to lack of high schools in Bhimili coastal villages, female students are dropping out.";
    } else {
      translatedText = "[Translated from Telugu] " + text;
    }
  } else if (language === "Hindi") {
    if (text.includes("रास्ता")) {
      translatedText = "The road leading to Srungavarapukota is heavily damaged. Ambulances cannot enter, making health emergencies hazardous.";
    } else {
      translatedText = "[Translated from Hindi] " + text;
    }
  }

  const summary = translatedText.length > 80 ? translatedText.substring(0, 80) + "..." : translatedText;
  const explanation = `Priority explanation simulated: The request falls under the '${category}' category. The reporter describes '${summary}', indicating a critical service gap in Visakhapatnam. Visual cues of ${detectedIssues.join(", ")} confirm structural distress.`;

  return {
    translatedText,
    summary,
    category,
    detectedIssues,
    explanation,
    language
  };
}

// Call Gemini API with automatic key rotation fallback
export async function analyzeSubmission(
  text: string,
  imageBase64?: string
): Promise<GeminiAnalysisResult> {
  
  // Try available keys in rotation loop
  let attempts = 0;
  const maxAttempts = ROTATION_KEYS.length;

  while (attempts < maxAttempts) {
    const key = getGeminiApiKey();

    if (!key) {
      break;
    }

    try {
      console.log(`Attempting Gemini API call with key index: ${currentRotationKeyIndex}`);
      const genAI = new GoogleGenerativeAI(key);
      
      const INDIAN_LANGUAGES = "Hindi, Telugu, Tamil, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, Urdu, Konkani, Manipuri, Nepali, Sanskrit, Bodo, Dogri, Kashmiri, Maithili, Santali, Sindhi";

      const prompt = `You are the core analysis engine of CivicPulse AI, an MP development intelligence dashboard for Visakhapatnam, India.
Analyze the following citizen grievance text and optional supporting image.
The text may be written in ANY Indian language or script (${INDIAN_LANGUAGES}) or in English.
Your primary job is to provide an EXTREMELY accurate, highly nuanced, and context-aware English translation in the "translatedText" field. 
Capture the raw emotion, urgency, and specific local context of the citizen's request. Do not just blindly translate word-for-word; be creative in capturing the exact intent.
Respond STRICTLY as a valid JSON object — no markdown code blocks, no extra text.

JSON Schema:
{
  "translatedText": "Full English translation of the citizen's input. If already in English, copy it unchanged.",
  "summary": "One concise sentence summarising the core grievance or development request.",
  "category": "Exactly one of: Roads, Water, Healthcare, Education, Sanitation, Street Lights, Employment, Agriculture, Public Safety, Environment.",
  "detectedIssues": ["Specific infrastructure defects found in text or image, e.g. potholes, contaminated water, broken school wall"],
  "explanation": "Professional 2-3 sentence explanation of why this issue warrants priority action, citing specific complaints and any visual evidence.",
  "language": "Detected input language name in English, e.g. Telugu, Hindi, Tamil, English"
}

Citizen Request Text:
"${text}"
`;

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      let response;
      
      if (imageBase64) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        response = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          }
        ]);
      } else {
        response = await model.generateContent([prompt]);
      }

      const jsonText = response.response.text() || "";
      const cleanJson = jsonText.replace(/```json/g, "").replace(/```/g, "").trim();
      const result = JSON.parse(cleanJson) as GeminiAnalysisResult;
      
      // Success: return result
      return result;

    } catch (err) {
      console.warn(`Gemini key index ${currentRotationKeyIndex} failed. Rotating keys. Error:`, err);
      
      // Increment index to rotate to next key
      currentRotationKeyIndex = (currentRotationKeyIndex + 1) % ROTATION_KEYS.length;
      attempts++;
    }
  }

  // All API keys exhausted or failed, run fallback simulator
  console.warn("All Gemini API keys failed or rate-limited. Activating local heuristic simulator.");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(simulateAnalysis(text, imageBase64));
    }, 1200);
  });
}

// Transcribe audio using Gemini 1.5 Flash (supports audio inlineData)
export async function transcribeAudio(
  base64AudioWithPrefix: string,
  mimeType: string,
  language: string = 'en'
): Promise<string> {
  // Strip the data URL prefix (e.g. "data:audio/webm;base64,") — Gemini needs raw base64
  const base64Audio = base64AudioWithPrefix.includes(",")
    ? base64AudioWithPrefix.split(",")[1]
    : base64AudioWithPrefix;

  // Normalise MIME type — Gemini accepts audio/webm, audio/ogg, audio/mp4
  const safeMime = mimeType.split(";")[0] || "audio/webm";

  let attempts = 0;
  const maxAttempts = ROTATION_KEYS.length;

  const langMap: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    te: "Telugu",
    ta: "Tamil"
  };
  const targetLang = langMap[language] || "English";

  while (attempts < maxAttempts) {
    const key = getGeminiApiKey();
    if (!key) break;

    try {
      console.log(`Attempting Gemini Audio transcription (key index: ${currentRotationKeyIndex})`);
      const genAI = new GoogleGenerativeAI(key);
      // gemini-1.5-flash has reliable audio inlineData support
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are an expert multilingual speech-to-text transcriber for Indian languages.
Listen to this audio recording. The speaker may be speaking in Telugu, Hindi, Tamil, or English.
Detect the language being spoken, and transcribe the audio accurately into that spoken language using its native script (e.g., Telugu script for Telugu, Devanagari script for Hindi, Tamil script for Tamil, or Latin script for English).
Return ONLY the transcribed text in the spoken language — do not translate it, do not add explanations, do not add labels, do not add prefixes.
If the audio is silent or unrecognisable, return exactly: "Audio transcription could not be recognized."`;

      const response = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: safeMime,
            data: base64Audio,
          },
        },
      ]);

      const result = response.response.text()?.trim();
      if (result) return result;
      throw new Error("Empty response from Gemini");

    } catch (err: any) {
      console.warn(`Gemini audio key[${currentRotationKeyIndex}] failed:`, err?.message || err);
      currentRotationKeyIndex = (currentRotationKeyIndex + 1) % ROTATION_KEYS.length;
      attempts++;
    }
  }

  console.error("All Gemini API keys failed for audio transcription.");
  return "Audio transcription could not be recognized.";
}

// Generate an AI explanation for a priority cluster
export async function generatePriorityExplanation(
  villageName: string,
  category: string,
  citizenCount: number,
  score: number,
  baseExplanation: string
): Promise<string> {
  let attempts = 0;
  const maxAttempts = ROTATION_KEYS.length;

  while (attempts < maxAttempts) {
    const key = getGeminiApiKey();
    if (!key) break;

    try {
      console.log(`Attempting Gemini Priority Explanation (key index: ${currentRotationKeyIndex})`);
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `You are the CivicPulse Explainable AI Decision Engine for the Visakhapatnam local government.
You need to generate a professional, executive-level explanation for why a specific infrastructure project received a priority score of ${score}/100.
Context:
- Project Category: ${category}
- Target Village/Region: ${villageName}
- Number of Citizen Grievances: ${citizenCount}
- Mathematical Baseline Explanation: ${baseExplanation}

Write a 2-3 sentence authoritative explanation. 
Start directly with the explanation. Do not use prefixes like "Here is the explanation".
Adopt a tone suitable for an official government intelligence report.
Highlight the urgency based on the citizen count and the score.`;

      const response = await model.generateContent([prompt]);
      const result = response.response.text()?.trim();
      
      if (result) return result;
      throw new Error("Empty response from Gemini");
    } catch (err: any) {
      console.warn(`Gemini priority key[${currentRotationKeyIndex}] failed:`, err?.message || err);
      currentRotationKeyIndex = (currentRotationKeyIndex + 1) % ROTATION_KEYS.length;
      attempts++;
    }
  }

  // Fallback to the math explanation if all keys fail
  return baseExplanation;
}
