import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { getTemplateById, getTemplateComponent, transformDataForTemplate } from '../templates/templateRegistry';
import TemplateRenderer from './TemplateRenderer';

const ResumePreview = forwardRef(({ data, template }, downloadRef) => {
    const iframeRef = useRef(null);
    const templateMeta = getTemplateById(template);
    const isStaticTemplate = Boolean(templateMeta?.html);

    useEffect(() => {
        if (!isStaticTemplate || !iframeRef.current) return;

        const sendData = () => {
            const win = iframeRef.current?.contentWindow;
            if (!win) return;

            const payload = {
                type: 'UPDATE_CONTENT',
                payload: {
                    fontFamily: data?.fontFamily || 'Inter',
                    profileImage: data?.profileImage || null,
                    personalInfo: data?.personalInfo || {
                        fullName: '',
                        email: '',
                        phone: '',
                        location: '',
                        website: '',
                        title: ''
                    },
                    about: data?.about || { heading: 'About Me', content: '', visible: true },
                    education: data?.education || [],
                    skills: (data?.skills || []).map(skill => skill.name ? { name: skill.name } : skill),
                    languages: data?.languages || [],
                    awards: data?.awards || [],
                    experiences: data?.experiences || [],
                    projects: data?.projects || [],
                    references: data?.references || [],
                    customSections: data?.customSections || [],
                    sectionSettings: data?.sectionSettings || {}
                }
            };

            win.postMessage(payload, '*');
        };

        // Send immediately if already loaded
        sendData();

        // Also send when iframe loads
        const iframe = iframeRef.current;
        iframe.addEventListener('load', sendData);

        return () => {
            iframe?.removeEventListener('load', sendData);
        };
    }, [isStaticTemplate, data, template]);

    useImperativeHandle(downloadRef, () => ({
        downloadPDF: () => {
            if (isStaticTemplate && iframeRef.current?.contentWindow) {
                console.log('Sending DOWNLOAD_PDF message to iframe');
                iframeRef.current.contentWindow.postMessage('DOWNLOAD_PDF', '*');
                return true;
            }
            console.log('Download failed: isStaticTemplate =', isStaticTemplate, 'iframeRef =', iframeRef.current);
            return false;
        }
    }), [isStaticTemplate]);

    // If template is a static HTML template, render via iframe
    if (isStaticTemplate) {
        return (
            <div id="resume-preview-content">
                <TemplateRenderer templateId={template} iframeRef={iframeRef} src={templateMeta?.html} />
            </div>
        );
    }

    // Check if template is in registry (React component system)
    const TemplateComponent = getTemplateComponent(template);
    if (TemplateComponent) {
        const transformedData = transformDataForTemplate(template, data);
        return <TemplateComponent data={transformedData} />;
    }

    // Classic Template
    const ClassicTemplate = () => (
        <div id="resume-preview-content" className="p-8 h-full bg-white text-gray-900 font-serif leading-normal box-border">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.personalInfo.fullName || 'Your Name'}</h1>
                <div className="text-sm flex justify-center gap-4 text-gray-600 flex-wrap">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>| {data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>| {data.personalInfo.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-400 mb-2 uppercase tracking-wide">Professional Summary</h2>
                    <p className="text-sm text-justify">{data.summary}</p>
                </div>
            )}

            {/* Experience */}
            {data.experiences && data.experiences.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-400 mb-2 uppercase tracking-wide">Experience</h2>
                    <div className="space-y-4">
                        {data.experiences.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-md">{exp.title}</h3>
                                    <span className="text-sm text-gray-600 italic">{exp.duration}</span>
                                </div>
                                <div className="text-sm font-semibold text-gray-700 mb-1">{exp.company}</div>
                                <p className="text-sm whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-400 mb-2 uppercase tracking-wide">Projects</h2>
                    <div className="space-y-3">
                        {data.projects.map((proj, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-md">{proj.name}</h3>
                                </div>
                                <p className="text-sm mb-1">{proj.description}</p>
                                {proj.tech && <p className="text-xs text-gray-600"><strong>Tech:</strong> {proj.tech}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-400 mb-2 uppercase tracking-wide">Education</h2>
                    <div className="space-y-2">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex justify-between">
                                <div>
                                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                                    <div className="text-sm">{edu.school}</div>
                                    {edu.percentage && <div className="text-xs text-slate-500 font-medium mt-0.5">Grade: {edu.percentage}</div>}
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-gray-600 italic block">{edu.year}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold border-b border-gray-400 mb-2 uppercase tracking-wide">Skills</h2>
                    <div className="text-sm flex flex-wrap gap-2">
                        {data.skills.map((skill, i) => (
                            <span key={i} className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700">{skill.name || skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Sections */}
            {data.customSections && data.customSections.map((section, i) => (
                (section.title || section.content) && (
                    <div key={i} className="mb-6">
                        <h2 className="text-lg font-bold border-b border-gray-400 mb-2 uppercase tracking-wide">{section.title}</h2>
                        <p className="text-sm whitespace-pre-wrap">{section.content}</p>
                    </div>
                )
            ))}
        </div>
    );

    // Modern Template
    const ModernTemplate = () => (
        <div id="resume-preview-content" className="flex h-full bg-white font-sans box-border text-slate-800">
            {/* Left Sidebar */}
            <div className="w-1/3 bg-slate-800 text-white p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold leading-tight mb-4">{data.personalInfo.fullName || 'Your Name'}</h1>
                    <div className="text-sm opacity-80 space-y-2">
                        {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
                        {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
                        {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
                    </div>
                </div>

                {/* Skills in Sidebar */}
                {data.skills && data.skills.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold border-b border-slate-600 pb-1 mb-3 uppercase tracking-wider">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="bg-slate-700 px-2 py-1 rounded text-xs">{skill.name || skill}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education in Sidebar */}
                {data.education && data.education.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold border-b border-slate-600 pb-1 mb-3 uppercase tracking-wider">Education</h2>
                        <div className="space-y-4">
                            {data.education.map((edu, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-sm text-white">{edu.degree}</h3>
                                    <div className="text-sm text-slate-300">{edu.school}</div>
                                    <div className="text-xs text-slate-400">{edu.year}</div>
                                    {edu.percentage && <div className="text-xs text-slate-300 mt-1">Grade: {edu.percentage}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Main Content */}
            <div className="w-2/3 p-8">
                {data.summary && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-800 border-b-2 border-indigo-500 inline-block mb-3">PROFILE</h2>
                        <p className="text-slate-600 text-sm leading-relaxed">{data.summary}</p>
                    </div>
                )}

                {data.experiences && data.experiences.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-800 border-b-2 border-indigo-500 inline-block mb-4">EXPERIENCE</h2>
                        <div className="space-y-6">
                            {data.experiences.map((exp, i) => (
                                <div key={i} className="relative pl-4 border-l-2 border-indigo-100">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-lg text-slate-800">{exp.title}</h3>
                                        <span className="text-sm text-indigo-600 font-medium">{exp.duration}</span>
                                    </div>
                                    <div className="text-sm text-slate-500 font-semibold mb-2">{exp.company}</div>
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data.projects && data.projects.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 border-b-2 border-indigo-500 inline-block mb-4">PROJECTS</h2>
                        <div className="space-y-4">
                            {data.projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-md text-slate-800">{proj.name}</h3>
                                    <p className="text-sm text-slate-600 mb-1">{proj.description}</p>
                                    {proj.tech && <p className="text-xs text-indigo-500 font-medium">{proj.tech}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {data.customSections && data.customSections.map((section, i) => (
                (section.title || section.content) && (
                    <div key={i} className="mb-8">
                        <h2 className="text-xl font-bold text-slate-800 border-b-2 border-indigo-500 inline-block mb-4 uppercase">{section.title}</h2>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{section.content}</p>
                    </div>
                )
            ))}
        </div>
    );

    switch (template) {
        case 'modern': return <ModernTemplate />;
        case 'classic': default: return <ClassicTemplate />;
    }
});

export default ResumePreview;
