import React, { useState } from 'react';
import { Plus, Trash, Wand2, Image as ImageIcon, Upload, X } from 'lucide-react';
import axios from 'axios';
import { getTemplateById } from '../templates/templateRegistry';

const ResumeForm = ({ data, updateData, template }) => {
    const templateInfo = getTemplateById(template);
    const supportsImage = templateInfo?.supportsProfileImage || false;
    const supportsColumns = templateInfo?.supportsColumnPlacement || false;

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
                        {supportsColumns && (
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
                        )}
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
                        {supportsColumns && (
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
                        )}
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
                        {supportsColumns && (
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
                        )}
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
                        {supportsColumns && (
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
                        )}
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
                        {supportsColumns && (
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
                        )}
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
                        {supportsColumns && (
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
                        )}
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
                        {supportsColumns && (
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
                        )}
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
                        {supportsColumns && (
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
                        )}
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
                        {supportsColumns && (
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
                        )}
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

            {/* Profile Image (conditional) */}
            {supportsImage && (
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2 text-indigo-700">Profile Image</h2>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                        {data.profileImage ? (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <img 
                                        src={data.profileImage} 
                                        alt="Profile" 
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <label className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-700 transition">
                                        <Upload size={16} /> Replace Image
                                        <input 
                                            type="file" 
                                            accept="image/jpeg,image/jpg,image/png" 
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        updateData(prev => ({ ...prev, profileImage: reader.result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                    <button 
                                        onClick={() => updateData(prev => ({ ...prev, profileImage: null }))}
                                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                    >
                                        <X size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-100 transition">
                                <ImageIcon size={48} className="text-purple-400 mb-3" />
                                <p className="text-sm font-semibold text-gray-700 mb-1">Upload Profile Image</p>
                                <p className="text-xs text-gray-500 mb-3">JPG or PNG (recommended: square image)</p>
                                <div className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                                    <Upload size={16} /> Choose File
                                </div>
                                <input 
                                    type="file" 
                                    accept="image/jpeg,image/jpg,image/png" 
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                updateData(prev => ({ ...prev, profileImage: reader.result }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        )}
                    </div>
                </section>
            )}

            {/* About Section Content */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">About / Professional Summary</h2>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Section Heading</label>
                    <input
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none"
                        placeholder="About Me"
                        value={data.about?.heading || 'About Me'}
                        onChange={(e) => updateData(prev => ({
                            ...prev,
                            about: { ...prev.about, heading: e.target.value }
                        }))}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Professional Summary</label>
                    <div className="relative">
                        <textarea
                            className="w-full border p-2 rounded h-32 focus:ring-2 focus:ring-indigo-300 outline-none"
                            placeholder="Briefly describe your professional background, key achievements, and career goals..."
                            value={data.about?.content || ''}
                            onChange={(e) => updateData(prev => ({
                                ...prev,
                                about: { ...prev.about, content: e.target.value }
                            }))}
                        />
                        <button
                            onClick={() => enhanceText(data.about?.content || '', 'summary', (val) => 
                                updateData(prev => ({
                                    ...prev,
                                    about: { ...prev.about, content: val }
                                }))
                            )}
                            className="absolute bottom-2 right-2 text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 bg-white px-2 py-1 rounded shadow"
                        >
                            <Wand2 size={12} /> AI Enhance
                        </button>
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Work Experience</h2>
                    <button onClick={() => addItem('experiences', { id: Date.now(), position: '', company: '', startDate: '', endDate: '', currentlyWorking: false, description: '', bullets: [] })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                {data.experiences.map((exp, index) => (
                    <div key={exp.id || index} className="bg-gray-50 p-4 rounded border relative space-y-2">
                        <button onClick={() => removeItem('experiences', index)} className="absolute top-2 right-2 text-red-500">
                            <Trash size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input className="border p-2 rounded" placeholder="Job Title / Position" value={exp.position || ''} onChange={(e) => updateItem('experiences', index, 'position', e.target.value)} />
                            <input className="border p-2 rounded" placeholder="Company" value={exp.company || ''} onChange={(e) => updateItem('experiences', index, 'company', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <input className="border p-2 rounded" placeholder="Start Date" value={exp.startDate || ''} onChange={(e) => updateItem('experiences', index, 'startDate', e.target.value)} />
                            <input className="border p-2 rounded" placeholder="End Date" disabled={exp.currentlyWorking} value={exp.endDate || ''} onChange={(e) => updateItem('experiences', index, 'endDate', e.target.value)} />
                            <label className="flex items-center gap-2 border p-2 rounded">
                                <input type="checkbox" checked={exp.currentlyWorking || false} onChange={(e) => updateItem('experiences', index, 'currentlyWorking', e.target.checked)} className="w-4 h-4" />
                                <span className="text-sm">Currently Working</span>
                            </label>
                        </div>
                        <div className="relative">
                            <textarea className="w-full border p-2 rounded h-20" placeholder="Job description and responsibilities" value={exp.description || ''} onChange={(e) => updateItem('experiences', index, 'description', e.target.value)} />
                            <button
                                onClick={() => enhanceText(exp.description || '', 'experience', (val) => updateItem('experiences', index, 'description', val))}
                                className="absolute bottom-2 right-2 text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 bg-white px-2 py-1 rounded shadow"
                            >
                                <Wand2 size={12} /> Enhance
                            </button>
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-semibold text-gray-600">Key Achievements (Bullet Points)</label>
                            <div className="space-y-1">
                                {Array.isArray(exp.bullets) && exp.bullets.map((bullet, bulletIdx) => (
                                    <div key={bulletIdx} className="flex gap-2">
                                        <input className="flex-1 border p-2 rounded text-sm" placeholder="• Achievement..." value={bullet} onChange={(e) => {
                                            const newBullets = [...(exp.bullets || [])];
                                            newBullets[bulletIdx] = e.target.value;
                                            updateItem('experiences', index, 'bullets', newBullets);
                                        }} />
                                        <button onClick={() => {
                                            const newBullets = (exp.bullets || []).filter((_, i) => i !== bulletIdx);
                                            updateItem('experiences', index, 'bullets', newBullets);
                                        }} className="text-red-500"><Trash size={14} /></button>
                                    </div>
                                ))}
                                <button onClick={() => updateItem('experiences', index, 'bullets', [...(exp.bullets || []), ''])} className="text-indigo-600 text-sm flex items-center gap-1">
                                    <Plus size={14} /> Add Bullet Point
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Education</h2>
                    <button onClick={() => addItem('education', { id: Date.now(), school: '', degree: '', field: '', startDate: '', endDate: '', description: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                {data.education.map((edu, index) => (
                    <div key={edu.id || index} className="bg-gray-50 p-4 rounded border relative space-y-2">
                        <button onClick={() => removeItem('education', index)} className="absolute top-2 right-2 text-red-500">
                            <Trash size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input className="border p-2 rounded" placeholder="Degree / Qualification" value={edu.degree || ''} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} />
                            <input className="border p-2 rounded" placeholder="Field of Study" value={edu.field || ''} onChange={(e) => updateItem('education', index, 'field', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-1 gap-2 mb-2">
                            <input className="border p-2 rounded w-full" placeholder="School / University Name" value={edu.school || ''} onChange={(e) => updateItem('education', index, 'school', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input className="border p-2 rounded w-full" placeholder="Start Date" value={edu.startDate || ''} onChange={(e) => updateItem('education', index, 'startDate', e.target.value)} />
                            <input className="border p-2 rounded w-full" placeholder="End Date" value={edu.endDate || ''} onChange={(e) => updateItem('education', index, 'endDate', e.target.value)} />
                        </div>
                        <textarea className="w-full border p-2 rounded h-16" placeholder="Additional details (e.g., honors, relevant coursework)" value={edu.description || ''} onChange={(e) => updateItem('education', index, 'description', e.target.value)} />
                    </div>
                ))
                }
            </section>

            {/* Skills */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Skills</h2>
                    <button onClick={() => addItem('skills', { id: Date.now(), name: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="space-y-2">
                    {data.skills.map((skill, index) => (
                        <div key={skill.id || index} className="flex gap-2 items-center">
                            <input
                                className="flex-1 border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none"
                                placeholder="Skill name"
                                value={skill.name || skill}
                                onChange={(e) => updateItem('skills', index, 'name', e.target.value)}
                            />
                            <button onClick={() => removeItem('skills', index)} className="text-red-500"><Trash size={14} /></button>
                        </div>
                    ))}
                </div>
            </section >

            {/* Projects */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Projects</h2>
                    <button onClick={() => addItem('projects', { id: Date.now(), title: '', description: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                {
                    data.projects.map((proj, index) => (
                        <div key={proj.id || index} className="bg-gray-50 p-4 rounded border relative space-y-2">
                            <button onClick={() => removeItem('projects', index)} className="absolute top-2 right-2 text-red-500">
                                <Trash size={16} />
                            </button>
                            <input className="border p-2 rounded w-full" placeholder="Project Title" value={proj.title || ''} onChange={(e) => updateItem('projects', index, 'title', e.target.value)} />
                            <textarea className="w-full border p-2 rounded h-16" placeholder="Project Description" value={proj.description || ''} onChange={(e) => updateItem('projects', index, 'description', e.target.value)} />
                        </div>
                    ))
                }
            </section>

            {/* Languages */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Languages</h2>
                    <button onClick={() => addItem('languages', { id: Date.now(), name: '', level: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="space-y-2">
                    {data.languages && data.languages.map((lang, index) => (
                        <div key={lang.id || index} className="flex gap-2 items-center">
                            <input
                                className="flex-1 border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none"
                                placeholder="Language name"
                                value={lang.name || lang}
                                onChange={(e) => updateItem('languages', index, 'name', e.target.value)}
                            />
                            <input
                                className="w-24 border p-2 rounded focus:ring-2 focus:ring-indigo-300 outline-none"
                                placeholder="Level"
                                value={lang.level || ''}
                                onChange={(e) => updateItem('languages', index, 'level', e.target.value)}
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
                    <button onClick={() => addItem('awards', { id: Date.now(), title: '', issuer: '', date: '', description: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                <div className="space-y-2">
                    {data.awards && data.awards.map((award, index) => (
                        <div key={award.id || index} className="bg-gray-50 p-3 rounded border relative space-y-2">
                            <button onClick={() => removeItem('awards', index)} className="absolute top-2 right-2 text-red-500"><Trash size={14} /></button>
                            <div className="grid grid-cols-2 gap-2">
                                <input className="border p-2 rounded" placeholder="Award Title" value={award.title || ''} onChange={(e) => updateItem('awards', index, 'title', e.target.value)} />
                                <input className="border p-2 rounded" placeholder="Issuer" value={award.issuer || ''} onChange={(e) => updateItem('awards', index, 'issuer', e.target.value)} />
                            </div>
                            <input className="border p-2 rounded w-full" placeholder="Date" value={award.date || ''} onChange={(e) => updateItem('awards', index, 'date', e.target.value)} />
                            <textarea className="w-full border p-2 rounded h-12" placeholder="Description" value={award.description || ''} onChange={(e) => updateItem('awards', index, 'description', e.target.value)} />
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
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-indigo-700">Custom Sections</h2>
                    <button onClick={() => addItem('customSections', { id: Date.now(), heading: '', content: '' })} className="text-indigo-600 hover:text-indigo-800">
                        <Plus size={20} />
                    </button>
                </div>
                {
                    data.customSections && data.customSections.map((section, index) => (
                        <div key={section.id || index} className="bg-gray-50 p-4 rounded border relative space-y-2">
                            <button onClick={() => removeItem('customSections', index)} className="absolute top-2 right-2 text-red-500">
                                <Trash size={16} />
                            </button>
                            <input
                                className="border p-2 rounded w-full font-bold"
                                placeholder="Section Heading (e.g. Achievements)"
                                value={section.heading || ''}
                                onChange={(e) => updateItem('customSections', index, 'heading', e.target.value)}
                            />
                            <textarea
                                className="w-full border p-2 rounded h-24"
                                placeholder="Content (e.g. List of achievements...)"
                                value={section.content || ''}
                                onChange={(e) => updateItem('customSections', index, 'content', e.target.value)}
                            />
                        </div>
                    ))
                }
            </section>
        </div >
    );
};

export default ResumeForm;
