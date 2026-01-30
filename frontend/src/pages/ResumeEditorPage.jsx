import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSwitcher from '../components/TemplateSwitcher';
import TextFormattingToolbar from '../components/TextFormattingToolbar';
import { Download, Wand2 } from 'lucide-react';
import { applyTemplateTheme } from '../templates/templateRegistry';
import html2pdf from 'html2pdf.js';

const ResumeEditorPage = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const templateId = searchParams.get('template') || 'classic';

    // Initialize resume data with preserved data if available
    const getInitialResumeData = () => {
        // Check if we have preserved data from navigation state
        if (location.state?.preserveData) {
            const savedData = localStorage.getItem('resumeData');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    // Apply template default theme to the preserved data
                    return applyTemplateTheme(templateId, parsedData);
                } catch (error) {
                    console.error('Error parsing saved resume data:', error);
                }
            }
        }
        
        // Check if we have saved data from previous session
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // Apply template default theme to the saved data
                return applyTemplateTheme(templateId, parsedData);
            } catch (error) {
                console.error('Error parsing saved resume data:', error);
            }
        }

        // Return default data structure with template theme applied
        const defaultData = {
            profileImage: null,
            personalInfo: { 
                fullName: '', 
                email: '', 
                phone: '', 
                location: '', 
                website: '', 
                title: '', 
                links: [] 
            },
            about: {
                heading: 'About Me',
                content: '',
                visible: true,
                column: 'right'
            },
            textFormatting: {
                fontSize: 'base',
                bold: false,
                italic: false,
                underline: false
            },
            experiences: [
                {
                    id: 'exp-1',
                    company: '',
                    position: '',
                    startDate: '',
                    endDate: '',
                    currentlyWorking: false,
                    description: '',
                    bullets: []
                }
            ],
            education: [
                {
                    id: 'edu-1',
                    school: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                }
            ],
            skills: [
                { id: 'skill-1', name: '' }
            ],
            languages: [
                { id: 'lang-1', name: '', level: 'Fluent' }
            ],
            awards: [
                { id: 'award-1', title: '', issuer: '', date: '', description: '' }
            ],
            projects: [
                { id: 'proj-1', title: '', description: '', url: '', startDate: '', endDate: '' }
            ],
            references: [
                { id: 'ref-1', name: '', title: '', company: '', email: '', phone: '' }
            ],
            customSections: [],
            sectionSettings: {
                about: { heading: 'About Me', visible: true, column: 'right' },
                education: { heading: 'Education', visible: true, column: 'right' },
                skills: { heading: 'Skills', visible: true, column: 'left' },
                experience: { heading: 'Work Experience', visible: true, column: 'right' },
                projects: { heading: 'Projects', visible: true, column: 'right' },
                languages: { heading: 'Languages', visible: true, column: 'left' },
                awards: { heading: 'Awards', visible: true, column: 'left' },
                references: { heading: 'References', visible: true, column: 'right' }
            }
        };

        // Apply template default theme
        return applyTemplateTheme(templateId, defaultData);
    };

    const [resumeData, setResumeData] = useState(getInitialResumeData);
    const [hasSelection, setHasSelection] = useState(false);

    const previewRef = React.useRef(null);
    const iframeRef = React.useRef(null);

    // Auto-save resume data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }, [resumeData]);

    // Apply template theme when templateId changes
    useEffect(() => {
        const currentData = { ...resumeData };
        const themedData = applyTemplateTheme(templateId, currentData);
        // Only update if theme actually changed to avoid infinite loop
        if (JSON.stringify(themedData.theme) !== JSON.stringify(resumeData.theme) || 
            themedData.fontFamily !== resumeData.fontFamily) {
            setResumeData(themedData);
        }
    }, [templateId]);

    // Apply font to editor on load and when fontFamily changes
    useEffect(() => {
        const fontFamily = resumeData.fontFamily || 'Inter';
        document.documentElement.style.setProperty('--resume-font', `'${fontFamily}', sans-serif`);
    }, [resumeData.fontFamily]);

    // Apply theme colors to CSS variables when theme changes
    useEffect(() => {
        if (resumeData.theme) {
            document.documentElement.style.setProperty('--resume-primary-color', resumeData.theme.primaryColor || '#2563eb');
            document.documentElement.style.setProperty('--resume-background-color', resumeData.theme.backgroundColor || '#ffffff');
            document.documentElement.style.setProperty('--resume-text-color', resumeData.theme.textColor || '#1f2937');
            document.documentElement.style.setProperty('--resume-text-secondary', resumeData.theme.textSecondary || '#6b7280');
            document.documentElement.style.setProperty('--resume-border-color', resumeData.theme.borderColor || '#e5e7eb');
        }
    }, [resumeData.theme]);

    // Handle messages from iframe
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'SELECTION_CHANGED') {
                setHasSelection(event.data.hasSelection);
            } else if (event.data.type === 'DOWNLOAD_SUCCESS') {
                console.log('PDF download completed successfully');
            } else if (event.data.type === 'DOWNLOAD_ERROR') {
                console.error('PDF download failed:', event.data.error);
                alert('Failed to download PDF: ' + event.data.error);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Handle formatting requests
    const handleFormat = (formatType, value = null) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'APPLY_FORMAT',
                formatType: formatType,
                value: value
            }, '*');
        }
    };

    // Handle iframe load
    const handleIframeLoad = (iframe) => {
        iframeRef.current = iframe;
    };

    const handleDownload = async () => {
        try {
            console.log('handleDownload called for template:', templateId);
            console.log('previewRef.current:', previewRef.current);
            
            // Ensure theme colors are applied before PDF generation
            if (resumeData.theme) {
                const theme = resumeData.theme;
                if (theme.primaryColor) {
                    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
                }
                if (theme.backgroundColor) {
                    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
                }
                if (theme.textColor) {
                    document.documentElement.style.setProperty('--text-color', theme.textColor);
                }
                if (theme.textSecondary) {
                    document.documentElement.style.setProperty('--text-secondary', theme.textSecondary);
                }
                if (theme.borderColor) {
                    document.documentElement.style.setProperty('--border-color', theme.borderColor);
                }
            }

            // Try to download via iframe's postMessage
            if (previewRef.current?.downloadPDF) {
                console.log('Attempting download via iframe postMessage');
                const result = previewRef.current.downloadPDF();
                console.log('downloadPDF result:', result);
                
                if (result) {
                    console.log('PDF download triggered from iframe');
                    return;
                } else {
                    console.log('iframe downloadPDF returned false, trying fallback');
                }
            } else {
                console.log('previewRef.current.downloadPDF is not available');
            }

<<<<<<< HEAD
            // Create a dedicated print window for true text-based PDF generation
=======
            // Fallback for React templates
            console.log('Using fallback download method');
>>>>>>> 376dac5 (Initial commit)
            const element = document.getElementById('resume-preview-content');
            if (element) {
                // Create a new window for printing
                const printWindow = window.open('', '_blank');
                if (!printWindow) {
                    alert('Please allow popups for this site to generate PDF');
                    return;
                }

                // Clone the resume content
                const clonedContent = element.cloneNode(true);
                
                // Apply styles directly to the cloned content
                if (resumeData.theme) {
                    const theme = resumeData.theme;
                    if (theme.backgroundColor) {
                        clonedContent.style.backgroundColor = theme.backgroundColor;
                    }
                    if (theme.textColor) {
                        clonedContent.style.color = theme.textColor;
                    }
                }
                
                // Apply font family
                if (resumeData.fontFamily) {
                    clonedContent.style.fontFamily = `'${resumeData.fontFamily}', sans-serif`;
                }

                // Create the print document with proper print CSS
                const printDocument = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume PDF</title>
    <style>
        @page {
            size: A4;
            margin: 15mm; /* Fixed margins for all pages */
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
        }
        
        body {
            margin: 0 !important;
            padding: 0 !important;
            background: ${resumeData.theme?.backgroundColor || '#ffffff'} !important;
            font-family: '${resumeData.fontFamily || 'Inter'}', sans-serif !important;
            font-size: 12pt !important;
            line-height: 1.4 !important;
            color: ${resumeData.theme?.textColor || '#1f2937'} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        .resume-container {
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            background: ${resumeData.theme?.backgroundColor || '#ffffff'} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        
        /* Prevent content from being cut off */
        .resume-section, section, .section, .experience, .education, .skills, .projects, .about, .hobbies, .languages, .references {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
            page-break-before: auto !important;
            margin-bottom: 1rem !important;
            position: relative !important;
            overflow: visible !important;
        }
        
        .experience-item, .education-item, .project-item, .job, .position, .school, .degree {
            page-break-inside: avoid !important;
            margin-bottom: 0.8rem !important;
            overflow: visible !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            margin-top: 1em !important;
            margin-bottom: 0.5em !important;
            overflow: visible !important;
        }
        
        p, div, span, li {
            page-break-inside: avoid !important;
            orphans: 3 !important;
            widows: 3 !important;
            overflow: visible !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            line-height: 1.4 !important;
        }
        
        ul, ol, dl, .skills-list, .languages-list {
            page-break-inside: avoid !important;
            overflow: visible !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
        }
        
        li {
            page-break-inside: avoid !important;
            margin-bottom: 0.2em !important;
            overflow: visible !important;
        }
        
        img {
            page-break-inside: avoid !important;
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            object-fit: contain !important;
            overflow: visible !important;
        }
        
        table {
            page-break-inside: avoid !important;
            overflow: visible !important;
        }
        
        .columns, .grid, .flex, .container {
            page-break-inside: avoid !important;
            display: block !important;
            width: 100% !important;
            overflow: visible !important;
        }
        
        /* Hide non-essential elements during print */
        button, input, textarea, select, .no-print {
            display: none !important;
        }
        
        /* Ensure consistent template styling */
        .header, .footer, .sidebar, .main-content {
            page-break-inside: avoid !important;
            overflow: visible !important;
        }
        
        .text-content, .content, .description {
            overflow: visible !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            page-break-inside: avoid !important;
        }
        
        .profile, .contact, .personal-info {
            page-break-inside: avoid !important;
            overflow: visible !important;
        }
        
        /* Import fonts for proper rendering */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    </style>
</head>
<body>
    <div class="resume-container">
        ${clonedContent.outerHTML}
    </div>
    <script>
        // Wait for content to load, then trigger print
        window.onload = function() {
            setTimeout(() => {
                window.print();
            }, 500);
        };
        
        // Close window after printing
        window.onafterprint = function() {
            window.close();
        };
    </script>
</body>
</html>`;

                // Write the content to the print window
                printWindow.document.write(printDocument);
                printWindow.document.close();
                
                console.log('Print-based PDF generation initiated');
            } else {
                console.error('Could not find resume content to download');
                alert('Could not find resume content to download');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden" style={{ fontFamily: `var(--resume-font, 'Inter', sans-serif)` }}>
            {/* Toolbar */}
            <div className="bg-white shadow px-6 py-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-800">Resume Editor</h1>
                    <TemplateSwitcher 
                        currentTemplateId={templateId} 
                        resumeData={resumeData} 
                        setResumeData={setResumeData} 
                    />
                </div>
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
                    <div className="mb-4">
                        <TemplateSwitcher 
                            currentTemplateId={templateId} 
                            resumeData={resumeData} 
                            setResumeData={setResumeData} 
                        />
                    </div>
                    <ResumeForm data={resumeData} updateData={setResumeData} template={templateId} />
                </div>
                
                {/* Right: Preview - Full Height with Scrolling */}
                <div className="w-1/2 overflow-y-auto bg-gray-300 flex flex-col items-start pt-4">
                    {/* Formatting Toolbar */}
                    <div className="w-full max-w-[8.5in] px-4 mb-4">
                        <TextFormattingToolbar 
                            onFormat={handleFormat} 
                            disabled={!hasSelection}
                        />
                    </div>
                    
                    {/* Preview Content */}
                    <div style={{ width: '8.5in', flexShrink: 0 }}>
                        <ResumePreview 
                            ref={previewRef} 
                            data={resumeData} 
                            template={templateId}
                            onIframeLoad={handleIframeLoad}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeEditorPage;
