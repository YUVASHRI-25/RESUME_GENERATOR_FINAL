import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from '../templates/templateRegistry';
import { Sparkles, ArrowRight } from 'lucide-react';

const TemplateSelectionPage = () => {
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const selectTemplate = (id) => {
        setSelectedId(id);
        setTimeout(() => {
            navigate(`/editor?template=${id}`);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Sparkles className="w-8 h-8 text-cyan-600" />
                        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                            Resume Templates
                        </h1>
                        <Sparkles className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-xl text-slate-700 max-w-2xl mx-auto">
                        Choose a professional template to create your stunning resume
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
                    {templates.map((t, index) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => selectTemplate(t.id)}
                            onMouseEnter={() => setHoveredId(t.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`group relative h-full transform transition-all duration-500 ${
                                selectedId === t.id ? 'scale-95 opacity-50' : ''
                            }`}
                            style={{
                                perspective: '1000px',
                            }}
                        >
                            {/* Card Container */}
                            <div
                                className={`relative bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-cyan-200/50 h-full transition-all duration-500 ${
                                    hoveredId === t.id
                                        ? 'border-cyan-400/80 shadow-2xl shadow-cyan-400/30 scale-105'
                                        : 'hover:border-cyan-300/60'
                                }`}
                                style={{
                                    transform:
                                        hoveredId === t.id
                                            ? 'rotateY(-5deg) rotateX(5deg)'
                                            : 'rotateY(0deg) rotateX(0deg)',
                                    transformStyle: 'preserve-3d',
                                }}
                            >
                                {/* Shine effect */}
                                <div
                                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                                    style={{
                                        background:
                                            'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
                                    }}
                                ></div>

                                {/* Preview Image Container */}
                                <div className="relative h-80 mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-blue-100/50 to-cyan-100/50 border border-cyan-200/30 flex items-center justify-center group/image">
                                    {t.preview ? (
                                        <img
                                            src={t.preview}
                                            alt={`${t.name} preview`}
                                            className={`h-full w-full object-cover transition-all duration-500 ${
                                                hoveredId === t.id
                                                    ? 'scale-110 brightness-110'
                                                    : 'group-hover/image:scale-105'
                                            }`}
                                        />
                                    ) : (
                                        <span className="text-gray-400">Preview of {t.name}</span>
                                    )}

                                    {/* Overlay gradient on hover */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300`}
                                    ></div>
                                </div>

                                {/* Template Name */}
                                <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center relative z-10">
                                    {t.name}
                                </h3>

                                {/* CTA Button */}
                                <div
                                    className={`flex items-center justify-center gap-2 text-sm font-semibold text-cyan-600 group-hover:text-cyan-700 transition-colors duration-300 relative z-10 ${
                                        hoveredId === t.id ? 'opacity-100' : 'opacity-75'
                                    }`}
                                >
                                    <span>Use Template</span>
                                    <ArrowRight
                                        className={`w-4 h-4 transition-transform duration-300 ${
                                            hoveredId === t.id ? 'translate-x-1' : ''
                                        }`}
                                    />
                                </div>

                                {/* Badge */}
                                {index === 0 && (
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        POPULAR
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Animated dots decoration */}
            <style>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default TemplateSelectionPage;
