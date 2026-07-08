import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 });
    }

    if (action === "translate") {
      const { input, sourceLanguageCode, targetLanguageCode } = body;
      const res = await fetch("https://api.sarvam.ai/translate", {
        method: "POST",
        headers: {
          "api-subscription-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
          source_language_code: sourceLanguageCode,
          target_language_code: targetLanguageCode,
          model: "sarvam-translate:v1",
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json({ error: `Sarvam API error: ${errorText}` }, { status: res.status });
      }

      const data = await res.json();
      return NextResponse.json({ translatedText: data.translated_text });
    }

    if (action === "tts") {
      const { text, targetLanguageCode } = body;
      
      // Determine speaker voice based on language
      let speaker = "aditya";
      if (targetLanguageCode === "te-IN") {
        speaker = "kavitha";
      } else if (targetLanguageCode === "hi-IN") {
        speaker = "shubh";
      } else if (targetLanguageCode === "ta-IN") {
        speaker = "kavitha";
      }

      const res = await fetch("https://api.sarvam.ai/text-to-speech", {
        method: "POST",
        headers: {
          "api-subscription-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          speaker,
          model: "bulbul:v3",
          target_language_code: targetLanguageCode,
          speech_sample_rate: 8000,
          output_audio_codec: "wav",
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json({ error: `Sarvam API error: ${errorText}` }, { status: res.status });
      }

      const data = await res.json();
      const base64Audio = data.audios?.[0] || "";
      const audioUrl = `data:audio/wav;base64,${base64Audio}`;
      return NextResponse.json({ audioUrl });
    }

    if (action === "stt") {
      const { audio, mimeType, languageCode } = body;
      
      const base64Data = audio.includes(",") ? audio.split(",")[1] : audio;
      const buffer = Buffer.from(base64Data, "base64");
      
      // Robustly detect format from magic bytes to handle different mobile audio containers
      let detectedMime = "audio/webm";
      let detectedExt = "webm";

      if (buffer.length > 8) {
        const magic32 = buffer.readUInt32BE(0);
        // RIFF -> WAV
        if (magic32 === 0x52494646) {
          detectedMime = "audio/wav";
          detectedExt = "wav";
        }
        // EBML -> WEBM (1A 45 DF A3)
        else if (magic32 === 0x1A45DFA3) {
          detectedMime = "audio/webm";
          detectedExt = "webm";
        }
        // MP4 ftyp box (bytes 4-7 equal 'ftyp')
        else if (buffer.toString("ascii", 4, 8) === "ftyp") {
          detectedMime = "audio/mp4";
          detectedExt = "mp4";
        }
        // ADTS AAC frame starts with 0xFFF or 0xFF0
        else if (buffer[0] === 0xFF && (buffer[1] & 0xF0) === 0xF0) {
          detectedMime = "audio/aac";
          detectedExt = "aac";
        }
        // ID3 v2 (MP3) -> ID3
        else if (buffer.toString("ascii", 0, 3) === "ID3") {
          detectedMime = "audio/mp3";
          detectedExt = "mp3";
        }
        // MP3 frame sync (first 11 bits set 0xFFE / 0xFFF)
        else if (buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0) {
          detectedMime = "audio/mp3";
          detectedExt = "mp3";
        }
        // Fallback: Check provided mimeType
        else if (mimeType) {
          const lowerMime = mimeType.toLowerCase();
          if (lowerMime.includes("mp4") || lowerMime.includes("m4a") || lowerMime.includes("aac")) {
            detectedMime = "audio/mp4";
            detectedExt = "mp4";
          } else if (lowerMime.includes("wav")) {
            detectedMime = "audio/wav";
            detectedExt = "wav";
          } else if (lowerMime.includes("ogg")) {
            detectedMime = "audio/ogg";
            detectedExt = "ogg";
          } else if (lowerMime.includes("mp3") || lowerMime.includes("mpeg")) {
            detectedMime = "audio/mp3";
            detectedExt = "mp3";
          }
        }
      }

      const formData = new FormData();
      const blob = new Blob([buffer], { type: detectedMime });
      formData.append("file", blob, `audio.${detectedExt}`);
      formData.append("model", "saaras:v3");
      formData.append("mode", "transcribe");
      formData.append("language_code", languageCode || "en-IN");

      const res = await fetch("https://api.sarvam.ai/speech-to-text", {
        method: "POST",
        headers: {
          "api-subscription-key": apiKey,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json({ error: `Sarvam API error: ${errorText}` }, { status: res.status });
      }

      const data = await res.json();
      return NextResponse.json({ transcript: data.transcript });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("API Router Error in sarvam:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
