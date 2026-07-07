import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRAJA_KEYS } from "@/services/prajaKeys";

export async function POST(req: Request) {
  try {
    const { messages, contextData } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const systemPrompt = `You are "Praja Prathinidhi", an AI aide and intelligence assistant for the Member of Parliament (MP) of Visakhapatnam.
Always address the user as "sir". Be polite, professional, and concise.
You have access to the following current context data about citizen submissions and priority clusters:
${JSON.stringify(contextData, null, 2)}

Your job is to answer the MP's questions based ONLY on this context data. If they ask about priorities, list the top priority clusters. If they ask about specific categories (like Roads or Water), filter and summarize the data for them. Keep answers structured, easy to read, and actionable.`;

    // Build history: exclude last message (sent via sendMessage), ensure starts with 'user'
    const rawHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));
    // Gemini requires history starts with 'user' role
    while (rawHistory.length > 0 && rawHistory[0].role === "model") {
      rawHistory.shift();
    }

    const lastMessage = messages[messages.length - 1].content;

    // Try each key in turn, rotating on quota/rate-limit errors
    let lastError: any;
    for (const key of PRAJA_KEYS) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          systemInstruction: systemPrompt
        });

        const chat = model.startChat({
          history: rawHistory,
          generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
        });

        const result = await chat.sendMessage(lastMessage);
        const text = result.response.text();
        return NextResponse.json({ reply: text });

      } catch (err: any) {
        lastError = err;
        const is429 = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota");
        if (!is429) {
          throw err; // Non-quota error — fail fast
        }
        console.warn("Quota hit on key, rotating to next...");
      }
    }

    // All 20 keys exhausted
    console.error("All Praja API keys exhausted:", lastError?.message);
    return NextResponse.json({ error: "All API keys are currently rate-limited. Please try again in a moment." }, { status: 429 });

  } catch (error: any) {
    console.error("Praja Prathinidhi API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
  }
}
