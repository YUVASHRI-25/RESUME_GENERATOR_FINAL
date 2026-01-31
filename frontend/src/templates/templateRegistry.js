/**
 * Template Registry
 * Central registry for all resume templates
 * Static templates provide an `html` path; React templates can supply a `component`.
 */
import LornaModernTemplate from './lorna-modern/Template.jsx';
import { transformDataToLornaFormat } from './lorna-modern/schema.js';

export const templates = [
  {
    id: "modern-two-column",
    name: "Modern Two Column",
    preview: "/templates/modern-two-column/preview.png",
    html: "/templates/modern-two-column/index.html",
    supportsColumnPlacement: true,
    defaultTheme: {
      fontFamily: "Inter",
      primaryColor: "#2563eb",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      textSecondary: "#6b7280",
      borderColor: "#e5e7eb"
    }
  },
  {
    id: "drew-feig",
    name: "Drew Feig",
    preview: "/templates/drew-feig/preview.png",
    html: "/templates/drew-feig/index.html",
    supportsColumnPlacement: false,
    defaultTheme: {
      fontFamily: "Calibri",
      primaryColor: "#1aa6a6",
      backgroundColor: "#ffffff",
      textColor: "#2f2f2f",
      textSecondary: "#6f6f6f",
      borderColor: "#1aa6a6"
    }
  },
  {
    id: "lorna-modern",
    name: "Lorna Alvarado",
    preview: "/templates/lorna-modern/preview.png",
    component: LornaModernTemplate,
    supportsColumnPlacement: true,
    transformData: transformDataToLornaFormat,
    defaultTheme: {
      fontFamily: "Helvetica",
      primaryColor: "#7c3aed",
      backgroundColor: "#ffffff",
      textColor: "#374151",
      textSecondary: "#6b7280",
      borderColor: "#e5e7eb"
    }
  },
  {
    id: "riaan-marketing",
    name: "Riaan Marketing",
    preview: "/templates/riaan-marketing/preview.png",
    html: "/templates/riaan-marketing/index.html",
    supportsColumnPlacement: false,
    defaultTheme: {
      fontFamily: "Arial",
      primaryColor: "#dc2626",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      textSecondary: "#6b7280",
      borderColor: "#d1d5db"
    }
  },
  {
    id: "jyoti-sidebar-cream",
    name: "Jyoti Sidebar",
    preview: "/templates/jyoti-sidebar-cream/preview.png",
    html: "/templates/jyoti-sidebar-cream/index.html",
    supportsColumnPlacement: true,
    defaultTheme: {
      fontFamily: "Times New Roman",
      primaryColor: "#92400e",
      backgroundColor: "#fef3c7",
      textColor: "#451a03",
      textSecondary: "#78350f",
      borderColor: "#f59e0b"
    }
  },
  {
    id: "jonathan-writer",
    name: "Jonathan Writer",
    preview: "/templates/jonathan-writer/preview.png",
    html: "/templates/jonathan-writer/index.html",
    supportsColumnPlacement: false,
    defaultTheme: {
      fontFamily: "Georgia",
      primaryColor: "#1e40af",
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
      textSecondary: "#475569",
      borderColor: "#cbd5e1"
    }
  },
  {
    id: "creative-profile",
    name: "Creative Profile",
    preview: "/templates/creative-profile/preview.png",
    html: "/templates/creative-profile/index.html",
    supportsProfileImage: true,
    defaultTheme: {
      fontFamily: "Inter",
      primaryColor: "#6b7280",
      backgroundColor: "#f9fafb",
      textColor: "#374151",
      textSecondary: "#9ca3af",
      borderColor: "#d1d5db"
    }
  },
  {
    id: "richard-image-two-column",
    name: "Richard Image Two Column",
    preview: "/templates/richard-image-two-column/preview.png",
    html: "/templates/richard-image-two-column/index.html",
    supportsProfileImage: true,
    defaultTheme: {
      fontFamily: "Arial",
      primaryColor: "#059669",
      backgroundColor: "#ffffff",
      textColor: "#064e3b",
      textSecondary: "#047857",
      borderColor: "#6ee7b7"
    }
  },
  {
    id: "anaisha-timeline",
    name: "Anaisha Timeline",
    preview: "/templates/anaisha-timeline/preview.png",
    html: "/templates/anaisha-timeline/index.html",
    supportsProfileImage: true,
    supportsColumnPlacement: true,
    defaultTheme: {
      fontFamily: "Inter",
      primaryColor: "#4f46e5",
      backgroundColor: "#eef2ff",
      textColor: "#312e81",
      textSecondary: "#4c1d95",
      borderColor: "#a5b4fc"
    }
  },
  {
    id: "olivia-minimal",
    name: "Olivia Minimal",
    preview: "/templates/olivia-minimal/preview.png",
    html: "/templates/olivia-minimal/index.html",
    supportsColumnPlacement: true,
    defaultTheme: {
      fontFamily: "Inter",
      primaryColor: "#64748b",
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      textSecondary: "#64748b",
      borderColor: "#e2e8f0"
    }
  }
];

/**
 * Get template by ID
 */
export function getTemplateById(id) {
  return templates.find(t => t.id === id);
}

/**
 * Get template default theme by ID
 */
export function getTemplateDefaultTheme(id) {
  const template = getTemplateById(id);
  return template?.defaultTheme || {
    fontFamily: "Inter",
    primaryColor: "#2563eb",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    textSecondary: "#6b7280",
    borderColor: "#e5e7eb"
  };
}

/**
 * Apply template default theme to resume data
 */
export function applyTemplateTheme(templateId, currentData) {
  const defaultTheme = getTemplateDefaultTheme(templateId);
  return {
    ...currentData,
    fontFamily: defaultTheme.fontFamily,
    theme: defaultTheme
  };
}

/**
 * Get template component by ID (for React-based templates if added)
 */
export function getTemplateComponent(id) {
  const template = getTemplateById(id);
  return template?.component || null;
}

/**
 * Get static HTML path for a template
 */
export function getTemplateHtml(id) {
  const template = getTemplateById(id);
  return template?.html || null;
}

/**
 * Transform data for a specific template
 */
export function transformDataForTemplate(templateId, data) {
  const template = getTemplateById(templateId);
  if (template?.transformData) {
    return template.transformData(data);
  }
  return data;
}
