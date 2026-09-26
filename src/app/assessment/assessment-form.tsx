"use client";

import { useState } from "react";
import { assessmentQuestions } from "@/lib/assessment";

type AssessmentState = "idle" | "generating" | "complete" | "error";

export function AssessmentForm() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [assessmentState, setAssessmentState] = useState<AssessmentState>("idle");
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");

  const answeredCount = answers.filter((answer) => answer !== undefined).length;
  const complete = answeredCount === assessmentQuestions.length;
  const score = answers.reduce<number>((total, answer) => total + (answer ?? 0), 0);
  const recommendation = score < 3
    ? ["Clarify the opportunity", "Start by mapping the workflow and defining the problem worth solving. A focused discovery conversation can turn an open question into a buildable direction."]
    : score < 6
      ? ["Prototype the workflow", "There is a tangible opportunity to explore. A scoped prototype can test the experience and reveal the integration, data, and oversight needs."]
      : ["Shape a product build", "Your answers point toward a defined product or system opportunity. The next step is to align on scope, technical foundations, and what a useful first release must prove."];

  function select(questionIndex: number, answer: number) {
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = answer;
      return next;
    });
    setAssessmentState("idle");
    setReflection("");
    setError("");
  }

  async function generateReflection() {
    if (!complete) return;
    setAssessmentState("generating");
    setError("");

    const payload = {
      opportunity: assessmentQuestions[0].options[answers[0]],
      currentProcess: assessmentQuestions[1].options[answers[1]],
      desiredOutcome: assessmentQuestions[2].options[answers[2]],
    };

    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { reflection?: string; error?: string } = await response.json();
      if (!response.ok || !result.reflection) {
        throw new Error(result.error ?? "We couldn't generate the AI reflection.");
      }
      setReflection(result.reflection);
      setAssessmentState("complete");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't generate the AI reflection.");
      setAssessmentState("error");
    }
  }

  function reset() {
    setAnswers([]);
    setAssessmentState("idle");
    setReflection("");
    setError("");
  }

  return (
    <div className="assessment-box">
      <div className="assessment-progress">
        <span>{complete ? "ASSESSMENT COMPLETE" : `${answeredCount} OF ${assessmentQuestions.length} ANSWERED`}</span>
        <span>{Math.round((answeredCount / assessmentQuestions.length) * 100)}%</span>
        <div><i style={{ width: `${(answeredCount / assessmentQuestions.length) * 100}%` }} /></div>
      </div>

      {!complete ? (
        <>
          {assessmentQuestions.map((item, questionIndex) => (
            <fieldset className={`assessment-question ${answers[questionIndex] === undefined ? "" : "answered"}`} key={item.id}>
              <legend>{String(questionIndex + 1).padStart(2, "0")} / {item.question}</legend>
              <div className="assessment-options">
                {item.options.map((option, optionIndex) => (
                  <button
                    className={answers[questionIndex] === optionIndex ? "selected" : ""}
                    key={option}
                    onClick={() => select(questionIndex, optionIndex)}
                    type="button"
                    aria-pressed={answers[questionIndex] === optionIndex}
                  >
                    <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <p className="assessment-note">Your answers stay in this browser. They are sent to the configured AI provider only if you choose to generate an AI reflection.</p>
        </>
      ) : (
        <div className="assessment-result">
          <div className="section-kicker"><span>YOUR STARTING POINT</span></div>
          <h2>{recommendation[0]}</h2>
          <p>{recommendation[1]}</p>

          <div className="assessment-ai-action">
            <button className="button button-dark" disabled={assessmentState === "generating"} onClick={generateReflection} type="button">
              {assessmentState === "generating" ? "Generating reflection…" : assessmentState === "complete" ? "Regenerate AI reflection" : "Generate AI reflection"}
              <span className="arrow" aria-hidden="true">↗</span>
            </button>
            <p>Your selected answers will be sent to the configured AI provider for a tailored reflection. Think Zone does not store assessment answers.</p>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          {reflection && <section className="assessment-ai-result" aria-live="polite" aria-label="AI-generated reflection"><div className="section-kicker"><span>AI-GENERATED REFLECTION</span></div><p>{reflection}</p></section>}

          <div className="assessment-result-actions">
            <a className="button button-dark" href={`mailto:info@contact.thinkzone.tech?subject=${encodeURIComponent("AI Opportunity Assessment: " + recommendation[0])}`}>Discuss this opportunity <span className="arrow" aria-hidden="true">↗</span></a>
            <button className="assessment-reset" onClick={reset} type="button">Start again</button>
          </div>
        </div>
      )}
    </div>
  );
}
