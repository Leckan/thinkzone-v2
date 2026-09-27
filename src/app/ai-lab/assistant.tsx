"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BrandFavicon } from "@/components/brand-favicon";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function AIChat() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/assistant")
      .then(async (response) => {
        if (!response.ok) throw new Error("status");
        const data = await response.json();
        setEnabled(data.enabled === true);
      })
      .catch(() => setEnabled(false));
  }, []);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (enabled !== true || !content || busy) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content };
    const history = [...messages, userMessage].slice(-8);
    setMessages(history);
    setInput("");
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ turns: history.map(({ role, content: text }) => ({ role, content: text })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "The assistant is unavailable.");
      if (typeof data.reply !== "string") throw new Error("The assistant returned an invalid response.");
      const reply: Message = { id: crypto.randomUUID(), role: "assistant", content: data.reply };
      setMessages((current) => [...current, reply].slice(-8));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The assistant is unavailable.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="assistant-panel" aria-labelledby="assistant-title">
    <div className="assistant-copy"><div className="section-kicker"><span>THINK ZONE / AI ASSISTANT</span></div><h2 id="assistant-title">Ask about the<br /><span>work we do.</span></h2><p>Explore Think Zone&apos;s products, AI capabilities, and how we work with businesses.</p><p className="assistant-privacy">Messages are sent to the configured AI provider to generate a reply. Please don&apos;t share confidential or sensitive information.</p></div>
    <div className="assistant-chat"><div className="assistant-chat-head"><span className="assistant-status"><i /> THINK ZONE ASSISTANT</span><span>PREVIEW</span></div><div className="assistant-messages" aria-live="polite" aria-relevant="additions text">
      {messages.length === 0 && <div className="assistant-welcome"><span><BrandFavicon inverse /></span><p>{enabled === true ? "Hi. I can help you explore what Think Zone builds and where AI may be useful." : enabled === false ? "The assistant is being prepared. In the meantime, get in touch and we’ll help you find a useful next step." : "Checking assistant availability…"}</p></div>}
      {messages.map((message) => <div className={`assistant-message ${message.role}`} key={message.id}><span>{message.role === "assistant" ? "THINK ZONE" : "YOU"}</span><p>{message.content}</p></div>)}
      {busy && <div className="assistant-typing" role="status">Thinking<span>…</span></div>}
      {enabled === false && messages.length === 0 && <a className="assistant-contact" href="mailto:info@contact.thinkzone.tech">Contact the team ↗</a>}
    </div><form className="assistant-input" onSubmit={send}><label className="sr-only" htmlFor="assistant-message">Ask Think Zone a question</label><input id="assistant-message" value={input} onChange={(event) => setInput(event.target.value)} disabled={enabled !== true || busy} maxLength={1800} placeholder={enabled === true ? "Ask a question…" : enabled === false ? "Assistant not configured" : "Checking availability…"} /><button type="submit" disabled={enabled !== true || busy || !input.trim()} aria-label="Send message">↗</button></form>{error && <p className="assistant-error" role="alert">{error}</p>}<p className="assistant-disclaimer">AI responses may be incomplete. Confirm important details with the Think Zone team.</p></div>
  </section>;
}
