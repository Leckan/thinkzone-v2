"use client";

import { useState, type FormEvent } from "react";

const interests = ["AI opportunity", "AI product", "Automation & agents", "Data & engineering", "Think Zone product", "Other"];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");
    setError("");
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We couldn't send your message.");
      setStatus("sent");
      formElement.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't send your message. Please email info@contact.thinkzone.tech.");
      setStatus("error");
    }
  }

  if (status === "sent") return <div className="contact-success" role="status"><span>MESSAGE RECEIVED</span><h3>Thanks for reaching out.</h3><p>We&apos;ll review your note and follow up as soon as we can.</p><a href="mailto:info@contact.thinkzone.tech">Need to add something? Email us ↗</a></div>;

  return <form className="contact-form" id="contact-form" onSubmit={submit}>
    <div className="contact-form-heading"><span>START A CONVERSATION</span><p>Tell us a little about what you&apos;re working on.</p></div>
    <div className="form-field-grid"><label>Your name<input name="name" autoComplete="name" minLength={2} maxLength={120} required placeholder="Name" /></label><label>Work email<input name="email" type="email" autoComplete="email" maxLength={320} required placeholder="you@company.com" /></label></div>
    <label>Company <span className="optional-label">OPTIONAL</span><input name="company" autoComplete="organization" maxLength={160} placeholder="Company or team" /></label>
    <label>What are you exploring?<select name="interest" defaultValue="AI opportunity">{interests.map((interest) => <option key={interest}>{interest}</option>)}</select></label>
    <label>Tell us about it<textarea name="message" minLength={20} maxLength={4000} required rows={5} placeholder="What is difficult today? What would you like to make possible?" /></label>
    <label className="honeypot" aria-hidden="true" tabIndex={-1}>Website<input name="website" autoComplete="off" tabIndex={-1} /></label>
    <div className="contact-form-bottom"><p>We&apos;ll only use your details to respond to this inquiry.</p><button className="button button-dark" disabled={status === "sending"} type="submit">{status === "sending" ? "Sending…" : "Send inquiry"}<span className="arrow">↗</span></button></div>
    {status === "error" && <p className="form-error" role="alert">{error} <a href="mailto:info@contact.thinkzone.tech">Email us directly ↗</a></p>}
  </form>;
}
