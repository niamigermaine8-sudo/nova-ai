import type { Language } from "@/lib/i18n";

function chooseRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getLocalReply(command: string, language: Language = "en"): string {
  const text = command.trim().toLowerCase();
  const isFrench = language === "fr";

  if (!text) {
    return isFrench ? "Je n’ai pas entendu votre question." : "I didn’t catch your question.";
  }

  if (text.includes("time")) {
    const now = new Date();
    return chooseRandom(
      isFrench
        ? [
            `Il est actuellement ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
            `Dans ma région, il est ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
            `Il est ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} pour le moment.`,
          ]
        : [
            `The current time is ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
            `Right now it is ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`,
            `It’s ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} at the moment.`,
          ]
    );
  }

  if (text.includes("weather")) {
    return isFrench
      ? "Il fait beau aujourd’hui avec une température de 24 degrés."
      : "It’s sunny today with a high of 24 degrees.";
  }

  if (text.includes("joke")) {
    return isFrench
      ? "Pourquoi les développeurs n’aiment-ils pas la nature ? Parce qu’ils ont trop de bugs dans les forêts."
      : "Why do developers like nature? Because they have too many bugs in the forest.";
  }

  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return isFrench ? "Bonjour ! Comment puis-je vous aider aujourd’hui ?" : "Hello! How can I help you today?";
  }

  if (text.includes("capital of")) {
    const country = text.replace(/.*capital of /, "").trim();
    const capitals: Record<string, string> = {
      france: "Paris",
      cameroon: "Yaoundé",
      nigeria: "Abuja",
      germany: "Berlin",
      england: "London",
      canada: "Ottawa",
      "united states": "Washington, D.C.",
      "usa": "Washington, D.C.",
    };
    const capital = capitals[country];
    if (capital) {
      return isFrench
        ? `La capitale de ${country} est ${capital}.`
        : `The capital of ${country} is ${capital}.`;
    }
  }

  if (text.includes("who are you") || text.includes("what can you do")) {
    return isFrench
      ? "Je suis Nova, votre assistant vocal personnel. Je peux répondre à vos questions et vous aider à naviguer dans l’application."
      : "I’m Nova, your personal voice assistant. I can answer questions and help you use the app.";
  }

  return isFrench
    ? "Je peux essayer, mais je n'ai pas assez d'informations pour fournir une réponse complète maintenant."
    : "I can try to help, but I don’t have enough information to give a complete answer right now.";
}

export async function getAssistantReply(
  command: string,
  language: Language = "en",
  responseLength: string = "Balanced",
  signal?: AbortSignal
): Promise<string> {
  const fallback = getLocalReply(command, language);

  try {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: command, language, responseLength }),
      signal,
    });

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const reply = data?.reply;

    if (typeof reply === "string" && reply.trim()) {
      const looksLikeFallback = /sorry|désolé|couldn't|could not|pas pu/i.test(reply);
      return looksLikeFallback ? fallback : reply;
    }

    return fallback;
  } catch {
    return fallback;
  }
}
