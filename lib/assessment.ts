export type SkillArea =
  | "Domain/Technical Skills"
  | "Communication Skills"
  | "Digital Skills"
  | "Interpersonal Skills"
  | "Creativity"

export type Question = {
  id: string
  area: SkillArea
  text: string
  options: { label: string; value: number }[] // 1–5
}

export const SKILL_AREAS: SkillArea[] = [
  "Domain/Technical Skills",
  "Communication Skills",
  "Digital Skills",
  "Interpersonal Skills",
  "Creativity",
]

const LIKERT = [
  { label: "Strongly Disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Neutral", value: 3 },
  { label: "Agree", value: 4 },
  { label: "Strongly Agree", value: 5 },
]

export const DEMO_QUESTIONS: Question[] = [
  // Domain/Technical Skills (dt1–dt10)
  {
    id: "dt1",
    area: "Domain/Technical Skills",
    text: "I can apply core concepts from my field to solve problems.",
    options: LIKERT,
  },
  {
    id: "dt2",
    area: "Domain/Technical Skills",
    text: "I can debug and resolve technical issues efficiently.",
    options: LIKERT,
  },
  {
    id: "dt3",
    area: "Domain/Technical Skills",
    text: "I write code or produce work that adheres to standards and best practices.",
    options: LIKERT,
  },
  {
    id: "dt4",
    area: "Domain/Technical Skills",
    text: "I can break down complex problems into smaller, solvable parts.",
    options: LIKERT,
  },
  {
    id: "dt5",
    area: "Domain/Technical Skills",
    text: "I verify my work with tests, reviews, or validation steps.",
    options: LIKERT,
  },
  {
    id: "dt6",
    area: "Domain/Technical Skills",
    text: "I understand performance implications and optimize when needed.",
    options: LIKERT,
  },
  {
    id: "dt7",
    area: "Domain/Technical Skills",
    text: "I read and understand technical documentation effectively.",
    options: LIKERT,
  },
  {
    id: "dt8",
    area: "Domain/Technical Skills",
    text: "I can choose appropriate tools or methods for a given problem.",
    options: LIKERT,
  },
  { id: "dt9", area: "Domain/Technical Skills", text: "I keep my technical knowledge up to date.", options: LIKERT },
  {
    id: "dt10",
    area: "Domain/Technical Skills",
    text: "I am comfortable troubleshooting unknown issues.",
    options: LIKERT,
  },

  // Communication Skills (com1–com10)
  { id: "com1", area: "Communication Skills", text: "I communicate my ideas clearly in writing.", options: LIKERT },
  {
    id: "com2",
    area: "Communication Skills",
    text: "I present and explain complex topics effectively.",
    options: LIKERT,
  },
  {
    id: "com3",
    area: "Communication Skills",
    text: "I tailor my communication for different audiences.",
    options: LIKERT,
  },
  {
    id: "com4",
    area: "Communication Skills",
    text: "I actively listen and ask clarifying questions.",
    options: LIKERT,
  },
  { id: "com5", area: "Communication Skills", text: "I provide concise status updates and reports.", options: LIKERT },
  {
    id: "com6",
    area: "Communication Skills",
    text: "I document decisions and rationales for future reference.",
    options: LIKERT,
  },
  {
    id: "com7",
    area: "Communication Skills",
    text: "I communicate respectfully even in disagreements.",
    options: LIKERT,
  },
  {
    id: "com8",
    area: "Communication Skills",
    text: "I can facilitate productive meetings or discussions.",
    options: LIKERT,
  },
  {
    id: "com9",
    area: "Communication Skills",
    text: "I adapt my style between synchronous and asynchronous channels.",
    options: LIKERT,
  },
  {
    id: "com10",
    area: "Communication Skills",
    text: "I give actionable, empathetic feedback to others.",
    options: LIKERT,
  },

  // Digital Skills (dig1–dig10)
  {
    id: "dig1",
    area: "Digital Skills",
    text: "I can quickly learn and adapt to new tools and platforms.",
    options: LIKERT,
  },
  {
    id: "dig2",
    area: "Digital Skills",
    text: "I understand data privacy and security best practices.",
    options: LIKERT,
  },
  {
    id: "dig3",
    area: "Digital Skills",
    text: "I organize my digital files and information efficiently.",
    options: LIKERT,
  },
  { id: "dig4", area: "Digital Skills", text: "I automate repetitive tasks using appropriate tools.", options: LIKERT },
  {
    id: "dig5",
    area: "Digital Skills",
    text: "I use collaboration tools (e.g., docs, boards) effectively.",
    options: LIKERT,
  },
  {
    id: "dig6",
    area: "Digital Skills",
    text: "I understand version control or change management processes.",
    options: LIKERT,
  },
  {
    id: "dig7",
    area: "Digital Skills",
    text: "I evaluate digital sources for reliability and accuracy.",
    options: LIKERT,
  },
  { id: "dig8", area: "Digital Skills", text: "I maintain good digital hygiene (updates, backups).", options: LIKERT },
  { id: "dig9", area: "Digital Skills", text: "I make data-informed decisions when possible.", options: LIKERT },
  { id: "dig10", area: "Digital Skills", text: "I troubleshoot basic software and hardware issues.", options: LIKERT },

  // Interpersonal Skills (ip1–ip10)
  {
    id: "ip1",
    area: "Interpersonal Skills",
    text: "I collaborate well in teams and manage conflicts constructively.",
    options: LIKERT,
  },
  { id: "ip2", area: "Interpersonal Skills", text: "I proactively give and receive feedback.", options: LIKERT },
  {
    id: "ip3",
    area: "Interpersonal Skills",
    text: "I build trust by following through on commitments.",
    options: LIKERT,
  },
  {
    id: "ip4",
    area: "Interpersonal Skills",
    text: "I show empathy and consider others’ perspectives.",
    options: LIKERT,
  },
  { id: "ip5", area: "Interpersonal Skills", text: "I support teammates and share knowledge openly.", options: LIKERT },
  {
    id: "ip6",
    area: "Interpersonal Skills",
    text: "I handle stressful situations with professionalism.",
    options: LIKERT,
  },
  { id: "ip7", area: "Interpersonal Skills", text: "I contribute positively to team culture.", options: LIKERT },
  {
    id: "ip8",
    area: "Interpersonal Skills",
    text: "I resolve misunderstandings promptly and respectfully.",
    options: LIKERT,
  },
  { id: "ip9", area: "Interpersonal Skills", text: "I negotiate priorities and scope effectively.", options: LIKERT },
  { id: "ip10", area: "Interpersonal Skills", text: "I mentor or coach others when appropriate.", options: LIKERT },

  // Creativity (cr1–cr10)
  {
    id: "cr1",
    area: "Creativity",
    text: "I generate original ideas to improve processes or products.",
    options: LIKERT,
  },
  { id: "cr2", area: "Creativity", text: "I am comfortable experimenting and iterating.", options: LIKERT },
  { id: "cr3", area: "Creativity", text: "I connect disparate ideas to create novel solutions.", options: LIKERT },
  { id: "cr4", area: "Creativity", text: "I brainstorm many possibilities before narrowing down.", options: LIKERT },
  { id: "cr5", area: "Creativity", text: "I prototype or mock up ideas to test quickly.", options: LIKERT },
  { id: "cr6", area: "Creativity", text: "I embrace feedback to refine creative work.", options: LIKERT },
  { id: "cr7", area: "Creativity", text: "I reframe problems to discover new approaches.", options: LIKERT },
  { id: "cr8", area: "Creativity", text: "I look outside my field for inspiration.", options: LIKERT },
  { id: "cr9", area: "Creativity", text: "I balance creativity with practical constraints.", options: LIKERT },
  { id: "cr10", area: "Creativity", text: "I persist through ambiguity to reach a solution.", options: LIKERT },
]

export type Answers = Record<string, number>

export function computeAreaAverages(answers: Answers) {
  const byArea: Record<SkillArea, { sum: number; count: number }> = {
    "Domain/Technical Skills": { sum: 0, count: 0 },
    "Communication Skills": { sum: 0, count: 0 },
    "Digital Skills": { sum: 0, count: 0 },
    "Interpersonal Skills": { sum: 0, count: 0 },
    Creativity: { sum: 0, count: 0 },
  }
  for (const q of DEMO_QUESTIONS) {
    const v = answers[q.id]
    if (typeof v === "number") {
      byArea[q.area].sum += v
      byArea[q.area].count += 1
    }
  }
  return SKILL_AREAS.map((area) => {
    const s = byArea[area]
    const avg = s.count ? s.sum / s.count : 0
    return { area, avg }
  })
}
