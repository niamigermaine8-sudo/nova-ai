/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { getAssistantReply } from "@/lib/getAssistantReply";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking";

import type { Language } from "@/lib/i18n";

type VoiceAssistantOptions = {
  onPlayMusic?: (query: string, language: Language) => Promise<string>;
  onPauseMusic?: () => Promise<boolean> | boolean;
  onResumeMusic?: () => Promise<void> | void;
};

export function useVoiceAssistant(options?: VoiceAssistantOptions) {
  const { t, language } = useLanguage();
  const IDLE_CAPTION = t.voiceAssistant.idle;
  const [state, setState] = useState<VoiceState>("idle");
  const [caption, setCaption] = useState<string>(IDLE_CAPTION);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const stateRef = useRef<VoiceState>("idle");
  const pausedMusicRef = useRef(false);
  const tRef = useRef(t);
  const languageRef = useRef(language);
  const optionsRef = useRef(options);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    tRef.current = t;
    languageRef.current = language;
    optionsRef.current = options;
  }, [t, language, options]);

  const resumeMusic = useCallback(async () => {
    if (pausedMusicRef.current && optionsRef.current?.onResumeMusic) {
      await optionsRef.current.onResumeMusic();
      pausedMusicRef.current = false;
    }
  }, []);

  const respond = useCallback(async (text: string) => {
    setState("thinking");
    setCaption(tRef.current.voiceAssistant.thinking);

    pausedMusicRef.current = await (async () => {
      if (optionsRef.current?.onPauseMusic) {
        return !!(await optionsRef.current.onPauseMusic());
      }
      return false;
    })();

    try {
      const playCommandMatch = languageRef.current === "fr"
        ? text.match(/^\s*(?:joue|mets|lance|écoute)\s+(?:de la |du |la |une |le )?(.*)/i)
        : text.match(/^\s*(?:play|open)\s+(?:me\s+)?(.+)/i);
      const searchCommandMatch = languageRef.current === "fr"
        ? text.match(/^\s*(?:cherche|trouve)\s+(.*)/i)
        : text.match(/^\s*(?:search for|find)\s+(.+)/i);
      const musicKeywordMatch = languageRef.current === "fr"
        ? /\b(musique|chanson|chansons|morceau|album|artiste|groupe|vidéo|remix|cover|live)\b/i
        : /\b(music|song|songs|track|album|artist|band|official|video|remix|cover)\b/i;
      let musicQuery: string | null = null;

      if (playCommandMatch) {
        musicQuery = playCommandMatch[1].trim();
      } else if (searchCommandMatch) {
        const maybeQuery = searchCommandMatch[1].trim();
        if (musicKeywordMatch.test(maybeQuery)) {
          musicQuery = maybeQuery;
        }
      }

      if (musicQuery) {
        let query = musicQuery.replace(/^(?:me|some|a|the)\s+/i, "");

        if (!musicKeywordMatch.test(query)) {
          query = languageRef.current === "fr" ? `${query} chanson officielle` : `${query} official music video`;
        }

        if (optionsRef.current?.onPlayMusic) {
          try {
            const reply = await optionsRef.current.onPlayMusic(query, languageRef.current);
            pausedMusicRef.current = false;
            setState("speaking");
            setCaption(reply);

            setTimeout(() => {
              setState("idle");
              setCaption(tRef.current.voiceAssistant.idle);
            }, 2500);
            return;
          } catch (playError) {
            await resumeMusic();
            throw playError;
          }
        }
      }

      // read user preference for response length
      let responseLength = "Balanced";
      try {
        const stored = window.localStorage.getItem("nova-response-length");
        responseLength = stored || "Balanced";
      } catch {}

      // create abort controller for this request so it can be cancelled
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const reply = await getAssistantReply(text, languageRef.current, responseLength, signal);
      // Save to local history (persist in localStorage)
      try {
        const key = "nova-history";
        const raw = window.localStorage.getItem(key);
        const list = raw ? JSON.parse(raw) : [];
        list.unshift({
          question: text,
          reply,
          language: languageRef.current,
          time: new Date().toISOString(),
        });
        // keep at most 200 items
        window.localStorage.setItem(key, JSON.stringify(list.slice(0, 200)));
      } catch (e) {
        console.warn("Failed to save history", e);
      }
      // clear abort controller when reply received
      abortControllerRef.current = null;

      setState("speaking");
      setCaption(reply);

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = languageRef.current === "fr" ? "fr-FR" : "en-US";
        try {
          const prefVoice = window.localStorage.getItem("nova-voice");
          const voices = window.speechSynthesis.getVoices();
          const languageCode = languageRef.current === "fr" ? "fr-FR" : "en-US";
          const fromLanguage = voices.find((v) => v.lang === languageCode);
          const fromVoiceName = prefVoice
            ? voices.find((v) => v.name.toLowerCase().includes(prefVoice.toLowerCase()))
            : null;

          if (fromVoiceName) {
            utterance.voice = fromVoiceName;
          } else if (fromLanguage) {
            utterance.voice = fromLanguage;
          }
        } catch {}
        utterance.onend = async () => {
          setState("idle");
          setCaption(tRef.current.voiceAssistant.idle);
          await resumeMusic();
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(async () => {
          setState("idle");
          setCaption(tRef.current.voiceAssistant.idle);
          await resumeMusic();
        }, 2000);
      }
    } catch (err: any) {
      // if aborted, simply reset state without treating as an error
      const isAbort = err && (err.name === "AbortError" || err.message === "The user aborted a request.");
      if (isAbort) {
        // cleanup
        abortControllerRef.current = null;
        setState("idle");
        setCaption(tRef.current.voiceAssistant.idle);
        await resumeMusic();
        return;
      }
      setState("idle");
      setCaption(tRef.current.voiceAssistant.idle);
      await resumeMusic();
    }
  }, [resumeMusic]);

  const startListening = useCallback(() => {
    if (state !== "idle") return;

    const SpeechRecognitionCtor =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognitionCtor) {
      setCaption(tRef.current.voiceAssistant.unsupported);
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = languageRef.current === "fr" ? "fr-FR" : "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false; // stop automatically after user stops speaking
    recognition.onspeechstart = () => {
      console.log("SpeechRecognition speech started");
      setCaption(tRef.current.voiceAssistant.listening);
    };
    recognition.onspeechend = () => {
      if (stateRef.current === "listening") {
        recognition.stop();
      }
    };
    recognitionRef.current = recognition;

    setState("listening");
    setCaption(tRef.current.voiceAssistant.listening);

    recognition.onstart = () => {
      console.log("SpeechRecognition started");
      setState("listening");
      setCaption(tRef.current.voiceAssistant.listening);
    };

    recognition.onresult = (event: any) => {
      console.log("SpeechRecognition event", event);
      const result = event.results[event.resultIndex ?? event.results.length - 1];
      const transcript = result?.[0]?.transcript?.trim() || "";
      if (!transcript) return;

      const message = languageRef.current === "fr" ? `Vous avez dit : "${transcript}"` : `You said: "${transcript}"`;
      console.log("SpeechRecognition result", { transcript, isFinal: result.isFinal });
      setCaption(message);

      if (result.isFinal) {
        // user finished speaking — send to assistant
        setState("thinking");
        respond(transcript);
      }
    };

    recognition.onnomatch = (event: any) => {
      console.log("SpeechRecognition no match", event);
      // show feedback to the user briefly
      setCaption(languageRef.current === "fr" ? "Je n’ai pas entendu clairement." : "I didn't catch that.");
      setTimeout(() => {
        if (stateRef.current !== "listening") return;
        setCaption(tRef.current.voiceAssistant.listening);
      }, 900);
    };

    recognition.onaudiostart = () => console.log("SpeechRecognition audio started");
    recognition.onaudioend = () => console.log("SpeechRecognition audio ended");

    recognition.onerror = (event: any) => {
      console.warn("SpeechRecognition error", {
        error: event?.error,
        message: event?.message,
      });
      if (stateRef.current === "listening") {
        setState("idle");
        setCaption(
          event?.error === "not-allowed"
            ? (languageRef.current === "fr" ? "L’accès au micro est refusé." : "Microphone access was denied.")
            : tRef.current.voiceAssistant.idle
        );
      }
    };

    recognition.onend = () => {
      console.log("SpeechRecognition ended");
      if (stateRef.current === "listening") {
        setState("idle");
        setCaption(tRef.current.voiceAssistant.idle);
      }
    };

    try {
      recognition.start();
    } catch (err: any) {
      console.warn("SpeechRecognition start failed", err?.message || err);
      setState("idle");
      setCaption(
        (languageRef.current === "fr" ? "L’accès au micro est refusé." : "Microphone access was denied.")
      );
    }
  }, [state, respond]);

  const interrupt = useCallback(async () => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    } catch {}
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
    await resumeMusic();
    setState("idle");
    setCaption(t.voiceAssistant.idle);
  }, [t, resumeMusic]);

  const submitText = useCallback(
    (text: string) => {
      if (!text.trim() || state !== "idle") return;
      setCaption(`"${text}"`);
      respond(text);
    },
    [respond, state]
  );

  return { state, caption, startListening, submitText, interrupt };
}
