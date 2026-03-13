const {
  careerChatbot, analyzeResume, generateInterviewQuestions,
  generateCareerRoadmap, analyzeSkillGap,
} = require('../services/aiService');

// ─── CHATBOT ──────────────────────────────────────────────────────────────────


const chat = async (req, res) => {

  try {

    const { messages } = req.body;

    const response = await careerChatbot(messages, req.user);

    res.json({
      success: true,
      response
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI error" });
  }
};


const resumeAnalyze = async (req, res) => {

  try {

    const { resumeText, targetRole } = req.body;

    const analysis = await analyzeResume(resumeText, targetRole);

    res.json({
      success: true,
      analysis
    });

  } catch (err) {

    res.status(500).json({ message: "Resume analysis failed" });

  }
};


const mockInterview = async (req, res) => {

  try {

    const { domain, level } = req.body;

    const questions = await generateInterviewQuestions(domain, level);

    res.json({
      success: true,
      questions
    });

  } catch (err) {

    res.status(500).json({ message: "Interview generation failed" });

  }
};


const careerRoadmap = async (req, res) => {

  try {

    const { goal, timeframe } = req.body;

    const roadmap = await generateCareerRoadmap(goal, [], timeframe);

    res.json({
      success: true,
      roadmap
    });

  } catch (err) {

    res.status(500).json({ message: "Roadmap generation failed" });

  }
};


const skillGap = async (req, res) => {

  try {

    const { targetRole } = req.body;

    const analysis = await analyzeSkillGap([], targetRole);

    res.json({
      success: true,
      analysis
    });

  } catch (err) {

    res.status(500).json({ message: "Skill gap analysis failed" });

  }
};


module.exports = { chat, resumeAnalyze, mockInterview, careerRoadmap, skillGap };
