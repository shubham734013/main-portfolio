import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { usePortfolioData } from "@/lib/portfolio-store";
import { loadInquiries, type Inquiry } from "@/lib/inquiries";
import { ScrambleText } from "@/components/site/TextEffects";
import { Button } from "@/components/ui/button";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

type Tab =
  | "certificates"
  | "inquiries"
  | "timeline"
  | "projects"
  | "experiences"
  | "articles"
  | "backup";

function getMasterPassword(): string {
  if (typeof window !== "undefined") {
    const custom = window.localStorage.getItem("portfolio_admin_custom_key");
    if (custom && custom.trim()) return custom.trim();
  }
  return import.meta.env.VITE_ADMIN_PASSWORD || "shubham2026";
}

function AdminLockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Auto-login if ?key=... URL parameter matches master password
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get("key");
    if (keyParam && keyParam === getMasterPassword()) {
      sessionStorage.setItem("admin_auth_token", "authenticated");
      // Clean query parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      onUnlock();
    }
  }, [onUnlock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getMasterPassword();

    if (passcode.trim() === correctPassword) {
      sessionStorage.setItem("admin_auth_token", "authenticated");
      onUnlock();
    } else {
      setError(true);
      setErrorMessage("Incorrect passcode. Access denied.");
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 pt-20 pb-12">
      {/* Background glow & mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[420px] w-[420px] rounded-full bg-primary/10 blur-[130px]" />
      </div>

      <div className="glass w-full max-w-md rounded-3xl border border-glass-border p-8 sm:p-10 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-500">
        {/* Lock header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/25 text-primary shadow-[0_0_35px_rgba(var(--primary-rgb),0.25)]">
            <Lock className="h-8 w-8" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass-surface/40 px-3.5 py-1 font-mono text-[11px] uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Restricted Studio Access
          </div>

          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Admin <span className="text-liquid">Authentication</span>
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            This control room is restricted to the portfolio owner. Enter your
            secure master key to manage certificates, work, and articles.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Master Passcode
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter admin key..."
                autoFocus
                className={`glass w-full rounded-xl border bg-background/60 py-3 pl-4 pr-11 font-mono text-sm tracking-widest text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/40 placeholder:tracking-normal focus:ring-2 focus:ring-primary/40 ${
                  error
                    ? "border-destructive/80 ring-2 ring-destructive/40"
                    : "border-glass-border focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {error && (
              <p className="pt-1 text-xs font-medium text-destructive">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            <KeyRound className="h-4 w-4 transition-transform group-hover:rotate-12" />
            <span>Unlock Admin Studio</span>
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between border-t border-glass-border/60 pt-4 text-xs text-muted-foreground">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Portfolio</span>
          </Link>
          <span className="font-mono text-[10px] text-muted-foreground/60">
            Protected Route
          </span>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("admin_auth_token") === "authenticated";
  });
  const {
    projects,
    addProject,
    deleteProject,
    certificates,
    addCertificate,
    deleteCertificate,
    experiences,
    addExperience,
    deleteExperience,
    articles,
    addArticle,
    deleteArticle,
    timeline,
    addTimelineStep,
    deleteTimelineStep,
    resetToDefaults,
    exportAllData,
    importAllData,
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState<Tab>("certificates");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const [newKeyInput, setNewKeyInput] = useState("");
  const [activeMasterKey, setActiveMasterKey] = useState(getMasterPassword());
  const [copiedUrlKey, setCopiedUrlKey] = useState(false);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  useEffect(() => {
    if (!isAuthenticated || activeTab !== "inquiries") return;
    setInquiriesLoading(true);
    loadInquiries({})
      .then(setInquiries)
      .catch((error) => {
        console.error("Failed to load inquiries", error);
        showNotification("Could not load inquiries.");
      })
      .finally(() => setInquiriesLoading(false));
  }, [activeTab, isAuthenticated]);

  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim()) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "portfolio_admin_custom_key",
        newKeyInput.trim(),
      );
      setActiveMasterKey(newKeyInput.trim());
      setNewKeyInput("");
      showNotification("✦ Admin master key updated successfully!");
    }
  };

  const handleResetPasscode = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("portfolio_admin_custom_key");
      setActiveMasterKey(getMasterPassword());
      showNotification(
        "✦ Reset passcode back to default / Vercel environment variable.",
      );
    }
  };

  const handleCopyDirectLink = () => {
    if (typeof window !== "undefined") {
      const directUrl = `${window.location.origin}/admin?key=${encodeURIComponent(activeMasterKey)}`;
      navigator.clipboard.writeText(directUrl);
      setCopiedUrlKey(true);
      setTimeout(() => setCopiedUrlKey(false), 2500);
      showNotification("✦ 1-Click secret admin link copied to clipboard!");
    }
  };

  // 1. Certificate Form State
  const [certForm, setCertForm] = useState({
    title: "",
    issuer: "",
    date: new Date().getFullYear().toString(),
    id: `CRT-${Math.floor(1000 + Math.random() * 9000)}`,
    skills: "",
  });

  const handleCreateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title.trim() || !certForm.issuer.trim()) return;

    addCertificate({
      title: certForm.title.trim(),
      issuer: certForm.issuer.trim(),
      date: certForm.date.trim(),
      id: certForm.id.trim() || `CRT-${Date.now().toString().slice(-4)}`,
      skills: certForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });

    setCertForm({
      title: "",
      issuer: "",
      date: new Date().getFullYear().toString(),
      id: `CRT-${Math.floor(1000 + Math.random() * 9000)}`,
      skills: "",
    });
    showNotification("✦ Certificate successfully added to portfolio!");
  };

  // 2. Journey Step Form State
  const [journeyForm, setJourneyForm] = useState({
    year: (new Date().getFullYear() + 1).toString(),
    title: "",
    text: "",
  });

  const handleCreateJourneyStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !journeyForm.year.trim() ||
      !journeyForm.title.trim() ||
      !journeyForm.text.trim()
    )
      return;

    addTimelineStep({
      year: journeyForm.year.trim(),
      title: journeyForm.title.trim(),
      text: journeyForm.text.trim(),
    });

    setJourneyForm({
      year: (new Date().getFullYear() + 1).toString(),
      title: "",
      text: "",
    });
    showNotification("✦ New Journey Milestone added to About section!");
  };

  // 3. Project Form State
  const [projectForm, setProjectForm] = useState({
    title: "",
    tag: "",
    year: new Date().getFullYear().toString(),
    desc: "",
    metrics: "",
    link: "https://github.com",
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !projectForm.title.trim() ||
      !projectForm.tag.trim() ||
      !projectForm.desc.trim()
    )
      return;

    addProject({
      title: projectForm.title.trim(),
      tag: projectForm.tag.trim(),
      year: projectForm.year.trim(),
      desc: projectForm.desc.trim(),
      metrics: projectForm.metrics.trim() || "Interactive · 60 FPS · Modern UI",
      link: projectForm.link.trim() || "https://github.com",
    });

    setProjectForm({
      title: "",
      tag: "",
      year: new Date().getFullYear().toString(),
      desc: "",
      metrics: "",
      link: "https://github.com",
    });
    showNotification("✦ Selected Work project added to portfolio gallery!");
  };

  // 4. Experience Form State
  const [expForm, setExpForm] = useState({
    role: "",
    company: "",
    period: `${new Date().getFullYear()} — Present`,
    location: "Remote / Hybrid",
    description: "",
    highlights: "",
    tech: "",
  });

  const handleCreateExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !expForm.role.trim() ||
      !expForm.company.trim() ||
      !expForm.description.trim()
    )
      return;

    addExperience({
      role: expForm.role.trim(),
      company: expForm.company.trim(),
      period: expForm.period.trim(),
      location: expForm.location.trim() || "Remote",
      description: expForm.description.trim(),
      highlights: expForm.highlights
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
      tech: expForm.tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setExpForm({
      role: "",
      company: "",
      period: `${new Date().getFullYear()} — Present`,
      location: "Remote / Hybrid",
      description: "",
      highlights: "",
      tech: "",
    });
    showNotification(
      "✦ Career Experience craft role added to experience timeline!",
    );
  };

  // 5. Article Form State
  const [artForm, setArtForm] = useState({
    title: "",
    slug: "",
    category: "Motion & GSAP",
    readTime: "5 min read",
    date: "November 2026",
    excerpt: "",
    content: "",
  });

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !artForm.title.trim() ||
      !artForm.excerpt.trim() ||
      !artForm.content.trim()
    )
      return;

    const slug =
      artForm.slug.trim() ||
      artForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    addArticle({
      title: artForm.title.trim(),
      slug,
      category: artForm.category.trim() || "Creative Engineering",
      readTime: artForm.readTime.trim() || "5 min read",
      date: artForm.date.trim() || "2026",
      excerpt: artForm.excerpt.trim(),
      content: artForm.content.trim(),
    });

    setArtForm({
      title: "",
      slug: "",
      category: "Motion & GSAP",
      readTime: "5 min read",
      date: "November 2026",
      excerpt: "",
      content: "",
    });
    showNotification("✦ New Article published to Writing section!");
  };

  const handleExportCopy = () => {
    const data = exportAllData();
    navigator.clipboard.writeText(data);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const res = importAllData(importText.trim());
    if (res.success) {
      setImportText("");
      showNotification("✦ Portfolio data successfully restored from backup!");
    } else {
      showNotification(`❌ Error restoring data: ${res.error}`);
    }
  };

  if (!isAuthenticated) {
    return <AdminLockScreen onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen px-4 pb-24 pt-28 sm:px-8 md:px-16">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glass-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              Portfolio Studio Command
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl md:text-5xl text-foreground">
            Admin <span className="text-liquid">Dashboard</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-all duration-300"
          >
            <span>View Live Portfolio ↗</span>
          </Link>
          <Button
            variant="ghost"
            onClick={() => setShowExportModal(true)}
            className="glass rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary hover:border-primary"
          >
            Backup & Export
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              sessionStorage.removeItem("admin_auth_token");
              setIsAuthenticated(false);
            }}
            className="glass flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/15 hover:border-destructive transition-all duration-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Lock</span>
          </Button>
        </div>
      </div>

      {/* Status Notification Toast */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-[99] flex items-center gap-3 rounded-2xl border border-primary/40 bg-background/95 px-5 py-3 text-sm font-medium text-foreground shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <span className="text-primary font-bold">✦</span>
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          {
            label: "Certificates",
            count: certificates.length,
            tab: "certificates" as Tab,
            icon: "📜",
          },
          {
            label: "Journey Steps",
            count: timeline.length,
            tab: "timeline" as Tab,
            icon: "⏳",
          },
          {
            label: "Selected Work",
            count: projects.length,
            tab: "projects" as Tab,
            icon: "🚀",
          },
          {
            label: "Experience Roles",
            count: experiences.length,
            tab: "experiences" as Tab,
            icon: "💼",
          },
          {
            label: "Articles",
            count: articles.length,
            tab: "articles" as Tab,
            icon: "✍️",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            onClick={() => setActiveTab(stat.tab)}
            className={`glass group cursor-pointer rounded-2xl p-4 transition-all duration-300 hover:border-primary/60 ${
              activeTab === stat.tab
                ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                : ""
            }`}
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs uppercase tracking-wider">
                {stat.label}
              </span>
              <span>{stat.icon}</span>
            </div>
            <div className="mt-2 font-display text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors">
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div className="mt-10 flex flex-wrap gap-2 border-b border-glass-border pb-4 overflow-x-auto no-scrollbar">
        {[
          { id: "inquiries" as Tab, label: "Inquiries", icon: "✉️" },
          { id: "certificates" as Tab, label: "Certificate Cards", icon: "📜" },
          { id: "timeline" as Tab, label: "Next Journey Step", icon: "⏳" },
          { id: "projects" as Tab, label: "Selected Work", icon: "🚀" },
          { id: "experiences" as Tab, label: "Experience Craft", icon: "💼" },
          { id: "articles" as Tab, label: "New Articles", icon: "✍️" },
          { id: "backup" as Tab, label: "Backup & Sync", icon: "⚙️" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              activeTab === t.id
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "inquiries" && (
        <div className="mt-8 space-y-4">
          {inquiriesLoading ? (
            <p className="glass rounded-2xl p-6 text-sm text-muted-foreground">
              Loading inquiries...
            </p>
          ) : inquiries.length === 0 ? (
            <p className="glass rounded-2xl p-6 text-sm text-muted-foreground">
              No inquiries received yet.
            </p>
          ) : (
            inquiries.map((inquiry) => (
              <article key={inquiry.id} className="glass rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {inquiry.name}
                    </h3>
                    <a href={`mailto:${inquiry.email}`} className="text-sm text-primary hover:underline">
                      {inquiry.email}
                    </a>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {inquiry.message}
                </p>
              </article>
            ))
          )}
        </div>
      )}

      {/* TAB 1: CERTIFICATES */}
      {activeTab === "certificates" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Add Certificate Form */}
          <div className="lg:col-span-5">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">
                New Credential
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold">
                Add Certificate Card
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Add a new verified certificate or achievement to your credential
                vault.
              </p>

              <form
                onSubmit={handleCreateCertificate}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Certified Solutions Architect"
                    value={certForm.title}
                    onChange={(e) =>
                      setCertForm({ ...certForm, title: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Issuer / Org *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amazon Web Services"
                      value={certForm.issuer}
                      onChange={(e) =>
                        setCertForm({ ...certForm, issuer: e.target.value })
                      }
                      className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Issue Year / Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2026"
                      value={certForm.date}
                      onChange={(e) =>
                        setCertForm({ ...certForm, date: e.target.value })
                      }
                      className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Credential ID / Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AWS-SAA-9011"
                    value={certForm.id}
                    onChange={(e) =>
                      setCertForm({ ...certForm, id: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Serverless, DynamoDB, VPC, Security"
                    value={certForm.skills}
                    onChange={(e) =>
                      setCertForm({ ...certForm, skills: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  + Add Certificate to Vault
                </Button>
              </form>
            </div>
          </div>

          {/* Certificate Cards List */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">
                Current Certificates ({certificates.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                Live in portfolio
              </span>
            </div>

            <div className="space-y-3">
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="glass group flex items-start justify-between rounded-2xl p-5 transition-colors duration-300 hover:border-primary/50"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">✦</span>
                      <h4 className="font-display text-lg font-bold text-foreground truncate">
                        <ScrambleText text={c.title} />
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-primary font-medium">
                      {c.issuer} · {c.date} ·{" "}
                      <span className="font-mono text-muted-foreground">
                        {c.id}
                      </span>
                    </p>

                    {c.skills && c.skills.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {c.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-mono text-primary"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove certificate "${c.title}"?`)) {
                        deleteCertificate(c.id);
                        showNotification(`Removed "${c.title}"`);
                      }
                    }}
                    className="glass flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    title="Delete certificate"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JOURNEY TIMELINE STEP */}
      {activeTab === "timeline" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Add Journey Step Form */}
          <div className="lg:col-span-5">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">
                Story Milestones
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold">
                Add Next Journey Step
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Append future or past career milestones to the interactive
                Journey timeline in About.
              </p>

              <form
                onSubmit={handleCreateJourneyStep}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Milestone Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2027"
                    value={journeyForm.year}
                    onChange={(e) =>
                      setJourneyForm({ ...journeyForm, year: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Milestone Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spatial Computing & WebGL Studio"
                    value={journeyForm.title}
                    onChange={(e) =>
                      setJourneyForm({ ...journeyForm, title: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Story / Details *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Expanding creative engineering into autonomous interfaces and real-time generative art."
                    value={journeyForm.text}
                    onChange={(e) =>
                      setJourneyForm({ ...journeyForm, text: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border p-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  + Add Step to Journey
                </Button>
              </form>
            </div>
          </div>

          {/* Journey Steps List */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">
                Current Journey Steps ({timeline.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                Live in About section
              </span>
            </div>

            <div className="space-y-3">
              {timeline.map((step) => (
                <div
                  key={`${step.year}-${step.title}`}
                  className="glass group flex items-start justify-between rounded-2xl p-5 transition-colors duration-300 hover:border-primary/50"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl font-extrabold text-liquid">
                        {step.year}
                      </span>
                      <h4 className="font-display text-lg font-bold text-foreground">
                        {step.title}
                      </h4>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {step.text}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Remove milestone "${step.year}: ${step.title}"?`,
                        )
                      ) {
                        deleteTimelineStep(step.year, step.title);
                        showNotification(`Removed ${step.year}`);
                      }
                    }}
                    className="glass flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    title="Delete milestone"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SELECTED WORK (PROJECTS) */}
      {activeTab === "projects" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Add Project Form */}
          <div className="lg:col-span-5">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">
                Portfolio Showcase
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold">
                Add Selected Work
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Publish a new flagship project or experimental build to your
                portfolio.
              </p>

              <form onSubmit={handleCreateProject} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aura Spatial"
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Tech Tag *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WebGL · Three.js"
                      value={projectForm.tag}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, tag: e.target.value })
                      }
                      className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Year *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2026"
                      value={projectForm.year}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, year: e.target.value })
                      }
                      className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Project Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Real-time spatial telemetry dashboard with GPU compute shaders."
                    value={projectForm.desc}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, desc: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border p-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Key Performance Metrics / Tech Highlights
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 60 FPS · Sub-20ms latency · WebGPU"
                    value={projectForm.metrics}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        metrics: e.target.value,
                      })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Live Link / Repo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com"
                    value={projectForm.link}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, link: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  + Add Project to Work Gallery
                </Button>
              </form>
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">
                Current Projects ({projects.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                Live in Work section
              </span>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.title}
                  className="glass group flex items-start justify-between rounded-2xl p-5 transition-colors duration-300 hover:border-primary/50"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-3">
                      <h4 className="font-display text-xl font-bold text-foreground">
                        <ScrambleText text={p.title} />
                      </h4>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-mono text-primary">
                        {p.year}
                      </span>
                    </div>

                    <p className="mt-1 text-xs uppercase tracking-widest text-primary font-semibold">
                      {p.tag}
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>

                    {p.metrics && (
                      <div className="mt-3 inline-block rounded-lg border border-glass-border bg-glass/60 px-2.5 py-0.5 text-[11px] font-mono text-foreground/80">
                        ⚡️ {p.metrics}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove project "${p.title}"?`)) {
                        deleteProject(p.title);
                        showNotification(`Removed "${p.title}"`);
                      }
                    }}
                    className="glass flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXPERIENCE CRAFT */}
      {activeTab === "experiences" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Add Experience Form */}
          <div className="lg:col-span-5">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">
                Career History
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold">
                Add Experience Craft
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Document a leadership role, senior engineering position, or
                studio engagement.
              </p>

              <form
                onSubmit={handleCreateExperience}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Creative Developer"
                    value={expForm.role}
                    onChange={(e) =>
                      setExpForm({ ...expForm, role: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Studio Hyperion"
                      value={expForm.company}
                      onChange={(e) =>
                        setExpForm({ ...expForm, company: e.target.value })
                      }
                      className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Period *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2025 — Present"
                      value={expForm.period}
                      onChange={(e) =>
                        setExpForm({ ...expForm, period: e.target.value })
                      }
                      className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / Hybrid"
                    value={expForm.location}
                    onChange={(e) =>
                      setExpForm({ ...expForm, location: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Role Overview / Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Spearheading interactive web applications, high-performance WebGL product showcases..."
                    value={expForm.description}
                    onChange={(e) =>
                      setExpForm({ ...expForm, description: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border p-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Key Highlights (One bullet per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Engineered bespoke 60fps micro-interaction libraries...&#10;Architected design system with zero layout shifts..."
                    value={expForm.highlights}
                    onChange={(e) =>
                      setExpForm({ ...expForm, highlights: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border p-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Tech Stack (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React 19, Three.js, GSAP 3, TypeScript, Tailwind CSS"
                    value={expForm.tech}
                    onChange={(e) =>
                      setExpForm({ ...expForm, tech: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  + Add Experience Role
                </Button>
              </form>
            </div>
          </div>

          {/* Experience List */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">
                Career Roles ({experiences.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                Live in Experience section
              </span>
            </div>

            <div className="space-y-3">
              {experiences.map((exp) => (
                <div
                  key={`${exp.role}-${exp.company}`}
                  className="glass group flex items-start justify-between rounded-2xl p-5 transition-colors duration-300 hover:border-primary/50"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs uppercase text-primary font-semibold">
                        {exp.period}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
                        {exp.company}
                      </span>
                    </div>

                    <h4 className="mt-1 font-display text-xl font-bold text-foreground">
                      <ScrambleText text={exp.role} />
                    </h4>

                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>

                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-primary font-bold">✦</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.tech && exp.tech.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {exp.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-glass-border bg-glass px-2 py-0.5 text-[10px] font-mono text-foreground/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Remove experience "${exp.role} at ${exp.company}"?`,
                        )
                      ) {
                        deleteExperience(exp.role, exp.company);
                        showNotification(`Removed "${exp.role}"`);
                      }
                    }}
                    className="glass flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    title="Delete experience"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NEW ARTICLES (WRITING) */}
      {activeTab === "articles" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* Add Article Form */}
          <div className="lg:col-span-5">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">
                Writing & Thoughts
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold">
                Publish New Article
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Write creative coding notes, shader architecture deep dives, or
                UI philosophy.
              </p>

              <form onSubmit={handleCreateArticle} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WebGPU in Production: The Future of Browser 3D"
                    value={artForm.title}
                    onChange={(e) =>
                      setArtForm({ ...artForm, title: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3D & WebGL"
                      value={artForm.category}
                      onChange={(e) =>
                        setArtForm({ ...artForm, category: e.target.value })
                      }
                      className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Read Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6 min read"
                      value={artForm.readTime}
                      onChange={(e) =>
                        setArtForm({ ...artForm, readTime: e.target.value })
                      }
                      className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. November 2026"
                    value={artForm.date}
                    onChange={(e) =>
                      setArtForm({ ...artForm, date: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Excerpt / Teaser Summary *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="A concise summary displayed on the article card preview..."
                    value={artForm.excerpt}
                    onChange={(e) =>
                      setArtForm({ ...artForm, excerpt: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border p-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Full Article Content *
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Write your article thoughts and code notes here..."
                    value={artForm.content}
                    onChange={(e) =>
                      setArtForm({ ...artForm, content: e.target.value })
                    }
                    className="glass mt-1.5 w-full rounded-2xl border border-glass-border p-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] active:scale-95"
                >
                  + Publish Article
                </Button>
              </form>
            </div>
          </div>

          {/* Articles List */}
          <div className="space-y-4 lg:col-span-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">
                Published Articles ({articles.length})
              </h3>
              <span className="text-xs text-muted-foreground">
                Live in Writing section
              </span>
            </div>

            <div className="space-y-3">
              {articles.map((art) => (
                <div
                  key={art.slug}
                  className="glass group flex items-start justify-between rounded-2xl p-5 transition-colors duration-300 hover:border-primary/50"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {art.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {art.readTime} · {art.date}
                      </span>
                    </div>

                    <h4 className="mt-2 font-display text-xl font-bold text-foreground">
                      <ScrambleText text={art.title} />
                    </h4>

                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove article "${art.title}"?`)) {
                        deleteArticle(art.slug);
                        showNotification(`Removed "${art.title}"`);
                      }
                    }}
                    className="glass flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
                    title="Delete article"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BACKUP & DATA SYNC */}
      {activeTab === "backup" && (
        <div className="mt-8 max-w-4xl space-y-8">
          {/* Security & Access Management Card */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-primary/20 bg-primary/[0.02]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">
                Studio Security & Route Protection
              </span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold">
              Admin Passcode & Direct Access
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Your admin route (
              <code className="rounded bg-black/40 px-2 py-0.5 font-mono text-xs text-primary">
                /admin
              </code>
              ) is protected by a master passcode. Visitors who visit this URL
              cannot view or modify your data without entering the correct key.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Direct Access Link Box */}
              <div className="glass rounded-2xl p-5 border border-glass-border">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Your 1-Click Secret Access URL
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  Bookmark this link in your browser to skip typing the
                  password:
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    readOnly
                    value={
                      typeof window !== "undefined"
                        ? `${window.location.origin}/admin?key=${activeMasterKey}`
                        : `/admin?key=${activeMasterKey}`
                    }
                    className="glass flex-1 rounded-xl bg-black/40 px-3 py-2 font-mono text-xs text-primary outline-none"
                  />
                  <Button
                    onClick={handleCopyDirectLink}
                    className="shrink-0 rounded-xl bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
                  >
                    {copiedUrlKey ? "✓ Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* Change Passcode Box */}
              <div className="glass rounded-2xl p-5 border border-glass-border">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Change Master Key (Device Local)
                </span>
                <form
                  onSubmit={handleUpdatePasscode}
                  className="mt-3 flex items-center gap-2"
                >
                  <input
                    type="password"
                    placeholder="New custom key..."
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    className="glass flex-1 rounded-xl bg-black/40 px-3 py-2 font-mono text-xs text-foreground outline-none border border-glass-border focus:border-primary"
                  />
                  <Button
                    type="submit"
                    className="shrink-0 rounded-xl bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
                  >
                    Save
                  </Button>
                </form>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    Current Key:{" "}
                    <strong className="font-mono text-primary">••••••</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetPasscode}
                    className="text-muted-foreground hover:text-destructive underline transition-colors"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-glass-border/70 bg-black/30 p-4">
              <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                💡 100% Free Vercel Custom Passcode:
              </span>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                In your Vercel Dashboard, go to{" "}
                <strong>
                  Project &gt; Settings &gt; Environment Variables
                </strong>
                , add key{" "}
                <code className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-primary">
                  VITE_ADMIN_PASSWORD
                </code>{" "}
                with your secret password, and click Redeploy. It works on the
                free Vercel Hobby tier without paying for Pro!
              </p>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 sm:p-8">
            <span className="text-xs uppercase tracking-widest text-primary font-mono font-semibold">
              Data Management
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold">
              Backup, Export & Restore
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              All items created in this Admin Dashboard are instantly saved to
              your browser's persistent storage. You can export a snapshot
              backup to JSON or paste a JSON string to restore data anytime.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Button
                onClick={() => setShowExportModal(true)}
                className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]"
              >
                Export All Data (JSON) ↓
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  if (
                    confirm(
                      "Reset all additions back to default portfolio state? This cannot be undone.",
                    )
                  ) {
                    resetToDefaults();
                    showNotification(
                      "✦ Portfolio reset to original default state.",
                    );
                  }
                }}
                className="glass rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider text-destructive hover:bg-destructive/20 hover:border-destructive"
              >
                Reset to Factory Defaults ↺
              </Button>
            </div>
          </div>

          {/* Import JSON Box */}
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h3 className="font-display text-xl font-bold">
              Import Data from JSON
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Paste a previously exported portfolio JSON payload to import
              certificates, projects, and articles.
            </p>

            <form onSubmit={handleImportSubmit} className="mt-4 space-y-4">
              <textarea
                rows={5}
                required
                placeholder='Paste {"projects": [...], "certificates": [...]} here...'
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="glass w-full rounded-2xl border border-glass-border p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
              />
              <Button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]"
              >
                Import & Apply Data ↗
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div
          onClick={() => setShowExportModal(false)}
          className="fixed inset-0 z-[99] flex items-center justify-center bg-background/85 p-4 backdrop-blur-2xl"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8"
          >
            <div className="flex items-center justify-between border-b border-glass-border pb-4">
              <h3 className="font-display text-xl font-bold text-foreground">
                Exported Portfolio Data
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="glass flex h-8 w-8 items-center justify-center rounded-full text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Copy this JSON payload to backup your custom entries or transfer
              them to another device.
            </p>

            <pre className="mt-4 max-h-72 overflow-y-auto rounded-2xl border border-glass-border bg-black/60 p-4 font-mono text-xs text-primary/90">
              {exportAllData()}
            </pre>

            <div className="mt-6 flex justify-end gap-3 border-t border-glass-border pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowExportModal(false)}
                className="glass rounded-full px-5 py-2 text-xs uppercase tracking-wider"
              >
                Close
              </Button>
              <Button
                onClick={handleExportCopy}
                className="rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-glow)]"
              >
                {copiedExport ? "✓ Copied to Clipboard!" : "Copy JSON Data"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
