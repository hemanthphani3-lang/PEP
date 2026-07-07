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
        speaker = "meera";
      } else if (targetLanguageCode === "hi-IN") {
        speaker = "shubh";
      } else if (targetLanguageCode === "ta-IN") {
        speaker = "meera";
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
      
      const formData = new FormData();
      const blob = new Blob([buffer], { type: mimeType || "audio/webm" });
      formData.append("file", blob, "audio.webm");
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
