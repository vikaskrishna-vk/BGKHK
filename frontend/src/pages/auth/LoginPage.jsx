import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
      className="grid-bg"
    >
      <div
        className="orb orb-cyan"
        style={{ width: 400, height: 400, top: "5%", right: "10%" }}
      />
      <div
        className="orb orb-violet"
        style={{ width: 500, height: 500, bottom: "5%", left: "5%" }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "var(--bg1)",
          border: "1px solid var(--border2)",
          borderRadius: 24,
          padding: "40px 36px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 8,
            }}
            className="grad-text-cv"
          >
            ✦ InternAI
          </div>

          <h1
            style={{
              fontFamily: "Syne,sans-serif",
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            {title}
          </h1>

          <p style={{ fontSize: 14, color: "var(--text2)" }}>{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

export function LoginPage() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        email: form.identifier,
        password: form.password,
      });

      const user = res.user;

      toast.success(`Welcome ${user.name}`);

      if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "mentor") {
        navigate("/mentor");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your InternAI account"
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div className="form-group">
          <label className="form-label">Email / User ID</label>

          <input
            className="form-input"
            placeholder="student@email.com or FAC1001"
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>

          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          style={{ padding: 12 }}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          color: "var(--text2)",
          marginTop: 24,
        }}
      >
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "var(--cyan)", fontWeight: 600 }}>
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password)
      return toast.error("Name, email and password required");

    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    setLoading(true);

    try {
      const user = await register({
        ...form,
        role: "student",
      });

      toast.success(`Welcome to InternAI, ${user.name}!`);

      navigate("/student");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const f = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your AI-powered career journey"
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            placeholder="Arjun Sharma"
            value={form.name}
            onChange={(e) => f("name", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="arjun@college.edu"
            value={form.email}
            onChange={(e) => f("email", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={(e) => f("password", e.target.value)}
          />
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div className="form-group">
            <label className="form-label">College</label>
            <input
              className="form-input"
              placeholder="IIT Bombay"
              value={form.college}
              onChange={(e) => f("college", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              className="form-input"
              placeholder="CSE"
              value={form.department}
              onChange={(e) => f("department", e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          style={{ padding: 12 }}
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create Account →"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          color: "var(--text2)",
          marginTop: 24,
        }}
      >
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--cyan)", fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
