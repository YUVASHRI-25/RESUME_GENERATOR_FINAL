import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import { Download, Wand2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const ResumeEditorPage = () => {
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get('template') || 'classic';

    const [resumeData, setResumeData] = useState({
        fontFamily: 'Inter',
        profileImage: null,
        personalInfo: { fullName: '', email: '', phone: '', location: '', website: '', title: '', links: [] },
        summary: '',
        experiences: [],
        education: [],
        skills: [],
        languages: [],
        awards: [],
        projects: [],
        references: [],
        customSections: [],
        sectionSettings: {
            about: { heading: 'About Me', visible: true, column: 'right' },
            education: { heading: 'Education', visible: true, column: 'right' },
            skills: { heading: 'Skill', visible: true, column: 'left' },
            experience: { heading: 'Experience', visible: true, column: 'right' },
            projects: { heading: 'Projects', visible: true, column: 'right' },
            languages: { heading: 'Language', visible: true, column: 'left' },
            awards: { heading: 'Awards', visible: true, column: 'left' },
            references: { heading: 'References', visible: true, column: 'right' },
            custom: { heading: 'Custom', visible: true, column: 'right' }
        }
    });

    const previewRef = React.useRef(null);

    // Apply font to editor on load and when fontFamily changes
    useEffect(() => {
        const fontFamily = resumeData.fontFamily || 'Inter';
        document.documentElement.style.setProperty('--resume-font', `'${fontFamily}', sans-serif`);
    }, [resumeData.fontFamily]);

    const handleDownload = async () => {
        try {
            // Try to download via iframe's postMessage
            if (previewRef.current?.downloadPDF) {
                const result = previewRef.current.downloadPDF();
                if (result) {
                    console.log('PDF download triggered from iframe');
                    return;
                }
            }

            // Fallback for React templates
            const element = document.getElementById('resume-preview-content');
            if (element) {
                const opt = {
                    margin: 0,
                    filename: 'resume.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                };
                html2pdf().set(opt).from(element).save();
            } else {
                alert('Could not find resume content to download');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download PDF. Please try again.');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden" style={{ fontFamily: `var(--resume-font, 'Inter', sans-serif)` }}>
            {/* Toolbar */}
            <div className="bg-white shadow px-6 py-4 flex justify-between items-center z-10">
                <h1 className="text-xl font-bold text-gray-800">Resume Editor - {templateId}</h1>
                <div className="flex gap-4">
                    {/* Add AI Enhance button here or inside form sections */}
                    <button onClick={handleDownload} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                        <Download size={18} /> Download PDF
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden gap-0">
                {/* Left: Input Form */}
                <div className="w-1/2 overflow-y-auto p-6 border-r bg-white">
                    <ResumeForm data={resumeData} updateData={setResumeData} template={templateId} />
                </div>
                
                {/* Right: Preview - Full Height with Scrolling */}
                <div className="w-1/2 overflow-y-auto bg-gray-300 flex items-start justify-center pt-4">
                    <div style={{ width: '8.5in', flexShrink: 0 }}>
                        <ResumePreview ref={previewRef} data={resumeData} template={templateId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeEditorPage;
