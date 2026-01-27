import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates, applyTemplateTheme } from '../templates/templateRegistry';
import { Sparkles, ArrowRight, FileText, Palette, Layout } from 'lucide-react';

const TemplateSelectionPage = () => {
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [activeTab, setActiveTab] = useState('one-column');

    const oneColumnTemplates = templates.filter(t => t.id !== 'creative-profile' && t.id !== 'richard-image-two-column' && t.id !== 'jyoti-sidebar-cream' && t.id !== 'modern-two-column' && t.id !== 'lorna-modern' && t.id !== 'anaisha-timeline' && t.id !== 'olivia-minimal');
    const imageColumnTemplates = templates.filter(t => t.id === 'creative-profile' || t.id === 'richard-image-two-column' || t.id === 'anaisha-timeline');
    const twoColumnTemplates = templates.filter(t => t.id === 'jyoti-sidebar-cream' || t.id === 'modern-two-column' || t.id === 'lorna-modern' || t.id === 'olivia-minimal');
    
    const displayTemplates = 
        activeTab === 'one-column' ? oneColumnTemplates :
        activeTab === 'image-two-column' ? imageColumnTemplates :
        twoColumnTemplates;

    const selectTemplate = (id) => {
        setSelectedId(id);
        // Save current resume data before navigating
        const currentData = localStorage.getItem('resumeData');
        let dataToSave;
        
        if (currentData) {
            try {
                const parsedData = JSON.parse(currentData);
                // Apply new template theme to existing data
                dataToSave = applyTemplateTheme(id, parsedData);
            } catch (error) {
                console.error('Error parsing saved resume data:', error);
                dataToSave = null;
            }
        }
        
        if (!dataToSave) {
            // If no existing data or error, create empty structure with template theme
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
            dataToSave = applyTemplateTheme(id, defaultData);
        }
        
        localStorage.setItem('resumeData', JSON.stringify(dataToSave));
        
        setTimeout(() => {
            navigate(`/editor?template=${id}`, { state: { preserveData: true } });
        }, 300);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">Choose Your Template</h1>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Sparkles className="w-4 h-4" />
                            <span>12 Professional Templates</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Category Tabs */}
                <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
                    <button
                        onClick={() => setActiveTab('one-column')}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'one-column'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <Layout className="w-4 h-4" />
                        One Column
                    </button>
                    <button
                        onClick={() => setActiveTab('two-column')}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'two-column'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <Layout className="w-4 h-4" />
                        Two Column
                    </button>
                    <button
                        onClick={() => setActiveTab('image-two-column')}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                            activeTab === 'image-two-column'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <Palette className="w-4 h-4" />
                        Image Layouts
                    </button>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayTemplates.map((template, index) => (
                        <div
                            key={template.id}
                            className={`group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-300 cursor-pointer ${
                                selectedId === template.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                            }`}
                            onClick={() => selectTemplate(template.id)}
                            onMouseEnter={() => setHoveredId(template.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Preview */}
                            <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                                {template.preview ? (
                                    <img
                                        src={template.preview}
                                        alt={`${template.name} preview`}
                                        className={`w-full h-full object-cover transition-transform duration-300 ${
                                            hoveredId === template.id ? 'scale-105' : ''
                                        }`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                            <p className="text-slate-500 text-sm">{template.name}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Hover Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                                    hoveredId === template.id ? 'opacity-100' : 'opacity-0'
                                }`}>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center justify-center gap-2 text-white">
                                            <span className="text-sm font-medium">Use Template</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Popular Badge */}
                                {index === 0 && (
                                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        Popular
                                    </div>
                                )}
                            </div>

                            {/* Template Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                                <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {displayTemplates.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates found</h3>
                        <p className="text-slate-600">Try selecting a different category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateSelectionPage;
