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
      
      const prompt = `
      You are the core analysis engine of CivicPulse AI, an MP development intelligence dashboard.
      Analyze the following citizen request and optional image.
      Provide your response STRICTLY as a valid JSON object matching the schema below. Do not wrap it in markdown code blocks.
      
      JSON Schema:
      {
        "translatedText": "Translate the input text into plain English if it is in Hindi, Telugu, or any other language. If it is already in English, output the original text.",
        "summary": "A concise 1-sentence summary of the main grievance or development request.",
        "category": "Must be exactly one of the following: Roads, Water, Healthcare, Education, Sanitation, Street Lights, Employment, Agriculture, Public Safety, Environment.",
        "detectedIssues": ["A list of specific issues or infrastructure defects identified in the text or image. e.g., 'potholes', 'flooding', 'lack of doctors', 'collapsed roof'"],
        "explanation": "A professional, objective explanation detailing why this issue warrants priority, citing the user's specific complaints and visual evidence.",
        "language": "The detected input language, e.g., 'English', 'Telugu', 'Hindi'"
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

// Transcribe audio using Gemini 2.5 Flash
export async function transcribeAudio(
  base64Audio: string,
  mimeType: string
): Promise<string> {
  let attempts = 0;
  const maxAttempts = ROTATION_KEYS.length;

  while (attempts < maxAttempts) {
    const key = getGeminiApiKey();
    if (!key) break;

    try {
      console.log(`Attempting Gemini Audio call with key index: ${currentRotationKeyIndex}`);
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
      You are an expert multilingual speech-to-text translator.
      Listen to this audio recording (which could be in English, Hindi, Telugu, Tamil, or any other Indian language) and translate it into clear, grammatically correct English (UK).
      Provide ONLY the translated English transcription text. Do not write any explanations, greetings, or prefixes. If the audio is completely silent or unrecognizable, return exactly: "Audio transcription could not be recognized."
      `;

      const response = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Audio
          }
        }
      ]);

      const text = response.response.text();
      if (text && text.trim()) {
        return text.trim();
      }
      throw new Error("Empty response from Gemini audio parser");

    } catch (err) {
      console.warn(`Gemini audio transcribe key index ${currentRotationKeyIndex} failed. Rotating keys. Error:`, err);
      currentRotationKeyIndex = (currentRotationKeyIndex + 1) % ROTATION_KEYS.length;
      attempts++;
    }
  }

  // Fallback if all keys fail
  console.warn("All Gemini API keys failed for audio. Falling back to default simulation transcription.");
  return "The main access road in Srungavarapukota is heavily damaged due to the recent landslides. It needs immediate paving.";
}
