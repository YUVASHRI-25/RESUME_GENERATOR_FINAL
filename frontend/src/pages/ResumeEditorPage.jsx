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
            
            // Try to download via iframe's postMessage first (for static templates)
            if (previewRef.current?.downloadPDF) {
                console.log('Attempting download via iframe postMessage');
                const result = previewRef.current.downloadPDF();
                console.log('downloadPDF result:', result);
                
                if (result) {
                    console.log('PDF download triggered from iframe');
                    return;
                }
            }

            // Fallback for React templates and when iframe method fails
            console.log('Using fallback download method');
            
            // Wait a bit for the content to render
            setTimeout(() => {
                // Try multiple selectors to find the resume content
                let element = document.getElementById('resume-preview-content');
                
                if (!element) {
                    // Try to find the main resume container
                    element = document.querySelector('[class*="resume"], [class*="Resume"], .bg-white');
                }
                
                if (!element) {
                    // Try to find the preview component container
                    element = document.querySelector('.w-1\\/2.overflow-y-auto > div > div');
                }
                
                if (!element) {
                    // Last resort: get the entire right panel content
                    element = document.querySelector('.w-1\\/2.overflow-y-auto');
                }

                if (element) {
                    console.log('Found element for PDF generation:', element);
                    
                    // Apply theme colors to the element
                    if (resumeData.theme) {
                        const theme = resumeData.theme;
                        
                        // Create a clone to avoid modifying the live element
                        const clonedElement = element.cloneNode(true);
                        
                        // Apply styles to the clone
                        if (theme.backgroundColor) {
                            clonedElement.style.backgroundColor = theme.backgroundColor;
                        }
                        if (theme.textColor) {
                            clonedElement.style.color = theme.textColor;
                        }
                        if (theme.primaryColor) {
                            // Apply primary color to headings
                            const headings = clonedElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
                            headings.forEach(heading => {
                                heading.style.color = theme.primaryColor;
                            });
                        }
                        if (resumeData.fontFamily) {
                            clonedElement.style.fontFamily = `'${resumeData.fontFamily}', sans-serif`;
                        }
                        
                        // Hide non-essential elements
                        const elementsToHide = clonedElement.querySelectorAll('button, input, textarea, select, .no-print, [class*="toolbar"], [class*="switcher"]');
                        elementsToHide.forEach(el => el.style.display = 'none');
                        
                        // Create a container for PDF generation
                        const pdfContainer = document.createElement('div');
                        pdfContainer.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 8.5in;
                            background: white;
                            padding: 0;
                            z-index: -1;
                        `;
                        pdfContainer.appendChild(clonedElement);
                        document.body.appendChild(pdfContainer);
                        
                        // Generate PDF
                        const opt = {
                            margin: 0,
                            filename: 'resume.pdf',
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { 
                                scale: 2,
                                useCORS: true,
                                allowTaint: true,
                                backgroundColor: theme.backgroundColor || '#ffffff'
                            },
                            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                        };
                        
                        html2pdf().set(opt).from(clonedElement).save().then(() => {
                            // Clean up
                            document.body.removeChild(pdfContainer);
                        }).catch((error) => {
                            console.error('PDF generation error:', error);
                            document.body.removeChild(pdfContainer);
                            alert('Failed to generate PDF. Please try again.');
                        });
                        
                    } else {
                        // Fallback without theme
                        const opt = {
                            margin: 0,
                            filename: 'resume.pdf',
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                        };
                        
                        html2pdf().set(opt).from(element).save();
                    }
                } else {
                    console.error('Could not find resume content to download');
                    alert('Could not find resume content to download. Please make sure your resume is visible in the preview.');
                }
            }, 500);
            
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download PDF. Please try again.');
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

