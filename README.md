# ✦ InternAI — AI-Powered Student Internship & Skill Tracking Platform

A full-stack production-grade web platform for student career development with AI-powered features, internship tracking, skill analytics, and placement readiness.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router v6 |
| Backend | Node.js, Express.js, MongoDB Atlas, Mongoose |
| AI | OpenAI API (GPT-3.5-turbo) |
| Auth | JWT + bcrypt |
| File Storage | Multer + Cloudinary |
| Email | Nodemailer |
| Real-time | Socket.IO |

---

## 📁 Project Structure

```
internai/
├── backend/
│   ├── src/
│   │   ├── config/        # DB, Cloudinary config
│   │   ├── controllers/   # authController, internshipController, reportController, aiController, etc.
│   │   ├── middleware/    # authMiddleware, errorMiddleware
│   │   ├── models/        # User, Internship, Report, Certificate, etc.
│   │   ├── routes/        # All API routes
│   │   ├── services/      # aiService, skillService, emailService
│   │   └── server.js      # Entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # Navbar, UIComponents, NotificationBell
    │   ├── context/       # AuthContext
    │   ├── pages/
    │   │   ├── auth/      # Login, Register
    │   │   ├── student/   # Overview, Internships, Reports, Certs, Skills, Profile
    │   │   ├── mentor/    # Overview, Students, Reports, Certificates
    │   │   ├── admin/     # Overview, Students, Analytics, Placement, Notifications
    │   │   └── ai/        # Chat, ResumeAnalyzer, MockInterview, CareerRoadmap
    │   ├── utils/         # axios API client
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css      # Complete design system
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- OpenAI API key
- Cloudinary account (free tier works)

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in all values in .env
npm install
npm run dev   # or: npm start
```

**Backend `.env` values:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/internai
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173

# OpenAI
OPENAI_API_KEY=sk-...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

> **Gmail App Password:** Enable 2FA → Google Account → Security → App Passwords → Generate

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env   # or create .env
# Add: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🎭 User Roles

| Role | Access |
|------|--------|
| **Student** | Overview, internships, reports, certificates, skills, AI tools, study materials, aptitude tests |
| **Mentor** | Review reports, verify certificates, view assigned students |
| **Admin** | Full user management, analytics, placement dashboard, bulk notifications |

---

## 🤖 AI Features

| Feature | Description |
|---------|-------------|
| Career Chatbot | GPT-powered 24/7 career guidance |
| Resume Analyzer | ATS score, keyword gaps, improvement tips |
| Mock Interview | Domain-specific question generation with tips |
| Career Roadmap | Phase-based 3/6/12-month learning plans |
| Skill Gap Analysis | Compare current skills vs target role requirements |
| Report Summarization | AI summary of weekly reports |
| Internship Verification | AI detection of fake/suspicious internship details |

---

## 📊 AI Skill Score Formula

```
Score = 0.4 × Internship Performance
      + 0.3 × AI Test Results
      + 0.2 × Mentor Feedback
      + 0.1 × Project Score
```

---

## 🌐 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile

GET    /api/internships/my
POST   /api/internships
PATCH  /api/internships/:id/approve

GET    /api/reports/my
POST   /api/reports
PATCH  /api/reports/:id/review

POST   /api/certificates        (multipart)
GET    /api/certificates/my
PATCH  /api/certificates/:id/verify

POST   /api/ai/chat
POST   /api/ai/resume
POST   /api/ai/interview
POST   /api/ai/roadmap
POST   /api/ai/skill-gap

GET    /api/skills/my
PUT    /api/skills/my

GET    /api/analytics/admin
GET    /api/analytics/student

POST   /api/notifications/bulk
GET    /api/notifications

GET    /api/users              (admin)
POST   /api/users/assign-mentor (admin)
```

---

## 🎨 Design System

- **Theme:** Dark (near-black backgrounds, glassmorphism cards)
- **Accent:** Cyan `#00e5ff` · Violet `#a855f7` · Pink `#ec4899`
- **Fonts:** Syne 800 (headings) + DM Sans (body)
- **Components:** Cards, score rings, progress bars, badges, timeline, tabs, modals, skill pills

---

## 🏗️ Deployment

### Backend (Railway / Render / Heroku)
1. Set all env variables in platform dashboard
2. Set start command: `node src/server.js`
3. Deploy from GitHub

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your backend URL
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add redirect rule: `/* → /index.html` (200)

---

## 📝 License

MIT License — built with ❤️ by InternAI Team
