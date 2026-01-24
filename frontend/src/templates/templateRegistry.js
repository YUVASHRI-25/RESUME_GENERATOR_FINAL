/**
 * Template Registry
 * Central registry for all resume templates
 * Static templates provide an `html` path; React templates can supply a `component`.
 */
export const templates = [
  {
    id: "modern-two-column",
    name: "Modern Two Column",
    preview: "/templates/modern-two-column/preview.png",
    html: "/templates/modern-two-column/index.html"
  },
  {
    id: "drew-feig",
    name: "Drew Feig",
    preview: "/templates/drew-feig/preview.png",
    html: "/templates/drew-feig/index.html"
  },
  {
    id: "lorna-modern",
    name: "Lorna Alvarado",
    preview: "/templates/lorna-modern/preview.png",
    html: "/templates/lorna-modern/index.html"
  },
  {
    id: "riaan-marketing",
    name: "Riaan Marketing",
    preview: "/templates/riaan-marketing/preview.png",
    html: "/templates/riaan-marketing/index.html"
  },
  {
    id: "jyoti-sidebar-cream",
    name: "Jyoti Sidebar",
    preview: "/templates/jyoti-sidebar-cream/preview.png",
    html: "/templates/jyoti-sidebar-cream/index.html"
  }
  ,
  {
    id: "jonathan-writer",
    name: "Jonathan Writer",
    preview: "/templates/jonathan-writer/preview.png",
    html: "/templates/jonathan-writer/index.html"
  }
  ,
  {
    id: "creative-profile",
    name: "Creative Profile",
    preview: "/templates/creative-profile/preview.png",
    html: "/templates/creative-profile/index.html"
  }
];

/**
 * Get template by ID
 */
export function getTemplateById(id) {
  return templates.find(t => t.id === id);
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
