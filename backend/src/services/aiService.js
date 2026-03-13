const { GoogleGenerativeAI } = require("@google/generative-ai");
const Report = require("../models/Report");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});


/* ============================================================
   CAREER CHATBOT
============================================================ */

const careerChatbot = async (messages, userProfile) => {

  const systemPrompt = `
You are InternAI, an expert AI career mentor for engineering students in India.

Guide students about:

Tech Domains:
Frontend, Backend, Full Stack, Data Science, AI/ML, DevOps, Mobile Development.

Help students with:
- Career paths
- Skill roadmaps
- Internship preparation
- Job market demand
- Resume improvement
- Portfolio projects
- Interview preparation

User profile:
${JSON.stringify(userProfile || {})}

Always provide:
1. Explanation
2. Roadmap
3. Skills required
4. Learning resources
5. Internship tips
`;

  const conversation = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = `${systemPrompt}\n\nConversation:\n${conversation}`;

  const result = await model.generateContent(prompt);

  return result.response.text();
};



/* ============================================================
   RESUME ANALYZER
============================================================ */

const analyzeResume = async (resumeText, targetRole) => {

  const prompt = `
Analyze this resume for ${targetRole || "software engineer"} role.

Return JSON:

{
"atsScore":0-100,
"jobReadiness":0-100,
"missingKeywords":[],
"strengths":[],
"improvements":[],
"summary":""
}

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);

  try {
    return JSON.parse(result.response.text());
  } catch {
    return { error: "Failed to analyze resume" };
  }
};



/* ============================================================
   INTERVIEW QUESTION GENERATOR
============================================================ */

const generateInterviewQuestions = async (domain, level) => {

  const prompt = `
Generate 8 interview questions for ${domain} role (${level} level).

Return JSON array:
[
{
"id":1,
"question":"",
"type":"",
"difficulty":"",
"expectedAnswer":""
}
]
`;

  const result = await model.generateContent(prompt);

  try {
    return JSON.parse(result.response.text());
  } catch {
    return [];
  }
};



/* ============================================================
   CAREER ROADMAP GENERATOR
============================================================ */

const generateCareerRoadmap = async (goal, currentSkills, timeframe = "6 months") => {

  const prompt = `
Create ${timeframe} roadmap to become ${goal}.

Current skills:
${currentSkills?.join(", ") || "Beginner"}

Return JSON:
{
"goal":"",
"phases":[
{
"title":"",
"skills":[],
"projects":[],
"resources":[]
}
],
"salaryRange":"",
"topCompanies":[]
}
`;

  const result = await model.generateContent(prompt);

  try {
    return JSON.parse(result.response.text());
  } catch {
    return null;
  }
};



/* ============================================================
   INTERNSHIP REPORT ANALYSIS
============================================================ */

const analyzeReport = async (reportId) => {

  try {

    const report = await Report.findById(reportId);
    if (!report) return;

    const prompt = `
Analyze this internship report.

Tasks: ${report.tasksCompleted}
Technologies: ${report.technologiesUsed}
Skills: ${report.skillsLearned}

Return JSON:
{
"qualityScore":0-100,
"authenticityScore":0-100,
"suspicionFlags":[],
"summary":""
}
`;

    const result = await model.generateContent(prompt);

    const analysis = JSON.parse(result.response.text());

    await Report.findByIdAndUpdate(reportId, {
      aiAnalysis: {
        ...analysis,
        analyzedAt: new Date(),
      },
    });

  } catch (err) {
    console.error("Report analysis error:", err.message);
  }
};



/* ============================================================
   SKILL GAP ANALYSIS
============================================================ */

const analyzeSkillGap = async (currentSkills, targetRole) => {

  const prompt = `
Analyze skill gap for ${targetRole} role.

Current skills:
${currentSkills?.join(", ")}

Return JSON:
{
"missingSkills":[],
"strongSkills":[],
"learningPath":[],
"readinessScore":0
}
`;

  const result = await model.generateContent(prompt);

  try {
    return JSON.parse(result.response.text());
  } catch {
    return null;
  }
};


module.exports = {
  careerChatbot,
  analyzeResume,
  generateInterviewQuestions,
  generateCareerRoadmap,
  analyzeReport,
  analyzeSkillGap,
};