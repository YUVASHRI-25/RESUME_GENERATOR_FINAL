/**
 * Schema mapping for Lorna Modern template
 * Maps the standard resume data structure to the slot-based format consumed by the template
 */
export function transformDataToLornaFormat(standardData) {
  const personal = standardData.personalInfo || {};
  const about = standardData.about || {};
  const sectionSettings = standardData.sectionSettings || {};
  const summary = about.content || standardData.summary || "";
  const experiences = Array.isArray(standardData.experiences) ? standardData.experiences : [];
  const education = Array.isArray(standardData.education) ? standardData.education : [];
  const skills = Array.isArray(standardData.skills) ? standardData.skills : [];
  const languages = Array.isArray(standardData.languages) ? standardData.languages : [];
  const projects = Array.isArray(standardData.projects) ? standardData.projects : [];
  const customSections = Array.isArray(standardData.customSections) ? standardData.customSections : [];

  const leftSections = [];
  const rightSections = [];

  // Education - respect column setting
  if (education.length > 0 && sectionSettings.education?.visible !== false) {
    const educationSection = {
      title: sectionSettings.education?.heading || "Education",
      content: education.map(entry => ({
        title: entry.degree || entry.fieldOfStudy || "",
        subtitle: entry.school || entry.institution || "",
        meta: entry.year || entry.duration || formatRange(entry.startDate, entry.endDate),
        description: entry.description || ""
      }))
    };
    
    if (sectionSettings.education?.column === 'left') {
      leftSections.push(educationSection);
    } else {
      rightSections.push(educationSection);
    }
  }

  // Skills - respect visibility setting
  if (skills.length > 0 && sectionSettings.skills?.visible !== false) {
    const skillNames = skills
      .map(skill => skill.name || skill)
      .filter(name => name && name.trim() !== '');
    
    if (skillNames.length > 0) {
      leftSections.push({
        title: sectionSettings.skills?.heading || "Skills",
        content: skillNames
      });
    }
  }

  // Languages - respect visibility setting
  if (languages.length > 0 && sectionSettings.languages?.visible !== false) {
    const languageNames = languages
      .map(lang => lang.name || lang)
      .filter(name => name && name.trim() !== '');
    
    if (languageNames.length > 0) {
      leftSections.push({
        title: sectionSettings.languages?.heading || "Languages",
        content: languageNames
      });
    }
  }

  // About Me - respect visibility setting
  if (summary && sectionSettings.about?.visible !== false) {
    rightSections.push({
      title: about.heading || sectionSettings.about?.heading || "Profile",
      content: summary
    });
  }

  // Work Experience - respect visibility setting
  if (experiences.length > 0 && sectionSettings.experience?.visible !== false) {
    rightSections.push({
      title: sectionSettings.experience?.heading || "Work Experience",
      content: experiences.map(exp => ({
        title: exp.company || "",
        subtitle: exp.position || exp.title || "",
        meta: exp.duration || formatRange(exp.startDate, exp.endDate),
        description: exp.description || ""
      }))
    });
  }

  // Projects - respect visibility setting
  if (projects.length > 0 && sectionSettings.projects?.visible !== false) {
    rightSections.push({
      title: sectionSettings.projects?.heading || "Projects",
      content: projects.map(proj => ({
        title: proj.title || proj.name || "",
        meta: proj.duration || formatRange(proj.startDate, proj.endDate),
        description: proj.description || "",
        text: proj.url ? `URL: ${proj.url}` : ""
      }))
    });
  }

  // Custom Sections - handle both heading and title fields
  customSections.forEach(section => {
    if (!section || (!section.heading && !section.title && !section.content)) return;
    
    // Create content object that can handle both text content and bullets
    let content = section.content || "";
    
    // If there are bullets, format them properly
    if (section.bullets && Array.isArray(section.bullets) && section.bullets.length > 0) {
      const validBullets = section.bullets.filter(bullet => bullet && bullet.trim() !== '');
      if (validBullets.length > 0) {
        content = {
          text: content,
          bullets: validBullets
        };
      }
    }
    
    rightSections.push({
      title: section.heading || section.title || "",
      content: content
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
