import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { signInWithGoogle, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Load Google Identity Services on component mount
    useEffect(() => {
        const loadGoogleScript = () => {
            return new Promise((resolve, reject) => {
                // Check if script is already loaded
                if (window.google && window.google.accounts) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                
                script.onload = () => {
                    console.log('Google Identity Services loaded successfully');
                    // Wait a bit for the library to initialize
                    setTimeout(() => {
                        if (window.google && window.google.accounts) {
                            resolve();
                        } else {
                            reject(new Error('Google library failed to initialize'));
                        }
                    }, 500);
                };
                
                script.onerror = () => {
                    console.error('Failed to load Google Identity Services script');
                    reject(new Error('Failed to load Google services'));
                };
                
                document.head.appendChild(script);
            });
        };

        // Load the script when component mounts
        loadGoogleScript().catch(error => {
            console.error('Google script loading error:', error);
        });
    }, []);

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result.success) {
                navigate('/choose-template');
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            
            // Provide user-friendly error messages
            let errorMessage = 'Failed to sign in with Google. Please try again.';
            
            if (error.message.includes('not configured')) {
                errorMessage = 'Google Sign-In is not properly configured. Please contact the administrator.';
            } else if (error.message.includes('not loaded')) {
                errorMessage = 'Google services are still loading. Please wait a moment and try again.';
            } else if (error.message.includes('popup')) {
                errorMessage = 'Popup was blocked. Please allow popups for this site and try again.';
            } else if (error.message.includes('access_denied')) {
                errorMessage = 'Access was denied. Please try again.';
            }
            
            alert(errorMessage);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // For demo purposes, simulate login and redirect
        navigate('/choose-template');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
                            ✨ ResumeMaster
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
                        <p className="text-slate-600 mt-2">Sign in to create your perfect resume</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white/80 text-slate-500">or sign in with</span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-600 mt-6">
                        No account? <span className="text-cyan-600 font-semibold">Sign up is free</span>
                    </p>
                </div>

                {/* Trust Badge */}
                <div className="text-center mt-6 text-slate-600 text-sm">
                    <p>✨ 100% Free • No Credit Card Required • Instant Access</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
