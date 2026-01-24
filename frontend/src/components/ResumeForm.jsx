import React, { useState } from 'react';
import { Plus, Trash, Wand2 } from 'lucide-react';
import axios from 'axios';

const ResumeForm = ({ data, updateData }) => {

    const fonts = [
        { name: 'Inter', family: 'Inter' },
        { name: 'Roboto', family: 'Roboto' },
        { name: 'Lato', family: 'Lato' },
        { name: 'Poppins', family: 'Poppins' },
        { name: 'Playfair Display', family: 'Playfair Display' },
        { name: 'Merriweather', family: 'Merriweather' },
        { name: 'Montserrat', family: 'Montserrat' }
    ];

    const handleFontChange = (fontName) => {
        updateData(prev => ({ ...prev, fontFamily: fontName }));
        document.documentElement.style.setProperty('--resume-font', `'${fontName}', sans-serif`);
    };

    const handleChange = (section, field, value) => {
        updateData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const enhanceText = async (text, type, displaySetter) => {
        try {
            // Basic implementation to find the right field to update might be tricky with this generic signature
            // Ideally we just return the value and let the caller set it.
            const res = await axios.post('http://localhost:5000/api/enhance', { text, type });
            displaySetter(res.data.enhancedText);
        } catch (err) {
            console.error(err);
            alert('Failed to enhance text. Ensure backend is running.');
        }
    };

    // Helper for arrays (Experiences, Education, etc.)
    const addItem = (section, item) => {
        updateData(prev => ({
            ...prev,
            [section]: [...prev[section], item]
        }));
    };

    const removeItem = (section, index) => {
        updateData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const updateItem = (section, index, field, value) => {
        updateData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => i === index ? { ...item, [field]: value } : item)
        }));
    };

    const updateSectionSetting = (section, field, value) => {
        updateData(prev => ({
            ...prev,
            sectionSettings: {
                ...prev.sectionSettings,
                [section]: {
                    ...prev.sectionSettings[section],
                    [field]: value
                }
            }
        }));
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-10" style={{ fontFamily: `var(--resume-font, 'Inter', sans-serif)` }}>
            {/* Section Settings */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2 text-indigo-700">Section Settings</h2>

                {/* Font Selector with Previews */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border-2 border-indigo-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Font Selection</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {fonts.map((font) => (
                            <button
                                key={font.family}
                                onClick={() => handleFontChange(font.family)}
                                className={`p-3 rounded-lg border-2 transition-all text-center ${
                                    data.fontFamily === font.family
                                        ? 'border-indigo-600 bg-indigo-100 shadow-lg'
                                        : 'border-gray-300 bg-white hover:border-indigo-400'
                                }`}
                                style={{ fontFamily: `'${font.family}', sans-serif` }}
                            >
                                <p className="text-sm font-medium">{font.name}</p>
                                <p className="text-xs text-gray-500">Aa</p>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Selected: <strong>{data.fontFamily || 'Inter'}</strong> - Changes apply instantly to form & preview</p>
                </div>

                <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
                    {/* About Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">About Section Heading</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none"
                                value={data.sectionSettings?.about?.heading || 'About Me'}
                                onChange={(e) => updateSectionSetting('about', 'heading', e.target.value)}
                            />
                        </div>
                        <div className="mx-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Column</label>
                            <select
                                className="border p-2 rounded w-28 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                                value={data.sectionSettings?.about?.column || 'right'}
                                onChange={(e) => updateSectionSetting('about', 'column', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="checkbox"
                                id="about-visible"
                                checked={data.sectionSettings?.about?.visible !== false}
                                onChange={(e) => updateSectionSetting('about', 'visible', e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <label htmlFor="about-visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Show</label>
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Education Section Heading</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none"
                                value={data.sectionSettings?.education?.heading || 'Education'}
                                onChange={(e) => updateSectionSetting('education', 'heading', e.target.value)}
                            />
                        </div>
                        <div className="mx-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Column</label>
                            <select
                                className="border p-2 rounded w-28 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                                value={data.sectionSettings?.education?.column || 'right'}
                                onChange={(e) => updateSectionSetting('education', 'column', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="checkbox"
                                id="education-visible"
                                checked={data.sectionSettings?.education?.visible !== false}
                                onChange={(e) => updateSectionSetting('education', 'visible', e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <label htmlFor="education-visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Show</label>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Skills Section Heading</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none"
                                value={data.sectionSettings?.skills?.heading || 'Skills'}
                                onChange={(e) => updateSectionSetting('skills', 'heading', e.target.value)}
                            />
                        </div>
                        <div className="mx-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Column</label>
                            <select
                                className="border p-2 rounded w-28 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                                value={data.sectionSettings?.skills?.column || 'left'}
                                onChange={(e) => updateSectionSetting('skills', 'column', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="checkbox"
                                id="skills-visible"
                                checked={data.sectionSettings?.skills?.visible !== false}
                                onChange={(e) => updateSectionSetting('skills', 'visible', e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <label htmlFor="skills-visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Show</label>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Experience Section Heading</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none"
                                value={data.sectionSettings?.experience?.heading || 'Work Experience'}
                                onChange={(e) => updateSectionSetting('experience', 'heading', e.target.value)}
                            />
                        </div>
                        <div className="mx-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Column</label>
                            <select
                                className="border p-2 rounded w-28 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                                value={data.sectionSettings?.experience?.column || 'right'}
                                onChange={(e) => updateSectionSetting('experience', 'column', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="checkbox"
                                id="experience-visible"
                                checked={data.sectionSettings?.experience?.visible !== false}
                                onChange={(e) => updateSectionSetting('experience', 'visible', e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <label htmlFor="experience-visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Show</label>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Projects Section Heading</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none"
                                value={data.sectionSettings?.projects?.heading || 'Projects'}
                                onChange={(e) => updateSectionSetting('projects', 'heading', e.target.value)}
                            />
                        </div>
                        <div className="mx-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Column</label>
                            <select
                                className="border p-2 rounded w-28 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                                value={data.sectionSettings?.projects?.column || 'right'}
                                onChange={(e) => updateSectionSetting('projects', 'column', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="checkbox"
                                id="projects-visible"
                                checked={data.sectionSettings?.projects?.visible !== false}
                                onChange={(e) => updateSectionSetting('projects', 'visible', e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <label htmlFor="projects-visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Show</label>
                        </div>
                    </div>

                    {/* Languages Section */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Languages Section Heading</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none"
                                value={data.sectionSettings?.languages?.heading || 'Language'}
                                onChange={(e) => updateSectionSetting('languages', 'heading', e.target.value)}
                            />
                        </div>
                        <div className="mx-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Column</label>
                            <select
                                className="border p-2 rounded w-28 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                                value={data.sectionSettings?.languages?.column || 'left'}
                                onChange={(e) => updateSectionSetting('languages', 'column', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="checkbox"
                                id="languages-visible"
                                checked={data.sectionSettings?.languages?.visible !== false}
                                onChange={(e) => updateSectionSetting('languages', 'visible', e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <label htmlFor="languages-visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Show</label>
                        </div>
                    </div>

                    {/* Awards Section */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Awards Section Heading</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none"
                                value={data.sectionSettings?.awards?.heading || 'Awards'}
                                onChange={(e) => updateSectionSetting('awards', 'heading', e.target.value)}
                            />
                        </div>
                        <div className="mx-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Column</label>
                            <select
                                className="border p-2 rounded w-28 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                                value={data.sectionSettings?.awards?.column || 'left'}
                                onChange={(e) => updateSectionSetting('awards', 'column', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="checkbox"
                                id="awards-visible"
                                checked={data.sectionSettings?.awards?.visible !== false}
                                onChange={(e) => updateSectionSetting('awards', 'visible', e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <label htmlFor="awards-visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Show</label>
                        </div>
                    </div>

                    {/* References Section */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">References Section Heading</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none"
                                value={data.sectionSettings?.references?.heading || 'References'}
                                onChange={(e) => updateSectionSetting('references', 'heading', e.target.value)}
                            />
                        </div>
                        <div className="mx-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Column</label>
                            <select
                                className="border p-2 rounded w-28 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                                value={data.sectionSettings?.references?.column || 'right'}
                                onChange={(e) => updateSectionSetting('references', 'column', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="checkbox"
                                id="references-visible"
                                checked={data.sectionSettings?.references?.visible !== false}
                                onChange={(e) => updateSectionSetting('references', 'visible', e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <label htmlFor="references-visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Show</label>
                        </div>
                    </div>

                    {/* Custom Sections */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Custom Sections Heading</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full focus:ring-2 focus:ring-indigo-300 outline-none"
                                value={data.sectionSettings?.custom?.heading || 'Custom'}
                                onChange={(e) => updateSectionSetting('custom', 'heading', e.target.value)}
                            />
                        </div>
                        <div className="mx-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Column</label>
                            <select
                                className="border p-2 rounded w-28 focus:ring-2 focus:ring-indigo-300 outline-none bg-white"
                                value={data.sectionSettings?.custom?.column || 'right'}
                                onChange={(e) => updateSectionSetting('custom', 'column', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="ml-4 flex items-center">
                            <input
                                type="checkbox"
                                id="custom-visible"
                                checked={data.sectionSettings?.custom?.visible !== false}
                                onChange={(e) => updateSectionSetting('custom', 'visible', e.target.checked)}
                                className="w-5 h-5 cursor-pointer"
                            />
                            <label htmlFor="custom-visible" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Show</label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Personal Info */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2 text-indigo-700">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Full Name"
                        value={data.personalInfo.fullName}
                        onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
                    />
                    <input
                        className="border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Email"
                        value={data.personalInfo.email}
                        onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                    />
                    <input
                        className="border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Phone"
                        value={data.personalInfo.phone}
                        onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                    />
                    <input
                        className="border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Location"
                        value={data.personalInfo.location}
                        onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
                    />
                    <input
                        className="border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Job Title"
                        value={data.personalInfo.title || ''}
                        onChange={(e) => handleChange('personalInfo', 'title', e.target.value)}
                    />
                    <input
                        className="border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none" placeholder="Website"
                        value={data.personalInfo.website || ''}
                        onChange={(e) => handleChange('personalInfo', 'website', e.target.value)}
                    />
                </div>
            </section>

            {/* Summary */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Profile Summary</h2>
                    <button
                        onClick={() => enhanceText(data.summary, 'summary', (val) => updateData(p => ({ ...p, summary: val })))}
                        className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        <Wand2 size={16} /> AI Enhance
                    </button>
                </div>
                <textarea
                    className="w-full border p-2 rounded h-32 focus:ring-2 focus:ring-indigo-300 outline-none"
                    placeholder="Briefly describe your professional background..."
                    value={data.summary}
                    onChange={(e) => updateData(prev => ({ ...prev, summary: e.target.value }))}
                />
            </section>

            {/* Experience */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Work Experience</h2>
                    <button onClick={() => addItem('experiences', { title: '', company: '', duration: '', description: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                {data.experiences.map((exp, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border relative">
                        <button onClick={() => removeItem('experiences', index)} className="absolute top-2 right-2 text-red-500">
                            <Trash size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input className="border p-2 rounded" placeholder="Job Title" value={exp.title} onChange={(e) => updateItem('experiences', index, 'title', e.target.value)} />
                            <input className="border p-2 rounded" placeholder="Company" value={exp.company} onChange={(e) => updateItem('experiences', index, 'company', e.target.value)} />
                        </div>
                        <input className="border p-2 rounded w-full mb-2" placeholder="Duration (e.g. 2020 - Present)" value={exp.duration} onChange={(e) => updateItem('experiences', index, 'duration', e.target.value)} />
                        <div className="relative">
                            <textarea className="w-full border p-2 rounded h-24" placeholder="Description of responsibilities" value={exp.description} onChange={(e) => updateItem('experiences', index, 'description', e.target.value)} />
                            <button
                                onClick={() => enhanceText(exp.description, 'experience', (val) => updateItem('experiences', index, 'description', val))}
                                className="absolute bottom-2 right-2 text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 bg-white px-2 py-1 rounded shadow"
                            >
                                <Wand2 size={12} /> Enhance
                            </button>
                        </div>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Education</h2>
                    <button onClick={() => addItem('education', { degree: '', school: '', year: '', percentage: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                {data.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border relative">
                        <button onClick={() => removeItem('education', index)} className="absolute top-2 right-2 text-red-500">
                            <Trash size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input className="border p-2 rounded" placeholder="Degree / Major" value={edu.degree} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} />
                            <input className="border p-2 rounded" placeholder="Institution" value={edu.school} onChange={(e) => updateItem('education', index, 'school', e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <input className="border p-2 rounded w-full" placeholder="Year" value={edu.year} onChange={(e) => updateItem('education', index, 'year', e.target.value)} />
                            <input className="border p-2 rounded w-full" placeholder="Percentage / GPA" value={edu.percentage || ''} onChange={(e) => updateItem('education', index, 'percentage', e.target.value)} />
                        </div>
                    </div>
                ))
                }
            </section>

            {/* Skills */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Skills</h2>
                    <button onClick={() => addItem('skills', '')} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border">
                            <input
                                className="bg-transparent outline-none w-32"
                                value={skill}
                                onChange={(e) => {
                                    const newSkills = [...data.skills];
                                    newSkills[index] = e.target.value;
                                    updateData(p => ({ ...p, skills: newSkills }));
                                }}
                            />
                            <button onClick={() => removeItem('skills', index)} className="text-red-500"><Trash size={14} /></button>
                        </div>
                    ))}
                </div>
            </section >

            {/* Projects */}
            < section className="space-y-4" >
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Projects</h2>
                    <button onClick={() => addItem('projects', { name: '', description: '', tech: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                {
                    data.projects.map((proj, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded border relative">
                            <button onClick={() => removeItem('projects', index)} className="absolute top-2 right-2 text-red-500">
                                <Trash size={16} />
                            </button>
                            <input className="border p-2 rounded w-full mb-2" placeholder="Project Name" value={proj.name} onChange={(e) => updateItem('projects', index, 'name', e.target.value)} />
                            <textarea className="w-full border p-2 rounded h-20 mb-2" placeholder="Project Description" value={proj.description} onChange={(e) => updateItem('projects', index, 'description', e.target.value)} />
                            <input className="border p-2 rounded w-full" placeholder="Technologies Used" value={proj.tech} onChange={(e) => updateItem('projects', index, 'tech', e.target.value)} />
                        </div>
                    ))
                }
            </section >

            {/* Languages */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Languages</h2>
                    <button onClick={() => addItem('languages', '')} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.languages && data.languages.map((lang, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border">
                            <input
                                className="bg-transparent outline-none w-32"
                                value={lang}
                                onChange={(e) => {
                                    const newLangs = [...(data.languages || [])];
                                    newLangs[index] = e.target.value;
                                    updateData(p => ({ ...p, languages: newLangs }));
                                }}
                            />
                            <button onClick={() => removeItem('languages', index)} className="text-red-500"><Trash size={14} /></button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Awards */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Awards & Certifications</h2>
                    <button onClick={() => addItem('awards', '')} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {data.awards && data.awards.map((award, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border">
                            <input
                                className="bg-transparent outline-none w-40"
                                value={award}
                                onChange={(e) => {
                                    const newAwards = [...(data.awards || [])];
                                    newAwards[index] = e.target.value;
                                    updateData(p => ({ ...p, awards: newAwards }));
                                }}
                            />
                            <button onClick={() => removeItem('awards', index)} className="text-red-500"><Trash size={14} /></button>
                        </div>
                    ))}
                </div>
            </section>

            {/* References */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">References</h2>
                    <button onClick={() => addItem('references', { name: '', title: '', company: '', email: '', phone: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                {data.references && data.references.map((ref, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded border relative">
                        <button onClick={() => removeItem('references', index)} className="absolute top-2 right-2 text-red-500">
                            <Trash size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input className="border p-2 rounded" placeholder="Name" value={ref.name} onChange={(e) => updateItem('references', index, 'name', e.target.value)} />
                            <input className="border p-2 rounded" placeholder="Title" value={ref.title} onChange={(e) => updateItem('references', index, 'title', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input className="border p-2 rounded" placeholder="Company" value={ref.company} onChange={(e) => updateItem('references', index, 'company', e.target.value)} />
                            <input className="border p-2 rounded" placeholder="Email" type="email" value={ref.email} onChange={(e) => updateItem('references', index, 'email', e.target.value)} />
                        </div>
                        <input className="border p-2 rounded w-full mt-2" placeholder="Phone" value={ref.phone} onChange={(e) => updateItem('references', index, 'phone', e.target.value)} />
                    </div>
                ))}
            </section>

            {/* Custom Sections */}
            < section className="space-y-4" >
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Custom Sections</h2>
                    <button onClick={() => addItem('customSections', { title: '', content: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                {
                    data.customSections && data.customSections.map((section, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded border relative">
                            <button onClick={() => removeItem('customSections', index)} className="absolute top-2 right-2 text-red-500">
                                <Trash size={16} />
                            </button>
                            <input
                                className="border p-2 rounded w-full mb-2 font-bold"
                                placeholder="Section Title (e.g. Achievements)"
                                value={section.title}
                                onChange={(e) => updateItem('customSections', index, 'title', e.target.value)}
                            />
                            <textarea
                                className="w-full border p-2 rounded h-24"
                                placeholder="Content (e.g. List of awards...)"
                                value={section.content}
                                onChange={(e) => updateItem('customSections', index, 'content', e.target.value)}
                            />
                        </div>
                    ))
                }
            </section >
        </div >
    );
};

export default ResumeForm;
