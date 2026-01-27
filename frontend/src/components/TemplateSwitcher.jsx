import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates, applyTemplateTheme } from '../templates/templateRegistry';
import { Palette, ChevronDown, Layout, Sparkles } from 'lucide-react';

const TemplateSwitcher = ({ currentTemplateId, resumeData, setResumeData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const currentTemplate = templates.find(t => t.id === currentTemplateId);

    const handleTemplateChange = (newTemplateId) => {
        // Apply new template theme to current data
        const themedData = applyTemplateTheme(newTemplateId, resumeData);
        
        // Save themed data to localStorage before switching
        localStorage.setItem('resumeData', JSON.stringify(themedData));
        
        // Navigate to new template with preserved data
        navigate(`/editor?template=${newTemplateId}`, { 
            state: { preserveData: true } 
        });
        
        setIsOpen(false);
    };

    const groupedTemplates = {
        'One Column': templates.filter(t => 
            !['creative-profile', 'richard-image-two-column', 'jyoti-sidebar-cream', 
              'modern-two-column', 'lorna-modern', 'anaisha-timeline', 
              'olivia-minimal'].includes(t.id)
        ),
        'Two Column': templates.filter(t => 
            ['jyoti-sidebar-cream', 'modern-two-column', 'lorna-modern', 'olivia-minimal'].includes(t.id)
        ),
        'Image Layouts': templates.filter(t => 
            ['creative-profile', 'richard-image-two-column', 'anaisha-timeline'].includes(t.id)
        )
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm"
            >
                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center">
                    <Layout className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                    {currentTemplate?.name || 'Select Template'}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                        <div className="p-4">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <Palette className="w-3 h-3 text-white" />
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900">Change Template</h3>
                            </div>
                            
                            <p className="text-xs text-slate-500 mb-4">Your resume data will be preserved</p>
                            
                            {/* Template Categories */}
                            {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                                <div key={category} className="mb-6 last:mb-0">
                                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        {category}
                                    </h4>
                                    <div className="space-y-2">
                                        {categoryTemplates.map((template) => (
                                            <button
                                                key={template.id}
                                                onClick={() => handleTemplateChange(template.id)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border ${
                                                    template.id === currentTemplateId
                                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                        : 'hover:bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-200'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded ${
                                                            template.id === currentTemplateId
                                                                ? 'bg-blue-500'
                                                                : 'bg-slate-300'
                                                        }`}></div>
                                                        <span className="font-medium">{template.name}</span>
                                                    </div>
                                                    {template.id === currentTemplateId && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 ml-6">
                                                    {template.description}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TemplateSwitcher;
