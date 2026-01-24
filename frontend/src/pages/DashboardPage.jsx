import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';

const DashboardPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Card 1: Build from Scratch */}
                <div
                    onClick={() => navigate('/templates')}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col items-center border-l-4 border-indigo-500 hover:scale-105 transform"
                >
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                        <FileText size={48} className="text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">Build from Scratch</h2>
                    <p className="text-gray-500 text-center">Choose a template and build a professional resume using our editor.</p>
                </div>

                {/* Card 2: Upload Resume */}
                <div
                    onClick={() => navigate('/upload')}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col items-center border-l-4 border-green-500 hover:scale-105 transform"
                >
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                        <Upload size={48} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">Upload Resume</h2>
                    <p className="text-gray-500 text-center">Enhance your existing resume with AI-powered suggestions.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
