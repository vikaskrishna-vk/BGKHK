const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

/* ================= CHATBOT ================= */

const careerChatbot = async (messages, userProfile) => {

  const systemPrompt = `
You are InternAI, an AI career mentor for engineering students in India.

Guide about:
Frontend, Backend, Full Stack, AI/ML, Data Science, DevOps.

User profile:
${JSON.stringify(userProfile || {})}

Always give:
1. Explanation
2. Skills required
3. Learning roadmap
4. Resources
5. Internship tips
`;

  const chatHistory = messages
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = `${systemPrompt}\n\nConversation:\n${chatHistory}`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  return text;
};


/* ================= RESUME ANALYZER ================= */

const analyzeResume = async (resumeText, targetRole) => {

  const prompt = `
Analyze this resume for ${targetRole || "Software Developer"} role.

Return JSON only.

{
"atsScore":0,
"jobReadiness":0,
"missingKeywords":[],
"strengths":[],
"improvements":[],
"summary":""
}

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);

  let text = result.response.text();

  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch {
    return {
      atsScore: 50,
      jobReadiness: 50,
      missingKeywords: [],
      strengths: [],
      improvements: ["AI could not parse response"],
      summary: text
    };
  }
};


/* ================= MOCK INTERVIEW ================= */

const generateInterviewQuestions = async (domain, level) => {

  const prompt = `
Generate 8 interview questions for ${domain} (${level}).

Return JSON array:

[
{
"id":1,
"question":"",
"type":"technical",
"difficulty":"Medium",
"expectedAnswer":""
}
]
`;

  const result = await model.generateContent(prompt);

  let text = result.response.text();

  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
};


/* ================= CAREER ROADMAP ================= */

const generateCareerRoadmap = async (goal, currentSkills, timeframe) => {

  const prompt = `
Create roadmap to become ${goal} in ${timeframe}.

Current skills:
${currentSkills?.join(", ") || "Beginner"}

Return JSON:

{
"goal":"",
"totalDuration":"",
"phases":[
{
"phase":1,
"title":"",
"duration":"",
"skills":[],
"projects":[],
"resources":[]
}
],
"topCompanies":[]
}
`;

  const result = await model.generateContent(prompt);

  let text = result.response.text();

  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};


/* ================= SKILL GAP ================= */

const analyzeSkillGap = async (skills, role) => {

  const prompt = `
Analyze skill gap for ${role}.

Current skills:
${skills.join(", ")}

Return JSON:

{
"missingSkills":[],
"strongSkills":[],
"learningPath":[],
"readinessScore":0
}
`;

  const result = await model.generateContent(prompt);

  let text = result.response.text();

  text = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

module.exports = {
  careerChatbot,
  analyzeResume,
  generateInterviewQuestions,
  generateCareerRoadmap,
  analyzeSkillGap
};