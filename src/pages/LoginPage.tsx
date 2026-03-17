import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, BookOpen } from "lucide-react";

type UserRole = "student" | "faculty";

const LoginPage = () => {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    const success = login(username, password, role);
    if (!success) setError("Invalid credentials.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-[400px]"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">CampusFlow</h1>
          <p className="text-muted-foreground mt-1">Sign in to continue</p>
        </div>

        <div className="bg-card shadow-surface rounded-lg p-6">
          {/* Role Toggle */}
          <div className="flex bg-secondary rounded-sm p-1 mb-6">
            {(["student", "faculty"] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-sm text-sm font-medium transition-all duration-150 ${
                  role === r
                    ? "bg-card shadow-surface text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "student" ? <GraduationCap className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                <span className="capitalize">{r}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === "student" ? "student@campus.edu" : "faculty@campus.edu"}
                className="w-full h-10 px-3 rounded-sm bg-background border-0 shadow-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-elevated transition-all duration-150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full h-10 px-3 rounded-sm bg-background border-0 shadow-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-elevated transition-all duration-150"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-destructive text-sm"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full h-10 bg-primary text-primary-foreground rounded-sm font-medium hover:opacity-90 transition-opacity duration-150"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Use any credentials to sign in (demo mode)
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
