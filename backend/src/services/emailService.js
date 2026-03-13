const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to InternAI! 🚀',
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#050810;color:#f1f5f9;padding:40px;border-radius:16px">
      <h1 style="background:linear-gradient(135deg,#00e5ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:32px">✦ InternAI</h1>
      <h2>Welcome, ${name}! 🎉</h2>
      <p style="color:#94a3b8">Your account has been created. Start your AI-powered career journey today.</p>
      <a href="${process.env.CLIENT_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#00e5ff,#a855f7);color:#000;font-weight:700;border-radius:8px;text-decoration:none;margin-top:16px">Go to Dashboard →</a>
    </div>`,
  }),
  reportApproved: (studentName, weekNum, mentorName) => ({
    subject: `✅ Week ${weekNum} Report Approved`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px">
      <h2>Hi ${studentName},</h2>
      <p>Your <strong>Week ${weekNum} internship report</strong> has been approved by <strong>${mentorName}</strong>.</p>
      <p style="color:#64748b">Keep up the great work! Submit your next weekly report on time.</p>
    </div>`,
  }),
  certVerified: (studentName, certTitle) => ({
    subject: `🎓 Certificate Verified: ${certTitle}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px">
      <h2>Hi ${studentName},</h2>
      <p>Your certificate <strong>"${certTitle}"</strong> has been verified and added to your profile.</p>
    </div>`,
  }),
  internshipApproved: (studentName, company) => ({
    subject: `🏢 Internship Approved: ${company}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:40px">
      <h2>Hi ${studentName},</h2>
      <p>Your internship at <strong>${company}</strong> has been approved. Start submitting weekly reports!</p>
    </div>`,
  }),
};

const sendEmail = async ({ to, type, data = {} }) => {
  try {
    const transporter = createTransporter();
    const template = emailTemplates[type]?.(data.name, data.week, data.mentor, data.company, data.title);
    if (!template) return;

    await transporter.sendMail({
      from: `"InternAI" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✉️  Email sent to ${to}: ${template.subject}`);
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};

module.exports = { sendEmail };
