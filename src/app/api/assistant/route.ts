import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let language = "en";

  try {
    const payload = await request.json();
    language = payload.language || "en";
    const { message } = payload;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const model = "deepseek-chat";

    if (!apiKey) {
      console.error("Missing DeepSeek API key: set process.env.DEEPSEEK_API_KEY");
      return NextResponse.json(
        {
          reply:
            language === "fr"
              ? "Désolé, je n’ai pas pu répondre pour le moment."
              : "Sorry, I couldn’t answer that right now.",
        },
        { status: 500 }
      );
    }

    const responseLength = (payload.responseLength || "Balanced").toString();

    const brevityInstruction =
      responseLength === "Concise" || responseLength === "Court"
        ? "Keep responses short and to the point."
        : responseLength === "Detailed" || responseLength === "Détaillé"
        ? "Provide a detailed, thorough answer with extra context."
        : "Provide a balanced answer that is clear and helpful.";

    const prompt = `You are Nova, a helpful AI assistant for a voice app. Answer the user's question in ${
      language === "fr" ? "French" : "English"
    }. ${brevityInstruction} If the user repeats a question, do not return the exact same answer text; instead provide a new perspective or another useful detail.`;

    const tempMap: Record<string, number> = {
      Concise: 0.2,
      Court: 0.2,
      Balanced: 0.6,
      Detailed: 0.9,
      Détaillé: 0.9,
    };

    const temperature = tempMap[responseLength] ?? 0.6;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        top_p: 0.9,
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error", errorText);
      return NextResponse.json(
        {
          reply:
            language === "fr"
              ? "Désolé, je n’ai pas pu répondre pour le moment."
              : "Sorry, I couldn’t answer that right now.",
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      data?.choices?.[0]?.text?.trim() ||
      data?.reply?.trim() ||
      (language === "fr"
        ? "Je n’ai pas pu générer une réponse pour le moment."
        : "I couldn’t generate a response right now.");

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Assistant route error", error);
    return NextResponse.json(
      {
        reply:
          (typeof language === "string" && language === "fr"
            ? "Désolé, je n’ai pas pu répondre pour le moment."
            : "Sorry, I couldn’t answer that right now."),
      },
      { status: 200 }
    );
  }
}
