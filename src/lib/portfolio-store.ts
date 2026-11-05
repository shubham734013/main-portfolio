import { useState, useEffect, useCallback } from "react";
import {
  projects as defaultProjects,
  certificates as defaultCertificates,
  experiences as defaultExperiences,
  articles as defaultArticles,
} from "@/components/site/data";

export interface Project {
  title: string;
  tag: string;
  year: string;
  desc: string;
  link?: string;
  metrics?: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  id: string;
  skills?: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tech: string[];
}

export interface Article {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string;
}

export interface TimelineStep {
  year: string;
  title: string;
  text: string;
}

export const defaultTimeline: TimelineStep[] = [
  {
    year: "2021",
    title: "First line of code",
    text: "Fell in love with making things move on screen with raw JavaScript and canvas.",
  },
  {
    year: "2022",
    title: "Freelance designer",
    text: "Designed brand identities, wireframes & tactile sites for small creative studios.",
  },
  {
    year: "2024",
    title: "Front-end engineer",
    text: "Built production web apps with React, state management, and unified motion systems.",
  },
  {
    year: "2026",
    title: "Creative developer",
    text: "Blending WebGL shaders, GSAP physics and human-centered UX into memorable products.",
  },
];

const STORAGE_KEYS = {
  PROJECTS: "portfolio_projects_data_v1",
  CERTIFICATES: "portfolio_certificates_data_v1",
  EXPERIENCES: "portfolio_experiences_data_v1",
  ARTICLES: "portfolio_articles_data_v1",
  TIMELINE: "portfolio_timeline_data_v1",
} as const;

const EVENT_NAME = "portfolio_store_updated";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Failed to load ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err);
  }
}

/**
 * Universal reactive hook for all dynamic portfolio data.
 * Synchronizes across components, route changes, and tabs via localStorage and custom events.
 */
export function usePortfolioData() {
  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage(STORAGE_KEYS.PROJECTS, defaultProjects as Project[]),
  );
  const [certificates, setCertificates] = useState<Certificate[]>(() =>
    loadFromStorage(
      STORAGE_KEYS.CERTIFICATES,
      defaultCertificates as Certificate[],
    ),
  );
  const [experiences, setExperiences] = useState<Experience[]>(() =>
    loadFromStorage(
      STORAGE_KEYS.EXPERIENCES,
      defaultExperiences as Experience[],
    ),
  );
  const [articles, setArticles] = useState<Article[]>(() =>
    loadFromStorage(STORAGE_KEYS.ARTICLES, defaultArticles as Article[]),
  );
  const [timeline, setTimeline] = useState<TimelineStep[]>(() =>
    loadFromStorage(STORAGE_KEYS.TIMELINE, defaultTimeline),
  );

  const reloadAll = useCallback(() => {
    setProjects(
      loadFromStorage(STORAGE_KEYS.PROJECTS, defaultProjects as Project[]),
    );
    setCertificates(
      loadFromStorage(
        STORAGE_KEYS.CERTIFICATES,
        defaultCertificates as Certificate[],
      ),
    );
    setExperiences(
      loadFromStorage(
        STORAGE_KEYS.EXPERIENCES,
        defaultExperiences as Experience[],
      ),
    );
    setArticles(
      loadFromStorage(STORAGE_KEYS.ARTICLES, defaultArticles as Article[]),
    );
    setTimeline(loadFromStorage(STORAGE_KEYS.TIMELINE, defaultTimeline));
  }, []);

  useEffect(() => {
    reloadAll();
    const handleUpdate = () => reloadAll();
    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [reloadAll]);

  // Project Mutations
  const addProject = useCallback(
    (newProject: Project) => {
      const updated = [newProject, ...projects];
      setProjects(updated);
      saveToStorage(STORAGE_KEYS.PROJECTS, updated);
    },
    [projects],
  );

  const deleteProject = useCallback(
    (title: string) => {
      const updated = projects.filter((p) => p.title !== title);
      setProjects(updated);
      saveToStorage(STORAGE_KEYS.PROJECTS, updated);
    },
    [projects],
  );

  // Certificate Mutations
  const addCertificate = useCallback(
    (newCert: Certificate) => {
      const updated = [newCert, ...certificates];
      setCertificates(updated);
      saveToStorage(STORAGE_KEYS.CERTIFICATES, updated);
    },
    [certificates],
  );

  const deleteCertificate = useCallback(
    (id: string) => {
      const updated = certificates.filter((c) => c.id !== id);
      setCertificates(updated);
      saveToStorage(STORAGE_KEYS.CERTIFICATES, updated);
    },
    [certificates],
  );

  // Experience Mutations
  const addExperience = useCallback(
    (newExp: Experience) => {
      const updated = [newExp, ...experiences];
      setExperiences(updated);
      saveToStorage(STORAGE_KEYS.EXPERIENCES, updated);
    },
    [experiences],
  );

  const deleteExperience = useCallback(
    (role: string, company: string) => {
      const updated = experiences.filter(
        (e) => !(e.role === role && e.company === company),
      );
      setExperiences(updated);
      saveToStorage(STORAGE_KEYS.EXPERIENCES, updated);
    },
    [experiences],
  );

  // Article Mutations
  const addArticle = useCallback(
    (newArt: Article) => {
      const updated = [newArt, ...articles];
      setArticles(updated);
      saveToStorage(STORAGE_KEYS.ARTICLES, updated);
    },
    [articles],
  );

  const deleteArticle = useCallback(
    (slug: string) => {
      const updated = articles.filter((a) => a.slug !== slug);
      setArticles(updated);
      saveToStorage(STORAGE_KEYS.ARTICLES, updated);
    },
    [articles],
  );

  // Timeline Mutations
  const addTimelineStep = useCallback(
    (newStep: TimelineStep) => {
      const updated = [...timeline, newStep];
      setTimeline(updated);
      saveToStorage(STORAGE_KEYS.TIMELINE, updated);
    },
    [timeline],
  );

  const deleteTimelineStep = useCallback(
    (year: string, title: string) => {
      const updated = timeline.filter(
        (t) => !(t.year === year && t.title === title),
      );
      setTimeline(updated);
      saveToStorage(STORAGE_KEYS.TIMELINE, updated);
    },
    [timeline],
  );

  // Reset & Backup Utilities
  const resetToDefaults = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      window.localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
      window.localStorage.removeItem(STORAGE_KEYS.EXPERIENCES);
      window.localStorage.removeItem(STORAGE_KEYS.ARTICLES);
      window.localStorage.removeItem(STORAGE_KEYS.TIMELINE);
      reloadAll();
      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, { detail: { key: "all" } }),
      );
    }
  }, [reloadAll]);

  const exportAllData = useCallback(() => {
    return JSON.stringify(
      {
        projects,
        certificates,
        experiences,
        articles,
        timeline,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    );
  }, [projects, certificates, experiences, articles, timeline]);

  const importAllData = useCallback(
    (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.projects)
          saveToStorage(STORAGE_KEYS.PROJECTS, parsed.projects);
        if (parsed.certificates)
          saveToStorage(STORAGE_KEYS.CERTIFICATES, parsed.certificates);
        if (parsed.experiences)
          saveToStorage(STORAGE_KEYS.EXPERIENCES, parsed.experiences);
        if (parsed.articles)
          saveToStorage(STORAGE_KEYS.ARTICLES, parsed.articles);
        if (parsed.timeline)
          saveToStorage(STORAGE_KEYS.TIMELINE, parsed.timeline);
        reloadAll();
        return { success: true };
      } catch (err: unknown) {
        return {
          success: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
    [reloadAll],
  );

  return {
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
  };
}
