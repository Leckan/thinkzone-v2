export const assessmentQuestions = [
  {
    id: "opportunity",
    question: "What best describes the opportunity?",
    options: [
      "A repeated workflow takes too much time",
      "Important information is hard to find",
      "We have an AI product idea to validate",
      "We're not sure where AI fits yet",
    ],
  },
  {
    id: "currentProcess",
    question: "How does the work happen today?",
    options: [
      "Mostly manual, across several tools",
      "Partly automated but still needs handoffs",
      "We have a prototype or early product",
      "We need help understanding the current process",
    ],
  },
  {
    id: "desiredOutcome",
    question: "What would make the next 90 days valuable?",
    options: [
      "A clear opportunity and roadmap",
      "A working workflow or agent",
      "A focused prototype we can learn from",
      "A stronger data and technical foundation",
    ],
  },
] as const;

export type OpportunityAssessment = {
  opportunity: (typeof assessmentQuestions)[0]["options"][number];
  currentProcess: (typeof assessmentQuestions)[1]["options"][number];
  desiredOutcome: (typeof assessmentQuestions)[2]["options"][number];
};
