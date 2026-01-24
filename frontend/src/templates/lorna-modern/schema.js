/**
 * Schema mapping for Lorna Modern template
 * Maps the standard resume data structure to the slot-based format consumed by the template
 */
export function transformDataToLornaFormat(standardData) {
  const personal = standardData.personalInfo || {};
  const summary = standardData.summary || "";
  const experiences = Array.isArray(standardData.experiences) ? standardData.experiences : [];
  const education = Array.isArray(standardData.education) ? standardData.education : [];
  const skills = Array.isArray(standardData.skills) ? standardData.skills : [];
  const languages = Array.isArray(standardData.languages) ? standardData.languages : [];
  const projects = Array.isArray(standardData.projects) ? standardData.projects : [];
  const customSections = Array.isArray(standardData.customSections) ? standardData.customSections : [];

  const leftSections = [];
  const rightSections = [];

  if (education.length > 0) {
    leftSections.push({
      title: "Education",
      content: education.map(entry => ({
        title: entry.degree || entry.fieldOfStudy || "",
        subtitle: entry.school || entry.institution || "",
        meta: entry.year || entry.duration || formatRange(entry.startDate, entry.endDate),
        description: entry.description || ""
      }))
    });
  }

  if (skills.length > 0) {
    leftSections.push({
      title: "Skills",
      content: skills
    });
  }

  if (languages.length > 0) {
    leftSections.push({
      title: "Languages",
      content: languages
    });
  }

  if (summary) {
    rightSections.push({
      title: "Profile",
      content: summary
    });
  }

  if (experiences.length > 0) {
    rightSections.push({
      title: "Work Experience",
      content: experiences.map(exp => ({
        title: exp.company || exp.title || "",
        subtitle: exp.title || exp.role || "",
        meta: exp.duration || formatRange(exp.startDate, exp.endDate),
        description: exp.description || ""
      }))
    });
  }

  if (projects.length > 0) {
    rightSections.push({
      title: "Projects",
      content: projects.map(proj => ({
        title: proj.name || proj.title || "",
        meta: proj.duration || formatRange(proj.startDate, proj.endDate),
        description: proj.description || "",
        text: proj.tech ? `Tech: ${proj.tech}` : ""
      }))
    });
  }

  customSections.forEach(section => {
    if (!section || (!section.title && !section.content)) return;
    rightSections.push({
      title: section.title || "",
      content: section.content || ""
    });
  });

  return {
    name: personal.fullName || "",
    title: personal.title || "",
    contact: [personal.phone, personal.email, personal.location].filter(Boolean),
    leftSections,
    rightSections
  };
}

function formatRange(start, end) {
  if (start && end) return `${start} - ${end}`;
  if (start && !end) return `${start} - Present`;
  return start || end || "";
}
