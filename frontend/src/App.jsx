import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/layout/Navbar";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LandingPage from "./pages/LandingPage";

/* Student */
import StudentLayout from "./pages/student/StudentLayout";
import StudentOverview from "./pages/student/StudentOverview";
import StudentInternships from "./pages/student/StudentInternships";
import StudentReports from "./pages/student/StudentReports";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentSkills from "./pages/student/StudentSkills";
import StudentProfile from "./pages/student/StudentProfile";

/* AI */
import AIChatPage from "./pages/ai/AIChatPage";
import ResumeAnalyzerPage from "./pages/ai/ResumeAnalyzerPage";
import MockInterviewPage from "./pages/ai/MockInterviewPage";
import CareerRoadmapPage from "./pages/ai/CareerRoadmapPage";

/* Study */
import StudyMaterialsPage from "./pages/StudyMaterialsPage";
import AptitudeTestsPage from "./pages/AptitudeTestsPage";

/* Mentor */
import MentorLayout from "./pages/mentor/MentorLayout";
import MentorOverview from "./pages/mentor/MentorOverview";
import MentorStudents from "./pages/mentor/MentorStudents";
import MentorReports from "./pages/mentor/MentorReports";
import MentorCertificates from "./pages/mentor/MentorCertificates";

/* Admin */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminPlacement from "./pages/admin/AdminPlacement";
import AdminNotifications from "./pages/admin/AdminNotifications";

// ─── LOADING SCREEN ─────────────────────
const LoadingScreen = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    Loading InternAI...
  </div>
);

// ─── PROTECTED ROUTE ────────────────────
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

// ─── PUBLIC ROUTE ───────────────────────
const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) return <Navigate to={`/${user.role}`} replace />;

  return children;
};

// ─── APP ─────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* STUDENT */}
          <Route
            path="/student"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentOverview />} />
            <Route path="internships" element={<StudentInternships />} />
            <Route path="reports" element={<StudentReports />} />
            <Route path="certificates" element={<StudentCertificates />} />
            <Route path="skills" element={<StudentSkills />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="ai-chat" element={<AIChatPage />} />
            <Route path="resume" element={<ResumeAnalyzerPage />} />
            <Route path="interview" element={<MockInterviewPage />} />
            <Route path="roadmap" element={<CareerRoadmapPage />} />
            <Route path="study" element={<StudyMaterialsPage />} />
            <Route path="tests" element={<AptitudeTestsPage />} />
          </Route>

          {/* MENTOR */}
          <Route
            path="/mentor"
            element={
              <ProtectedRoute roles={["mentor"]}>
                <MentorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MentorOverview />} />
            <Route path="students" element={<MentorStudents />} />
            <Route path="reports" element={<MentorReports />} />
            <Route path="certificates" element={<MentorCertificates />} />
          </Route>

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="placement" element={<AdminPlacement />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}
