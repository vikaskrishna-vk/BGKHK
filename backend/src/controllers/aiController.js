const {
  careerChatbot, analyzeResume, generateInterviewQuestions,
  generateCareerRoadmap, analyzeSkillGap,
} = require('../services/aiService');

// ─── CHATBOT ──────────────────────────────────────────────────────────────────
const chat = async (req, res, next) => {
  try {
    const { messages } = req.body;
    if (!messages?.length) return res.status(400).json({ success: false, message: 'Messages are required' });

    const userProfile = {
      name: req.user.name,
      skills: req.user.studentProfile?.skills || [],
      domains: req.user.studentProfile?.selectedDomains || [],
      careerGoal: req.user.studentProfile?.careerGoal,
    };

    const response = await careerChatbot(messages, userProfile);
    res.json({ success: true, response });
  } catch (error) {
    if (error.status === 429) return res.status(429).json({ success: false, message: 'AI service busy. Try again shortly.' });
    next(error);
  }
};

// ─── RESUME ANALYZER ──────────────────────────────────────────────────────────
const resumeAnalyze = async (req, res, next) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText) return res.status(400).json({ success: false, message: 'Resume text is required' });

    const result = await analyzeResume(resumeText, targetRole);
    res.json({ success: true, analysis: result });
  } catch (error) {
    next(error);
  }
};

// ─── MOCK INTERVIEW ───────────────────────────────────────────────────────────
const mockInterview = async (req, res, next) => {
  try {
    const { domain, level = 'Entry Level', count = 8 } = req.body;
    if (!domain) return res.status(400).json({ success: false, message: 'Domain is required' });

    const questions = await generateInterviewQuestions(domain, level, count);
    res.json({ success: true, domain, level, questions });
  } catch (error) {
    next(error);
  }
};

// ─── CAREER ROADMAP ───────────────────────────────────────────────────────────
const careerRoadmap = async (req, res, next) => {
  try {
    const { goal, timeframe } = req.body;
    if (!goal) return res.status(400).json({ success: false, message: 'Career goal is required' });

    const currentSkills = req.user.studentProfile?.skills || [];
    const roadmap = await generateCareerRoadmap(goal, currentSkills, timeframe);
    res.json({ success: true, roadmap });
  } catch (error) {
    next(error);
  }
};

// ─── SKILL GAP ────────────────────────────────────────────────────────────────
const skillGap = async (req, res, next) => {
  try {
    const { targetRole } = req.body;
    if (!targetRole) return res.status(400).json({ success: false, message: 'Target role is required' });

    const currentSkills = req.user.studentProfile?.skills || [];
    const analysis = await analyzeSkillGap(currentSkills, targetRole);
    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat, resumeAnalyze, mockInterview, careerRoadmap, skillGap };
