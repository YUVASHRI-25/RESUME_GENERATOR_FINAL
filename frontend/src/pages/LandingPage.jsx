import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, FileText, Sparkles, Check, Users, Rocket } from 'lucide-react';

const LandingPage = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const features = [
        {
            icon: <FileText className="w-8 h-8" />,
            title: 'Multiple Templates',
            description: 'Choose from professionally designed resume templates'
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'AI Enhanced',
            description: 'Get AI suggestions to improve your resume content'
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: 'Live Preview',
            description: 'See changes instantly as you edit your resume'
        },
        {
            icon: <Rocket className="w-8 h-8" />,
            title: 'Fast Export',
            description: 'Download your resume as PDF in seconds'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-96 h-96 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
                    style={{
                        top: '0%',
                        left: '10%',
                    }}
                ></div>
                <div
                    className="absolute w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
                    style={{
                        top: '50%',
                        right: '10%',
                    }}
                ></div>
                <div
                    className="absolute w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
                    style={{
                        bottom: '10%',
                        left: '40%',
                    }}
                ></div>

                {/* Mouse follow gradient */}
                <div
                    className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full filter blur-3xl transition-all duration-300"
                    style={{
                        left: `${mousePos.x - 192}px`,
                        top: `${mousePos.y - 192}px`,
                    }}
                ></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Navbar */}
                <nav className="backdrop-blur-md bg-white/30 border-b border-white/50 sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                            ✨ ResumeMaster AI
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="min-h-[90vh] flex items-center justify-center px-6 py-20">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Badge */}
                        <div className="mb-8 inline-block">
                            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-6 py-2 rounded-full text-sm font-semibold border border-blue-200">
                                🚀 Build Your Perfect Resume
                            </div>
                        </div>

                        {/* Main heading */}
                        <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600">
                                Create Stunning Resumes
                            </span>
                            <br />
                            <span className="text-slate-800">Powered by AI</span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl text-slate-700 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Transform your career with professionally designed resumes. Choose from beautiful templates, get AI suggestions, and download in seconds.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Link to="/login">
                                <button className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 flex items-center gap-2 justify-center">
                                    Get Started
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </div>

                        {/* Trust badges */}
                    </div>

                    {/* Floating cards decoration */}
                    <div className="absolute top-20 right-10 w-72 h-80 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl shadow-2xl opacity-10 blur-xl animate-float"></div>
                    <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-3xl shadow-2xl opacity-10 blur-xl animate-float animation-delay-2000"></div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-5xl font-bold text-center text-slate-800 mb-16">
                            Why Choose ResumeMaster?
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-white/80 hover:bg-white/80 hover:border-cyan-300 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-200/50 transform hover:scale-105"
                                >
                                    <div className="text-cyan-500 mb-4 group-hover:text-blue-600 transition-colors p-3 bg-cyan-100/50 rounded-lg w-fit">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Social proof Section */}
                <section className="py-20 px-6 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 backdrop-blur-xl rounded-3xl mx-6 mb-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Users className="w-6 h-6 text-cyan-600" />
                            <span className="text-slate-700 font-semibold">Trusted by thousands</span>
                        </div>
                        <h2 className="text-4xl font-bold text-slate-800 mb-8">
                            Join thousands of professionals building better resumes
                        </h2>
                        <div className="flex flex-wrap justify-center gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                                    10K+
                                </div>
                                <p className="text-slate-600">Resumes Created</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                                    99%
                                </div>
                                <p className="text-slate-600">Satisfaction Rate</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                                    3
                                </div>
                                <p className="text-slate-600">Premium Templates</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-5xl font-bold text-slate-800 mb-8">
                            Ready to get started?
                        </h2>
                        <p className="text-lg text-slate-600 mb-12">
                            Create your first resume now and stand out from the competition.
                        </p>
                        <Link to="/templates">
                            <button className="group bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 flex items-center gap-2 justify-center mx-auto">
                                Explore Templates
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 px-6 mt-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <h3 className="font-bold text-lg mb-4">ResumeMaster AI</h3>
                                <p className="text-gray-400">Build professional resumes with AI assistance.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Product</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition">Templates</a></li>
                                    <li><a href="#" className="hover:text-white transition">Features</a></li>
                                    <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Company</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition">About</a></li>
                                    <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Legal</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                                    <li><a href="#" className="hover:text-white transition">Terms</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
                            <p>&copy; 2026 ResumeMaster AI. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Animations */}
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
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-30px) rotate(5deg);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
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

export default LandingPage;
