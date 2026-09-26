"use client";

import { useState } from "react";

const questions = [
  { question: "What best describes the opportunity?", options: ["A repeated workflow takes too much time", "Important information is hard to find", "We have an AI product idea to validate", "We're not sure where AI fits yet"] },
  { question: "How does the work happen today?", options: ["Mostly manual, across several tools", "Partly automated but still needs handoffs", "We have a prototype or early product", "We need help understanding the current process"] },
  { question: "What would make the next 90 days valuable?", options: ["A clear opportunity and roadmap", "A working workflow or agent", "A focused prototype we can learn from", "A stronger data and technical foundation"] },
];

export function AssessmentForm() {
  const [answers, setAnswers] = useState<number[]>([]);
  const answeredCount = answers.filter((answer) => answer !== undefined).length;
  const complete = answeredCount === questions.length;
  const score = answers.reduce<number>((total, answer) => total + (answer ?? 0), 0);
  const recommendation = score < 3 ? ["Clarify the opportunity", "Start by mapping the workflow and defining the problem worth solving. A focused discovery conversation can turn an open question into a buildable direction."] : score < 6 ? ["Prototype the workflow", "There is a tangible opportunity to explore. A scoped prototype can test the experience and reveal the integration, data, and oversight needs."] : ["Shape a product build", "Your answers point toward a defined product or system opportunity. The next step is to align on scope, technical foundations, and what a useful first release must prove."];
  function select(questionIndex: number, answer: number) { setAnswers((current) => { const next = [...current]; next[questionIndex] = answer; return next; }); }
  return <div className="assessment-box"><div className="assessment-progress"><span>{complete ? "ASSESSMENT COMPLETE" : `${answeredCount} OF ${questions.length} ANSWERED`}</span><span>{Math.round((answeredCount / questions.length) * 100)}%</span><div><i style={{ width: `${(answeredCount / questions.length) * 100}%` }} /></div></div>{!complete ? <>{questions.map((item, q) => <fieldset className={`assessment-question ${answers[q] === undefined ? "" : "answered"}`} key={item.question}><legend>{String(q + 1).padStart(2, "0")} / {item.question}</legend><div className="assessment-options">{item.options.map((option, i) => <button className={answers[q] === i ? "selected" : ""} key={option} onClick={() => select(q, i)} type="button"><span>{String.fromCharCode(65 + i)}</span>{option}</button>)}</div></fieldset>)}<p className="assessment-note">Your answers stay in this browser. This assessment is a starting point for reflection, not an AI-generated audit.</p></> : <div className="assessment-result"><div className="section-kicker"><span>YOUR STARTING POINT</span></div><h2>{recommendation[0]}</h2><p>{recommendation[1]}</p><div className="assessment-result-actions"><a className="button button-dark" href={`mailto:info@contact.thinkzone.tech?subject=${encodeURIComponent("AI Opportunity Assessment: " + recommendation[0])}`}>Discuss this opportunity <span className="arrow">↗</span></a><button className="assessment-reset" onClick={() => setAnswers([])} type="button">Start again</button></div></div>}</div>;
}
